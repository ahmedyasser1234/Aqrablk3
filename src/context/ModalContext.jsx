import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', // 'success' | 'error' | 'warning' | 'info'
        onConfirm: null,
        onCancel: null,
        confirmText: '',
        cancelText: '',
        showCancel: false
    });

    const showAlert = useCallback((message, title = '', type = 'info') => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false })),
            onCancel: null,
            showCancel: false
        });
    }, []);

    const showConfirm = useCallback((message, onConfirm, onCancel = null, title = '', options = {}) => {
        setModalConfig({
            isOpen: true,
            title,
            message,
            type: options.type || 'warning',
            onConfirm: () => {
                if (onConfirm) onConfirm();
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            },
            onCancel: () => {
                if (onCancel) onCancel();
                setModalConfig(prev => ({ ...prev, isOpen: false }));
            },
            showCancel: true,
            confirmText: options.confirmText,
            cancelText: options.cancelText
        });
    }, []);

    const closeModal = useCallback(() => {
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm, closeModal, modalConfig }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
