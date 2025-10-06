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
            // CSRF token mismatch - reload immediately to get fresh token
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// Add global error handler for Inertia
router.on('error', (event) => {
    const error = event.detail.errors as any;
    });

router.on('exception', (event) => {
    const exception = event.detail.exception as any;
    if (exception?.response?.status === 419 && !isReloading) {
        isReloading = true;
        // CSRF token mismatch - reload page
        window.location.reload();
    }
});

// Refresh CSRF token on page visibility change (user returns to tab)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        const token = getCsrfToken();
        if (token) {
            axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        }
    }
});

// Clean up old localStorage keys on app load (migrate from old universal key to user-specific keys)
// This runs once when the app loads to clean up the old 'user_profile_photo' key
if (localStorage.getItem('user_profile_photo')) {
    localStorage.removeItem('user_profile_photo');
}

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
