import React, { useState } from 'react';
import {
  Radar,
  FileText,
  FileSignature,
  Gift,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Globe,
  Gauge,
  Share2,
} from 'lucide-react';
import {
  downloadAiCustomProposal,
  downloadSignedDigitalContract,
  AiProposalPayload,
} from '../utils/documentExport';
import { CartOrderItem } from './ShoppingCartDrawer';
import { PRO_PLUGINS_CATALOG, PRO_PLUGIN_BUNDLES } from '../data/pluginsCatalog';

interface XRayResult {
  metrics: {
    url: string;
    reachable: boolean;
    statusCode: number;
    ttfbMs: number;
    https: boolean;
    title: string;
    titleLength: number;
    metaDescriptionLength: number;
    h1Count: number;
    hasViewport: boolean;
    hasOpenGraph: boolean;
    schemaCount: number;
    hasHsts: boolean;
    hasCsp: boolean;
  };
  analysis: {
    overallScore: number;
    summary: string;
    weaknesses: string[];
    actionPlan: string[];
    recommendedIds: string[];
  };
}

interface AiGrowthToolsStudioProps {
  cartItemIds: Set<string>;
  onToggleCartItem: (item: CartOrderItem) => void;
  defaultBrandName?: string;
}

type StudioTab = 'xray' | 'proposal' | 'contract' | 'referral';

