import React from 'react';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';

const GlobalModal = () => {
    const { modalConfig, closeModal } = useModal();
    const { language } = useLanguage();

    if (!modalConfig.isOpen) return null;

    const isAr = language === 'ar';

    const getTypeStyles = () => {
        switch (modalConfig.type) {
            case 'success': return { icon: 'check-circle', color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
            case 'error': return { icon: 'exclamation-circle', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
            case 'warning': return { icon: 'exclamation-triangle', color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
            default: return { icon: 'info-circle', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div
                className={`w-full max-w-md bg-[#0d0e1b]/80 border ${styles.border} md:p-8 p-6 rounded-[2.5rem] shadow-2xl backdrop-blur-3xl animate-in zoom-in-95 duration-300 relative overflow-hidden`}
                dir={isAr ? 'rtl' : 'ltr'}
            >
                {/* Glow Effect */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 ${styles.bg} rounded-full blur-[100px] pointer-events-none opacity-50`}></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className={`w-20 h-20 rounded-3xl ${styles.bg} flex items-center justify-center mb-6`}>
                        {modalConfig.type === 'success' && (
                            <svg className={`w-10 h-10 ${styles.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {modalConfig.type === 'error' && (
                            <svg className={`w-10 h-10 ${styles.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {modalConfig.type === 'warning' && (
                            <svg className={`w-10 h-10 ${styles.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {modalConfig.type === 'info' && (
                            <svg className={`w-10 h-10 ${styles.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>

                    <h3 className="text-2xl font-black text-white mb-3">
                        {modalConfig.title || (isAr ? 'تنبيه' : 'Alert')}
                    </h3>

                    <p className="text-white/70 text-lg font-medium leading-relaxed mb-8">
                        {modalConfig.message}
                    </p>

                    <div className="flex gap-4 w-full">
                        {modalConfig.showCancel && (
                            <button
                                onClick={modalConfig.onCancel}
                                className="flex-1 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all active:scale-95"
                            >
                                {modalConfig.cancelText || (isAr ? 'إلغاء' : 'Cancel')}
                            </button>
                        )}
                        <button
                            onClick={modalConfig.onConfirm}
                            className={`flex-1 px-6 py-4 rounded-2xl font-black text-white shadow-lg shadow-white/5 transition-all active:scale-95 ${modalConfig.type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                                    modalConfig.type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 text-black' :
                                        'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {modalConfig.confirmText || (isAr ? 'حسناً' : 'OK')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalModal;
