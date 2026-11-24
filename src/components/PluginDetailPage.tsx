import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  CheckCircle2,
  ShoppingCart,
  Crown,
  Gift,
  Sparkles,
  Star,
  Download,
  Clock,
  ShieldCheck,
  Code2,
  Layers,
  HelpCircle,
  Share2,
  Check,
  ArrowUpLeft,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Cpu,
  Wrench,
  MessageSquarePlus,
  History,
  Send,
} from 'lucide-react';
import { ProPluginItem } from '../data/pluginsCatalog';
import { PluginLogoEmblem, getPluginCategoryCover } from './PluginVisuals';
import { CartOrderItem } from './ShoppingCartDrawer';

interface PluginDetailPageProps {
  plugin: ProPluginItem;
  allPlugins: ProPluginItem[];
  cartItemIds: Set<string>;
  onToggleCartItem: (item: CartOrderItem) => void;
  onOpenCart: () => void;
  onBackToTools: () => void;
  onSelectPlugin: (plugin: ProPluginItem) => void;
}

const TIER_META: Record<
  ProPluginItem['tier'],
  { label: string; badgeClass: string; desc: string }
> = {
  free: {
    label: 'نسخه پایه کاملاً رایگان',
    badgeClass: 'bg-emerald-500 text-slate-950',
    desc: 'رایگان دائمی روی سایت شما + امکان ارتقا به VIP',
  },
  pro: {
    label: 'نسخه حرفه‌ای (Pro رقابتی)',
    badgeClass: 'bg-blue-600 text-white',
    desc: 'قیمت‌گذاری رقابتی مستقیم بدون واسطه + نصب و تنظیم',
  },
  vip: {
    label: 'نسخه سازمانی VIP',
    badgeClass: 'bg-amber-400 text-slate-950',
    desc: 'معماری اختصاصی پرفروش + پشتیبانی ویژه و مانیتورینگ',
  },
};

