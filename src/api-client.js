'use strict';

(function () {
  const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

  function csrfToken() {
    const match = document.cookie.match(/(?:^|;\s*)cinetix_csrf=([^;]+)/);
    if (!match) return '';
    try { return decodeURIComponent(match[1]); } catch { return ''; }
  }

  async function primeCsrfCookie() {
    if (csrfToken()) return csrfToken();
    try { await fetch('/api/session', { method: 'GET', credentials: 'same-origin', cache: 'no-store' }); }
    catch { /* The main request reports the unavailable server. */ }
    return csrfToken();
  }

  async function request(path, options = {}) {
    if (typeof path !== 'string' || !path.startsWith('/api/')) throw new Error('Đường dẫn API không hợp lệ.');
    const method = String(options.method || 'GET').toUpperCase();
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    const init = { method, credentials: 'same-origin', headers, cache: 'no-store' };
    if (!SAFE_METHODS.has(method)) {
      const token = await primeCsrfCookie();
      if (!token) throw new Error('Không thể khởi tạo phiên bảo vệ. Vui lòng tải lại trang.');
      headers['Content-Type'] = 'application/json';
      headers['X-Cinetix-CSRF'] = token;
      init.body = JSON.stringify(options.body ?? {});
    }
    let response;
    try { response = await fetch(path, init); }
    catch { throw new Error('Không thể kết nối máy chủ Cinetix. Hãy thử lại khi có kết nối.'); }
    const contentType = response.headers.get('content-type') || '';
    let data = {};
    if (contentType.includes('application/json')) {
      try { data = await response.json(); }
      catch { throw new Error('Máy chủ trả về dữ liệu không hợp lệ.'); }
    }
    if (!response.ok) {
      const error = new Error(data.error || `Yêu cầu thất bại (${response.status}).`);
      error.status = response.status;
      error.code = data.code || 'request_failed';
      throw error;
    }
    return data;
  }

  window.CinetixApi = Object.freeze({ request });
})();
