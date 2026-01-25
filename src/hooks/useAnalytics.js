import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/analytics/track`;

// Global variables to prevent double-tracking in StrictMode/Redirects
let lastTrackedPath = null;
let lastTrackedTime = 0;

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        const trackPage = async () => {
            const now = Date.now();
            const currentPath = location.pathname;

            // Debounce: If same path within 1000ms, ignore
            if (currentPath === lastTrackedPath && (now - lastTrackedTime < 1000)) {
                return;
            }

            // Don't track dashboard pages
            if (currentPath.includes('/dashboard')) return;

            // Update trackers immediately to block concurrent calls
            lastTrackedPath = currentPath;
            lastTrackedTime = now;

            try {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ page: currentPath }),
                });
                console.log('Analytics Sent:', currentPath);
            } catch (error) {
                // Silently fail if backend is offline
                console.warn('Analytics Error:', error);
            }
        };

        trackPage();
    }, [location]);
};