export const AiGrowthToolsStudio: React.FC<AiGrowthToolsStudioProps> = ({
  cartItemIds,
  onToggleCartItem,
  defaultBrandName = '',
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('xray');

  // --- Tab 1: Competitor / Site X-Ray ---
  const [xrayUrl, setXrayUrl] = useState('');
  const [xrayLoading, setXrayLoading] = useState(false);
  const [xrayError, setXrayError] = useState<string | null>(null);
  const [xrayResult, setXrayResult] = useState<XRayResult | null>(null);

  // --- Tab 2: 10s AI Custom Proposal ---
  const [propBrand, setPropBrand] = useState(defaultBrandName);
  const [propIndustry, setPropIndustry] = useState('فروشگاه اینترنتی');
  const [propBudget, setPropBudget] = useState('پکیج ۲۰ میلیونی دامنه .com و هاست رایگان');
  const [propGoals, setPropGoals] = useState('رتبه ۱ گوگل، سرعت زیر ۱ ثانیه، اتصال ترب و فروش اقساطی اسنپ‌پی');
  const [propPhone, setPropPhone] = useState('');
  const [propLoading, setPropLoading] = useState(false);
  const [propError, setPropError] = useState<string | null>(null);
  const [propResult, setPropResult] = useState<AiProposalPayload | null>(null);

  // --- Tab 3: Online Digital Contract ---
  const [cntName, setCntName] = useState('');
  const [cntNationalId, setCntNationalId] = useState('');
  const [cntPhone, setCntPhone] = useState('');
  const [cntDomain, setCntDomain] = useState('');
  const [cntProject, setCntProject] = useState('پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان');
  const [cntAmount, setCntAmount] = useState(20000000);
  const [cntAccepted, setCntAccepted] = useState(true);
  const [cntLoading, setCntLoading] = useState(false);
  const [cntError, setCntError] = useState<string | null>(null);
  const [signedContract, setSignedContract] = useState<{
    contractNo: string;
    clientName: string;
    nationalId: string;
    phone: string;
    domainName: string;
    projectTitle: string;
    totalToman: number;
    signedAt: string;
  } | null>(null);

  // --- Tab 4: 2M Referral Code ---
  const [refName, setRefName] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refLoading, setRefLoading] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);
  const [referralData, setReferralData] = useState<{
    code: string;
    ownerName: string;
    bonusToman: number;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const buildCartItemFromId = (id: string): CartOrderItem | null => {
    if (id === 'special-com-20m') {
      return {
        id: 'special-com-20m',
        title: 'پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان',
        categoryLabel: 'پکیج ویژه .com',
        priceToman: 20000000,
        isInquiryOnly: false,
        freeGiftNote: 'دامنه .com رایگان ۱ ساله + هاست ابری رایگان + اینماد و درگاه بله',
        deliveryLabel: 'تحویل ۴۸ تا ۷۲ ساعته',
      };
    }
    if (id === 'ready-5-pages') {
      return {
        id: 'ai-ready-5-pages',
        title: 'طرح آماده زنده ۵ صفحه‌ای + دامنه .ir و ۶ ماه هاست رایگان',
        categoryLabel: 'طرح آماده زنده',
        priceToman: 12500000,
        isInquiryOnly: false,
        freeGiftNote: '۶ ماه هاست رایگان + دامنه .ir رایگان',
        deliveryLabel: 'تحویل ۴۸ ساعته',
      };
    }
    const bundle = PRO_PLUGIN_BUNDLES.find((b) => b.id === id);
    if (bundle) {
      return {
        id: bundle.id,
        title: bundle.title,
        categoryLabel: 'پکیج جامع افزونه‌ها',
        priceToman: bundle.bundlePriceToman,
        isInquiryOnly: false,
        freeGiftNote: `شامل ${bundle.pluginIds.length} افزونه + نصب رایگان`,
        deliveryLabel: bundle.deliveryLabel,
      };
    }
    const plugin = PRO_PLUGINS_CATALOG.find((p) => p.id === id);
    if (plugin) {
      return {
        id: plugin.id,
        title: plugin.title,
        categoryLabel: plugin.categoryLabel,
        priceToman: plugin.priceToman,
        isInquiryOnly: false,
        freeGiftNote: plugin.warrantyLabel,
        deliveryLabel: plugin.deliveryLabel,
      };
    }
    return null;
  };

  const handleRunXRay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xrayUrl.trim()) {
      setXrayError('لطفاً آدرس وب‌سایت فعلی یا سایت رقیب خود را وارد کنید.');
      return;
    }
    setXrayLoading(true);
    setXrayError(null);
    setXrayResult(null);
    try {
      const resp = await fetch('/api/ai/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: xrayUrl.trim() }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setXrayError(data.error || 'خطا در آنالیز زنده وب‌سایت.');
      } else {
        setXrayResult({ metrics: data.metrics, analysis: data.analysis });
      }
    } catch {
      setXrayError('ارتباط با سرور آنالیزور برقرار نشد.');
    } finally {
      setXrayLoading(false);
    }
  };

  const handleGenerateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (propBrand.trim().length < 2) {
      setPropError('لطفاً نام برند یا کسب‌وکار خود را وارد کنید.');
      return;
    }
    setPropLoading(true);
    setPropError(null);
    setPropResult(null);
    try {
      const resp = await fetch('/api/ai/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: propBrand.trim(),
          industry: propIndustry,
          budget: propBudget,
          goals: propGoals,
          phone: propPhone.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setPropError(data.error || 'خطا در تولید پروپوزال اختصاصی.');
      } else {
        setPropResult(data.proposal);
      }
    } catch {
      setPropError('ارتباط با موتور تولید پروپوزال برقرار نشد.');
    } finally {
      setPropLoading(false);
    }
  };

  const handleSignContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cntAccepted) {
      setCntError('لطفاً تاییدیه مطالعه مفاد قرارداد را تیک بزنید.');
      return;
    }
    setCntLoading(true);
    setCntError(null);
    try {
      const resp = await fetch('/api/contracts/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: cntName.trim(),
          nationalId: cntNationalId.replace(/\D/g, ''),
          phone: cntPhone.trim(),
          domainName: cntDomain.trim() || 'yourbrand.com',
          projectTitle: cntProject,
          totalToman: cntAmount,
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setCntError(data.error || 'خطا در ثبت امضای دیجیتال قرارداد.');
      } else {
        setSignedContract(data.contract);
      }
    } catch {
      setCntError('ارتباط با سامانه ثبت قرارداد برقرار نشد.');
    } finally {
      setCntLoading(false);
    }
  };

  const handleCreateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    setRefLoading(true);
    setRefError(null);
    try {
      const resp = await fetch('/api/referrals/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: refName.trim(),
          ownerPhone: refPhone.trim(),
        }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setRefError(data.error || 'خطا در صدور کد معرف اختصاصی.');
      } else {
        setReferralData(data.referral);
      }
    } catch {
      setRefError('ارتباط با سرور صدور کد معرف برقرار نشد.');
    } finally {
      setRefLoading(false);
    }
  };

  const tabs: { id: StudioTab; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'xray',
      label: 'آنالیزور زنده سایت رقیب (AI X-Ray)',
      sub: 'اسکن سرعت، سئو، اسکیما و امنیت',
      icon: <Radar className="w-4 h-4" />,
    },
    {
      id: 'proposal',
      label: 'تولید پروپوزال رسمی ۱۰ ثانیه‌ای PDF',
      sub: 'اختصاصی با نام برند شما',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'contract',
      label: 'امضای دیجیتال قرارداد رسمی',
      sub: 'ثبت آنی کد ملی + دانلود PDF',
      icon: <FileSignature className="w-4 h-4" />,
    },
    {
      id: 'referral',
      label: 'کد معرف ۲ میلیونی پاشالان',
      sub: 'همکاری در فروش و هدیه نقدی',
      icon: <Gift className="w-4 h-4" />,
    },
  ];

  return (
    <section
      id="growth-studio"
      className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm space-y-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>استودیوی هوشمند رشد، قرارداد دیجیتال و آنالیز رقبا (سطح Enterprise)</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900">
            سایت رقیب را زیر ذره‌بین ببرید، پروپوزال PDF بگیرید یا قرارداد آنلاین ببندید
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            تمامی ابزارهای زیر به‌صورت ۱۰۰٪ زنده روی سرور پاشالان اجرا می‌شوند؛ از اسکن واقعی سرعت و سئوی رقبا تا تولید پروپوزال اختصاصی برند شما و صدور کد معرف ۲ میلیون تومانی.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {tabs.map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`p-3.5 rounded-2xl border text-right cursor-pointer transition-all flex items-start gap-2.5 ${
                active
                  ? 'bg-slate-950 text-white border-slate-950 shadow-md'
                  : 'bg-slate-50 hover:bg-blue-50/60 text-slate-800 border-slate-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  active
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-white text-blue-600 border border-slate-200'
                }`}
              >
                {t.icon}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold leading-snug">{t.label}</div>
                <div
                  className={`text-[10.5px] mt-0.5 ${
                    active ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {t.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPETITOR / SITE X-RAY */}
      {activeTab === 'xray' && (
        <div className="space-y-5">
          <form
            onSubmit={handleRunXRay}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3.5">
              <Globe className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="text"
                dir="ltr"
                value={xrayUrl}
                onChange={(e) => setXrayUrl(e.target.value)}
                placeholder="https://competitor-site.ir  یا  your-site.com"
                className="w-full py-3 text-xs sm:text-sm font-mono text-slate-900 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={xrayLoading}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
            >
              {xrayLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال اسکن زنده سرور + تحلیل AI...</span>
                </>
              ) : (
                <>
                  <Radar className="w-4 h-4" />
                  <span>شروع آنالیز رایگان X-Ray</span>
                </>
              )}
            </button>
          </form>

          {xrayError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{xrayError}</span>
            </div>
          )}

          {xrayResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Score & Raw Live Telemetry */}
              <div className="lg:col-span-4 bg-slate-950 text-white rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">
                    امتیاز فنی و سئوی سایت هدف
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 text-xs font-mono font-black">
                    LIVE SCAN
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-mono font-black text-emerald-400 tabular-nums">
                    {xrayResult.analysis.overallScore}
                  </span>
                  <span className="text-sm text-slate-400">/ ۱۰۰</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400">زمان پاسخ (TTFB)</div>
                    <div className="font-mono font-black text-white mt-0.5">
                      {xrayResult.metrics.ttfbMs} ms
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400">اسکیما (Schema)</div>
                    <div className="font-mono font-black text-white mt-0.5">
                      {xrayResult.metrics.schemaCount} بلوک
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400">امنیت HTTPS / HSTS</div>
                    <div className="font-bold text-emerald-300 mt-0.5">
                      {xrayResult.metrics.https ? 'SSL فعال' : 'فاقد SSL'} ·{' '}
                      {xrayResult.metrics.hasHsts ? 'HSTS ✓' : 'بدون HSTS'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-slate-400">متاتگ توضیحات</div>
                    <div className="font-mono font-black text-white mt-0.5">
                      {xrayResult.metrics.metaDescriptionLength} کاراکتر
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Findings & Recommended Upgrade */}
              <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <Gauge className="w-4 h-4 text-blue-600" />
                    <span>گزارش تحلیلی هوش مصنوعی پاشالان:</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {xrayResult.analysis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-rose-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-extrabold text-rose-700">
                      نقاط ضعف شناسایی‌شده در اسکن:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {xrayResult.analysis.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <div className="text-xs font-extrabold text-emerald-700">
                      نقشه راه سبقت از این سایت در گوگل:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {xrayResult.analysis.actionPlan.map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {xrayResult.analysis.recommendedIds.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                    {xrayResult.analysis.recommendedIds.map((id) => {
                      const item = buildCartItemFromId(id);
                      if (!item) return null;
                      const inCart = cartItemIds.has(item.id);
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => onToggleCartItem(item)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-1.5 ${
                            inCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 hover:bg-blue-600 text-white'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>
                            {inCart ? 'در سبد خرید ✓' : `افزودن: ${item.title}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 10-SECOND AI CUSTOM BRAND PROPOSAL PDF */}
      {activeTab === 'proposal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleGenerateProposal}
            className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5"
          >
            <h3 className="text-sm font-extrabold text-slate-900">
              مشخصات برندتان را وارد کنید تا پروپوزال رسمی PDF ساخته شود
            </h3>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">نام برند یا شرکت *</label>
              <input
                type="text"
                value={propBrand}
                onChange={(e) => setPropBrand(e.target.value)}
                placeholder="مثلاً: کلینیک زیبایی رویا / فروشگاه آرامیس"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">صنف و حوزه فعالیت</label>
                <input
                  type="text"
                  value={propIndustry}
                  onChange={(e) => setPropIndustry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">شماره تماس (اختیاری)</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={propPhone}
                  onChange={(e) => setPropPhone(e.target.value)}
                  placeholder="09123456789"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">بودجه و پکیج مدنظر</label>
              <select
                value={propBudget}
                onChange={(e) => setPropBudget(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="طرح آماده اقتصادی (۸ تا ۱۵ میلیون تومان)">
                  طرح آماده اقتصادی (۸ تا ۱۵ میلیون تومان)
                </option>
                <option value="پکیج ۲۰ میلیونی دامنه .com و هاست رایگان">
                  پکیج ۲۰ میلیونی دامنه .com و هاست رایگان (پیشنهادی)
                </option>
                <option value="فروشگاه پیشرفته با افزونه‌های رشد (۲۵ تا ۴۰ میلیون)">
                  فروشگاه پیشرفته با افزونه‌های رشد (۲۵ تا ۴۰ میلیون)
                </option>
                <option value="طراحی ۱۰۰٪ اختصاصی و استارتاپی (استعلام قیمت)">
                  طراحی ۱۰۰٪ اختصاصی و استارتاپی (استعلام قیمت)
                </option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">اهداف اصلی سایت</label>
              <textarea
                rows={2}
                value={propGoals}
                onChange={(e) => setPropGoals(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>

            {propError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {propError}
              </div>
            )}

            <button
              type="submit"
              disabled={propLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {propLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال نگارش پروپوزال رسمی برند شما...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>ساخت رایگان پروپوزال اختصاصی (۱۰ ثانیه)</span>
                </>
              )}
            </button>
          </form>

          <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl p-5 sm:p-6 min-h-[340px] flex flex-col justify-between space-y-4">
            {!propResult ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3 py-10">
                <FileText className="w-12 h-12 text-emerald-400 opacity-90" />
                <h4 className="text-base font-extrabold">
                  پروپوزال آماده ارائه به مدیران و شرکا با نام برند شما
                </h4>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                  بلافاصله پس از ساخت پروپوزال می‌توانید فایل رسمی قابل چاپ PDF را با مهر پاشالان، برآورد هزینه، زمان‌بندی تحویل و پیش‌بینی بازگشت سرمایه دانلود کنید.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[10.5px] font-bold text-emerald-300">
                        پروپوزال اختصاصی تولیدشده توسط هوش مصنوعی پاشالان
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                        {propResult.proposalTitle}
                      </h4>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono font-black text-xs">
                      {propResult.estimatedPriceToman > 0
                        ? `${propResult.estimatedPriceToman.toLocaleString('fa-IR')} تومان`
                        : 'استعلام تخصصی'}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {propResult.executiveSummary}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="text-xs font-extrabold text-blue-300">
                        معماری و امکانات پیشنهادی:
                      </div>
                      <ul className="space-y-1 text-[11.5px] text-slate-300">
                        {propResult.architectureHighlights.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="text-xs font-extrabold text-amber-300">
                        زمان‌بندی اجرایی پروژه:
                      </div>
                      <ul className="space-y-1 text-[11.5px] text-slate-300">
                        {propResult.timelineSteps.map((s, i) => (
                          <li key={i}>• {s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-200">
                    <strong>پیش‌بینی بازگشت سرمایه (ROI): </strong>
                    {propResult.expectedRoiNote}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      downloadAiCustomProposal({
                        brandName: propBrand.trim(),
                        industry: propIndustry,
                        budget: propBudget,
                        proposal: propResult,
                      })
                    }
                    className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود فایل رسمی پروپوزال PDF با نام برند شما</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const item = buildCartItemFromId('special-com-20m');
                      if (item) onToggleCartItem(item);
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن پکیج ۲۰ میلیونی .com به سبد</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ONLINE DIGITAL CONTRACT SIGNING */}
      {activeTab === 'contract' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSignContract}
            className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5"
          >
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold">
                امضای آنلاین قرارداد رسمی پاشالان با تضمین پرداخت مرحله‌ای
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={cntName}
                onChange={(e) => setCntName(e.target.value)}
                placeholder="نام و نام خانوادگی کارفرما *"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                dir="ltr"
                maxLength={10}
                value={cntNationalId}
                onChange={(e) => setCntNationalId(e.target.value.replace(/\D/g, ''))}
                placeholder="کد ملی ۱۰ رقمی *"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="tel"
                dir="ltr"
                value={cntPhone}
                onChange={(e) => setCntPhone(e.target.value)}
                placeholder="شماره موبایل (09...) *"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                dir="ltr"
                value={cntDomain}
                onChange={(e) => setCntDomain(e.target.value)}
                placeholder="دامنه مورد نظر (مثلاً mybrand.com)"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={cntProject}
                onChange={(e) => {
                  setCntProject(e.target.value);
                  if (e.target.value.includes('۲۰ میلیون')) setCntAmount(20000000);
                  else if (e.target.value.includes('۱۲.۵ میلیون')) setCntAmount(12500000);
                  else setCntAmount(0);
                }}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              >
                <option value="پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان (۲۰ میلیون)">
                  پکیج ویژه .com + هاست رایگان (۲۰ میلیون)
                </option>
                <option value="طرح آماده ۵ صفحه‌ای + دامنه .ir و ۶ ماه هاست رایگان (۱۲.۵ میلیون)">
                  طرح آماده ۵ صفحه‌ای + دامنه .ir (۱۲.۵ میلیون)
                </option>
                <option value="طراحی ۱۰۰٪ اختصاصی سایت و اپلیکیشن (طبق پیوست فنی)">
                  طراحی اختصاصی (طبق پیوست استعلام)
                </option>
              </select>
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono font-extrabold text-emerald-800 flex items-center justify-between">
                <span>مبلغ قرارداد:</span>
                <span>
                  {cntAmount > 0
                    ? `${cntAmount.toLocaleString('fa-IR')} تومان`
                    : 'طبق استعلام فنی'}
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={cntAccepted}
                onChange={(e) => setCntAccepted(e.target.checked)}
                className="mt-1 accent-blue-600"
              />
              <span>
                تعهدات مالکیت ۱۰۰٪ دامنه و سورس‌کد، پرداخت مرحله‌ای امانی ۵۰٪ و ۱ سال گارانتی فنی رایگان پاشالان را تایید و امضا می‌کنم.
              </span>
            </label>

            {cntError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {cntError}
              </div>
            )}

            <button
              type="submit"
              disabled={cntLoading}
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {cntLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSignature className="w-4 h-4" />
              )}
              <span>ثبت امضای دیجیتال و صدور نسخه رسمی قرارداد PDF</span>
            </button>
          </form>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            {signedContract ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900">
                  قرارداد دیجیتال شما با شماره{' '}
                  <span className="font-mono text-blue-700">
                    {signedContract.contractNo}
                  </span>{' '}
                  ثبت شد
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  نسخه امضاشده در بایگانی رسمی پاشالان ذخیره شد و اعلان فوری برای مدیریت ارسال گردید. هم‌اکنون نسخه PDF قابل چاپ را دانلود کنید.
                </p>
                <button
                  type="button"
                  onClick={() => downloadSignedDigitalContract(signedContract)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs cursor-pointer inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود نسخه رسمی امضاشده قرارداد (PDF)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <h4 className="text-sm font-extrabold text-slate-900">
                  خلاصه بندهای طلایی قرارداد رسمی پاشالان:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>مالکیت ۱۰۰٪ به نام کارفرما:</strong> دامنه (.com یا .ir)، پنل هاست و سورس‌کد از روز اول به نام شما ثبت می‌شود.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>پرداخت امن مرحله‌ای (Escrow):</strong> تسویه ۵۰٪ نهایی منوط به تحویل سایت روی دامنه اصلی و تایید رضایت شماست.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>۱ سال گارانتی فنی و آپشن‌های رایگان:</strong> اینماد، درگاه بله/شاپرک، اسنپ‌پی، ترب، SSL و آموزش ویدیویی بدون هزینه اضافه.
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: 2M TOMAN AFFILIATE / REFERRAL PROGRAM */}
      {activeTab === 'referral' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <form
            onSubmit={handleCreateReferral}
            className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3.5"
          >
            <h3 className="text-sm font-extrabold text-slate-900">
              با معرفی هر کارفرما به پاشالان، ۲,۰۰۰,۰۰۰ تومان پورسانت نقدی بگیرید!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              کد معرف اختصاصی خود را بسازید و برای دوستان و همکاران بفرستید. دوست شما ۱ میلیون تومان تخفیف می‌گیرد و ۲ میلیون تومان نقدی به حساب شما واریز می‌شود.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                placeholder="نام و نام خانوادگی شما *"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
              />
              <input
                type="tel"
                dir="ltr"
                value={refPhone}
                onChange={(e) => setRefPhone(e.target.value)}
                placeholder="شماره موبایل (09...) *"
                className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-900 focus:outline-none focus:border-blue-600"
              />
            </div>
            {refError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {refError}
              </div>
            )}
            <button
              type="submit"
              disabled={refLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2"
            >
              {refLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Gift className="w-4 h-4" />
              )}
              <span>صدور فوری کد معرف اختصاصی ۲ میلیونی</span>
            </button>
          </form>

          <div className="lg:col-span-6 bg-slate-950 text-white rounded-2xl p-6 text-center space-y-4">
            {referralData ? (
              <>
                <span className="text-xs font-bold text-emerald-300">
                  کد معرف اختصاصی {referralData.ownerName} فعال شد:
                </span>
                <div
                  dir="ltr"
                  className="text-3xl sm:text-4xl font-mono font-black text-amber-300 tracking-widest py-3 px-5 rounded-2xl bg-white/5 border border-amber-400/30 inline-block"
                >
                  {referralData.code}
                </div>
                <p className="text-xs text-slate-300">
                  پاداش هر سفارش تاییدشده:{' '}
                  <strong className="text-emerald-300">
                    {referralData.bonusToman.toLocaleString('fa-IR')} تومان نقدی
                  </strong>
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(referralData.code).catch(() => {});
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {copiedCode ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span>{copiedCode ? 'کپی شد ✓' : 'کپی کد معرف'}</span>
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `سلام! اگر قصد طراحی سایت حرفه‌ای با دامنه .com و هاست رایگان دارید، با کد معرف اختصاصی من (${referralData.code}) در پاشالان (pashalan.ir) ۱ میلیون تومان تخفیف بگیرید. شماره مشاوره: 09197254078`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black inline-flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>ارسال مستقیم در واتساپ</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="py-6 space-y-2">
                <Gift className="w-10 h-10 text-amber-400 mx-auto" />
                <div className="text-base font-extrabold">
                  سیستم همکاری در فروش شفاف و بدون سقف درآمد
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  حتی اگر صاحب کسب‌وکار، ادمین اینستاگرام یا مشاور هستید، با کد اختصاصی خود به ازای هر مشتری جدید ۲ میلیون تومان پاداش بگیرید.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
