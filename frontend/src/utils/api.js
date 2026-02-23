export const getBackendUrl = () => {
    const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let url = (RAW_BACKEND_URL || '').trim().replace(/\/$/, '');
    const { hostname, protocol } = window.location;

    if (!url) {
        // Determine if we are in a development-like environment (local network or localhost)
        const isLocal = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'].some(p => hostname.includes(p));

        // In local dev, we assume the backend is on port 8000
        // In production, we assume it's on the same origin
        url = isLocal ? `${protocol}//${hostname}:8000` : window.location.origin;
    } else {
        // If a URL is provided (like in production env), ensure it uses the current device's hostname 
        // if 'localhost' was hardcoded (allowing mobile access on local network)
        url = url.replace('localhost', hostname).replace('127.0.0.1', hostname);
    }

    // Debug log to help identify issues in the browser console
    console.log(`[API] Discovery Result: ${url} (Source: ${window.location.origin})`);
    return url;
};
