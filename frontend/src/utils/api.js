export const getBackendUrl = () => {
    const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let url = (RAW_BACKEND_URL || '').trim().replace(/\/$/, '');
    const { hostname, protocol, search } = window.location;

    // Allow forcing a backend URL via query param for extreme debugging
    const params = new URLSearchParams(search);
    const forcedBackend = params.get('backend');
    if (forcedBackend) return forcedBackend.replace(/\/$/, '');

    if (!url) {
        // If we are on a local network IP or localhost, try port 8000
        const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(p => hostname.includes(p));
        url = isLocal ? `${protocol}//${hostname}:8000` : window.location.origin;
    } else {
        // Replace localhost/127.0.0.1 with the actual hostname if the env var was fixed to one of those
        url = url.replace('localhost', hostname).replace('127.0.0.1', hostname);
    }

    return url;
};

/**
 * Pings the backend to check connectivity.
 * Returns true if reachable.
 */
export const checkBackendHealth = async () => {
    const url = `${getBackendUrl()}/api`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (err) {
        console.warn('[API] Health check failed for:', url, err.message);
        return false;
    }
};
