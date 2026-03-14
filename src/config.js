// src/config.js
const isProduction = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' && 
                     !window.location.hostname.startsWith('192.168.') && 
                     !window.location.hostname.startsWith('10.');

export const API_BASE_URL = isProduction
    ? 'https://aqrablkmedia.com/api'
    : `http://${window.location.hostname}:3545`;

export const SOCKET_URL = isProduction
    ? 'https://aqrablkmedia.com'
    : `http://${window.location.hostname}:3545`;

