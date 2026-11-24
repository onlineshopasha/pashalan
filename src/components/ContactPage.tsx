import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  Sparkles,
  Send,
  CheckCircle2,
  MapPin,
  ArrowUpLeft,
  CalendarClock,
  Headphones,
  Bot,
  FileCheck2,
  Zap,
} from 'lucide-react';
import {
  PashalanAiConsultantSection,
  PashalanAiActionHandlers,
} from './PashalanAiAssistant';

interface ContactPageProps {
  aiHandlers: PashalanAiActionHandlers;
  onOpenFloatingAi: () => void;
}

const DIRECT_PHONE_RAW = '09197254078';
const DIRECT_PHONE_DISPLAY = '0919 725 4078';
const DIRECT_PHONE_TEL = 'tel:+989197254078';
const DIRECT_WHATSAPP_BASE = 'https://wa.me/989197254078';

const SUBJECT_OPTIONS = [
  'پکیج ویژه ۲۰ میلیونی (دامنه .com + هاست رایگان)',
  'طرح آماده زنده (۱ تا ۱۰ صفحه — ۸ تا ۱۸ میلیون)',
  'طراحی ۱۰۰٪ اختصاصی سایت و اپلیکیشن',
  'نصب افزونه‌ها، درگاه بله، ترب و فروش اقساطی',
  'سئو، افزایش سرعت PageSpeed و پشتیبانی فنی',
];

const CALLBACK_SLOTS = [
  'فوری (در ۱۵ دقیقه آینده)',
  'نوبت صبح (۱۰ تا ۱۳)',
  'نوبت عصر (۱۴ تا ۱۸)',
  'نوبت شب (۱۸ تا ۲۲)',
];

const PREFERRED_CHANNELS = [
  { id: 'تماس تلفنی', label: 'تماس تلفنی مستقیم' },
  { id: 'واتساپ', label: 'پیام و تماس واتساپ' },
  { id: 'پیام‌رسان بله', label: 'پیام‌رسان بله' },
];

