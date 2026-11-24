import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  ShoppingCart,
  ShieldCheck,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { CartOrderItem } from './ShoppingCartDrawer';

interface DomainCheckItem {
  domain: string;
  tld: 'com' | 'ir' | 'net' | 'org' | 'co' | 'shop';
  status: 'available' | 'registered' | 'unknown';
  method: string;
  latencyMs: number;
  pashalanOffer: string;
  freeWithPackage: 'com-20m' | 'ready-ir' | 'addon';
}

interface DomainCheckerWidgetProps {
  compact?: boolean;
  cartItemIds: Set<string>;
  onAddDomainPackageToCart: (item: CartOrderItem) => void;
  onOpenToolsPage?: () => void;
}

const SAMPLE_DOMAINS = ['pashalan', 'zarinshop', 'novinclinic', 'tehranbrand2026'];

export const DomainCheckerWidget: React.FC<DomainCheckerWidgetProps> = ({
  compact = false,
  cartItemIds,
  onAddDomainPackageToCart,
  onOpenToolsPage,
}) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<DomainCheckItem[] | null>(null);
  const [checkedQuery, setCheckedQuery] = useState<string>('');
  const [totalLatencyMs, setTotalLatencyMs] = useState<number | null>(null);

  const runCheck = async (customInput?: string) => {
    const target = (customInput ?? query).trim();
    if (!target) {
      setError('لطفاً نام برند یا دامنه انگلیسی خود را وارد کنید (مثال: mybrand).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const resp = await fetch(
        `/api/domain/check?name=${encodeURIComponent(target)}`
      );
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setError(data.error || 'خطا در بررسی دامنه. لطفاً نام انگلیسی معتبر وارد کنید.');
        setResults(null);
      } else {
        setResults(data.results || []);
        setCheckedQuery(data.query || target);
        setTotalLatencyMs(data.totalLatencyMs ?? null);
      }
    } catch {
      setError('ارتباط با سرور استعلام دامنه برقرار نشد. لطفاً دوباره تلاش کنید.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCheck();
  };

  const handleReserveDomain = (item: DomainCheckItem) => {
    if (item.freeWithPackage === 'com-20m') {
      onAddDomainPackageToCart({
        id: 'special-com-20m',
        title: `پکیج ویژه طراحی سایت + دامنه رایگان ${item.domain} + هاست رایگان`,
        categoryLabel: 'پکیج ویژه .com',
        priceToman: 20000000,
        freeGiftNote: `ثبت رایگان دامنه بین‌المللی ${item.domain} به نام کارفرما + هاست ابری رایگان`,
        deliveryLabel: 'تحویل ۳ تا ۵ روز کاری',
      });
    } else if (item.freeWithPackage === 'ready-ir') {
      onAddDomainPackageToCart({
        id: `domain-ready-${item.domain}`,
        title: `طرح آماده ۵ صفحه‌ای + ثبت رایگان دامنه ${item.domain}`,
        categoryLabel: 'طرح آماده + دامنه .ir رایگان',
        priceToman: 12000000,
        freeGiftNote: `دامنه ${item.domain} کاملاً رایگان ۱ ساله + ۶ ماه هاست ابری رایگان`,
        deliveryLabel: 'تحویل ۳ روز کاری',
      });
    } else {
      onAddDomainPackageToCart({
        id: `domain-reg-${item.domain}`,
        title: `ثبت رسمی دامنه بین‌المللی ${item.domain} به نام کارفرما (۱ ساله)`,
        categoryLabel: 'ثبت دامنه اختصاصی',
        priceToman: 1450000,
        freeGiftNote: 'تنظیم کامل DNS، گواهی SSL و اتصال رایگان به سایت',
        deliveryLabel: 'ثبت آنی در ۱۵ دقیقه',
      });
    }
  };

  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden ${
        compact ? 'p-5 sm:p-7' : 'p-6 sm:p-8'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-blue-700">
            <Globe className="w-4 h-4" />
            <span>استعلام آنلاین و ۱۰۰٪ زنده آزاد بودن دامنه (متصل به RDAP و DNS جهانی)</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
            همین الان چک کنید دامنه <span dir="ltr" className="font-mono text-blue-700">.com</span> یا{' '}
            <span dir="ltr" className="font-mono text-emerald-700">.ir</span> برندتان آزاد است؟
          </h3>
          <p className="text-xs text-slate-600">
            نام برندتان را به انگلیسی وارد کنید تا وضعیت واقعی ۶ پسوند پرطرفدار را زنده از رجیستری بررسی کنیم؛ در پکیج ۲۰ میلیونی، دامنه <span dir="ltr" className="font-mono font-bold">.com</span> و هاست کاملاً رایگان است.
          </p>
        </div>

        {compact && onOpenToolsPage && (
          <button
            type="button"
            onClick={onOpenToolsPage}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer shrink-0 self-start lg:self-center"
          >
            مشاهده تمام ابزارهای رایگان و پولی ←
          </button>
        )}
      </div>

      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-2"
      >
        <div className="flex-1 flex items-center gap-2.5 bg-white border border-slate-300 rounded-xl px-3.5 focus-within:border-blue-600">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            dir="ltr"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="مثلاً: mybrand یا pashalan.com"
            className="w-full py-3 text-sm font-mono text-slate-900 focus:outline-none text-left"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>در حال استعلام زنده...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>بررسی آزاد بودن دامنه</span>
            </>
          )}
        </button>
      </form>

      {/* Quick Test Suggestions */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
        <span>تست سریع:</span>
        {SAMPLE_DOMAINS.map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              setQuery(sample);
              runCheck(sample);
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 font-mono text-slate-700 cursor-pointer transition-colors"
          >
            {sample}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Live Results Grid */}
      {results && results.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                نتایج استعلام واقعی برای{' '}
                <span dir="ltr" className="font-mono text-blue-700">
                  {checkedQuery}
                </span>
              </span>
            </div>
            {totalLatencyMs !== null && (
              <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                <Clock className="w-3.5 h-3.5" />
                زمان استعلام زنده: {totalLatencyMs.toLocaleString('fa-IR')} میلی‌ثانیه
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {results.map((item) => {
              const isAvailable = item.status === 'available';
              const isRegistered = item.status === 'registered';
              const targetCartId =
                item.freeWithPackage === 'com-20m'
                  ? 'special-com-20m'
                  : item.freeWithPackage === 'ready-ir'
                  ? `domain-ready-${item.domain}`
                  : `domain-reg-${item.domain}`;
              const inCart = cartItemIds.has(targetCartId);

              return (
                <div
                  key={item.domain}
                  className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 ${
                    isAvailable
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : isRegistered
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-amber-50/40 border-amber-200'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        dir="ltr"
                        className="text-base font-mono font-extrabold text-slate-900 truncate"
                      >
                        {item.domain}
                      </span>
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 shrink-0">
                          <CheckCircle2 className="w-4 h-4" />
                          آزاد و قابل ثبت
                        </span>
                      ) : isRegistered ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 shrink-0">
                          <XCircle className="w-4 h-4" />
                          ثبت شده
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 shrink-0">
                          نیاز به بررسی
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>منبع: {item.method}</span>
                      <span className="font-mono">{item.latencyMs}ms</span>
                    </div>

                    <p className="text-[11px] text-slate-700 leading-relaxed font-medium">
                      {item.pashalanOffer}
                    </p>
                  </div>

                  {isAvailable ? (
                    <button
                      type="button"
                      onClick={() => handleReserveDomain(item)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                        inCart
                          ? 'bg-emerald-600 text-white'
                          : item.freeWithPackage === 'com-20m'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>
                        {inCart
                          ? 'در سبد خرید ثبت شد ✓'
                          : item.freeWithPackage === 'com-20m'
                          ? 'رزرو رایگان با پکیج ۲۰ میلیونی .com'
                          : item.freeWithPackage === 'ready-ir'
                          ? 'رزرو رایگان با طرح آماده'
                          : 'افزودن ثبت دامنه به سبد'}
                      </span>
                    </button>
                  ) : (
                    <div className="text-[11px] text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 text-center">
                      پیشنهاد: پسوند آزاد دیگری مثل{' '}
                      <span dir="ltr" className="font-mono font-bold text-slate-800">
                        {checkedQuery}shop.com
                      </span>{' '}
                      را تست کنید
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
