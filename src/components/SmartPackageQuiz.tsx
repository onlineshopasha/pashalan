import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Store,
  Building2,
  Stethoscope,
  Home,
  GraduationCap,
  Rocket,
  Globe,
  Gift,
  RotateCcw,
} from 'lucide-react';
import { PRO_PLUGINS_CATALOG } from '../data/pluginsCatalog';
import { CartOrderItem } from './ShoppingCartDrawer';

interface SmartPackageQuizProps {
  onAddBundleToCart: (items: CartOrderItem[]) => void;
  onOpenCart: () => void;
}

type BusinessKind =
  | 'shop'
  | 'corporate'
  | 'clinic'
  | 'realestate'
  | 'academy'
  | 'custom-app';

type ScaleChoice = 'com-20m' | 'ready-ir' | 'custom-inquiry';

const BUSINESS_OPTIONS: {
  id: BusinessKind;
  title: string;
  desc: string;
  icon: React.ElementType;
}[] = [
  {
    id: 'shop',
    title: 'فروشگاه اینترنتی و فروش کالا',
    desc: 'سبد خرید، ارسال پست/تیپاکس، ترب و فروش اقساطی',
    icon: Store,
  },
  {
    id: 'corporate',
    title: 'سایت شرکتی، خدماتی و صادراتی',
    desc: 'معرفی حرفه‌ای برند، نمونه‌کار و جذب مشتریان B2B',
    icon: Building2,
  },
  {
    id: 'clinic',
    title: 'کلینیک زیبایی، پزشکی و نوبت‌دهی',
    desc: 'رزرو آنلاین وقت، پروفایل پزشکان و یادآوری پیامکی',
    icon: Stethoscope,
  },
  {
    id: 'realestate',
    title: 'املاک، خودرو یا رزرو ویلا',
    desc: 'فیلتر نقشه، ثبت آگهی هوشمند و مشاوره فوری',
    icon: Home,
  },
  {
    id: 'academy',
    title: 'آموزشگاه آنلاین و فروش دوره',
    desc: 'پخش امن ویدیو با DRM، آزمون و صدور گواهینامه',
    icon: GraduationCap,
  },
  {
    id: 'custom-app',
    title: 'استارتاپ، مارکت‌پلیس و اپلیکیشن اختصاصی',
    desc: 'کدنویسی صفر تا صد اختصاصی طبق سناریوی ویژه شما',
    icon: Rocket,
  },
];

const SCALE_OPTIONS: {
  id: ScaleChoice;
  title: string;
  priceLabel: string;
  highlight: string;
}[] = [
  {
    id: 'com-20m',
    title: 'پکیج ویژه بین‌المللی با دامنه .com رایگان + هاست رایگان',
    priceLabel: '۲۰,۰۰۰,۰۰۰ تومان (مقطوع)',
    highlight: 'پیشنهاد طلایی برای برندینگ حرفه‌ای و سئو قوی‌تر',
  },
  {
    id: 'ready-ir',
    title: 'طرح آماده سریع و اقتصادی (۵ صفحه) + دامنه .ir و ۶ ماه هاست رایگان',
    priceLabel: '۱۲,۰۰۰,۰۰۰ تومان',
    highlight: 'شروع سریع ۴۸ ساعته با کمترین بودجه اولیه',
  },
  {
    id: 'custom-inquiry',
    title: 'طراحی ۱۰۰٪ اختصاصی و مهندسی‌شده طبق خواسته‌های ویژه شما',
    priceLabel: 'استعلام قیمت دقیق (رایگان)',
    highlight: 'مناسب برندهای بزرگ، مارکت‌پلیس‌ها و اپلیکیشن موبایل',
  },
];

const GOAL_OPTIONS: { id: string; label: string; pluginId: string }[] = [
  {
    id: 'bnpl',
    label: 'فروش اقساطی اسنپ‌پی/تارا + درگاه کیف‌پول بله',
    pluginId: 'tool-bnpl-snapppay-tara',
  },
  {
    id: 'torob',
    label: 'اتصال خودکار به ترب، ایمالز و جذب مشتری خریدار',
    pluginId: 'tool-torob-emalls-sync',
  },
  {
    id: 'otp',
    label: 'ورود سریع با پیامک OTP و اطلاع‌رسانی سفارشات',
    pluginId: 'tool-sms-otp-pro',
  },
  {
    id: 'speed',
    label: 'سرعت زیر ۱ ثانیه (PageSpeed 95+) و سئو گوگل',
    pluginId: 'tool-speed-cwv-turbo',
  },
  {
    id: 'security',
    label: 'امنیت ضد هک، فایروال WAF و بکاپ روزانه ابری',
    pluginId: 'tool-security-waf-backup',
  },
  {
    id: 'bale-chat',
    label: 'چت آنلاین سایت متصل مستقیم به پیام‌رسان بله',
    pluginId: 'tool-bale-livechat-crm',
  },
];

