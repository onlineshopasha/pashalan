import React, { useState, useMemo, useEffect } from 'react';
import {
  Wrench,
  ShieldCheck,
  Gauge,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShoppingCart,
  Sparkles,
  Calculator,
  Link2,
  FileCode2,
  MessageSquare,
  Loader2,
  ExternalLink,
  Gift,
  Lock,
  Layers,
  BadgeCheck,
  Crown,
  Star,
  ArrowUpLeft,
  Download,
} from 'lucide-react';
import { DomainCheckerWidget } from './DomainCheckerWidget';
import { SmartPackageQuiz } from './SmartPackageQuiz';
import { CartOrderItem } from './ShoppingCartDrawer';
import { PluginLogoEmblem, getPluginCategoryCover } from './PluginVisuals';
import {
  PRO_PLUGINS_CATALOG,
  PRO_PLUGIN_BUNDLES,
  PLUGIN_CATEGORIES,
  PluginCategoryId,
  PluginTier,
  ProPluginItem,
} from '../data/pluginsCatalog';

interface AuditCheck {
  category: 'seo' | 'security' | 'speed' | 'sitemap';
  label: string;
  status: 'pass' | 'warn';
  detail: string;
}

interface SelfAuditResponse {
  ok: boolean;
  auditedAt: string;
  responseMs: number;
  scorePercent: number;
  passedCount: number;
  totalCount: number;
  checks: AuditCheck[];
}

interface ToolsHubPageProps {
  cartItemIds: Set<string>;
  onToggleCartItem: (item: CartOrderItem) => void;
  onAddDomainPackageToCart: (item: CartOrderItem) => void;
  onAddMultipleToCart: (items: CartOrderItem[]) => void;
  onOpenCart: () => void;
  onSelectPlugin: (plugin: ProPluginItem) => void;
  pluginsRefreshNonce?: number;
}

const PERSIAN_TO_LATIN: Record<string, string> = {
  آ: 'a',
  ا: 'a',
  ب: 'b',
  پ: 'p',
  ت: 't',
  ث: 's',
  ج: 'j',
  چ: 'ch',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'z',
  ر: 'r',
  ز: 'z',
  ژ: 'zh',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'z',
  ط: 't',
  ظ: 'z',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'gh',
  ک: 'k',
  گ: 'g',
  ل: 'l',
  م: 'm',
  ن: 'n',
  و: 'v',
  ه: 'h',
  ی: 'y',
  ي: 'y',
  ك: 'k',
  ئ: 'y',
  ة: 'h',
};

