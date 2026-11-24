import React, { useState, useEffect } from 'react';
import { Download, WifiOff, Share, X, Smartphone, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * Mandatory in-app PWA Install Button (renders in header, hides automatically when already installed).
 * Supports Android/Desktop beforeinstallprompt and iOS Safari Share->Add to Home Screen guide.
 */
export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const standaloneMatch =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone ===
        true;
    setIsStandalone(standaloneMatch);
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowGuideModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isStandalone) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        title="نصب اپلیکیشن سریع پاشالان روی گوشی یا دسکتاپ (PWA)"
        className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-extrabold cursor-pointer transition-colors shrink-0"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden xl:inline">نصب اپلیکیشن</span>
      </button>

      {showGuideModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          dir="rtl"
          onClick={() => setShowGuideModal(false)}
        >
          <div
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    نصب اپلیکیشن پاشالان (PWA)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    دسترسی سریع، آفلاین و بدون نیاز به فروشگاه اپ
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                aria-label="بستن راهنمای نصب"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isIOS ? (
              <ol className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    ۱
                  </span>
                  <span>
                    در مرورگر Safari، دکمه اشتراک‌گذاری (
                    <Share className="w-3.5 h-3.5 inline text-blue-600" /> Share)
                    در نوار پایین صفحه را لمس کنید.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    ۲
                  </span>
                  <span>
                    گزینه <strong>Add to Home Screen</strong> را انتخاب کرده و
                    دکمه <strong>Add</strong> را بزنید.
                  </span>
                </li>
              </ol>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
                <p>
                  برای نصب مستقیم پلتفرم پاشالان روی صفحه اصلی گوشی یا دسکتاپ:
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      در مرورگر Chrome / Edge روی آیکون نصب در نوار آدرس یا منوی
                      سه نقطه → Install App کلیک کنید.
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Offline status indicator shown automatically when device loses connectivity.
 */
export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const onOffline = () => setIsOffline(true);
    const onOnline = () => setIsOffline(false);
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs shadow-2xl flex items-center gap-2 border border-amber-300"
      dir="rtl"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>
        حالت آفلاین فعال است — صفحات کش‌شده قابل مشاهده‌اند؛ برای استعلام زنده
        اینترنت را وصل کنید.
      </span>
    </div>
  );
};
