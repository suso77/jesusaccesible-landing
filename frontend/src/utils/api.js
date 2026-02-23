export const getBackendUrl = () => {
    const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let url = (RAW_BACKEND_URL || '').trim().replace(/\/$/, '');
    const { hostname, protocol, search } = window.location;

    // Allow forcing a backend URL via query param for extreme debugging
    // e.g., http://192.168.1.15:3000?backend=http://192.168.1.15:8000
    const params = new URLSearchParams(search);
    const forcedBackend = params.get('backend');
    if (forcedBackend) return forcedBackend.replace(/\/$/, '');

    if (!url) {
        const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(p => hostname.includes(p));
        url = isLocal ? `${protocol}//${hostname}:8000` : window.location.origin;
    } else {
        url = url.replace('localhost', hostname).replace('127.0.0.1', hostname);
    }

    return url;
};
