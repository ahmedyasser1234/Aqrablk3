// src/config.js
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isProduction
    ? `${window.location.origin}/api` // Usually standard for Nginx proxy pass
    : 'http://127.0.0.1:3545';

export const SOCKET_URL = isProduction
    ? window.location.origin
    : 'http://127.0.0.1:3545';