export const ContactPage: React.FC<ContactPageProps> = ({
  aiHandlers,
  onOpenFloatingAi,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(SUBJECT_OPTIONS[0]);
  const [callbackSlot, setCallbackSlot] = useState(CALLBACK_SLOTS[0]);
  const [preferredChannel, setPreferredChannel] = useState(
    PREFERRED_CHANNELS[0].id
  );
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const handleCopyPhone = () => {
    navigator.clipboard?.writeText(DIRECT_PHONE_RAW).catch(() => {});
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2200);
  };

  const whatsappQuickUrl = `${DIRECT_WHATSAPP_BASE}?text=${encodeURIComponent(
    `سلام، از سایت پاشالان برای مشاوره در مورد «${subject}» پیام می‌دهم.`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    if (!/^(09\d{9}|\+989\d{9})$/.test(cleanPhone)) {
      setErrorMsg('لطفاً شماره موبایل معتبر ایران وارد کنید (مثلاً 09123456789).');
      return;
    }

    setErrorMsg(null);
    setSubmitting(true);
    try {
      const fullMessage = `[زمان تماس: ${callbackSlot}] [کانال ترجیحی: ${preferredChannel}] ${
        message.trim() || 'درخواست تماس و مشاوره تخصصی طراحی سایت'
      }`;
      const resp = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          subject,
          message: fullMessage,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setErrorMsg(data.error || 'خطا در ثبت درخواست مشاوره. لطفاً دوباره تلاش کنید.');
      } else {
        setSubmittedRef(data.lead?.id || `LEAD-${Date.now().toString().slice(-4)}`);
      }
    } catch {
      setErrorMsg('ارتباط با سرور برقرار نشد. می‌توانید مستقیماً با 09197254078 تماس بگیرید.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full py-10 sm:py-14 bg-[#F8FAFC]" dir="rtl">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
        {/* ================================================================= */}
        {/* 1. EDITORIAL HERO COMMAND STRIP WITH DIRECT PHONE & INSTANT CTAS  */}
        {/* ================================================================= */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>خط مستقیم مشاوره و قرارداد فعال است · پاسخگویی همه‌روزه ۹ تا ۲۲</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold leading-tight">
                تماس مستقیم با تیم فنی و فروش{' '}
                <span className="text-emerald-400">پاشالان</span>
              </h1>

              <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed max-w-2xl">
                بدون اپراتور، بدون صف انتظار و بدون واسطه؛ مستقیم با کارشناس ارشد فنی و طراحی سایت صحبت کنید، برآورد دقیق هزینه و زمان تحویل بگیرید یا در کمتر از ۱۵ دقیقه تماس بازگشتی دریافت کنید.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>میانگین پاسخگویی زیر ۱۵ دقیقه</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>مشاوره فنی و آنالیز رقبا ۱۰۰٪ رایگان</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>صدور آنی پیش‌فاکتور رسمی</span>
                </span>
              </div>
            </div>

            {/* Direct VIP Hotline Card */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-xs border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-emerald-300">
                      شماره تماس مستقیم و واتساپ
                    </div>
                    <div className="text-[11px] text-slate-400">
                      مشاوره، سفارش فوری و پشتیبانی VIP
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black">
                  آنلاین
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3">
                <a
                  href={DIRECT_PHONE_TEL}
                  dir="ltr"
                  className="text-2xl sm:text-3xl font-mono font-black tracking-wider text-white hover:text-emerald-300 transition-colors"
                >
                  {DIRECT_PHONE_DISPLAY}
                </a>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white cursor-pointer inline-flex items-center gap-1.5 shrink-0"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>کپی</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={DIRECT_PHONE_TEL}
                  className="py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>تماس مستقیم همین الان</span>
                </a>
                <a
                  href={whatsappQuickUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ارسال پیام در واتساپ</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. FOUR INTERACTIVE COMMUNICATION CHANNELS                         */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href={DIRECT_PHONE_TEL}
            className="group bg-white border border-slate-200 hover:border-emerald-500 rounded-3xl p-5 shadow-2xs transition-all space-y-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                تماس مستقیم با کارشناس
              </div>
              <div dir="ltr" className="text-sm font-mono font-black text-emerald-700 mt-1 text-right">
                {DIRECT_PHONE_DISPLAY}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                همه‌روزه از ساعت ۹ صبح تا ۲۲ شب حتی روزهای تعطیل برای پروژه‌های فوری.
              </p>
            </div>
          </a>

          <a
            href={whatsappQuickUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white border border-slate-200 hover:border-blue-500 rounded-3xl p-5 shadow-2xs transition-all space-y-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                واتساپ و ارسال فایل بریف
              </div>
              <div className="text-xs font-extrabold text-blue-700 mt-1 inline-flex items-center gap-1">
                <span>شروع گفتگوی مستقیم واتساپ</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                ارسال لوگو، لینک سایت رقیب یا لیست امکانات موردنظرتان برای برآورد سریع.
              </p>
            </div>
          </a>

          <button
            type="button"
            onClick={onOpenFloatingAi}
            className="group bg-white border border-slate-200 hover:border-indigo-500 rounded-3xl p-5 shadow-2xs transition-all space-y-3 text-right cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                مشاور هوش مصنوعی ۲۴ ساعته
              </div>
              <div className="text-xs font-extrabold text-indigo-700 mt-1 inline-flex items-center gap-1">
                <span>باز کردن چت زنده پاشالان AI</span>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                پاسخ فوری در هر ساعت از شبانه‌روز درباره قیمت، دامنه و انتخاب افزونه.
              </p>
            </div>
          </button>

          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-2xs space-y-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-slate-900">
                دفتر مهندسی و جلسات حضوری
              </div>
              <div className="text-xs font-extrabold text-amber-800 mt-1">
                تهران · بلوار میرداماد
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                امکان عقد قرارداد حضوری، آنلاین و ارسال رسمی به سراسر ایران.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 3. INTERACTIVE CALLBACK SCHEDULER & CONSULTATION FORM              */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            {submittedRef ? (
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    درخواست مشاوره شما با موفقیت ثبت شد
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    اطلاعات شما به پنل مدیریت پاشالان ارسال شد. کارشناس ما در زمان انتخابی (<strong>{callbackSlot}</strong>) از طریق <strong>{preferredChannel}</strong> با شما تماس می‌گیرد.
                  </p>
                </div>

                <div className="inline-flex flex-col items-center gap-1 px-6 py-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-500">کد پیگیری درخواست:</span>
                  <span className="text-lg font-mono font-black text-blue-700">
                    {submittedRef}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  <a
                    href={`https://wa.me/989197254078?text=${encodeURIComponent(
                      `سلام، درخواست مشاوره ثبت کردم:\nکد پیگیری: ${submittedRef}\nنام: ${name}\nشماره: ${phone}\nموضوع: ${subject}\nزمان تماس: ${callbackSlot}\nتوضیحات: ${message || 'مشاوره تخصصی'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>ارسال فوری به واتساپ</span>
                  </a>
                  <a
                    href={`https://t.me/+989197254078`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-extrabold inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>پیام در تلگرام</span>
                  </a>
                  <a
                    href={DIRECT_PHONE_TEL}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold inline-flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>تماس {DIRECT_PHONE_DISPLAY}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmittedRef(null);
                      setMessage('');
                    }}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                  >
                    ثبت درخواست جدید
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1 border-b border-slate-100 pb-4">
                  <div className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5">
                    <CalendarClock className="w-4 h-4" />
                    <span>رزرو رایگان تماس مشاوره و استعلام دقیق پروژه</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                    زمان تماس دلخواهتان را انتخاب کنید تا با شما تماس بگیریم
                  </h2>
                </div>

                {/* Subject Selector Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-800 block">
                    موضوع پروژه یا مشاوره:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSubject(opt)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all text-right ${
                          subject === opt
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-400'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلاً: علی محمدی"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      شماره موبایل شما *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Preferred Callback Slot & Channel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>زمان مناسب تماس با شما:</span>
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {CALLBACK_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setCallbackSlot(slot)}
                          className={`px-2.5 py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-colors ${
                            callbackSlot === slot
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      روش ترجیحی پاسخگویی:
                    </label>
                    <div className="space-y-1.5">
                      {PREFERRED_CHANNELS.map((ch) => (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setPreferredChannel(ch.id)}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-bold border text-right cursor-pointer transition-colors flex items-center justify-between ${
                            preferredChannel === ch.id
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          <span>{ch.label}</span>
                          {preferredChannel === ch.id && (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Brief */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    توضیحات پروژه، کد طرح انتخابی یا دامنه مدنظر (اختیاری):
                  </label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="مثلاً: پکیج ۲۰ میلیونی دامنه .com برای فروشگاه لوازم آرایشی با اتصال ترب و درگاه بله می‌خواهم..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting
                      ? 'در حال ثبت درخواست...'
                      : 'ثبت رایگان درخواست مشاوره و تماس فوری'}
                  </span>
                </button>
              </form>
            )}
          </div>

          {/* Right/Side Info & 4-Step Workflow Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                از لحظه تماس شما تا تحویل سایت چه اتفاقی می‌افتد؟
              </h3>
              <div className="space-y-3.5">
                {[
                  {
                    step: '۰۱',
                    title: 'مشاوره رایگان و بررسی دامنه دلخواه (۱۵ دقیقه)',
                    desc: 'آزاد بودن دامنه .com یا .ir شما بررسی و بهترین پکیج متناسب با بودجه‌تان پیشنهاد می‌شود.',
                  },
                  {
                    step: '۰۲',
                    title: 'صدور پیش‌فاکتور رسمی و قرارداد شفاف',
                    desc: 'تمام تعهدات، زمان تحویل، آپشن‌های رایگان و مالکیت ۱۰۰٪ دامنه و سورس‌کد مکتوب می‌شود.',
                  },
                  {
                    step: '۰۳',
                    title: 'پرداخت امن مرحله‌ای (درگاه بله یا شاپرک)',
                    desc: 'شروع کار با ۵۰٪ پیش‌پرداخت امانی یا ۴ قسطه اسنپ‌پی بدون ریسک مالی.',
                  },
                  {
                    step: '۰۴',
                    title: 'تحویل ۴۸ ساعته + ۱ سال گارانتی رایگان',
                    desc: 'سایت آماده روی دامنه شما با سرعت ۹۵+، اینماد و آموزش کامل پنل مدیریت تحویل داده می‌شود.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 font-mono font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                        {item.title}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-6 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-100">
                <ShieldCheck className="w-5 h-5" />
                <span>تضمین آرامش خاطر کارفرمایان پاشالان</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-emerald-50">
                کلیه مکاتبات و سفارش‌ها مستقیم زیر نظر تیم فنی پاشالان پیگیری می‌شود. برای هماهنگی سریع همین حالا با شماره{' '}
                <a
                  href={DIRECT_PHONE_TEL}
                  dir="ltr"
                  className="font-mono font-black underline text-white"
                >
                  {DIRECT_PHONE_DISPLAY}
                </a>{' '}
                تماس بگیرید.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. SPECIALIZED AI CONSULTATION STUDIO EMBEDDED IN CONTACT PAGE     */}
        {/* ================================================================= */}
        <section>
          <PashalanAiConsultantSection handlers={aiHandlers} compactHeader />
        </section>
      </div>
    </div>
  );
};