export const PluginDetailPage: React.FC<PluginDetailPageProps> = ({
  plugin,
  allPlugins,
  cartItemIds,
  onToggleCartItem,
  onOpenCart,
  onBackToTools,
  onSelectPlugin,
}) => {
  const hasDistinctVip = plugin.vipPriceToman > plugin.priceToman;
  const [selectedEdition, setSelectedEdition] = useState<'standard' | 'vip'>(
    plugin.tier === 'vip' && !hasDistinctVip ? 'vip' : 'standard'
  );
  const [activeTab, setActiveTab] = useState<
    'overview' | 'specs' | 'compare' | 'faq' | 'reviews'
  >('overview');
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Verified Customer Reviews state
  const [reviews, setReviews] = useState<
    {
      id: string;
      authorName: string;
      businessName: string;
      rating: number;
      comment: string;
      createdAt: string;
    }[]
  >([]);
  const [revName, setRevName] = useState('');
  const [revBiz, setRevBiz] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [revSubmitting, setRevSubmitting] = useState(false);
  const [revFeedback, setRevFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/plugins/${encodeURIComponent(plugin.id)}/reviews`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && Array.isArray(d.reviews)) {
          setReviews(d.reviews);
        }
      })
      .catch(() => {});
  }, [plugin.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setRevSubmitting(true);
    setRevFeedback(null);
    try {
      const resp = await fetch(
        `/api/plugins/${encodeURIComponent(plugin.id)}/reviews`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            authorName: revName.trim(),
            businessName: revBiz.trim(),
            rating: revRating,
            comment: revComment.trim(),
          }),
        }
      );
      const data = await resp.json();
      if (resp.ok && data.ok) {
        setReviews(data.reviews || []);
        setRevName('');
        setRevBiz('');
        setRevComment('');
        setRevFeedback('دیدگاه فنی شما با موفقیت ثبت و منتشر شد ✓');
      } else {
        setRevFeedback(data.error || 'خطا در ثبت دیدگاه.');
      }
    } catch {
      setRevFeedback('ارتباط با سرور برقرار نشد.');
    } finally {
      setRevSubmitting(false);
    }
  };

  const tierInfo = TIER_META[plugin.tier];
  const coverSrc = getPluginCategoryCover(plugin.categoryId);

  const standardCartId = plugin.id;
  const vipCartId = `${plugin.id}-vip`;

  const isStandardInCart = cartItemIds.has(standardCartId);
  const isVipInCart = cartItemIds.has(vipCartId);

  const activeEditionIsVip =
    selectedEdition === 'vip' || (plugin.tier === 'vip' && !hasDistinctVip);
  const activePrice = activeEditionIsVip
    ? plugin.vipPriceToman
    : plugin.priceToman;
  const activeCartId = activeEditionIsVip ? vipCartId : standardCartId;
  const isActiveInCart = cartItemIds.has(activeCartId);

  const marketSavings =
    plugin.marketCompareToman > activePrice
      ? plugin.marketCompareToman - activePrice
      : 0;

  const relatedPlugins = useMemo(() => {
    const sameCategory = allPlugins.filter(
      (p) => p.id !== plugin.id && p.categoryId === plugin.categoryId
    );
    const others = allPlugins.filter(
      (p) => p.id !== plugin.id && p.categoryId !== plugin.categoryId
    );
    return [...sameCategory, ...others].slice(0, 3);
  }, [allPlugins, plugin]);

  const handleToggleEditionCart = (edition: 'standard' | 'vip') => {
    const isVip = edition === 'vip';
    const price = isVip ? plugin.vipPriceToman : plugin.priceToman;
    const cid = isVip ? vipCartId : standardCartId;
    onToggleCartItem({
      id: cid,
      title: isVip
        ? `${plugin.title} (نسخه VIP اختصاصی)`
        : plugin.tier === 'free'
        ? `${plugin.title} (نسخه رایگان)`
        : plugin.title,
      categoryLabel: isVip
        ? `${plugin.categoryLabel} · VIP`
        : plugin.tier === 'free'
        ? `${plugin.categoryLabel} · رایگان`
        : plugin.categoryLabel,
      priceToman: price,
      isInquiryOnly: false,
      freeGiftNote: isVip
        ? `نصب و کانفیگ VIP + پشتیبانی مستقیم و گارانتی ۱ ساله`
        : `${plugin.warrantyLabel} · نصب و تست فنی روی دامنه شما`,
      deliveryLabel: plugin.deliveryLabel,
    });
  };

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#plugin/${plugin.slug}`;
    navigator.clipboard?.writeText(url).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="w-full py-8 sm:py-12 bg-[#F8FAFC]" dir="rtl">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        {/* Top Breadcrumb & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={onBackToTools}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 text-slate-800 font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-blue-600" />
              <span>بازگشت به مرکز افزونه‌ها و ابزارها</span>
            </button>
            <span className="text-slate-400 hidden sm:inline">/</span>
            <span className="text-slate-500 font-bold hidden sm:inline">
              {plugin.categoryLabel}
            </span>
            <span className="text-slate-400 hidden sm:inline">/</span>
            <span className="text-slate-900 font-extrabold hidden sm:inline">
              {plugin.shortName}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">لینک صفحه کپی شد</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>کپی لینک مستقیم افزونه</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN SPLIT LAYOUT: HERO + TABS (8 COLS) | STICKY PRICING (4 COLS) */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* RIGHT COLUMN IN RTL (8 COLS): VISUAL HERO + TECHNICAL CONTENT */}
          <div className="lg:col-span-8 space-y-6">
            {/* Editorial Visual Hero Card */}
            <div className="bg-slate-950 text-white rounded-3xl overflow-hidden border border-slate-800 shadow-lg">
              {/* Cover Image Banner */}
              <div className="relative h-48 sm:h-60 w-full overflow-hidden">
                <img
                  src={coverSrc}
                  alt={plugin.title}
                  className="w-full h-full object-cover opacity-55"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/20" />

                {/* Top Meta Badges on Cover */}
                <div className="absolute top-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-xl text-xs font-black shadow-sm ${tierInfo.badgeClass}`}
                    >
                      {tierInfo.label}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900/85 border border-white/15 text-slate-200 text-[11px] font-bold">
                      {plugin.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/85 border border-white/15 rounded-xl px-3 py-1 text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-mono font-black text-white">
                      {plugin.rating}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ({plugin.reviewsCount.toLocaleString('fa-IR')} نظر)
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay: Branded Logo Emblem + Title */}
                <div className="absolute bottom-4 right-5 left-5 flex items-end gap-4">
                  <PluginLogoEmblem plugin={plugin} size="lg" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-emerald-300 font-mono font-bold">
                      <span>{plugin.version}</span>
                      <span>·</span>
                      <span>آپدیت {plugin.lastUpdated}</span>
                      <span>·</span>
                      <span>{plugin.activeInstalls} نصب فعال</span>
                    </div>
                    <h1 className="text-lg sm:text-2xl lg:text-[26px] font-extrabold text-white leading-snug">
                      {plugin.title}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Hero Body: Subtitle + 3 Key Metrics */}
              <div className="p-5 sm:p-7 space-y-5">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {plugin.subtitle} — {plugin.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plugin.keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white/5 border border-white/10 p-4 flex flex-col justify-center"
                    >
                      <div className="text-lg sm:text-xl font-mono font-black text-emerald-400 tabular-nums">
                        {metric.value}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5-Tab Content Navigation */}
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-200 bg-slate-50/80 p-2 gap-1.5">
                {(
                  [
                    { id: 'overview', label: 'معرفی و امکانات', icon: Sparkles },
                    { id: 'specs', label: 'مشخصات فنی', icon: Cpu },
                    { id: 'compare', label: 'پایه و VIP', icon: Layers },
                    { id: 'faq', label: 'سوالات فنی', icon: HelpCircle },
                    { id: 'reviews', label: 'نظرات و نسخه‌ها', icon: MessageSquarePlus },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-2.5 px-3 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="p-5 sm:p-8">
                {/* TAB 1: BUSINESS OVERVIEW & DELIVERABLES */}
                {activeTab === 'overview' && (
                  <div className="space-y-7">
                    <div className="space-y-3">
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        توضیحات جامع و کاربرد واقعی «{plugin.shortName}»
                      </h2>
                      <div className="space-y-3">
                        {plugin.overviewParagraphs.map((para, i) => (
                          <p
                            key={i}
                            className="text-xs sm:text-sm text-slate-700 leading-loose"
                          >
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 sm:p-6 space-y-4">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>لیست دقیق موارد تحویلی و قابلیت‌های فعال روی سایت شما:</span>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {plugin.deliverables.map((item, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2 leading-relaxed"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                        <span className="font-bold text-blue-800 block">
                          نوع لایسنس و مالکیت
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {plugin.licenseType}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
                        <span className="font-bold text-emerald-800 block">
                          ضمانت و آپدیت
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {plugin.warrantyLabel}
                        </span>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">
                          سازگاری فنی
                        </span>
                        <span className="text-slate-800 font-semibold">
                          {plugin.compatibility}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: TECHNICAL ARCHITECTURE & 3-STEP INSTALL */}
                {activeTab === 'specs' && (
                  <div className="space-y-7">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                          جدول مشخصات فنی، معماری و امنیت افزونه
                        </h2>
                      </div>
                      <div className="rounded-2xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-xs sm:text-sm">
                          <tbody>
                            {plugin.technicalSpecs.map((spec, idx) => (
                              <tr
                                key={idx}
                                className={
                                  idx % 2 === 0 ? 'bg-slate-50/80' : 'bg-white'
                                }
                              >
                                <td className="py-3.5 px-4 font-extrabold text-slate-800 w-2/5 sm:w-1/3 border-l border-slate-200">
                                  {spec.label}
                                </td>
                                <td className="py-3.5 px-4 text-slate-700 font-medium leading-relaxed">
                                  {spec.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                          فرآیند ۳ مرحله‌ای نصب، تنظیم و تحویل روی سایت شما
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plugin.installSteps.map((st, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 font-mono font-black text-sm flex items-center justify-center">
                              {st.step}
                            </div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                              {st.title}
                            </h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {st.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: STANDARD/FREE VS VIP COMPARISON MATRIX */}
                {activeTab === 'compare' && (
                  <div className="space-y-5">
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        مقایسه شفاف نسخه {plugin.tier === 'free' ? 'رایگان' : 'پایه'} با نسخه VIP اختصاصی
                      </h2>
                      <p className="text-xs text-slate-600 mt-1">
                        بدون هیچ هزینه پنهانی؛ بسته به نیاز و حجم فروش کسب‌وکارتان نسخه مناسب را انتخاب کنید.
                      </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-200">
                      <table className="w-full text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-slate-900 text-white">
                            <th className="py-3.5 px-4 text-right font-extrabold">
                              ویژگی و قابلیت فنی
                            </th>
                            <th className="py-3.5 px-4 text-center font-extrabold bg-slate-800">
                              {plugin.tier === 'free'
                                ? 'نسخه رایگان (۰ تومان)'
                                : `نسخه پایه (${plugin.priceToman.toLocaleString('fa-IR')} ت)`}
                            </th>
                            <th className="py-3.5 px-4 text-center font-extrabold bg-amber-500/20 text-amber-300">
                              نسخه VIP ({plugin.vipPriceToman.toLocaleString('fa-IR')} ت)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {plugin.freeVsVip.map((row, idx) => (
                            <tr
                              key={idx}
                              className={`border-t border-slate-200 ${
                                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'
                              }`}
                            >
                              <td className="py-3 px-4 font-bold text-slate-900">
                                {row.feature}
                              </td>
                              <td className="py-3 px-4 text-center text-slate-700">
                                {row.standard}
                              </td>
                              <td className="py-3 px-4 text-center font-bold text-emerald-800 bg-emerald-50/40">
                                {row.vip}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleEditionCart('standard')}
                        className={`py-3 px-4 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                          isStandardInCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          {isStandardInCart
                            ? 'نسخه پایه در سبد شماست ✓ (حذف)'
                            : plugin.priceToman === 0
                            ? 'افزودن رایگان نسخه پایه به سبد'
                            : `انتخاب نسخه پایه (${plugin.priceToman.toLocaleString('fa-IR')} ت)`}
                        </span>
                      </button>

                      {hasDistinctVip && (
                        <button
                          type="button"
                          onClick={() => handleToggleEditionCart('vip')}
                          className={`py-3 px-4 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                            isVipInCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                          }`}
                        >
                          <Crown className="w-4 h-4" />
                          <span>
                            {isVipInCart
                              ? 'نسخه VIP در سبد شماست ✓ (حذف)'
                              : `انتخاب نسخه VIP (${plugin.vipPriceToman.toLocaleString('fa-IR')} ت)`}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: PLUGIN TECHNICAL FAQS */}
                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                      سوالات متداول فنی درباره «{plugin.shortName}»
                    </h2>
                    <div className="space-y-3">
                      {plugin.faqs.map((faq, idx) => {
                        const isOpen = openFaqIdx === idx;
                        return (
                          <div
                            key={idx}
                            className="rounded-2xl border border-slate-200 bg-slate-50/60 overflow-hidden"
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                              className="w-full p-4 text-right flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 transition-colors"
                            >
                              <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                                {faq.q}
                              </span>
                              {isOpen ? (
                                <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="px-4 pb-4 text-xs sm:text-sm text-slate-700 leading-loose border-t border-slate-200/70 pt-3 bg-white">
                                {faq.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 5: VERIFIED REVIEWS & VERSION CHANGELOG */}
                {activeTab === 'reviews' && (
                  <div className="space-y-7">
                    {/* Changelog */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                        <History className="w-4 h-4 text-blue-600" />
                        <span>تاریخچه انتشار و آپدیت‌های فنی ({plugin.version})</span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-700">
                        <li className="flex items-start gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold shrink-0">
                            {plugin.version}
                          </span>
                          <span>
                            بهینه‌سازی سرعت پاسخ سرور زیر ۵۰ میلی‌ثانیه، سازگاری کامل با آخرین نسخه درگاه بله/شاپرک و اسکیماهای گوگل ۱۴۰۵ ({plugin.lastUpdated}).
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono font-bold shrink-0">
                            v2.0
                          </span>
                          <span>
                            افزودن پنل تنظیمات فارسی، گزارش خطایابی زنده و بهینه‌سازی مصرف رم برای هاست‌های ابری ایران.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-3">
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                        دیدگاه کارفرمایان استفاده‌کننده از «{plugin.shortName}» (
                        {reviews.length.toLocaleString('fa-IR')} دیدگاه زنده)
                      </h2>
                      {reviews.length === 0 ? (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                          اولین کارفرمایی باشید که تجربه نصب و عملکرد این افزونه را ثبت می‌کند.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {reviews.map((rev) => (
                            <div
                              key={rev.id}
                              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5"
                            >
                              <div className="flex items-center justify-between gap-2 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-900">
                                    {rev.authorName}
                                  </span>
                                  <span className="text-[11px] text-blue-700 font-bold">
                                    ({rev.businessName})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-amber-500 font-mono font-bold">
                                  <span>{'★'.repeat(rev.rating)}</span>
                                  <span className="text-[10px] text-slate-400 mr-1">
                                    {rev.createdAt}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-slate-700 leading-relaxed">
                                {rev.comment}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Review Form */}
                    <form
                      onSubmit={handleSubmitReview}
                      className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3"
                    >
                      <h3 className="text-sm font-extrabold text-slate-900">
                        ثبت دیدگاه و امتیاز شما برای این افزونه
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          required
                          value={revName}
                          onChange={(e) => setRevName(e.target.value)}
                          placeholder="نام شما *"
                          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                        />
                        <input
                          type="text"
                          value={revBiz}
                          onChange={(e) => setRevBiz(e.target.value)}
                          placeholder="نام سایت یا برند (اختیاری)"
                          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                        />
                        <select
                          value={revRating}
                          onChange={(e) => setRevRating(Number(e.target.value))}
                          className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold"
                        >
                          <option value={5}>★★★★★ عالی (۵ از ۵)</option>
                          <option value={4}>★★★★☆ خوب (۴ از ۵)</option>
                          <option value={3}>★★★☆☆ متوسط (۳ از ۵)</option>
                        </select>
                      </div>
                      <textarea
                        rows={2}
                        required
                        value={revComment}
                        onChange={(e) => setRevComment(e.target.value)}
                        placeholder="تجربه شما از سرعت، نصب و پشتیبانی این افزونه..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                      />
                      {revFeedback && (
                        <div className="text-xs font-bold text-emerald-700">
                          {revFeedback}
                        </div>
                      )}
                      <button
                        type="submit"
                        disabled={revSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-extrabold cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{revSubmitting ? 'در حال ثبت...' : 'انتشار دیدگاه'}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* LEFT COLUMN IN RTL (4 COLS): STICKY COMPETITIVE PRICING & CART CARD */}
          <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-md space-y-5">
              {/* Edition Switcher (if Standard/Free and VIP differ) */}
              {hasDistinctVip ? (
                <div className="space-y-2.5">
                  <span className="text-xs font-extrabold text-slate-800 block">
                    انتخاب نسخه مورد نیاز شما:
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedEdition('standard')}
                      className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        !activeEditionIsVip
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                          {plugin.priceToman === 0 ? (
                            <Gift className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                          )}
                          <span>
                            {plugin.priceToman === 0
                              ? 'نسخه پایه (کاملاً رایگان)'
                              : 'نسخه حرفه‌ای (Pro رقابتی)'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {plugin.priceToman === 0
                            ? 'رایگان دائمی + سورس تمیز'
                            : 'نصب کامل + گارانتی ۱ ساله'}
                        </div>
                      </div>
                      <span
                        className={`text-sm font-mono font-black shrink-0 ${
                          plugin.priceToman === 0
                            ? 'text-emerald-700'
                            : 'text-slate-900'
                        }`}
                      >
                        {plugin.priceToman === 0
                          ? 'رایگان'
                          : `${plugin.priceToman.toLocaleString('fa-IR')} ت`}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedEdition('vip')}
                      className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all flex items-center justify-between gap-2 ${
                        activeEditionIsVip
                          ? 'bg-slate-900 text-white border-amber-400 ring-2 ring-amber-400/25'
                          : 'bg-amber-50/60 border-amber-200 hover:border-amber-400 text-slate-900'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-400" />
                          <span>نسخه VIP اختصاصی</span>
                        </div>
                        <div
                          className={`text-[11px] ${
                            activeEditionIsVip
                              ? 'text-slate-300'
                              : 'text-slate-600'
                          }`}
                        >
                          تمام قابلیت‌های پیشرفته + پشتیبانی ویژه
                        </div>
                      </div>
                      <span
                        className={`text-sm font-mono font-black shrink-0 ${
                          activeEditionIsVip
                            ? 'text-amber-300'
                            : 'text-slate-900'
                        }`}
                      >
                        {plugin.vipPriceToman.toLocaleString('fa-IR')} ت
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-xs font-extrabold">
                        نسخه سازمانی VIP پاشالان
                      </div>
                      <div className="text-[11px] text-slate-300">
                        نصب اختصاصی، تست بار و پشتیبانی مستقیم
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Competitive Price Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                {plugin.marketCompareToman > activePrice && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">میانگین قیمت بازار ایران:</span>
                    <span className="font-mono text-slate-400 line-through">
                      {plugin.marketCompareToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                )}
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    تعرفه رقابتی شما:
                  </span>
                  <div className="text-left">
                    {activePrice === 0 ? (
                      <span className="text-2xl font-black text-emerald-600">
                        رایگان (۰ تومان)
                      </span>
                    ) : (
                      <span className="text-2xl font-mono font-black text-slate-900 tabular-nums">
                        {activePrice.toLocaleString('fa-IR')}{' '}
                        <span className="text-xs font-sans font-bold text-slate-500">
                          تومان
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                {marketSavings > 0 && (
                  <div className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 text-center">
                    صرفه‌جویی مستقیم شما:{' '}
                    {marketSavings.toLocaleString('fa-IR')} تومان نسبت به بازار
                  </div>
                )}
              </div>

              {/* Primary Cart CTA */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() =>
                    handleToggleEditionCart(activeEditionIsVip ? 'vip' : 'standard')
                  }
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black cursor-pointer flex items-center justify-center gap-2 transition-colors shadow-xs ${
                    isActiveInCart
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : activeEditionIsVip
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {isActiveInCart
                      ? 'در سبد خرید شماست ✓ (حذف از سبد)'
                      : activePrice === 0
                      ? 'افزودن رایگان این افزونه به سبد خرید'
                      : activeEditionIsVip
                      ? 'تیک نسخه VIP در سبد خرید'
                      : 'تیک افزونه در سبد خرید'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!isActiveInCart) {
                      handleToggleEditionCart(
                        activeEditionIsVip ? 'vip' : 'standard'
                      );
                    }
                    onOpenCart();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>مشاهده سبد و تسویه با درگاه بله / شاپرک</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Guarantees List */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    زمان نصب و تحویل:
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {plugin.deliveryLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    گارانتی و آپدیت:
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {plugin.warrantyLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-amber-600" />
                    تعداد نصب فعال:
                  </span>
                  <span className="font-mono font-extrabold text-slate-900">
                    {plugin.activeInstalls} سایت
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Note */}
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>تضمین اصالت و کدنویسی تمیز:</strong> تمام افزونه‌های پاشالان بدون کدهای رمزگذاری‌شده (ionCube) و بدون افت سرعت PageSpeed روی سایت شما نصب و تست زنده می‌شوند.
              </div>
            </div>
          </aside>
        </div>

        {/* ================================================================= */}
        {/* RELATED COMPLEMENTARY PLUGINS                                      */}
        {/* ================================================================= */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              افزونه‌های مکمل پیشنهادی در کنار «{plugin.shortName}»
            </h2>
            <button
              type="button"
              onClick={onBackToTools}
              className="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
            >
              مشاهده همه ۱۴ افزونه ←
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPlugins.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectPlugin(rel)}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-3xl p-5 cursor-pointer transition-all shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <PluginLogoEmblem plugin={rel} size="sm" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                          rel.tier === 'free'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rel.tier === 'vip'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {rel.tier === 'free'
                          ? 'رایگان'
                          : rel.tier === 'vip'
                          ? 'VIP'
                          : 'حرفه‌ای Pro'}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">
                        ★ {rel.rating}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2">
                      {rel.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span
                    className={`font-mono font-black ${
                      rel.priceToman === 0 ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {rel.priceToman === 0
                      ? 'رایگان (۰ تومان)'
                      : `${rel.priceToman.toLocaleString('fa-IR')} تومان`}
                  </span>
                  <span className="text-blue-600 font-extrabold inline-flex items-center gap-1">
                    <span>صفحه افزونه</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Plugin Dedicated SEO & AI-Search Fact Summary */}
        <aside className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <h2 className="text-sm font-extrabold text-slate-900">
            خلاصه تخصصی سئو و مشخصات کلیدی «{plugin.title}» در پاشالان
          </h2>
          <p>
            افزونه <strong>{plugin.title}</strong> ({plugin.version}) در دسته‌بندی{' '}
            <strong>{plugin.categoryLabel}</strong> توسط تیم مهندسی پاشالان (Pashalan.ir) با تعرفه رقابتی{' '}
            <strong>
              {plugin.priceToman === 0
                ? 'کاملاً رایگان (۰ تومان)'
                : `${plugin.priceToman.toLocaleString('fa-IR')} تومان`}
            </strong>{' '}
            و نسخه سازمانی VIP به مبلغ{' '}
            <strong>{plugin.vipPriceToman.toLocaleString('fa-IR')} تومان</strong>{' '}
            همراه با {plugin.warrantyLabel}، زمان تحویل {plugin.deliveryLabel} و سازگاری با{' '}
            {plugin.compatibility} ارائه می‌شود. مشاوره مستقیم نصب و اتصال: 09197254078.
          </p>
        </aside>
      </div>
    </div>
  );
};
