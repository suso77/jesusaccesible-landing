export const getBackendUrl = () => {
    const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let url = (RAW_BACKEND_URL || '').trim().replace(/\/$/, '');
    const { hostname, protocol, search } = window.location;

    const params = new URLSearchParams(search);
    const forcedBackend = params.get('backend');
    if (forcedBackend) return forcedBackend.replace(/\/$/, '');

    if (!url) {
        // Detect any IP-like hostname or localhost
        const isIp = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname);
        const isLocal = isIp || ['localhost', '127.0.0.1'].some(p => hostname.includes(p));

        // Default to port 8000 for local/IP access, otherwise use the host itself (production)
        url = isLocal ? `${protocol}//${hostname}:8000` : window.location.origin;
    } else {
        url = url.replace('localhost', hostname).replace('127.0.0.1', hostname);
    }

    return url;
};

export const checkBackendHealth = async () => {
    const url = `${getBackendUrl()}/api/`;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        // Explicitly set cache: 'no-cache' to avoid stale results on mobile
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return response.ok;
    } catch (err) {
        return false;
    }
};
