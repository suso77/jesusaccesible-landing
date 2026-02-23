export const getBackendUrl = () => {
    const RAW_BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    let url = (RAW_BACKEND_URL || '').trim().replace(/\/$/, '');
    const { hostname, protocol } = window.location;

    // Auto-discovery logic (essential for testing on mobile via local network)
    if (!url) {
        // If no environment variable, assume port 8000 on the current host in dev
        const devEnvironments = ['localhost', '127.0.0.1', '192.168.', '10.', '172.'];
        const isDev = devEnvironments.some(prefix => hostname.includes(prefix));
        url = isDev ? `${protocol}//${hostname}:8000` : window.location.origin;
    } else {
        // If variable exists, ensure it uses the current device's hostname instead of 'localhost'
        // This allows a mobile phone to reach the computer's backend
        url = url.replace('localhost', hostname).replace('127.0.0.1', hostname);
    }

    return url;
};
