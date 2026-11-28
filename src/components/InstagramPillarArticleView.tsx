import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Instagram,
  Layers,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  Globe,
  ArrowUpLeft,
} from 'lucide-react';
import { BlogArticle } from '../data/contentPagesData';
import {
  COST_ROI_TABLE,
  ConvertedInstagramShopSample,
  DIRECT_VS_WEBSITE_TABLE,
  INSTAGRAM_PILLAR_FAQS,
  INSTAGRAM_PILLAR_SECTIONS,
  INSTAGRAM_TO_SITE_20_EXAMPLES,
} from '../data/instagramToSitePillarData';
import { IndustryCategory } from '../data/spatialCatalog';
import {
  ActiveConvertedShopPreview,
  InstagramConvertedShopModal,
} from './InstagramConvertedShopModal';

interface InstagramPillarArticleViewProps {
  article: BlogArticle;
  onBack: () => void;
  onPreviewConvertedShop?: (params: {
    brandName: string;
    accentColor: string;
    category: Exclude<IndustryCategory, 'all'>;
    templateIndex: number;
  }) => void;
  onOrderComPackage?: () => void;
  onGoToTemplates?: () => void;
}

export const InstagramPillarArticleView: React.FC<InstagramPillarArticleViewProps> = ({
  article,
  onBack,
  onOrderComPackage,
  onGoToTemplates,
}) => {
  const [sampleSearch, setSampleSearch] = useState('');
  const [openFaqIdx, setOpenFaqIdx] = useState<number>(0);
  const [activePreview, setActivePreview] = useState<ActiveConvertedShopPreview | null>(null);

  // Instant Interactive Converter for user's own Instagram page
  const [customHandle, setCustomHandle] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [customNicheShopId, setCustomNicheShopId] = useState<string>('ig-demo-06');

  const filteredSamples = INSTAGRAM_TO_SITE_20_EXAMPLES.filter((item) => {
    const q = sampleSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      item.niche.toLowerCase().includes(q) ||
      item.shopBrandName.toLowerCase().includes(q) ||
      item.instagramHandle.toLowerCase().includes(q) ||
      item.afterUpgradeSummary.toLowerCase().includes(q)
    );
  });

  const handleLaunchCustomPreview = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedSample =
      INSTAGRAM_TO_SITE_20_EXAMPLES.find((s) => s.id === customNicheShopId) ||
      INSTAGRAM_TO_SITE_20_EXAMPLES[0];
    const rawHandle = customHandle.replace(/^@/, '').trim();
    const cleanedBrand =
      customBrand.trim() || rawHandle || matchedSample.shopBrandName;
    const slugHandle = rawHandle
      ? rawHandle.toLowerCase().replace(/[^a-z0-9._-]/g, '')
      : '';
    const customDomain = slugHandle
      ? `${slugHandle.replace(/[._]/g, '')}.ir`
      : matchedSample.convertedDomain;

    setActivePreview({
      shopId: matchedSample.id,
      brandName: cleanedBrand,
      instagramHandle: rawHandle ? `@${rawHandle}` : matchedSample.instagramHandle,
      convertedDomain: customDomain,
      followersLabel: 'تبدیل اختصاصی پیج شما',
      beforePainPoint: matchedSample.beforePainPoint,
      conversionBoost: matchedSample.conversionBoost,
      liveDemoUrl: matchedSample.liveDemoUrl,
      liveDemoBrandLabel: matchedSample.liveDemoBrandLabel,
    });
  };

  const handleOpenSample = (sample: ConvertedInstagramShopSample) => {
    setActivePreview({
      shopId: sample.id,
      brandName: sample.shopBrandName,
      instagramHandle: sample.instagramHandle,
      convertedDomain: sample.convertedDomain,
      followersLabel: sample.followersLabel,
      beforePainPoint: sample.beforePainPoint,
      conversionBoost: sample.conversionBoost,
      liveDemoUrl: sample.liveDemoUrl,
      liveDemoBrandLabel: sample.liveDemoBrandLabel,
    });
  };

  return (
    <section className="w-full py-10 sm:py-14 bg-[#F8FAFC]" dir="rtl">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>بازگشت به آرشیو مقالات تخصصی</span>
        </button>

        <article className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-10 space-y-7 shadow-xs">
          {/* Top Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 font-extrabold text-blue-700">
                راهنمای جامع پیلار (Pillar Guide)
              </span>
              <span className="font-bold text-slate-700">{article.category}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>به‌روزرسانی: {article.publishDate}</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-[34px] font-extrabold text-slate-900 leading-snug">
              {article.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-loose">
              {article.excerpt}
            </p>

            {/* Google E-E-A-T Author & Technical Reviewer Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 font-extrabold text-slate-900">
                  <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    نویسنده: {article.author} ({article.authorRole})
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    بازبینی فنی و تایید علمی:{' '}
                    {article.reviewedBy ||
                      'تیم مهندسی سئو و معماری وب پاشالان (تایید استاندارد Google E-E-A-T)'}
                  </span>
                </div>
                {article.humanExperienceNote && (
                  <div className="text-emerald-800 font-bold text-[11px] pt-0.5">
                    تجربه میدانی: {article.humanExperienceNote}
                  </div>
                )}
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-extrabold text-[11px]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>محتوای جامع انسان‌محور (Google E-E-A-T)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Key Executive Takeaways */}
          <div className="bg-blue-50/75 border border-blue-200 rounded-2xl p-5 space-y-3">
            <div className="text-xs sm:text-sm font-extrabold text-blue-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>خلاصه اجرایی و یافته‌های کلیدی این راهنمای جامع:</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
              {article.keyTakeaways.map((kt) => (
                <li key={kt} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                  <span>{kt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clickable Table of Contents */}
          <nav
            aria-label="فهرست مطالب راهنمای تبدیل پیج اینستاگرام به سایت"
            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3"
          >
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>فهرست مطالب (پرش سریع به هر بخش):</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {INSTAGRAM_PILLAR_SECTIONS.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-bold transition-colors"
                >
                  {sec.heading}
                </a>
              ))}
              <a
                href="#twenty-converted-instagram-shops"
                className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold transition-colors"
              >
                ★ کارگاه زنده: ۲۰ نمونه پیج فروشگاهی اینستاگرام تبدیل‌شده به سایت
              </a>
              <a
                href="#instagram-pillar-faq"
                className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 font-bold transition-colors"
              >
                پرسش و پاسخ متداول تبدیل پیج اینستاگرام به سایت (۸ سوال کلیدی)
              </a>
            </div>
          </nav>

          {/* 12 Full Pillar Chapters */}
          <div className="space-y-9 pt-2">
            {INSTAGRAM_PILLAR_SECTIONS.map((sec) => (
              <section key={sec.id} id={sec.id} className="space-y-4 scroll-mt-24">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug border-r-4 border-blue-600 pr-3">
                  {sec.heading}
                </h2>

                {sec.body.split('\n\n').map((para, idx) => (
                  <p
                    key={idx}
                    className="text-xs sm:text-[15px] text-slate-700 leading-[2.05] text-justify"
                  >
                    {para}
                  </p>
                ))}

                {sec.bullets && sec.bullets.length > 0 && (
                  <ul className="space-y-2.5 bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
                    {sec.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-loose"
                      >
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-1.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {sec.callout && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm font-bold text-emerald-950 leading-relaxed">
                    {sec.callout}
                  </div>
                )}

                {/* Comparison Table 1 inside Section 2 */}
                {sec.id === 'direct-vs-site-comparison' && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[680px]">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="p-3.5 font-extrabold">معیار کسب‌وکار</th>
                          <th className="p-3.5 font-extrabold">فروش در دایرکت اینستاگرام</th>
                          <th className="p-3.5 font-extrabold text-emerald-300">
                            وب‌سایت فروشگاهی مستقل
                          </th>
                          <th className="p-3.5 font-extrabold">اثر واقعی روی درآمد</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {DIRECT_VS_WEBSITE_TABLE.map((row) => (
                          <tr key={row.metric} className="hover:bg-slate-50">
                            <td className="p-3.5 font-extrabold text-slate-900">
                              {row.metric}
                            </td>
                            <td className="p-3.5 text-rose-700 font-medium">
                              {row.instagramDirect}
                            </td>
                            <td className="p-3.5 text-emerald-800 font-bold">
                              {row.independentWebsite}
                            </td>
                            <td className="p-3.5 text-slate-600 text-xs">
                              {row.impactNote}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cost & ROI Table inside Section 10 */}
                {sec.id === 'costs-and-roi-1405' && (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-right text-xs sm:text-sm border-collapse min-w-[660px]">
                      <thead>
                        <tr className="bg-blue-950 text-white">
                          <th className="p-3.5 font-extrabold">ردیف مالی / سرمایه‌گذاری</th>
                          <th className="p-3.5 font-extrabold">مدل فروش صرفاً در اینستاگرام</th>
                          <th className="p-3.5 font-extrabold text-emerald-300">
                            سایت فروشگاهی پاشالان
                          </th>
                          <th className="p-3.5 font-extrabold">نتیجه بازگشت سرمایه</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {COST_ROI_TABLE.map((row) => (
                          <tr key={row.metric} className="hover:bg-slate-50">
                            <td className="p-3.5 font-extrabold text-slate-900">
                              {row.metric}
                            </td>
                            <td className="p-3.5 text-slate-700">{row.instagramDirect}</td>
                            <td className="p-3.5 text-blue-800 font-bold">
                              {row.independentWebsite}
                            </td>
                            <td className="p-3.5 text-emerald-700 font-bold text-xs">
                              {row.impactNote}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* ================================================================= */}
          {/* 20 CONVERTED INSTAGRAM SHOPS SHOWCASE + INSTANT LIVE CONVERTER    */}
          {/* ================================================================= */}
          <section
            id="twenty-converted-instagram-shops"
            className="pt-4 space-y-6 scroll-mt-24 border-t border-slate-200"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold">
                <Instagram className="w-4 h-4" />
                <span>کارگاه زنده تبدیل پیج به سایت · ۲۰ صنف پرفروش ایران</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                ۲۰ نمونه تبدیل پیج فروشگاهی اینستاگرام به وب‌سایت زنده (با پیش‌نمایش تعاملی)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                برای احترام به حقوق مالکیت برندها، الگوهای زیر بر اساس ۲۰ صنف واقعی و پرفروش آنلاین‌شاپ‌های اینستاگرام ایران شبیه‌سازی شده‌اند. روی دکمه{' '}
                <strong>«مشاهده سایت تبدیل‌شده»</strong> هر کارت بزنید تا سایت فروشگاهی آن صنف را به‌صورت زنده باز کنید؛ یا همین الان در کادر زیر{' '}
                <strong>آیدی پیج اینستاگرام خودتان</strong> را وارد کنید و نسخه تبدیل‌شده پیجتان را زنده ببینید!
              </p>
            </div>

            {/* Instant Interactive "Convert Your Own Instagram Page" Mini-Studio */}
            <form
              onSubmit={handleLaunchCustomPreview}
              className="rounded-3xl bg-slate-950 text-white p-5 sm:p-6 border border-slate-800 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-emerald-300">
                  <Store className="w-4 h-4" />
                  <span>تست فوری: پیج اینستاگرام خودتان را همین الان تبدیل به سایت ببینید!</span>
                </div>
                <span className="text-[11px] font-bold text-slate-300">
                  کاملاً رایگان · پیش‌نمایش زنده زیر ۱ ثانیه
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  dir="ltr"
                  value={customHandle}
                  onChange={(e) => setCustomHandle(e.target.value)}
                  placeholder="@your_shop_page"
                  aria-label="آیدی پیج اینستاگرام"
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="نام فارسی فروشگاه (مثلاً: مزون آوا)"
                  aria-label="نام فارسی فروشگاه"
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
                />
                <select
                  value={customNicheShopId}
                  onChange={(e) => setCustomNicheShopId(e.target.value)}
                  aria-label="انتخاب دقیق صنف پیج اینستاگرام"
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-xs text-white focus:outline-none focus:border-emerald-400"
                >
                  {INSTAGRAM_TO_SITE_20_EXAMPLES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.niche}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>ساخت پیش‌نمایش زنده سایت</span>
                </button>
              </div>
            </form>

            {/* Search Filter for the 20 Samples */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <div className="text-xs font-extrabold text-slate-700">
                نمایش {filteredSamples.length.toLocaleString('fa-IR')} از ۲۰ نمونه پیج فروشگاهی تبدیل‌شده به سایت
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={sampleSearch}
                  onChange={(e) => setSampleSearch(e.target.value)}
                  placeholder="جستجوی صنف (مثلاً مانتو، عطر، طلا، موبایل...)"
                  aria-label="جستجو در ۲۰ نمونه پیج اینستاگرام"
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* 20 Converted Instagram Shop Cards Grid (With Unique Topic-Matched Site Preview Images) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSamples.map((sample) => (
                <div
                  key={sample.id}
                  className="group bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-500 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-2xs hover:shadow-md"
                >
                  <div>
                    {/* Mini Live Website Browser Preview Thumbnail */}
                    <button
                      type="button"
                      onClick={() => handleOpenSample(sample)}
                      className="w-full text-right block cursor-pointer focus:outline-none border-b border-slate-200 bg-slate-900"
                    >
                      {/* Mini Browser Chrome Bar */}
                      <div className="px-3 py-2 bg-slate-900 text-white flex items-center justify-between gap-2 text-[10px]">
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-rose-400" />
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <div
                          dir="ltr"
                          className="px-2.5 py-0.5 rounded-md bg-white/10 text-slate-200 font-mono truncate max-w-[190px]"
                        >
                          https://{sample.convertedDomain}
                        </div>
                        <span className="inline-flex items-center gap-1 text-emerald-300 font-extrabold shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>سایت زنده</span>
                        </span>
                      </div>

                      {/* Unique Topic-Matched Site Preview Photograph */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-800">
                        <img
                          src={`/images/ig-demos/${sample.id}.jpg`}
                          alt={`پیش‌نمایش سایت فروشگاهی ${sample.shopBrandName} — صنف ${sample.niche}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                        {/* Top-Right Niche Badge */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          <span
                            className="px-2 py-0.5 rounded-lg text-white font-mono font-black text-[10px] shadow-xs"
                            style={{ backgroundColor: sample.accentColor }}
                          >
                            #{String(sample.index).padStart(2, '0')}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-extrabold border border-white/15">
                            {sample.niche}
                          </span>
                        </div>

                        {/* Top-Left Growth Stat Badge */}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-emerald-400 text-slate-950 text-[10px] font-black shadow-xs">
                          {sample.conversionBoost}
                        </span>

                        {/* Bottom Storefront Overlay Bar */}
                        <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between gap-2 text-white">
                          <div className="min-w-0">
                            <div className="text-sm font-black truncate drop-shadow-xs">
                              {sample.shopBrandName}
                            </div>
                            <div className="text-[10px] text-slate-200 truncate">
                              {sample.liveDemoBrandLabel}
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-white/95 group-hover:bg-emerald-400 text-slate-950 font-black text-[10px] inline-flex items-center gap-1 shrink-0 transition-colors">
                            <span>باز کردن زنده</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Card Details */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                          <span dir="ltr" className="font-mono font-bold text-pink-700 truncate">
                            {sample.instagramHandle}
                          </span>
                          <span>·</span>
                          <span className="shrink-0">{sample.followersLabel}</span>
                        </div>
                        <span className="text-[10px] font-extrabold text-blue-700 shrink-0">
                          {sample.niche}
                        </span>
                      </div>

                      {/* Before -> After Breakdown */}
                      <div className="space-y-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-900 leading-relaxed">
                          <strong className="font-extrabold">قبل (دایرکت پیج): </strong>
                          {sample.beforePainPoint}
                        </div>
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-950 leading-relaxed">
                          <strong className="font-extrabold">
                            بعد (سایت{' '}
                            <span dir="ltr" className="font-mono">
                              {sample.convertedDomain}
                            </span>
                            ):{' '}
                          </strong>
                          {sample.afterUpgradeSummary}
                        </div>
                      </div>

                      {/* Active Features */}
                      <div className="flex flex-wrap gap-1.5">
                        {sample.activeFeatures.map((feat) => (
                          <span
                            key={feat}
                            className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-bold text-slate-700"
                          >
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Live Preview Trigger */}
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                    <button
                      type="button"
                      onClick={() => handleOpenSample(sample)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Globe className="w-4 h-4 text-emerald-400" />
                      <span>مشاهده پیش‌نمایش زنده سایت تبدیل‌شده</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* PILLAR FAQ ACCORDION (8 KEY QUESTIONS)                            */}
          {/* ================================================================= */}
          <section
            id="instagram-pillar-faq"
            className="pt-6 space-y-4 border-t border-slate-200 scroll-mt-24"
          >
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              پرسش‌های متداول درباره تبدیل پیج اینستاگرام به سایت فروشگاهی
            </h2>
            <div className="space-y-2.5">
              {INSTAGRAM_PILLAR_FAQS.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={faq.q}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/60"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIdx(isOpen ? -1 : idx)}
                      className="w-full text-right p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/80 transition-colors"
                    >
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-700 leading-loose border-t border-slate-200/70 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Final Clean Conversion CTA (Call Icon Only, Zero Raw Phone Digits) */}
          <section className="rounded-3xl bg-gradient-to-l from-slate-950 via-blue-950 to-slate-900 text-white p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
            <div className="space-y-2 max-w-2xl">
              <div className="text-xs font-extrabold text-emerald-300">
                آماده‌اید پیج اینستاگرامتان را در ۴۸ ساعت تبدیل به سایت فروشگاهی کنید؟
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold leading-snug">
                همین الان با دامنه رایگان، اینماد، درگاه پرداخت، اسنپ‌پی و ترب شروع کنید
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مالکیت ۱۰۰٪ دامنه و سورس‌کد به نام شما + آموزش مدیریت با موبایل + پرداخت امن مرحله‌ای.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {onOrderComPackage && (
                <button
                  type="button"
                  onClick={onOrderComPackage}
                  className="px-4 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer transition-colors"
                >
                  سفارش پکیج .com رایگان (۲۰ میلیون)
                </button>
              )}
              {onGoToTemplates && (
                <button
                  type="button"
                  onClick={onGoToTemplates}
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-extrabold text-xs inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <span>مشاهده ۱۴۰ طرح زنده</span>
                  <ArrowUpLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <a
                href="tel:+989197254078"
                aria-label="تماس مستقیم با مشاور تبدیل پیج به سایت"
                className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تماس فوری با مشاور</span>
              </a>
            </div>
          </section>
        </article>
      </div>

      {/* Instant 0ms 100% Niche-Matched Converted Shop Interactive Modal */}
      <InstagramConvertedShopModal
        key={activePreview ? `${activePreview.shopId}-${activePreview.brandName}` : 'closed'}
        preview={activePreview}
        onClose={() => setActivePreview(null)}
        onOrderSimilarSite={() => {
          setActivePreview(null);
          onOrderComPackage?.();
        }}
      />
    </section>
  );
};
