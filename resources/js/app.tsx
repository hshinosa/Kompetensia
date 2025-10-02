import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Function to get fresh CSRF token from meta tag
function getCsrfToken(): string | null {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') : null;
}

// Setup Axios to handle CSRF token refresh
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Update CSRF token before each request
axios.interceptors.request.use(config => {
    const token = getCsrfToken();
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token;
    }
    return config;
});

// Intercept 419 responses (CSRF token mismatch) and handle appropriately
let isReloading = false;
axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response?.status === 419 && !isReloading) {
            isReloading = true;
            // CSRF token mismatch - try to fetch new page to get fresh token
            try {
                await axios.get(window.location.href);
                // Reload to get fresh state
                window.location.reload();
            } catch (e) {
                // If that fails, just reload
                window.location.reload();
            }
        }
        return Promise.reject(error);
    }
);

// Add global error handler for Inertia
router.on('exception', (event) => {
    const exception = event.detail.exception as any;
    if (exception?.response?.status === 419 && !isReloading) {
        isReloading = true;
        // CSRF token mismatch - reload page
        window.location.reload();
    }
});

createInertiaApp({
    title: (title) => title ? `${title} - ${appName}` : appName,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