function persianToSeoSlug(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => PERSIAN_TO_LATIN[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export const ToolsHubPage: React.FC<ToolsHubPageProps> = ({
  cartItemIds,
  onToggleCartItem,
  onAddDomainPackageToCart,
  onAddMultipleToCart,
  onOpenCart,
  onSelectPlugin,
  pluginsRefreshNonce = 0,
}) => {
  const [activeFreeTool, setActiveFreeTool] = useState<
    'domain' | 'audit' | 'seo-meta' | 'slug' | 'roi' | 'messenger'
  >('domain');

  const [selectedPluginCategory, setSelectedPluginCategory] =
    useState<PluginCategoryId>('all');
  const [selectedTier, setSelectedTier] = useState<'all' | PluginTier>('all');
  const [pluginSearch, setPluginSearch] = useState<string>('');
  const [livePlugins, setLivePlugins] =
    useState<ProPluginItem[]>(PRO_PLUGINS_CATALOG);

  // Sync live plugin prices & availability from server (reflects Admin Panel edits instantly)
  useEffect(() => {
    fetch('/api/plugins')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.plugins)) {
          setLivePlugins(data.plugins);
        }
      })
      .catch(() => {
        setLivePlugins(PRO_PLUGINS_CATALOG);
      });
  }, [pluginsRefreshNonce]);

  const tierCounts = useMemo(
    () => ({
      all: livePlugins.length,
      free: livePlugins.filter((p) => p.tier === 'free').length,
      pro: livePlugins.filter((p) => p.tier === 'pro').length,
      vip: livePlugins.filter((p) => p.tier === 'vip').length,
    }),
    [livePlugins]
  );

  const filteredPlugins = useMemo(() => {
    const q = pluginSearch.trim().toLowerCase();
    return livePlugins.filter((p) => {
      if (selectedPluginCategory !== 'all' && p.categoryId !== selectedPluginCategory) {
        return false;
      }
      if (selectedTier !== 'all' && p.tier !== selectedTier) {
        return false;
      }
      if (q) {
        const hay = `${p.title} ${p.shortName} ${p.subtitle} ${p.description} ${p.categoryLabel}`.toLowerCase();
        return hay.includes(q);
      }
      return true;
    });
  }, [livePlugins, selectedPluginCategory, selectedTier, pluginSearch]);

  // 1. Live Self-Audit State
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SelfAuditResponse | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const runLiveAudit = async () => {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const resp = await fetch('/api/audit/self');
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setAuditError('خطا در اجرای تست فنی سرور.');
      } else {
        setAuditResult(data);
      }
    } catch {
      setAuditError('عدم دسترسی به سرویس تست زنده سرور.');
    } finally {
      setAuditLoading(false);
    }
  };

  // 2. SEO Meta & Schema Generator State
  const [seoTitle, setSeoTitle] = useState(
    'فروشگاه آنلاین برند شما | ارسال سریع و ضمانت اصالت کالا'
  );
  const [seoDesc, setSeoDesc] = useState(
    'خرید آنلاین جدیدترین محصولات با بهترین قیمت، پرداخت امن شاپرک و کیف‌پول بله، امکان خرید اقساطی اسنپ‌پی و ارسال فوری به سراسر ایران.'
  );
  const [seoUrl, setSeoUrl] = useState('https://yourbrand.com/');
  const [copiedMeta, setCopiedMeta] = useState(false);

  const generatedMetaCode = useMemo(() => {
    return `<title>${seoTitle}</title>
<meta name="description" content="${seoDesc}" />
<link rel="canonical" href="${seoUrl}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${seoTitle}" />
<meta property="og:description" content="${seoDesc}" />
<meta property="og:url" content="${seoUrl}" />
<meta name="twitter:card" content="summary_large_image" />`;
  }, [seoTitle, seoDesc, seoUrl]);

  // 3. Slug & Keyword Density Tool State
  const [slugInput, setSlugInput] = useState(
    'طراحی سایت فروشگاهی حرفه ای با دامنه رایگان'
  );
  const [keywordInput, setKeywordInput] = useState('سایت');
  const [sampleBody, setSampleBody] = useState(
    'طراحی سایت فروشگاهی سریع و بهینه باعث می‌شود سایت شما در صفحه اول گوگل دیده شود. اگر سرعت سایت زیر یک ثانیه باشد نرخ تبدیل سایت تا دو برابر افزایش می‌یابد.'
  );
  const generatedSlug = useMemo(() => persianToSeoSlug(slugInput), [slugInput]);
  const keywordStats = useMemo(() => {
    const words = sampleBody.trim().split(/\s+/).filter(Boolean);
    const target = keywordInput.trim();
    const count = target ? words.filter((w) => w.includes(target)).length : 0;
    const density = words.length > 0 ? ((count / words.length) * 100).toFixed(1) : '0';
    return { totalWords: words.length, count, density };
  }, [sampleBody, keywordInput]);

  // 4. E-commerce Profit & ROI Calculator State
  const [productCost, setProductCost] = useState(850000);
  const [sellPrice, setSellPrice] = useState(1450000);
  const [adCostPerOrder, setAdCostPerOrder] = useState(120000);
  const [monthlyOrders, setMonthlyOrders] = useState(120);

  const roiStats = useMemo(() => {
    const netPerOrder = sellPrice - productCost - adCostPerOrder;
    const marginPercent =
      sellPrice > 0 ? Math.round((netPerOrder / sellPrice) * 100) : 0;
    const monthlyRevenue = sellPrice * monthlyOrders;
    const monthlyProfit = netPerOrder * monthlyOrders;
    const roas = adCostPerOrder > 0 ? (sellPrice / adCostPerOrder).toFixed(1) : '∞';
    return { netPerOrder, marginPercent, monthlyRevenue, monthlyProfit, roas };
  }, [productCost, sellPrice, adCostPerOrder, monthlyOrders]);

  // 5. Bale & WhatsApp Direct Link Builder
  const [messengerUsername, setMessengerUsername] = useState('pashalan_support');
  const [whatsappNumber, setWhatsappNumber] = useState('989123456789');
  const [quickMessage, setQuickMessage] = useState(
    'سلام، برای مشاوره رایگان طراحی سایت و پکیج ۲۰ میلیونی دامنه .com پیام دادم.'
  );
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baleDirectLink = `https://ble.ir/${messengerUsername.replace(/^@/, '').trim()}`;
  const whatsappDirectLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
    quickMessage
  )}`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    if (key === 'meta') {
      setCopiedMeta(true);
      setTimeout(() => setCopiedMeta(false), 2000);
    } else {
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  return (
    <div className="w-full py-10 sm:py-14 bg-[#F8FAFC]">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-12">
        {/* Page Header */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-emerald-300">
              <Wrench className="w-4 h-4" />
              <span>مرکز تخصصی ابزارهای رایگان + ۱۴ افزونه حرفه‌ای و ۳ پکیج جامع پاشالان</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              ابزارهای <span className="text-emerald-400">۱۰۰٪ رایگان</span> و افزونه‌های{' '}
              <span className="text-amber-300">تخصصی و کامل</span> برای رشد سایت شما
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              همه ابزارهای مورد نیاز وب‌مسترها (استعلام زنده دامنه، تست فنی سرعت/امنیت/سئو، متاتگ‌ساز و محاسبه‌گر ROI) به‌همراه ۱۴ افزونه تخصصی و ۳ پکیج ترکیبی با تخفیف ویژه — هر مورد را تیک بزنید مستقیم به سبد خرید اضافه می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-emerald-400">۶</div>
              <div className="text-[10px] sm:text-[11px] text-slate-300 mt-1">ابزار رایگان</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300">
                {livePlugins.length.toLocaleString('fa-IR')}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-300 mt-1">افزونه حرفه‌ای</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
              <div className="text-xl sm:text-2xl font-mono font-extrabold text-blue-400">۳</div>
              <div className="text-[10px] sm:text-[11px] text-slate-300 mt-1">پکیج جامع</div>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SECTION 1: FREE LIVE TOOLS SUITE                                    */}
        {/* =================================================================== */}
        <section className="space-y-5">
          <div>
            <div className="text-xs font-extrabold text-emerald-700 flex items-center gap-1.5 mb-1">
              <Gift className="w-4 h-4" />
              <span>بخش اول — ۶ ابزار ۱۰۰٪ رایگان و زنده بدون نیاز به ثبت‌نام</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ابزارک‌های آنلاین وب‌مستر و آنالیز واقعی سایت
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {(
              [
                { id: 'domain', label: 'استعلام آزاد بودن دامنه', icon: Search },
                { id: 'audit', label: 'تست زنده سرعت، امنیت و سئو', icon: ShieldCheck },
                { id: 'seo-meta', label: 'سازنده متاتگ و پیش‌نمایش گوگل', icon: FileCode2 },
                { id: 'slug', label: 'آدرس سئو + چگالی کلمات', icon: Link2 },
                { id: 'roi', label: 'محاسبه‌گر سود و ROI', icon: Calculator },
                { id: 'messenger', label: 'سازنده لینک بله و واتساپ', icon: MessageSquare },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const active = activeFreeTool === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveFreeTool(tab.id);
                    if (tab.id === 'audit' && !auditResult && !auditLoading) {
                      runLiveAudit();
                    }
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-800 hover:border-blue-400'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-extrabold leading-snug">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {activeFreeTool === 'domain' && (
            <DomainCheckerWidget
              cartItemIds={cartItemIds}
              onAddDomainPackageToCart={onAddDomainPackageToCart}
            />
          )}

          {activeFreeTool === 'audit' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 mb-1">
                    <Gauge className="w-4 h-4" />
                    <span>تست ۱۰۰٪ واقعی و زنده از سرور (بدون عدد نمایشی یا ثابت)</span>
                  </div>
                  <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                    گزارش فنی سرعت، امنیت، سئو، نقشه سایت و Robots.txt
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={runLiveAudit}
                    disabled={auditLoading}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer flex items-center gap-2"
                  >
                    {auditLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>اجرای تست زنده جدید</span>
                  </button>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>مشاهده sitemap.xml</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <span>مشاهده robots.txt</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {auditError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {auditError}
                </div>
              )}

              {auditResult ? (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
                      <span className="text-xs text-emerald-800 font-bold">
                        امتیاز کل تست زنده فنی
                      </span>
                      <div className="text-3xl font-mono font-extrabold text-emerald-700 mt-1 tabular-nums">
                        {auditResult.scorePercent.toLocaleString('fa-IR')}٪
                      </div>
                      <span className="text-[11px] text-emerald-700">
                        {auditResult.passedCount.toLocaleString('fa-IR')} از{' '}
                        {auditResult.totalCount.toLocaleString('fa-IR')} استاندارد تایید شده
                      </span>
                    </div>

                    <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
                      <span className="text-xs text-blue-800 font-bold">
                        سرعت پاسخ زنده سرور (TTFB)
                      </span>
                      <div className="text-3xl font-mono font-extrabold text-blue-700 mt-1 tabular-nums">
                        {auditResult.responseMs.toLocaleString('fa-IR')} ms
                      </div>
                      <span className="text-[11px] text-blue-700">
                        پاسخ آنی زیر ۲۰۰ میلی‌ثانیه
                      </span>
                    </div>

                    <div className="rounded-2xl bg-slate-900 text-white p-4">
                      <span className="text-xs text-slate-300 font-bold">
                        وضعیت امنیت و درگاه بله
                      </span>
                      <div className="text-base font-extrabold text-emerald-400 mt-2 flex items-center gap-1.5">
                        <Lock className="w-4 h-4" />
                        <span>حفاظت کامل سمت سرور فعال</span>
                      </div>
                      <span className="text-[11px] text-slate-300 block mt-1">
                        هدرهای امنیتی، scrypt، HMAC و کلیدهای سرور تایید شدند
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {auditResult.checks.map((chk, idx) => (
                      <div
                        key={idx}
                        className={`rounded-2xl border p-4 flex items-start gap-3 ${
                          chk.status === 'pass'
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-amber-50 border-amber-200'
                        }`}
                      >
                        {chk.status === 'pass' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <div className="text-xs font-extrabold text-slate-900">
                            {chk.label}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {chk.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  برای بررسی زنده سرعت، امنیت، متاتگ‌ها و نقشه سایت روی دکمه «اجرای تست زنده جدید» کلیک کنید.
                </div>
              )}
            </div>
          )}

          {activeFreeTool === 'seo-meta' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  سازنده متاتگ سئو + پیش‌نمایش واقعی در نتایج گوگل (SERP)
                </h3>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="font-bold text-slate-700">عنوان صفحه (Title)</label>
                    <span
                      className={`font-mono ${
                        seoTitle.length <= 60 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {seoTitle.length} / ۶۰ کاراکتر
                    </span>
                  </div>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <label className="font-bold text-slate-700">
                      توضیحات متا (Meta Description)
                    </label>
                    <span
                      className={`font-mono ${
                        seoDesc.length <= 160 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {seoDesc.length} / ۱۶۰ کاراکتر
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    آدرس یکتا (Canonical URL)
                  </label>
                  <input
                    type="url"
                    dir="ltr"
                    value={seoUrl}
                    onChange={(e) => setSeoUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 block">
                    پیش‌نمایش زنده سایت شما در گوگل:
                  </span>
                  <div dir="ltr" className="text-xs text-slate-600 truncate text-right">
                    {seoUrl}
                  </div>
                  <div className="text-base font-bold text-blue-700 leading-snug">
                    {seoTitle || 'عنوان صفحه شما'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {seoDesc || 'توضیحات متای سایت شما در نتایج جستجوی گوگل...'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      کد آماده HTML (قابل قرارگیری در تگ head):
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(generatedMetaCode, 'meta')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      {copiedMeta ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>کپی کد سئو</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre
                    dir="ltr"
                    className="p-3.5 rounded-xl bg-slate-950 text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed"
                  >
                    {generatedMetaCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeFreeTool === 'slug' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  تبدیل تیتر فارسی به آدرس URL سئو‌شده (Slug)
                </h3>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  placeholder="عنوان مقاله یا محصول را بنویسید..."
                />
                <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between gap-2">
                  <code dir="ltr" className="text-xs font-mono text-emerald-300 truncate">
                    https://yourbrand.com/{generatedSlug || 'seo-slug'}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyText(generatedSlug, 'slug')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer shrink-0"
                  >
                    {copiedLink === 'slug' ? 'کپی شد ✓' : 'کپی'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  شمارشگر کلمات و بررسی چگالی کلمه کلیدی (Keyword Density)
                </h3>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="کلمه کلیدی هدف (مثلاً طراحی سایت)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                />
                <textarea
                  rows={3}
                  value={sampleBody}
                  onChange={(e) => setSampleBody(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-lg font-mono font-extrabold text-slate-900">
                      {keywordStats.totalWords.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[11px] text-slate-500">تعداد کل کلمات</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-lg font-mono font-extrabold text-blue-700">
                      {keywordStats.count.toLocaleString('fa-IR')}
                    </div>
                    <div className="text-[11px] text-blue-700">تکرار کلیدواژه</div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-lg font-mono font-extrabold text-emerald-700">
                      {keywordStats.density}٪
                    </div>
                    <div className="text-[11px] text-emerald-700">چگالی (ایده‌آل ۱ تا ۳٪)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFreeTool === 'roi' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900">
                  محاسبه‌گر سود خالص فروشگاه و نرخ بازگشت تبلیغات (ROAS)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      قیمت تمام‌شده کالا (تومان)
                    </label>
                    <input
                      type="number"
                      value={productCost}
                      onChange={(e) => setProductCost(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      قیمت فروش در سایت (تومان)
                    </label>
                    <input
                      type="number"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      هزینه تبلیغات هر سفارش (تومان)
                    </label>
                    <input
                      type="number"
                      value={adCostPerOrder}
                      onChange={(e) => setAdCostPerOrder(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      تعداد سفارش ماهانه
                    </label>
                    <input
                      type="number"
                      value={monthlyOrders}
                      onChange={(e) => setMonthlyOrders(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs text-emerald-800 font-bold">سود خالص ماهانه</span>
                  <div className="text-xl font-mono font-extrabold text-emerald-700 mt-1 tabular-nums">
                    {roiStats.monthlyProfit.toLocaleString('fa-IR')} ت
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-xs text-blue-800 font-bold">درآمد کل ماهانه</span>
                  <div className="text-xl font-mono font-extrabold text-blue-700 mt-1 tabular-nums">
                    {roiStats.monthlyRevenue.toLocaleString('fa-IR')} ت
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-700 font-bold">حاشیه سود خالص</span>
                  <div className="text-xl font-mono font-extrabold text-slate-900 mt-1 tabular-nums">
                    {roiStats.marginPercent.toLocaleString('fa-IR')}٪
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 text-white">
                  <span className="text-xs text-slate-300 font-bold">نرخ بازگشت تبلیغ (ROAS)</span>
                  <div className="text-xl font-mono font-extrabold text-amber-300 mt-1 tabular-nums">
                    {roiStats.roas}x
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFreeTool === 'messenger' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900">
                  سازنده لینک مستقیم پیام‌رسان بله و واتساپ برای سایت و اینستاگرام
                </h3>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    آیدی کانال یا پشتیبانی بله (بدون @)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={messengerUsername}
                    onChange={(e) => setMessengerUsername(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    شماره واتساپ با کد ایران (مثلاً 989123456789)
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    پیام پیش‌فرض مشتری
                  </label>
                  <input
                    type="text"
                    value={quickMessage}
                    onChange={(e) => setQuickMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 flex flex-col justify-center">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="text-xs font-extrabold text-emerald-900">
                    لینک مستقیم پیام‌رسان بله:
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white border border-emerald-200 rounded-xl px-3 py-2">
                    <code dir="ltr" className="text-xs font-mono text-emerald-800 truncate">
                      {baleDirectLink}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyText(baleDirectLink, 'bale')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      {copiedLink === 'bale' ? 'کپی شد ✓' : 'کپی'}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                  <div className="text-xs font-extrabold text-blue-900">
                    لینک مستقیم واتساپ با متن آماده:
                  </div>
                  <div className="flex items-center justify-between gap-2 bg-white border border-blue-200 rounded-xl px-3 py-2">
                    <code dir="ltr" className="text-xs font-mono text-blue-800 truncate">
                      {whatsappDirectLink}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyText(whatsappDirectLink, 'wa')}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      {copiedLink === 'wa' ? 'کپی شد ✓' : 'کپی'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =================================================================== */}
        {/* SECTION 2: 3-STEP SMART PACKAGE QUIZ                                */}
        {/* =================================================================== */}
        <section>
          <SmartPackageQuiz
            onAddBundleToCart={onAddMultipleToCart}
            onOpenCart={onOpenCart}
          />
        </section>

        {/* =================================================================== */}
        {/* SECTION 3: 3 COMPLETE POWER-PACK BUNDLES (DISCOUNTED)               */}
        {/* =================================================================== */}
        <section className="space-y-5">
          <div>
            <div className="text-xs font-extrabold text-amber-700 flex items-center gap-1.5 mb-1">
              <Layers className="w-4 h-4" />
              <span>پکیج‌های جامع افزونه‌ها — تا ۲۸٪ ارزان‌تر از خرید تکی</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              ۳ پکیج آماده و مهندسی‌شده برای حداکثر فروش، سرعت و امنیت
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {PRO_PLUGIN_BUNDLES.map((bundle) => {
              const inCart = cartItemIds.has(bundle.id);
              const savedToman = bundle.originalTotalToman - bundle.bundlePriceToman;
              return (
                <div
                  key={bundle.id}
                  className={`rounded-3xl p-6 flex flex-col justify-between gap-5 border transition-all ${
                    inCart
                      ? 'bg-slate-900 text-white border-emerald-400 ring-2 ring-emerald-400/30'
                      : 'bg-slate-950 text-white border-slate-800 hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold">
                        {bundle.badge}
                      </span>
                      <span className="text-[11px] font-bold text-amber-300">
                        صرفه‌جویی {savedToman.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold leading-snug">
                      {bundle.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {bundle.tagline}
                    </p>

                    <ul className="space-y-2 pt-1">
                      {bundle.highlights.map((hl, i) => (
                        <li
                          key={i}
                          className="text-xs text-slate-200 flex items-start gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 line-through font-mono block">
                          {bundle.originalTotalToman.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-xl font-mono font-extrabold text-amber-300 tabular-nums">
                          {bundle.bundlePriceToman.toLocaleString('fa-IR')}{' '}
                          <span className="text-xs font-sans font-normal text-slate-300">
                            تومان
                          </span>
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-300 font-bold">
                        {bundle.deliveryLabel}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onToggleCartItem({
                          id: bundle.id,
                          title: bundle.title,
                          categoryLabel: 'پکیج جامع افزونه‌ها',
                          priceToman: bundle.bundlePriceToman,
                          freeGiftNote: `شامل ${bundle.pluginIds.length} افزونه کامل + نصب، تنظیم و گارانتی ۱ ساله`,
                          deliveryLabel: bundle.deliveryLabel,
                        })
                      }
                      className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-black cursor-pointer flex items-center justify-center gap-2 transition-colors ${
                        inCart
                          ? 'bg-emerald-400 text-slate-950'
                          : 'bg-white hover:bg-emerald-400 text-slate-950'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {inCart
                          ? 'پکیج در سبد خرید شماست ✓ (حذف)'
                          : 'تیک پکیج کامل در سبد خرید'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =================================================================== */}
        {/* SECTION 4: ALL 14 PLUGINS (FREE / PRO / VIP) + DEDICATED PAGES      */}
        {/* =================================================================== */}
        <section className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    مارکت‌پلیس رسمی افزونه‌ها — قیمت‌گذاری رقابتی شفاف (رایگان + Pro + VIP)
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  کاتالوگ {livePlugins.length.toLocaleString('fa-IR')} افزونه اختصاصی با صفحه فنی مجزا و لوگوی اختصاصی
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  روی هر افزونه کلیک کنید تا وارد صفحه اختصاصی آن با مشخصات فنی، مقایسه نسخه رایگان/پایه با VIP، راهنمای نصب و سوالات متداول شوید.
                </p>
              </div>

              {/* Search Input */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-300 rounded-2xl px-3.5 py-2.5 w-full lg:w-80">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={pluginSearch}
                  onChange={(e) => setPluginSearch(e.target.value)}
                  placeholder="جستجوی افزونه (درگاه بله، ترب، پیامک، سئو...)"
                  className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Tier Filter Buttons: ALL / FREE / PRO / VIP */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-extrabold text-slate-600 ml-1">
                فیلتر سطح قیمت:
              </span>
              {(
                [
                  {
                    id: 'all',
                    label: `همه افزونه‌ها (${tierCounts.all.toLocaleString('fa-IR')})`,
                    activeCls: 'bg-slate-900 text-white border-slate-900',
                    idleCls: 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400',
                  },
                  {
                    id: 'free',
                    label: `کاملاً رایگان (${tierCounts.free.toLocaleString('fa-IR')})`,
                    activeCls: 'bg-emerald-600 text-white border-emerald-600',
                    idleCls: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
                  },
                  {
                    id: 'pro',
                    label: `حرفه‌ای Pro رقابتی (${tierCounts.pro.toLocaleString('fa-IR')})`,
                    activeCls: 'bg-blue-600 text-white border-blue-600',
                    idleCls: 'bg-blue-50 text-blue-800 border-blue-200 hover:border-blue-400',
                  },
                  {
                    id: 'vip',
                    label: `نسخه سازمانی VIP (${tierCounts.vip.toLocaleString('fa-IR')})`,
                    activeCls: 'bg-amber-400 text-slate-950 border-amber-400',
                    idleCls: 'bg-amber-50 text-amber-900 border-amber-200 hover:border-amber-400',
                  },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTier(t.id)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold cursor-pointer transition-all ${
                    selectedTier === t.id ? t.activeCls : t.idleCls
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {PLUGIN_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedPluginCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                    selectedPluginCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {filteredPlugins.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
              <p className="text-sm font-extrabold text-slate-800">
                افزونه‌ای با این فیلتر یا عبارت جستجو پیدا نشد.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedPluginCategory('all');
                  setSelectedTier('all');
                  setPluginSearch('');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-extrabold cursor-pointer"
              >
                نمایش مجدد همه ۱۴ افزونه
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlugins.map((tool) => {
                const inCart = cartItemIds.has(tool.id);
                const vipInCart = cartItemIds.has(`${tool.id}-vip`);
                const coverSrc = getPluginCategoryCover(tool.categoryId);
                const isFree = tool.tier === 'free' || tool.priceToman === 0;
                const isVip = tool.tier === 'vip';

                return (
                  <article
                    key={tool.id}
                    className={`rounded-3xl border bg-white overflow-hidden flex flex-col justify-between transition-all ${
                      inCart || vipInCart
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-slate-200 hover:border-blue-400 hover:shadow-md shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Visual Category Cover + Floating Branded Logo Emblem */}
                      <div
                        onClick={() => onSelectPlugin(tool)}
                        className="relative h-36 w-full overflow-hidden bg-slate-900 cursor-pointer group"
                      >
                        <img
                          src={coverSrc}
                          alt={tool.title}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/15" />

                        {/* Top Left & Right Badges */}
                        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black shadow-xs inline-flex items-center gap-1 ${
                              isFree
                                ? 'bg-emerald-400 text-slate-950'
                                : isVip
                                ? 'bg-amber-400 text-slate-950'
                                : 'bg-blue-600 text-white'
                            }`}
                          >
                            {isVip && <Crown className="w-3 h-3" />}
                            {isFree && <Gift className="w-3 h-3" />}
                            <span>
                              {isFree
                                ? 'رایگان (۰ تومان)'
                                : isVip
                                ? 'نسخه VIP'
                                : 'حرفه‌ای Pro'}
                            </span>
                          </span>

                          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-white/15 rounded-lg px-2 py-0.5 text-[11px] text-white font-mono">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="font-bold">{tool.rating}</span>
                            <span className="text-slate-400">·</span>
                            <span className="text-emerald-300 text-[10px]">
                              {tool.version}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Bar Inside Cover: Branded Logo + Short Name + Active Installs */}
                        <div className="absolute bottom-3 right-3.5 left-3.5 flex items-end gap-3">
                          <PluginLogoEmblem plugin={tool} size="md" />
                          <div className="min-w-0 flex-1 text-white pb-0.5">
                            <div className="text-[10px] text-slate-300 font-bold truncate">
                              {tool.categoryLabel}
                            </div>
                            <div className="text-xs font-extrabold text-white truncate">
                              {tool.shortName}
                            </div>
                            <div className="text-[10px] text-emerald-300 font-mono inline-flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{tool.activeInstalls} نصب فعال</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-3.5">
                        <div
                          onClick={() => onSelectPlugin(tool)}
                          className="cursor-pointer group space-y-1"
                        >
                          <h3 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                            {tool.title}
                          </h3>
                          <p className="text-[11px] font-bold text-emerald-700 leading-relaxed">
                            {tool.subtitle}
                          </p>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {tool.description}
                        </p>

                        {/* Top 3 Deliverables Preview */}
                        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <ul className="space-y-1.5">
                            {tool.deliverables.slice(0, 3).map((feat, i) => (
                              <li
                                key={i}
                                className="text-[11px] text-slate-700 flex items-start gap-1.5 leading-relaxed"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1 text-slate-700 font-semibold">
                            <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                            {tool.warrantyLabel}
                          </span>
                          <span>{tool.deliveryLabel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Competitive Market Pricing + Dedicated Page & Cart Buttons */}
                    <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/40">
                      <div className="flex items-end justify-between gap-2">
                        <div className="space-y-0.5">
                          {tool.vipPriceToman > tool.priceToman ? (
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>
                                نسخه VIP: {tool.vipPriceToman.toLocaleString('fa-IR')} ت
                              </span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-500">
                              شامل نصب و تست کامل
                            </span>
                          )}
                        </div>

                        <div className="text-left">
                          {tool.marketCompareToman > tool.priceToman && (
                            <span className="text-[10px] font-mono text-slate-400 line-through block">
                              بازار: {tool.marketCompareToman.toLocaleString('fa-IR')} ت
                            </span>
                          )}
                          {isFree ? (
                            <span className="text-lg font-black text-emerald-600">
                              رایگان
                            </span>
                          ) : (
                            <span className="text-base sm:text-lg font-mono font-extrabold text-slate-900 tabular-nums">
                              {tool.priceToman.toLocaleString('fa-IR')}{' '}
                              <span className="text-[11px] font-sans font-normal text-slate-500">
                                تومان
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectPlugin(tool)}
                          className="py-2.5 px-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-500 text-slate-900 hover:text-blue-700 text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>صفحه فنی افزونه</span>
                          <ArrowUpLeft className="w-3.5 h-3.5 shrink-0" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onToggleCartItem({
                              id: tool.id,
                              title: isFree
                                ? `${tool.title} (نسخه رایگان)`
                                : tool.title,
                              categoryLabel: isFree
                                ? `${tool.categoryLabel} · رایگان`
                                : tool.categoryLabel,
                              priceToman: tool.priceToman,
                              isInquiryOnly: false,
                              freeGiftNote: `${tool.warrantyLabel} · نصب و تست زنده`,
                              deliveryLabel: tool.deliveryLabel,
                            })
                          }
                          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                            inCart
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : isFree
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950'
                              : isVip
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                              : 'bg-slate-900 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {inCart
                              ? 'در سبد ✓'
                              : isFree
                              ? 'افزودن رایگان'
                              : 'تیک در سبد'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
