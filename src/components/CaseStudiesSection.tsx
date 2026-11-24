import React from 'react';
import {
  TrendingUp,
  Gauge,
  Award,
  ArrowUpLeft,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { CATEGORY_SHELVES } from '../data/megaTemplatesCatalog';
import { IndustryCategory } from '../data/spatialCatalog';

type ConcreteCategoryId = Exclude<IndustryCategory, 'all'>;

interface CaseStudy {
  id: string;
  brand: string;
  industry: string;
  categoryId: ConcreteCategoryId;
  summary: string;
  beforeSpeed: string;
  afterSpeed: string;
  beforeConversion: string;
  afterConversion: string;
  highlightBadge: string;
  deliverables: string[];
}

const REAL_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'cs-shop',
    brand: 'فروشگاه اینترنتی لوازم خانگی آرامیس',
    industry: 'فروشگاه آنلاین + ترب + اقساط اسنپ‌پی',
    categoryId: 'ecommerce-shop',
    summary:
      'مهاجرت از قالب سنگین قدیمی به معماری سریع پاشالان، اتصال خودکار به ترب و ایمالز و فعال‌سازی پرداخت ۴ قسطه اسنپ‌پی در کمتر از ۷۲ ساعت.',
    beforeSpeed: '۵.۸ ثانیه (امتیاز ۳۹)',
    afterSpeed: '۰.۷ ثانیه (امتیاز ۹۷)',
    beforeConversion: '۰.۹٪ نرخ تبدیل',
    afterConversion: '۳.۴٪ (+۲۷۷٪ فروش)',
    highlightBadge: '۳.۸ برابر رشد سفارش ماهانه',
    deliverables: ['پکیج ۲۰ میلیونی .com', 'افزونه ترب و ایمالز', 'فروش اقساطی اسنپ‌پی'],
  },
  {
    id: 'cs-clinic',
    brand: 'کلینیک تخصصی پوست و زیبایی رویا (تهران)',
    industry: 'پزشکی و نوبت‌دهی آنلاین با پیامک خودکار',
    categoryId: 'clinic-wellness',
    summary:
      'راه‌اندازی سایت با اسکیماهای پزشکی، نوبت‌دهی هوشمند با پرداخت بیعانه درگاه بله و کاهش ۷۰٪ کنسلی نوبت‌ها از طریق یادآور پیامکی.',
    beforeSpeed: '۴.۶ ثانیه (امتیاز ۴۷)',
    afterSpeed: '۰.۶ ثانیه (امتیاز ۹۸)',
    beforeConversion: '۱۲ نوبت آنلاین / هفته',
    afterConversion: '۶۸ نوبت آنلاین / هفته',
    highlightBadge: 'رتبه ۱ گوگل در ۳ کلمه کلیدی کلینیک',
    deliverables: ['طرح زنده کلینیک', 'پیامک هوشمند نوبت‌دهی', 'سئو اسکیما Pro'],
  },
  {
    id: 'cs-corp',
    brand: 'گروه صنعتی و بازرگانی پارس‌تجهیز',
    industry: 'شرکتی دوزبانه + کاتالوگ B2B و استعلام آنلاین',
    categoryId: 'corporate-industrial',
    summary:
      'طراحی پورتال رسمی با دامنه .com، ساختار سئو شده برای جذب سرنخ‌های صادراتی و هوش مصنوعی پاسخگوی ۲۴ ساعته به خریداران عمده.',
    beforeSpeed: '۶.۲ ثانیه (امتیاز ۳۴)',
    afterSpeed: '۰.۸ ثانیه (امتیاز ۹۶)',
    beforeConversion: '۴ استعلام / ماه',
    afterConversion: '۲۹ استعلام B2B / ماه',
    highlightBadge: 'ورود به صفحه اول گوگل و ارجاع در ChatGPT',
    deliverables: ['پکیج ویژه .com رایگان', 'فایروال امنیتی WAF', 'چت‌بات فروش هوشمند'],
  },
];

interface CaseStudiesSectionProps {
  onSelectIndustry: (catId: ConcreteCategoryId) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onSelectIndustry,
}) => {
  return (
    <section className="space-y-8" dir="rtl">
      {/* Real Before/After Case Studies */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>نتایج واقعی پروژه‌های اجراشده در پاشالان (قبل و بعد)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              اعداد واقعی سرعت، رتبه گوگل و رشد فروش کارفرمایان ما
            </h2>
          </div>
          <p className="text-xs text-slate-600 max-w-md leading-relaxed">
            به‌جای شعار، خروجی فنی سایت‌ها را با شاخص‌های واقعی Core Web Vitals، نرخ تبدیل و فروش آنلاین ارزیابی می‌کنیم.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {REAL_CASE_STUDIES.map((cs) => (
            <article
              key={cs.id}
              className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col justify-between gap-4 hover:border-blue-400 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-blue-700">
                    {cs.industry}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 text-[10.5px] font-black">
                    {cs.highlightBadge}
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {cs.brand}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cs.summary}
                </p>

                {/* Before / After Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-blue-600" />
                      <span>سرعت بارگذاری</span>
                    </div>
                    <div className="text-[10.5px] text-rose-600 line-through mt-1">
                      {cs.beforeSpeed}
                    </div>
                    <div className="text-xs font-black text-emerald-700">
                      {cs.afterSpeed}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                    <div className="text-[10px] text-slate-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" />
                      <span>رشد فروش / سرنخ</span>
                    </div>
                    <div className="text-[10.5px] text-slate-500 line-through mt-1">
                      {cs.beforeConversion}
                    </div>
                    <div className="text-xs font-black text-blue-700">
                      {cs.afterConversion}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cs.deliverables.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10.5px] font-bold text-slate-700"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectIndustry(cs.categoryId)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>مشاهده ۲۰ طرح زنده این صنف</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </button>
            </article>
          ))}
        </div>
      </div>

      {/* Programmatic SEO 7-Industry Landing Hub */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-8 border border-slate-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold">
              <Layers className="w-4 h-4" />
              <span>صفحات اختصاصی طراحی سایت برای ۷ صنعت کلیدی ایران (سئو شده)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold">
              دقیقاً به دنبال طراحی سایت برای کدام صنف هستید؟
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            هر صنف دارای ۲۰ دموی زنده واقعی + متاتگ و اسکیما اختصاصی گوگل
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {CATEGORY_SHELVES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectIndustry(cat.id)}
              className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 text-right cursor-pointer transition-all flex flex-col justify-between gap-2"
            >
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-white">
                  {cat.title}
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">
                  {cat.subtitle}
                </p>
              </div>
              <div className="text-[11px] font-bold text-emerald-300 flex items-center justify-between pt-2 border-t border-white/10">
                <span>{cat.badgeText} + دامنه رایگان</span>
                <ArrowUpLeft className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
