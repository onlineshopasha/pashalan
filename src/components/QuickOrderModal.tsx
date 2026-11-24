import React, { useState } from 'react';
import { X, CheckCircle2, ArrowUpLeft, ShieldCheck, Gift } from 'lucide-react';
import {
  SpatialKit,
  PricingTier,
  calculateReadyPlanPriceByPages,
} from '../data/spatialCatalog';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedKit: SpatialKit | null;
  selectedTier: PricingTier | null;
  selectedPageCount?: number;
  customServiceTitle?: string | null;
  customServicePrice?: number | null;
  orderMode: 'ready-kit' | 'custom-agency';
  onOrderCreated: (orderData: {
    clientName: string;
    phone: string;
    domainName: string;
    title: string;
    packageType: string;
    priceToman: number;
  }) => string;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  selectedKit,
  selectedTier,
  selectedPageCount = 5,
  customServiceTitle = null,
  customServicePrice = null,
  orderMode,
  onOrderCreated,
}) => {
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [domainName, setDomainName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [createdTrackingCode, setCreatedTrackingCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const displayTitle = customServiceTitle
    ? customServiceTitle
    : selectedKit
    ? `${selectedKit.title} (کد ${selectedKit.code} - ${
        orderMode === 'ready-kit'
          ? `${selectedPageCount.toLocaleString('fa-IR')} صفحه`
          : 'طراحی اختصاصی'
      })`
    : selectedTier
    ? selectedTier.name
    : orderMode === 'ready-kit'
    ? `پکیج آماده طراحی سایت (${selectedPageCount.toLocaleString('fa-IR')} صفحه + هاست و دامنه رایگان)`
    : 'طراحی اختصاصی وب‌سایت و اپلیکیشن موبایل';

  const displayPrice =
    customServicePrice !== null && customServicePrice !== undefined
      ? customServicePrice
      : selectedKit
      ? orderMode === 'ready-kit'
        ? calculateReadyPlanPriceByPages(selectedPageCount)
        : 0
      : selectedTier
      ? selectedTier.priceToman
      : orderMode === 'ready-kit'
      ? calculateReadyPlanPriceByPages(selectedPageCount)
      : 0;

  const isInquiryPrice = displayPrice <= 0;

  const packageLabel = customServiceTitle
    ? isInquiryPrice
      ? 'طراحی اختصاصی بر اساس خواسته‌ها و امکانات مدنظر کارفرما (استعلام دقیق)'
      : 'خدمات تخصصی توسعه، سئو و پشتیبانی وب‌سایت با قرارداد رسمی'
    : orderMode === 'ready-kit'
    ? `طرح آماده (${selectedPageCount.toLocaleString('fa-IR')} صفحه) + ۶ ماه هاست ابری رایگان + دامنه .ir رایگان ۱ ساله`
    : 'طراحی و کدنویسی اختصاصی کامل (استعلام قیمت طبق خواسته‌های شما)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientName.trim().length < 2) {
      setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد نمایید.');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('لطفاً شماره تماس معتبر وارد نمایید.');
      return;
    }

    setErrorMsg(null);
    const trackingCode = onOrderCreated({
      clientName: clientName.trim(),
      phone: cleanPhone,
      domainName: domainName.trim() || 'yourbrand.ir',
      title: displayTitle,
      packageType: packageLabel,
      priceToman: displayPrice,
    });
    setCreatedTrackingCode(trackingCode);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن فرم سفارش"
          className="absolute top-5 left-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {createdTrackingCode ? (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {isInquiryPrice
                ? 'درخواست استعلام قیمت شما ثبت شد'
                : 'سفارش شما به صورت رایگان ثبت شد'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              پرونده پروژه شما تشکیل شد. کارشناس فنی پاشالان تا ۱۵ دقیقه دیگر جهت برآورد دقیق، ثبت دامنه رایگان و هماهنگی قرارداد با شما تماس می‌گیرد.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 block">
                کد رهگیری اختصاصی پروژه شما:
              </span>
              <span className="text-2xl font-mono font-extrabold text-blue-600 tabular-nums">
                {createdTrackingCode}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={`https://wa.me/989197254078?text=${encodeURIComponent(
                  `سلام، سفارش جدید در پاشالان ثبت کردم:\nکد رهگیری: ${createdTrackingCode}\nنام: ${clientName}\nشماره: ${phone}\nپروژه: ${displayTitle}\nدامنه: ${domainName || 'ندارد'}\nتوضیحات: ${notes || '-'}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center transition-colors"
              >
                ارسال به واتساپ
              </a>
              <a
                href="https://t.me/+989197254078"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs text-center transition-colors"
              >
                ارسال در تلگرام
              </a>
              <a
                href="tel:09197254078"
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs text-center transition-colors"
              >
                تماس 09197254078
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setCreatedTrackingCode(null);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              مشاهده وضعیت در بخش پیگیری پروژه
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <span className="text-xs text-blue-600 font-bold block mb-1">
                {isInquiryPrice
                  ? 'درخواست استعلام قیمت و جلسه آنالیز رایگان'
                  : 'ثبت رایگان سفارش و رزرو زمان تحویل'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 pl-8">
                {displayTitle}
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-900 font-bold">{packageLabel}</div>
                <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>تسویه نهایی فقط پس از تحویل و رضایت کامل شما</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>شامل هاست ابری رایگان + دامنه رایگان (.ir یا .com در پکیج ۲۰ میلیونی)</span>
                </div>
              </div>
              <div className="text-left shrink-0">
                {isInquiryPrice ? (
                  <>
                    <span className="text-sm font-extrabold text-amber-700 block">
                      استعلام قیمت
                    </span>
                    <span className="text-[10px] text-slate-600 block">
                      طبق خواسته‌های شما
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base font-mono font-extrabold text-blue-600 tabular-nums">
                      {displayPrice.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-[11px] text-slate-600 block">تومان</span>
                  </>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  نام و نام خانوادگی *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: رضا کریمی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    شماره موبایل در دسترس *
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    دامنه .ir رایگان پیشنهادی (اختیاری)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    placeholder="mybrand.ir"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  توضیحات تکمیلی در مورد کسب‌وکار شما (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="هر نکته خاصی در مورد رنگ سازمانی، تعداد صفحات یا امکانات مد نظر دارید بنویسید..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>ثبت رایگان سفارش و دریافت کد پیگیری</span>
                <ArrowUpLeft className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