export const SmartPackageQuiz: React.FC<SmartPackageQuizProps> = ({
  onAddBundleToCart,
  onOpenCart,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [business, setBusiness] = useState<BusinessKind>('shop');
  const [scale, setScale] = useState<ScaleChoice>('com-20m');
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['bnpl', 'otp']);
  const [addedDone, setAddedDone] = useState(false);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const recommendation = useMemo(() => {
    const bizObj = BUSINESS_OPTIONS.find((b) => b.id === business)!;

    const baseItem: CartOrderItem =
      scale === 'com-20m'
        ? {
            id: 'special-com-20m',
            title: `پکیج ویژه طراحی ${bizObj.title} + دامنه .com رایگان + هاست رایگان`,
            categoryLabel: 'پکیج ویژه .com (پیشنهاد هوشمند)',
            priceToman: 20000000,
            freeGiftNote:
              'دامنه .com رایگان ۱ ساله + هاست ابری رایگان + اینماد، درگاه بله و شاپرک',
            deliveryLabel: 'تحویل ۳ تا ۵ روز کاری',
          }
        : scale === 'ready-ir'
        ? {
            id: `quiz-ready-${business}`,
            title: `طرح آماده ۵ صفحه‌ای (${bizObj.title}) + دامنه .ir و هاست ۶ ماهه رایگان`,
            categoryLabel: 'طرح آماده سریع',
            priceToman: 12000000,
            freeGiftNote: '۶ ماه هاست ابری رایگان + دامنه .ir رایگان ۱ ساله',
            deliveryLabel: 'تحویل ۴۸ ساعته',
          }
        : {
            id: `quiz-custom-${business}`,
            title: `طراحی اختصاصی ${bizObj.title} (بر اساس خواسته‌های شما)`,
            categoryLabel: 'طراحی اختصاصی (استعلام)',
            priceToman: 0,
            isInquiryOnly: true,
            freeGiftNote: 'جلسه آنالیز رایگان + صدور پیش‌فاکتور دقیق فنی',
            deliveryLabel: 'طبق قرارداد رسمی',
          };

    // Auto-recommend domain-specific plugin if user chose academy or export
    const pluginIds = new Set<string>(
      selectedGoals
        .map((gid) => GOAL_OPTIONS.find((g) => g.id === gid)?.pluginId)
        .filter((x): x is string => Boolean(x))
    );
    if (business === 'academy') pluginIds.add('tool-drm-course-shield');

    const matchedPlugins = PRO_PLUGINS_CATALOG.filter((p) =>
      pluginIds.has(p.id)
    );

    const pluginItems: CartOrderItem[] = matchedPlugins.map((p) => ({
      id: p.id,
      title: p.title,
      categoryLabel: p.categoryLabel,
      priceToman: p.priceToman,
      freeGiftNote: p.warrantyLabel,
      deliveryLabel: p.deliveryLabel,
    }));

    const allItems = [baseItem, ...pluginItems];
    const totalPrice = allItems.reduce((s, it) => s + (it.priceToman || 0), 0);

    return {
      bizTitle: bizObj.title,
      baseItem,
      matchedPlugins,
      allItems,
      totalPrice,
    };
  }, [business, scale, selectedGoals]);

  const handleApplyRecommendation = () => {
    onAddBundleToCart(recommendation.allItems);
    setAddedDone(true);
    setTimeout(() => {
      onOpenCart();
    }, 350);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header & Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700">
            <Sparkles className="w-4 h-4" />
            <span>مشاور هوشمند ۳ مرحله‌ای پاشالان (فقط ۲۰ ثانیه)</span>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
            کدام پکیج و افزونه‌ها برای کسب‌وکار شما بیشترین فروش را می‌آورد؟
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-2 rounded-full transition-all ${
                step >= num ? 'w-10 bg-blue-600' : 'w-6 bg-slate-200'
              }`}
            />
          ))}
          <span className="text-xs font-mono font-bold text-slate-500 mr-1">
            {step === 4 ? 'نتیجه' : `مرحله ${step.toLocaleString('fa-IR')} از ۳`}
          </span>
        </div>
      </div>

      {/* STEP 1: BUSINESS TYPE */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="text-sm font-extrabold text-slate-900">
            ۱. حوزه فعالیت کسب‌وکار شما چیست؟
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {BUSINESS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = business === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setBusiness(opt.id);
                    if (opt.id === 'custom-app') setScale('custom-inquiry');
                  }}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-start gap-3 ${
                    active
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/15'
                      : 'bg-slate-50 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {opt.title}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer inline-flex items-center gap-2"
            >
              <span>مرحله بعد: انتخاب دامنه و بودجه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DOMAIN & SCALE */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="text-sm font-extrabold text-slate-900">
            ۲. کدام ساختار دامنه و طراحی را ترجیح می‌دهید؟
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SCALE_OPTIONS.map((opt) => {
              const active = scale === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setScale(opt.id)}
                  className={`p-5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Globe
                        className={`w-5 h-5 ${
                          active ? 'text-emerald-400' : 'text-blue-600'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-extrabold ${
                          active ? 'text-amber-300' : 'text-blue-700'
                        }`}
                      >
                        {opt.priceLabel}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold leading-snug">
                      {opt.title}
                    </div>
                  </div>
                  <div
                    className={`text-[11px] ${
                      active ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {opt.highlight}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer inline-flex items-center gap-2"
            >
              <span>مرحله آخر: انتخاب افزونه‌های رشد فروش</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: GROWTH GOALS / PLUGINS */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="text-sm font-extrabold text-slate-900">
            ۳. کدام امکانات برایتان اولویت دارد؟ (هر چند مورد که می‌خواهید تیک بزنید)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GOAL_OPTIONS.map((goal) => {
              const checked = selectedGoals.includes(goal.id);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleGoal(goal.id)}
                  className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                    checked
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-blue-400'
                  }`}
                >
                  <CheckCircle2
                    className={`w-5 h-5 shrink-0 ${
                      checked ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <span className="text-xs font-extrabold leading-snug">
                    {goal.label}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4" />
              <span>مرحله قبل</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAddedDone(false);
                setStep(4);
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-extrabold cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>مشاهده ترکیب اختصاصی پیشنهادی من</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: TAILORED RECOMMENDATION RESULT */}
      {step === 4 && (
        <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-7 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                <Gift className="w-4 h-4" />
                <span>بهترین ترکیب مهندسی‌شده برای «{recommendation.bizTitle}»</span>
              </span>
              <h4 className="text-lg sm:text-xl font-extrabold mt-1">
                {recommendation.baseItem.title}
              </h4>
            </div>
            <div className="text-right md:text-left shrink-0">
              <span className="text-[11px] text-slate-400 block">
                برآورد کل ترکیب پیشنهادی:
              </span>
              <span className="text-2xl font-mono font-extrabold text-amber-300 tabular-nums">
                {recommendation.totalPrice > 0
                  ? `${recommendation.totalPrice.toLocaleString('fa-IR')} تومان`
                  : 'استعلام اختصاصی رایگان'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendation.allItems.map((it) => (
              <div
                key={it.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{it.title}</span>
                  </div>
                  {it.freeGiftNote && (
                    <div className="text-[11px] text-emerald-300">
                      {it.freeGiftNote}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-mono font-bold shrink-0 ${
                    !it.isInquiryOnly && it.priceToman === 0
                      ? 'text-emerald-400'
                      : 'text-amber-200'
                  }`}
                >
                  {it.isInquiryOnly
                    ? 'استعلام'
                    : it.priceToman === 0
                    ? 'رایگان ✓'
                    : `${it.priceToman.toLocaleString('fa-IR')} ت`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تغییر پاسخ‌ها</span>
            </button>

            <button
              type="button"
              onClick={handleApplyRecommendation}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {addedDone
                  ? 'کل پکیج به سبد خرید اضافه شد ✓'
                  : `افزودن کل این ${recommendation.allItems.length.toLocaleString('fa-IR')} مورد به سبد خرید و پرداخت`}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
