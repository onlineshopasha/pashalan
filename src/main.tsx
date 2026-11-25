import 'vazirmatn/Vazirmatn-Variable-font-face.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { installStaticSafeFetchBridge } from './utils/staticApiBridge';
import App from './App.tsx';
import './index.css';

installStaticSafeFetchBridge();

interface RootErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  RootErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: unknown): RootErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }

  handleHardReset = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      localStorage.removeItem('pashalan_cart_v1');
    } catch {
      // ignore cleanup error
    }
    window.location.href = '/?v=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h1 className="text-lg font-black text-white mb-2">
              بروزرسانی نسخه جدید پاشالان
            </h1>
            <p className="text-xs text-slate-300 leading-6 mb-5">
              نسخه جدید سایت منتشر شده است. لطفاً برای پاک‌سازی کش مرورگر و بارگذاری نسخه جدید روی دکمه زیر بزنید.
            </p>
            <button
              type="button"
              onClick={this.handleHardReset}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition cursor-pointer"
            >
              پاک‌سازی کش و باز کردن مجدد سایت
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  (window as unknown as Record<string, boolean>).__PASHALAN_MOUNTED__ = true;
  createRoot(rootElement).render(
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  );
}
