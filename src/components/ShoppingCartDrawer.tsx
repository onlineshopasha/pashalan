import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Gift,
  CheckCircle2,
  Printer,
  CreditCard,
  Tag,
  ArrowUpLeft,
  Sparkles,
} from 'lucide-react';
import { downloadOfficialProforma } from '../utils/documentExport';

export interface CartOrderItem {
  id: string;
  title: string;
  categoryLabel: string;
  priceToman: number; // 0 means "استعلام قیمت طبق خواسته‌ها"
  isInquiryOnly?: boolean;
  badgeText?: string;
  freeGiftNote?: string;
  deliveryLabel?: string;
}

interface ShoppingCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartOrderItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onAddComPackage: () => void;
  userBonusToman: number;
  defaultClientName?: string;
  defaultPhone?: string;
  onCheckoutComplete: (orderData: {
    clientName: string;
    phone: string;
    domainName: string;
    title: string;
    packageType: string;
    priceToman: number;
  }) => string;
}

export const ShoppingCartDrawer: React.FC<ShoppingCartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
  onAddComPackage,
  userBonusToman,
  defaultClientName = '',
  defaultPhone = '',
  onCheckoutComplete,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<
    'escrow-50' | 'cash-discount' | 'snapppay-4'
  >('escrow-50');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [appliedCouponToman, setAppliedCouponToman] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  const [clientName, setClientName] = useState<string>(defaultClientName);
  const [phone, setPhone] = useState<string>(defaultPhone);
  const [preferredDomain, setPreferredDomain] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'gateway' | 'done'>(
    'cart'
  );
  const [selectedGateway, setSelectedGateway] = useState<'bale' | 'shaparak'>(
    'bale'
  );
  const [baleLoading, setBaleLoading] = useState<boolean>(false);
  const [baleError, setBaleError] = useState<string | null>(null);
  const [baleTx, setBaleTx] = useState<{
    transactionId: string;
    signature: string;
    amountRial: number;
    mode: string;
    invoiceLink: string | null;
    message: string;
  } | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  const subtotalToman = useMemo(
    () => items.reduce((sum, item) => sum + (item.priceToman || 0), 0),
    [items]
  );

  const hasInquiryItems = useMemo(
    () => items.some((i) => Boolean(i.isInquiryOnly)),
    [items]
  );

  const hasComPackage = useMemo(
    () => items.some((i) => i.id === 'special-com-20m'),
    [items]
  );

  const paidItemsCount = useMemo(
    () => items.filter((i) => (i.priceToman || 0) > 0).length,
    [items]
  );

  const bundleDiscountPercent =
    paidItemsCount >= 3 ? 15 : paidItemsCount === 2 ? 8 : 0;

  const bundleDiscountToman = Math.round(
    (subtotalToman * bundleDiscountPercent) / 100
  );

  const cashDiscountToman =
    paymentMethod === 'cash-discount'
      ? Math.round((subtotalToman - bundleDiscountToman) * 0.08)
      : 0;

  const finalTotalToman = Math.max(
    0,
    subtotalToman -
      bundleDiscountToman -
      cashDiscountToman -
      appliedCouponToman -
      userBonusToman
  );

  const payableNowToman =
    paymentMethod === 'escrow-50'
      ? Math.round(finalTotalToman * 0.5)
      : paymentMethod === 'snapppay-4'
      ? Math.round(finalTotalToman / 4)
      : finalTotalToman;

  if (!isOpen) return null;

  const handleApplyCoupon = async () => {
    const code = discountCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage('لطفاً کد تخفیف را وارد کنید.');
      return;
    }
    try {
      const resp = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotalToman }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        setAppliedCouponToman(data.discountToman || 0);
        setCouponMessage(
          `کد ${data.code} با موفقیت اعمال شد (${(data.discountToman || 0).toLocaleString('fa-IR')} تومان تخفیف — ${data.description}).`
        );
      } else {
        setAppliedCouponToman(0);
        setCouponMessage(data.error || 'کد تخفیف معتبر نیست. کد فعال: PASHA1405 یا VIP15');
      }
    } catch {
      setAppliedCouponToman(0);
      setCouponMessage('خطا در بررسی کد تخفیف روی سرور.');
    }
  };

  const handlePrintOfficialProforma = () => {
    downloadOfficialProforma({
      clientName,
      phone,
      domainName: preferredDomain,
      items: items.map((it) => ({
        title: it.title,
        category: it.categoryLabel,
        priceToman: it.priceToman,
        note: it.freeGiftNote,
        isInquiry: it.isInquiryOnly,
      })),
      subtotalToman,
      discountToman:
        bundleDiscountToman +
        cashDiscountToman +
        appliedCouponToman +
        userBonusToman,
      finalTotalToman,
    });
  };

  const initiateBaleTransaction = async () => {
    setBaleLoading(true);
    setBaleError(null);
    try {
      const resp = await fetch('/api/payment/bale/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          phone: phone.replace(/\s+/g, ''),
          domainName:
            preferredDomain.trim() ||
            (hasComPackage ? 'yourbrand.com' : 'yourbrand.ir'),
          orderTitle:
            items.length === 1
              ? items[0].title
              : `سبد پاشالان (${items.length} مورد)`,
          amountToman: payableNowToman,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setBaleError(data.error || 'خطا در اتصال به درگاه پرداخت بله.');
      } else {
        setBaleTx({
          transactionId: data.transactionId,
          signature: data.signature,
          amountRial: data.amountRial,
          mode: data.mode,
          invoiceLink: data.invoiceLink,
          message: data.message,
        });
      }
    } catch {
      setBaleError('ارتباط با سرور درگاه بله برقرار نشد.');
    } finally {
      setBaleLoading(false);
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientName.trim().length < 2) {
      setFormError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^(09\d{9}|\+989\d{9})$/.test(cleanPhone)) {
      setFormError('لطفاً شماره موبایل معتبر ایران وارد کنید (مثال: 09123456789).');
      return;
    }
    setFormError(null);
    if (finalTotalToman === 0) {
      await completeOrderNow();
    } else {
      setCheckoutStep('gateway');
      setBaleTx(null);
      await initiateBaleTransaction();
    }
  };

  const handleVerifyBaleAndComplete = async () => {
    if (selectedGateway === 'bale' && baleTx) {
      setBaleLoading(true);
      setBaleError(null);
      try {
        const resp = await fetch('/api/payment/bale/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transactionId: baleTx.transactionId,
            signature: baleTx.signature,
          }),
        });
        const data = await resp.json();
        if (!resp.ok || !data.verified) {
          setBaleError(data.error || 'تایید امضای تراکنش درگاه بله ناموفق بود.');
          setBaleLoading(false);
          return;
        }
      } catch {
        setBaleError('خطا در تایید نهایی تراکنش بله.');
        setBaleLoading(false);
        return;
      } finally {
        setBaleLoading(false);
      }
    }
    await completeOrderNow();
  };

  const completeOrderNow = async () => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const summaryTitle =
      items.length === 1
        ? items[0].title
        : `سبد سفارش (${items.length.toLocaleString('fa-IR')} مورد): ${items[0].title}`;
    const gatewayTag =
      selectedGateway === 'bale'
        ? `درگاه کیف‌پول بله${baleTx ? ` (${baleTx.transactionId})` : ''}`
        : 'درگاه شاپرک / زرین‌پال';
    const paymentLabel =
      finalTotalToman === 0
        ? hasInquiryItems
          ? 'درخواست استعلام قیمت اختصاصی (رایگان)'
          : 'سفارش افزونه رایگان (۰ تومان)'
        : paymentMethod === 'escrow-50'
        ? `${gatewayTag} — پرداخت امن ۵۰٪ (${payableNowToman.toLocaleString('fa-IR')} ت)`
        : paymentMethod === 'snapppay-4'
        ? `${gatewayTag} — ۴ قسطه اسنپ‌پی (قسط اول: ${payableNowToman.toLocaleString('fa-IR')} ت)`
        : `${gatewayTag} — نقدی با ۸٪ تخفیف (${finalTotalToman.toLocaleString('fa-IR')} ت)`;

    const resolvedDomain =
      preferredDomain.trim() ||
      (hasComPackage ? 'yourbrand.com' : 'yourbrand.ir');

    const code = onCheckoutComplete({
      clientName: clientName.trim(),
      phone: cleanPhone,
      domainName: resolvedDomain,
      title: summaryTitle,
      packageType: paymentLabel,
      priceToman: finalTotalToman,
    });

    // Persist order on server & trigger instant Bale Admin Alert
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        clientName: clientName.trim(),
        phone: cleanPhone,
        domainName: resolvedDomain,
        title: summaryTitle,
        packageType: paymentLabel,
        priceToman: finalTotalToman,
        baleTransactionId: baleTx?.transactionId,
        paymentStatus:
          finalTotalToman === 0
            ? 'inquiry'
            : paymentMethod === 'cash-discount'
            ? 'paid'
            : 'escrow-paid',
      }),
    }).catch(() => {});

    setTrackingCode(code);
    setCheckoutStep('done');
    onClearCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex justify-end"
      dir="rtl"
    >
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold">
                سبد خرید و تسویه‌حساب امن کارفرما
              </h2>
              <p className="text-[11px] text-slate-300">
                مجهز به درگاه پرداخت کیف‌پول بله و پرداخت امن مرحله‌ای
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setCheckoutStep('cart');
              onClose();
            }}
            aria-label="بستن سبد خرید"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-slate-50">
          {checkoutStep === 'done' && trackingCode ? (
            <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                سفارش و تراکنش امن شما با موفقیت ثبت و تایید شد
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                پرونده پروژه شما در سامانه پیگیری آنلاین پاشالان ایجاد شد. کارشناس
                فنی تا ۱۵ دقیقه دیگر برای ثبت دامنه رایگان و شروع کار تماس می‌گیرد.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs text-slate-500 block">
                  کد رهگیری اختصاصی پروژه شما:
                </span>
                <span className="text-2xl font-mono font-extrabold text-blue-600 tabular-nums">
                  {trackingCode}
                </span>
                {baleTx && selectedGateway === 'bale' && (
                  <span className="text-[11px] font-mono text-emerald-700 block pt-1">
                    شناسه تاییدشده درگاه بله: {baleTx.transactionId}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={`https://wa.me/989197254078?text=${encodeURIComponent(
                    `سلام، سفارش سبد خرید پاشالان ثبت شد:\nکد رهگیری: ${trackingCode}\nنام: ${clientName}\nشماره: ${phone}\nدامنه: ${preferredDomain || 'ندارد'}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center"
                >
                  ارسال سفارش به واتساپ
                </a>
                <a
                  href="https://t.me/+989197254078"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs text-center"
                >
                  هماهنگی در تلگرام
                </a>
                <a
                  href="tel:+989197254078"
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs text-center"
                >
                  تماس مستقیم تلفنی
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                  document
                    .getElementById('tracker-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer"
              >
                مشاهده وضعیت پروژه در بخش پیگیری آنلاین
              </button>
            </div>
          ) : checkoutStep === 'gateway' ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-base font-extrabold text-slate-900">
                    انتخاب درگاه پرداخت امن (کیف‌پول بله / شاپرک)
                  </h3>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  امضای امن سرور SSL
                </span>
              </div>

              {/* Gateway Switcher */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedGateway('bale')}
                  className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all ${
                    selectedGateway === 'bale'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>درگاه پرداخت کیف‌پول بله</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-600 text-white">
                      پیشنهادی
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80 mt-1">
                    متصل به سرور امن پرداخت بله (Bale Wallet API)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedGateway('shaparak')}
                  className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all ${
                    selectedGateway === 'shaparak'
                      ? 'bg-blue-50 border-blue-600 text-blue-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-extrabold">
                    درگاه بانکی شاپرک / زرین‌پال
                  </div>
                  <div className="text-[11px] opacity-80 mt-1">
                    تمامی کارت‌های عضو شبکه شتاب (پرداخت امانی)
                  </div>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">نام کارفرما:</span>
                  <span className="font-bold text-slate-900">{clientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">تعداد اقلام سبد خرید:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {items.length.toLocaleString('fa-IR')} مورد
                  </span>
                </div>
                {baleTx && selectedGateway === 'bale' && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">شناسه تراکنش بله:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {baleTx.transactionId}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-900">
                    مبلغ قابل پرداخت در این مرحله:
                  </span>
                  <div className="text-left">
                    <span className="text-lg font-mono font-extrabold text-blue-700 tabular-nums block">
                      {payableNowToman.toLocaleString('fa-IR')} تومان
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      ({(payableNowToman * 10).toLocaleString('fa-IR')} ریال)
                    </span>
                  </div>
                </div>
              </div>

              {selectedGateway === 'bale' && baleTx && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold">{baleTx.message}</div>
                  {baleTx.invoiceLink && (
                    <a
                      href={baleTx.invoiceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs"
                    >
                      <span>باز کردن لینک رسمی فاکتور در بله (ble.ir)</span>
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {baleError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {baleError}
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">
                مبلغ پرداختی در حساب امانت پاشالان محفوظ می‌ماند و تا زمان تحویل
                پروژه روی دامنه شما و تایید کتبی رضایت‌تان آزاد نخواهد شد.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={baleLoading}
                  onClick={handleVerifyBaleAndComplete}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {baleLoading
                      ? 'در حال ارتباط با درگاه بله...'
                      : selectedGateway === 'bale'
                      ? `تایید و تکمیل پرداخت بله (${payableNowToman.toLocaleString('fa-IR')} ت)`
                      : `تایید و تکمیل پرداخت شاپرک (${payableNowToman.toLocaleString('fa-IR')} ت)`}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
                >
                  بازگشت به سبد
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">
                سبد سفارش شما در حال حاضر خالی است
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                کافی است هر کدام از ۱۴۰ طرح زنده، پکیج ویژه ۲۰ میلیونی دامنه .com،
                خدمات سئو و پشتیبانی یا ماژول‌های محاسبه‌گر را تیک بزنید تا اینجا
                اضافه شود.
              </p>
              <button
                type="button"
                onClick={onAddComPackage}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>افزودن پکیج ویژه دامنه .com + هاست رایگان (۲۰ میلیون)</span>
              </button>
            </div>
          ) : (
            <>
              {/* Quick Upsell for .com 20M package if not added */}
              {!hasComPackage && (
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs space-y-0.5">
                    <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                      <Gift className="w-4 h-4" />
                      <span>پیشنهاد ویژه: دامنه .com رایگان + هاست رایگان فقط ۲۰ میلیون</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">
                      با افزودن پکیج ۲۰ میلیونی، دامنه بین‌المللی .com و هاست رایگان به نام شما ثبت می‌شود.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onAddComPackage}
                    className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer shrink-0"
                  >
                    + افزودن پکیج .com
                  </button>
                </div>
              )}

              {/* Selected Items List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    اقلام تیک‌خورده در سبد شما ({items.length.toLocaleString('fa-IR')} مورد):
                  </span>
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    خالی کردن سبد
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-bold text-blue-700">
                          {item.categoryLabel}
                        </span>
                        {item.deliveryLabel && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{item.deliveryLabel}</span>
                          </>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      {item.freeGiftNote && (
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Gift className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.freeGiftNote}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span
                        className={`text-xs sm:text-sm font-mono font-extrabold tabular-nums ${
                          !item.isInquiryOnly && item.priceToman === 0
                            ? 'text-emerald-600'
                            : 'text-blue-700'
                        }`}
                      >
                        {item.isInquiryOnly
                          ? 'استعلام قیمت'
                          : item.priceToman === 0
                          ? 'رایگان ✓'
                          : `${item.priceToman.toLocaleString('fa-IR')} ت`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="حذف از سبد"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Plan Selector */}
              {subtotalToman > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-extrabold text-slate-900 block">
                    انتخاب روش پرداخت امن:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('escrow-50')}
                      className={`p-3 rounded-xl border text-right cursor-pointer transition-all ${
                        paymentMethod === 'escrow-50'
                          ? 'bg-blue-50 border-blue-600 text-blue-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-extrabold">پرداخت امن ۵۰٪</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        ۵۰٪ شروع کار + ۵۰٪ پس از تحویل
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash-discount')}
                      className={`p-3 rounded-xl border text-right cursor-pointer transition-all ${
                        paymentMethod === 'cash-discount'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-extrabold">نقدی (۸٪ تخفیف)</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        بیشترین صرفه‌جویی + اولویت تحویل
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('snapppay-4')}
                      className={`p-3 rounded-xl border text-right cursor-pointer transition-all ${
                        paymentMethod === 'snapppay-4'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-extrabold">۴ قسطه اسنپ‌پی</div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        بدون ضامن و بدون سود
                      </div>
                    </button>
                  </div>

                  {/* Discount Code */}
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-xl px-3">
                      <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        dir="ltr"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value)}
                        placeholder="کد تخفیف (مثلاً PASHA1405)"
                        className="w-full bg-transparent py-2 text-xs font-mono text-slate-900 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      اعمال کد
                    </button>
                  </div>
                  {couponMessage && (
                    <div className="text-[11px] font-bold text-emerald-700">
                      {couponMessage}
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic Tiered Bundle Discount Progress Bar */}
              {subtotalToman > 0 && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs font-extrabold text-emerald-950">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      {bundleDiscountPercent === 15
                        ? 'حداکثر تخفیف پلکانی ۱۵٪ پکیج روی سبد شما فعال شد!'
                        : bundleDiscountPercent === 8
                        ? 'تخفیف ۸٪ باندل فعال شد — با افزودن ۱ مورد پولی دیگر ۱۵٪ بگیرید!'
                        : 'با افزودن ۱ مورد پولی دیگر، ۸٪ تخفیف خودکار پکیج بگیرید (۳ مورد = ۱۵٪)'}
                    </span>
                    <span className="font-mono text-emerald-700 shrink-0">
                      {bundleDiscountPercent}٪
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-emerald-200/80 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (paidItemsCount / 3) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Totals Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>جمع کل اقلام قیمت‌دار:</span>
                  <span className="font-mono font-bold tabular-nums">
                    {subtotalToman.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                {bundleDiscountToman > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>
                      تخفیف پلکانی خودکار سبد ({bundleDiscountPercent}٪ برای{' '}
                      {paidItemsCount.toLocaleString('fa-IR')} قلم):
                    </span>
                    <span className="font-mono font-bold tabular-nums">
                      -{bundleDiscountToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                {cashDiscountToman > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>تخفیف ۸٪ پرداخت نقدی:</span>
                    <span className="font-mono font-bold tabular-nums">
                      -{cashDiscountToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                {appliedCouponToman > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>کد تخفیف اعمال‌شده:</span>
                    <span className="font-mono font-bold tabular-nums">
                      -{appliedCouponToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                {userBonusToman > 0 && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>اعتبار هدیه ثبت‌نام شما:</span>
                    <span className="font-mono font-bold tabular-nums">
                      -{userBonusToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm font-extrabold text-slate-900">
                  <span>مبلغ نهایی قرارداد:</span>
                  <span className="font-mono text-blue-700 text-base tabular-nums">
                    {finalTotalToman > 0
                      ? `${finalTotalToman.toLocaleString('fa-IR')} تومان`
                      : hasInquiryItems
                      ? 'استعلام رایگان'
                      : 'رایگان (۰ تومان)'}
                  </span>
                </div>
                {finalTotalToman > 0 && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                    <span>مبلغ قابل پرداخت در همین مرحله:</span>
                    <span className="font-mono text-sm tabular-nums">
                      {payableNowToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                {hasInquiryItems && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                    موارد «طراحی اختصاصی» پس از ثبت سبد، توسط کارشناس فنی بررسی و
                    قیمت دقیق مطابق خواسته‌های شما اعلام می‌شود.
                  </div>
                )}
              </div>

              {/* Client Details & Pay / Proforma Form */}
              <form
                onSubmit={handleProceedToPayment}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3"
              >
                <div className="text-xs font-extrabold text-slate-900">
                  مشخصات کارفرما جهت صدور پیش‌فاکتور رسمی و ثبت دامنه به نام شما:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="نام و نام خانوادگی *"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789 *"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <input
                  type="text"
                  dir="ltr"
                  value={preferredDomain}
                  onChange={(e) => setPreferredDomain(e.target.value)}
                  placeholder={
                    hasComPackage
                      ? 'دامنه .com رایگان دلخواه شما (مثلاً: mybrand.com)'
                      : 'دامنه .ir یا .com دلخواه شما (اختیاری)'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="توضیحات یا خواسته‌های اختصاصی پروژه (اختیاری)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />

                {formError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>
                      {finalTotalToman > 0
                        ? 'ادامه و پرداخت امن آنلاین'
                        : hasInquiryItems
                        ? 'ثبت رایگان درخواست استعلام'
                        : 'ثبت و فعال‌سازی رایگان افزونه‌ها'}
                    </span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handlePrintOfficialProforma}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-4 h-4 text-blue-600" />
                    <span>دانلود پیش‌فاکتور رسمی PDF</span>
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
