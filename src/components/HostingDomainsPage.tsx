import React, { useState, useMemo } from 'react';
import {
  Server,
  Globe,
  Check,
  ShieldCheck,
  Zap,
  HardDrive,
  Database,
  RefreshCw,
  ShoppingCart,
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowUpLeft,
  Headphones,
  Layers,
} from 'lucide-react';
import {
  HOSTING_CATEGORIES,
  HOSTING_PLANS,
  HOSTING_ADDONS,
  DATACENTER_OPTIONS,
  BILLING_CYCLES,
  DOMAIN_TLDS_CATALOG,
  HOSTING_DOMAINS_FAQS,
  HostingCategoryId,
  DatacenterId,
  BillingCycleId,
  HostingPlanItem,
  DomainTldItem,
  calculateHostingPrice,
} from '../data/hostingDomainsCatalog';
import type { CartOrderItem } from './ShoppingCartDrawer';
import { PageSeoContentBlock } from './PageSeoContentBlock';

interface DomainCheckApiRow {
  domain: string;
  tld: string;
  status: 'available' | 'taken' | 'unknown';
  method: string;
  note: string;
}

interface HostingDomainsPageProps {
  initialTab: 'hosting' | 'domains';
  onSwitchTab: (tab: 'hosting' | 'domains') => void;
  cartItemIds: Set<string>;
  onToggleCartItem: (item: CartOrderItem) => void;
  onOpenCart: () => void;
  onOpenAiConsultant: () => void;
}

export const HostingDomainsPage: React.FC<HostingDomainsPageProps> = ({
  initialTab,
  onSwitchTab,
  cartItemIds,
  onToggleCartItem,
  onOpenCart,
  onOpenAiConsultant,
}) => {
  const [activeTab, setActiveTab] = useState<'hosting' | 'domains'>(initialTab);
  const [hostingCategory, setHostingCategory] =
    useState<HostingCategoryId>('cloud-nvme');
  const [datacenterId, setDatacenterId] = useState<DatacenterId>('iran-tehran');
  const [billingCycleId, setBillingCycleId] =
    useState<BillingCycleId>('annual');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // Live Domain Search State (connected to real /api/domain/check RDAP/DNS)
  const [domainQuery, setDomainQuery] = useState<string>('');
  const [domainLoading, setDomainLoading] = useState<boolean>(false);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [domainResults, setDomainResults] = useState<DomainCheckApiRow[]>([]);
  const [checkedBaseName, setCheckedBaseName] = useState<string>('');
  const [selectedDomainYears, setSelectedDomainYears] = useState<1 | 5>(1);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (tab: 'hosting' | 'domains') => {
    setActiveTab(tab);
    onSwitchTab(tab);
  };

  const activeDatacenter = useMemo(
    () =>
      DATACENTER_OPTIONS.find((d) => d.id === datacenterId) ||
      DATACENTER_OPTIONS[0],
    [datacenterId]
  );

  const activeCycle = useMemo(
    () =>
      BILLING_CYCLES.find((c) => c.id === billingCycleId) || BILLING_CYCLES[1],
    [billingCycleId]
  );

  const visiblePlans = useMemo(
    () => HOSTING_PLANS.filter((p) => p.category === hostingCategory),
    [hostingCategory]
  );

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedAddonsTotal = useMemo(() => {
    return selectedAddonIds.reduce((sum, id) => {
      const found = HOSTING_ADDONS.find((a) => a.id === id);
      if (!found) return sum;
      return (
        sum +
        (found.oneTime
          ? found.monthlyPriceToman
          : found.monthlyPriceToman * activeCycle.months)
      );
    }, 0);
  }, [selectedAddonIds, activeCycle.months]);

  const handleTogglePlanInCart = (plan: HostingPlanItem) => {
    const pricing = calculateHostingPrice({
      monthlyBaseToman: plan.monthlyPriceToman,
      datacenterId,
      billingCycleId,
    });
    const addonsLabels = selectedAddonIds
      .map((id) => HOSTING_ADDONS.find((a) => a.id === id)?.title)
      .filter(Boolean);
    const totalWithAddons = pricing.totalPeriodToman + selectedAddonsTotal;
    const itemId = `hosting-${plan.id}-${datacenterId}-${billingCycleId}`;

    onToggleCartItem({
      id: itemId,
      title: `${plan.name} · ${activeDatacenter.name} (${activeCycle.label})`,
      categoryLabel: 'هاست ابری و سرور پاشالان',
      priceToman: totalWithAddons,
      freeGiftNote:
        billingCycleId !== 'monthly' && plan.freeDomainOnAnnual
          ? `${plan.freeDomainOnAnnual} + مهاجرت رایگان بدون قطعی + SSL رایگان${
              addonsLabels.length > 0 ? ` + افزودنی: ${addonsLabels.join('، ')}` : ''
            }`
          : `SSL رایگان همیشگی + مهاجرت رایگان بدون قطعی + بکاپ خودکار${
              addonsLabels.length > 0 ? ` + افزودنی: ${addonsLabels.join('، ')}` : ''
            }`,
      deliveryLabel: 'تحویل و فعال‌سازی آنی (زیر ۱۵ دقیقه)',
    });
  };

  const handleCheckDomainLive = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = domainQuery
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\.(ir|com|net|org|co|shop|ai|io|online)$/i, '')
      .replace(/[^a-z0-9-]/g, '');

    if (!cleaned || cleaned.length < 2) {
      setDomainError(
        'لطفاً نام دامنه انگلیسی معتبر (حداقل ۲ حرف، مثلاً mybrand) وارد کنید.'
      );
      return;
    }

    setDomainError(null);
    setDomainLoading(true);
    try {
      const res = await fetch(
        `/api/domain/check?name=${encodeURIComponent(cleaned)}`
      );
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setDomainError(
          data.error || 'خطا در استعلام زنده دامنه. لطفاً دوباره تلاش کنید.'
        );
        setDomainResults([]);
      } else {
        setCheckedBaseName(data.baseName || cleaned);
        setDomainResults(Array.isArray(data.results) ? data.results : []);
      }
    } catch {
      setDomainError('ارتباط با سرور استعلام دامنه برقرار نشد.');
      setDomainResults([]);
    } finally {
      setDomainLoading(false);
    }
  };

  const getTldPriceForYears = (tld: string, years: 1 | 5): number => {
    const found = DOMAIN_TLDS_CATALOG.find(
      (d) => d.tld.toLowerCase() === tld.toLowerCase()
    );
    if (!found) return 3149000;
    if (years === 5 && found.register5YrToman) return found.register5YrToman;
    return found.register1YrToman * years;
  };

  const handleToggleDomainInCart = (domainName: string, tld: string) => {
    const years = tld === '.ir' ? selectedDomainYears : 1;
    const priceToman = getTldPriceForYears(tld, years);
    const id = `domain-reg-${domainName}-${years}y`;
    onToggleCartItem({
      id,
      title: `ثبت اختصاصی دامنه ${domainName} (${years === 5 ? '۵ ساله' : '۱ ساله'})`,
      categoryLabel: 'ثبت دامنه رسمی پاشالان',
      priceToman,
      freeGiftNote:
        tld === '.ir'
          ? 'ثبت ۱۰۰٪ روی شناسه ایرنیک شما + تنظیم رایگان DNS و اتصال سایت'
          : 'مالکیت کامل + قفل ضدسرقت دامنه + محافظت Whois Privacy رایگان',
      deliveryLabel: 'ثبت آنی پس از تایید',
    });
  };

  const handleToggleTldOfferInCart = (tldItem: DomainTldItem) => {
    const years = tldItem.tld === '.ir' ? selectedDomainYears : 1;
    const priceToman =
      years === 5 && tldItem.register5YrToman
        ? tldItem.register5YrToman
        : tldItem.register1YrToman;
    const sampleName = checkedBaseName
      ? `${checkedBaseName}${tldItem.tld}`
      : `yourbrand${tldItem.tld}`;
    const id = `domain-tld-${tldItem.tld.replace(/\./g, '')}-${years}y`;
    onToggleCartItem({
      id,
      title: `ثبت دامنه ${sampleName} (${years === 5 ? '۵ ساله' : '۱ ساله'})`,
      categoryLabel: 'ثبت دامنه رسمی پاشالان',
      priceToman,
      freeGiftNote: tldItem.registryNote,
      deliveryLabel: 'فعال‌سازی فوری + تنظیم رایگان DNS',
    });
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10" dir="rtl">
      {/* ================================================================= */}
      {/* HERO HEADER WITH UNIFIED TAB SWITCHER (/hosting <-> /domains)     */}
      {/* ================================================================= */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <span>زیرساخت ابری و ثبت دامنه پاشالان</span>
              <span aria-hidden="true">·</span>
              <span>ایران، آلمان (هتزنر) و هلند</span>
              <span aria-hidden="true">·</span>
              <span>مالکیت ۱۰۰٪ کارفرما</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight text-balance">
              {activeTab === 'hosting'
                ? 'فروش هاست ابری NVMe، سرور مجازی و ایمیل سازمانی با قیمت رقابتی'
                : 'ثبت آنی و فروش دامنه .ir، .com، .shop و .ai با مالکیت ۱۰۰٪ رسمی'}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {activeTab === 'hosting'
                ? 'سرورهای نسل جدید AMD EPYC با دیسک‌های تمام NVMe Gen4، وب‌سرور LiteSpeed Enterprise، بکاپ دوگانه خودکار و مهاجرت رایگان بدون ۱ ثانیه قطعی — آماده برای رتبه‌گیری سریع در گوگل.'
                : 'استعلام زنده و مستقیم از رجیستری رسمی (RDAP و DNS)، ثبت قطعی در پنل ایرنیک یا رجیسترار بین‌المللی به نام خودتان، همراه با قفل ضدسرقت و تنظیم رایگان DNS و CDN.'}
            </p>
          </div>

          {/* Functional Segmented Switcher between /hosting and /domains */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 self-start lg:self-end shrink-0">
            <button
              type="button"
              onClick={() => handleTabChange('hosting')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'hosting'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Server className="w-4 h-4 shrink-0" />
              <span>فروش هاست و سرور ابری</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('domains')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeTab === 'domains'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>ثبت و فروش دامنه</span>
            </button>
          </div>
        </div>

        {/* Quantified Proof Strip (4 crisp metrics with units) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-slate-800/90">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono tabular-nums">
              99.99% SLA
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              تضمین پایداری آپتایم با مانیتورینگ ۲۴/۷
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-lg sm:text-xl font-black text-blue-400 font-mono tabular-nums">
              ~8 ms TTFB
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              پینگ دیتاسنتر ایران + LiteSpeed و Redis
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-lg sm:text-xl font-black text-white font-mono tabular-nums">
              14 روز ضمانت
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              بازگشت وجه بی‌قیدوشرط روی تمام پنل‌های هاست
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="text-lg sm:text-xl font-black text-amber-400 font-mono tabular-nums">
              0 ثانیه قطعی
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              مهاجرت کامل رایگان از هاست فعلی شما به پاشالان
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* TAB 1: HOSTING & CLOUD SERVERS STOREFRONT                         */}
      {/* ================================================================= */}
      {activeTab === 'hosting' && (
        <div className="space-y-10">
          {/* Control Bar: Category + Datacenter + Billing Cycle */}
          <section className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6">
            {/* Step 1: Hosting Category Selector */}
            <div className="space-y-2.5">
              <div className="text-xs font-extrabold text-slate-500">
                ۰۱. انتخاب نوع سرویس میزبانی
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {HOSTING_CATEGORIES.map((cat) => {
                  const active = hostingCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setHostingCategory(cat.id)}
                      className={`text-right p-4 rounded-2xl border transition-colors cursor-pointer ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-900 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="text-sm font-extrabold">{cat.title}</div>
                      <div
                        className={`text-xs mt-1 leading-relaxed ${
                          active ? 'text-blue-100' : 'text-slate-500'
                        }`}
                      >
                        {cat.subtitle}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2 & 3: Datacenter + Billing Cycle Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 border-t border-slate-100">
              {/* Datacenter Selector */}
              <div className="lg:col-span-7 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-500">
                  ۰۲. انتخاب لوکیشن دیتاسنتر
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DATACENTER_OPTIONS.map((dc) => {
                    const active = datacenterId === dc.id;
                    return (
                      <button
                        key={dc.id}
                        type="button"
                        onClick={() => setDatacenterId(dc.id)}
                        className={`text-right p-3.5 rounded-2xl border transition-colors cursor-pointer ${
                          active
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        <div className="text-xs font-extrabold">{dc.name}</div>
                        <div
                          className={`text-[11px] mt-0.5 font-mono tabular-nums ${
                            active ? 'text-emerald-400' : 'text-blue-600'
                          }`}
                        >
                          {dc.pingLabel}
                        </div>
                        <div
                          className={`text-[11px] mt-1 ${
                            active ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {dc.location}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-600 pt-1">
                  {activeDatacenter.trafficNote}
                </p>
              </div>

              {/* Billing Cycle Selector */}
              <div className="lg:col-span-5 space-y-2.5">
                <div className="text-xs font-extrabold text-slate-500">
                  ۰۳. انتخاب دوره پرداخت (تخفیف خودکار)
                </div>
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                  {BILLING_CYCLES.map((cycle) => {
                    const active = billingCycleId === cycle.id;
                    return (
                      <button
                        key={cycle.id}
                        type="button"
                        onClick={() => setBillingCycleId(cycle.id)}
                        className={`py-2.5 px-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-white text-blue-700 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {cycle.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-emerald-700 font-semibold pt-1">
                  {activeCycle.note}
                </p>
              </div>
            </div>
          </section>

          {/* Competitive Hosting Plans Grid */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {HOSTING_CATEGORIES.find((c) => c.id === hostingCategory)?.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  تمامی پلن‌ها با دیسک تمام NVMe، گواهی SSL رایگان و دسترسی کامل به کنترل‌پنل تحویل می‌شوند.
                </p>
              </div>
              <div className="text-xs text-slate-500 font-semibold">
                لوکیشن فعال: <span className="text-slate-900 font-bold">{activeDatacenter.name}</span>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 ${
                visiblePlans.length >= 4
                  ? 'xl:grid-cols-4'
                  : visiblePlans.length === 3
                  ? 'xl:grid-cols-3'
                  : 'xl:grid-cols-2'
              } gap-5 items-stretch`}
            >
              {visiblePlans.map((plan) => {
                const pricing = calculateHostingPrice({
                  monthlyBaseToman: plan.monthlyPriceToman,
                  datacenterId,
                  billingCycleId,
                });
                const itemId = `hosting-${plan.id}-${datacenterId}-${billingCycleId}`;
                const inCart = cartItemIds.has(itemId);

                return (
                  <article
                    key={plan.id}
                    className={`rounded-3xl border p-6 flex flex-col justify-between transition-colors ${
                      plan.recommended
                        ? 'bg-slate-950 text-white border-blue-500'
                        : 'bg-white text-slate-900 border-slate-200'
                    }`}
                  >
                    <div className="space-y-5">
                      {/* Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span
                            className={`font-mono ${
                              plan.recommended ? 'text-blue-300' : 'text-slate-500'
                            }`}
                          >
                            {plan.englishName}
                          </span>
                          {plan.recommended && (
                            <span className="text-emerald-400 font-extrabold">
                              پیشنهاد مهندسی
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-black">{plan.name}</h3>
                        <p
                          className={`text-xs leading-relaxed ${
                            plan.recommended ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {plan.tagline}
                        </p>
                      </div>

                      {/* Price Block */}
                      <div
                        className={`p-4 rounded-2xl border ${
                          plan.recommended
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-2xl sm:text-3xl font-black font-mono tabular-nums">
                            {pricing.effectiveMonthlyToman.toLocaleString('fa-IR')}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              plan.recommended ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            تومان / ماهانه
                          </span>
                        </div>
                        <div
                          className={`text-xs mt-1.5 tabular-nums ${
                            plan.recommended ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {billingCycleId === 'monthly' ? (
                            <span>پرداخت ماه‌به‌ماه بدون تعهد</span>
                          ) : (
                            <span>
                              مجموع دوره ({pricing.months} ماه):{' '}
                              <strong className="font-mono">
                                {pricing.totalPeriodToman.toLocaleString('fa-IR')}
                              </strong>{' '}
                              تومان
                            </span>
                          )}
                        </div>
                        {pricing.savingsToman > 0 && (
                          <div className="text-[11px] font-bold text-emerald-500 mt-1 tabular-nums">
                            صرفه‌جویی شما: {pricing.savingsToman.toLocaleString('fa-IR')} تومان
                          </div>
                        )}
                        {plan.freeDomainOnAnnual && (
                          <div
                            className={`text-[11px] font-bold mt-2 pt-2 border-t ${
                              plan.recommended
                                ? 'border-slate-800 text-amber-300'
                                : 'border-slate-200 text-blue-700'
                            }`}
                          >
                            هدیه خرید سالانه: {plan.freeDomainOnAnnual}
                          </div>
                        )}
                      </div>

                      {/* Hardware Specs List */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            فضای دیسک
                          </span>
                          <span className="font-bold tabular-nums">{plan.specs.storage}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            پردازنده (CPU)
                          </span>
                          <span className="font-bold tabular-nums">{plan.specs.cpu}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            حافظه رم (RAM)
                          </span>
                          <span className="font-bold tabular-nums">{plan.specs.ram}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            پهنای باند
                          </span>
                          <span className="font-bold">{plan.specs.bandwidth}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            تعداد دامنه
                          </span>
                          <span className="font-bold">{plan.specs.domainsAllowed}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/20">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            بکاپ خودکار
                          </span>
                          <span className="font-bold">{plan.specs.backup}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2 py-1">
                          <span className={plan.recommended ? 'text-slate-400' : 'text-slate-500'}>
                            وب‌سرور / پشته
                          </span>
                          <span className="font-bold text-left">{plan.specs.webServer}</span>
                        </div>
                      </div>

                      {/* Special Features */}
                      <ul className="space-y-2 pt-2">
                        {plan.highlights.map((hl, idx) => (
                          <li
                            key={idx}
                            className={`flex items-start gap-2 text-xs leading-relaxed ${
                              plan.recommended ? 'text-slate-200' : 'text-slate-700'
                            }`}
                          >
                            <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Footer CTA */}
                    <div className="pt-6 mt-6 border-t border-slate-200/20 space-y-2.5">
                      <div
                        className={`text-[11px] leading-relaxed ${
                          plan.recommended ? 'text-slate-400' : 'text-slate-500'
                        }`}
                      >
                        مناسب برای: {plan.bestFor}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePlanInCart(plan)}
                        className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                          inCart
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : plan.recommended
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-slate-900 text-white hover:bg-blue-600'
                        }`}
                      >
                        {inCart ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>در سبد خرید است (حذف)</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 shrink-0" />
                            <span>
                              انتخاب و افزودن به سبد
                              {selectedAddonsTotal > 0 ? ' (+ افزودنی‌ها)' : ''}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Special Optional Add-Ons (آپشن‌های خاص قابل انتخاب قبل از سفارش) */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  آپشن‌های اختصاصی و ارتقای فنی سرویس هاست
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  هر آپشن را انتخاب کنید تا هنگام کلیک روی پلن مورد نظر، مستقیم به سفارش شما اضافه شود.
                </p>
              </div>
              {selectedAddonIds.length > 0 && (
                <div className="text-xs font-extrabold text-blue-700 tabular-nums">
                  مجموع افزودنی‌های انتخابی: {selectedAddonsTotal.toLocaleString('fa-IR')} تومان
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {HOSTING_ADDONS.map((addon) => {
                const selected = selectedAddonIds.includes(addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon.id)}
                    className={`text-right p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between gap-3 ${
                      selected
                        ? 'bg-blue-50 border-blue-600 text-slate-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-extrabold leading-snug">
                          {addon.title}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                            selected
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-white border-slate-300'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5" />}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {addon.description}
                      </p>
                    </div>
                    <div className="text-xs font-black font-mono tabular-nums text-blue-700">
                      +{addon.monthlyPriceToman.toLocaleString('fa-IR')} تومان{' '}
                      <span className="font-sans font-semibold text-slate-500">
                        {addon.oneTime ? '(یک‌بار برای همیشه)' : '/ ماهانه'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Exclusive Technical Architecture Highlights (Asymmetric Bento) */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                چرا سرعت و سئوی سایت روی هاست ابری پاشالان متمایز است؟
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                <div className="space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>۰۱. وب‌سرور LiteSpeed Enterprise + HTTP/3</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    تا ۶ برابر سریع‌تر از آپاچی در پاسخ به کاربران همزمان؛ کاهش مستقیم زمان پاسخ سرور (TTFB) و امتیاز سبز گوگل.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>۰۲. آرایه تمام NVMe Gen4 RAID-10</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    سرعت خواندن دیتابیس تا ۳۵۰۰ مگابایت بر ثانیه همراه با افزونگی سخت‌افزاری برای حفاظت از داده‌ها.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>۰۳. سپر امنیتی هوشمند Imunify360 و WAF</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    مسدودسازی لحظه‌ای حملات تزریق کد، بات‌های مخرب و اسکن خودکار فایل‌ها بدون کاهش سرعت سایت.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="font-extrabold text-slate-900 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>۰۴. بکاپ آف‌سایت دوگانه + مهاجرت رایگان</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">
                    نسخه پشتیبان روزانه روی سرور مجزا با امکان بازگردانی ۱ کلیکی؛ سایت فعلی شما را رایگان و بدون قطعی منتقل می‌کنیم.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="text-xs font-bold text-emerald-400">
                  مشاوره انتخاب دقیق منابع
                </div>
                <h3 className="text-lg font-black leading-snug">
                  مطمئن نیستید کدام پنل هاست برای سایت شما کافی است؟
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  نوع سایت، تعداد بازدید روزانه یا سیستم مدیریت محتوای خود را به مشاور هوشمند یا مهندس زیرساخت پاشالان بگویید تا کم‌هزینه‌ترین و سریع‌ترین پلن را دقیقاً پیشنهاد دهیم.
                </p>
              </div>
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={onOpenAiConsultant}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>مشاوره رایگان با هوش مصنوعی پاشالان</span>
                  <ArrowUpLeft className="w-4 h-4 shrink-0" />
                </button>
                <a
                  href="tel:+989197254078"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Headphones className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تماس مستقیم با واحد فنی</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ================================================================= */}
      {/* TAB 2: LIVE DOMAIN SEARCH & COMPETITIVE TLD STOREFRONT            */}
      {/* ================================================================= */}
      {activeTab === 'domains' && (
        <div className="space-y-10">
          {/* Live Domain Search & Instant Registration Box */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  جستجوی زنده و خرید آنی دامنه (متصل به رجیستری رسمی)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  نام برند انگلیسی مورد نظرتان را وارد کنید تا آزاد بودن پسوندهای .ir، .com، .net، .org، .co و .shop به‌صورت لحظه‌ای بررسی شود.
                </p>
              </div>

              {/* 1-Year vs 5-Year selector for .ir */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 self-start shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDomainYears(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                    selectedDomainYears === 1
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ثبت ۱ ساله (.ir)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDomainYears(5)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                    selectedDomainYears === 5
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ثبت ۵ ساله (.ir به‌صرفه)
                </button>
              </div>
            </div>

            <form
              onSubmit={handleCheckDomainLive}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  dir="ltr"
                  value={domainQuery}
                  onChange={(e) => setDomainQuery(e.target.value)}
                  placeholder="مثلاً: pashalanshop یا brandname"
                  className="w-full pr-12 pl-4 py-3.5 rounded-2xl border border-slate-300 focus:border-blue-600 focus:outline-none text-sm font-mono font-bold text-slate-900 bg-slate-50"
                />
              </div>
              <button
                type="submit"
                disabled={domainLoading}
                className="px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-extrabold transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
              >
                {domainLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال استعلام زنده...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>بررسی آزاد بودن دامنه</span>
                  </>
                )}
              </button>
            </form>

            {domainError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                {domainError}
              </div>
            )}

            {/* Live Check Results Grid */}
            {domainResults.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold text-slate-700">
                  نتیجه استعلام زنده برای نام{' '}
                  <span className="font-mono text-blue-700" dir="ltr">
                    {checkedBaseName}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {domainResults.map((row) => {
                    const isAvail = row.status === 'available';
                    const years = row.tld === '.ir' ? selectedDomainYears : 1;
                    const price = getTldPriceForYears(row.tld, years);
                    const id = `domain-reg-${row.domain}-${years}y`;
                    const inCart = cartItemIds.has(id);

                    return (
                      <div
                        key={row.domain}
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                          isAvail
                            ? 'bg-emerald-50/60 border-emerald-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="min-w-0">
                          <div
                            className="text-sm font-black font-mono text-slate-900 truncate"
                            dir="ltr"
                          >
                            {row.domain}
                          </div>
                          <div className="flex items-center gap-1.5 mt-1 text-xs">
                            {isAvail ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-bold text-emerald-700">
                                  آزاد و قابل ثبت
                                </span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span className="font-semibold text-slate-500">
                                  قبلاً ثبت شده
                                </span>
                              </>
                            )}
                          </div>
                          {isAvail && (
                            <div className="text-xs font-black font-mono tabular-nums text-slate-800 mt-1">
                              {price.toLocaleString('fa-IR')} تومان{' '}
                              <span className="font-sans font-normal text-slate-500">
                                ({years === 5 ? '۵ ساله' : '۱ ساله'})
                              </span>
                            </div>
                          )}
                        </div>

                        {isAvail ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleDomainInCart(row.domain, row.tld)
                            }
                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors shrink-0 ${
                              inCart
                                ? 'bg-slate-900 text-white'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            {inCart ? 'در سبد خرید ✓' : 'افزودن به سبد'}
                          </button>
                        ) : (
                          <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                            غیرقابل ثبت
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>

          {/* Competitive TLD Pricing Table (10 Popular Extensions) */}
          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  تعرفه شفاف ثبت، تمدید و انتقال ۱۰ پسوند محبوب دامنه (۱۴۰۵)
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  بدون کارمزد پنهان — همراه با کنترل کامل DNS، قفل ضدسرقت دامنه و Whois Privacy رایگان برای پسوندهای جهانی.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCart}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-extrabold whitespace-nowrap cursor-pointer self-start sm:self-center"
              >
                مشاهده سبد خرید
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-extrabold text-slate-600">
                    <th className="py-3.5 px-5">پسوند دامنه</th>
                    <th className="py-3.5 px-4">کاربرد و توضیحات</th>
                    <th className="py-3.5 px-4">ثبت ۱ ساله</th>
                    <th className="py-3.5 px-4">تمدید سالانه</th>
                    <th className="py-3.5 px-4">انتقال</th>
                    <th className="py-3.5 px-5 text-left">سفارش</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {DOMAIN_TLDS_CATALOG.map((item) => {
                    const years = item.tld === '.ir' ? selectedDomainYears : 1;
                    const id = `domain-tld-${item.tld.replace(/\./g, '')}-${years}y`;
                    const inCart = cartItemIds.has(id);
                    return (
                      <tr
                        key={item.tld}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-base font-black font-mono text-blue-700"
                              dir="ltr"
                            >
                              {item.tld}
                            </span>
                            {item.popular && (
                              <span className="text-[11px] font-bold text-emerald-700">
                                پرطرفدار
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.label}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-sm">
                          <div className="text-slate-800 font-semibold">
                            {item.bestFor}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {item.registryNote}
                          </div>
                        </td>
                        <td className="py-4 px-4 font-mono font-black text-slate-900 tabular-nums whitespace-nowrap">
                          {item.register1YrToman.toLocaleString('fa-IR')} ت
                          {item.register5YrToman && (
                            <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                              ۵ ساله: {item.register5YrToman.toLocaleString('fa-IR')} ت
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                          {item.renew1YrToman.toLocaleString('fa-IR')} ت
                        </td>
                        <td className="py-4 px-4 font-mono font-semibold text-slate-700 tabular-nums whitespace-nowrap">
                          {item.transferToman.toLocaleString('fa-IR')} ت
                        </td>
                        <td className="py-4 px-5 text-left whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleTldOfferInCart(item)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer ${
                              inCart
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-900 hover:bg-blue-600 text-white'
                            }`}
                          >
                            {inCart ? 'در سبد خرید ✓' : 'ثبت سفارش'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Domain Ownership & Security Guarantees */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">
                ۰۱. مالکیت ۱۰۰٪ رسمی و قفل ضدسرقت
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                دامنه‌های .ir مستقیماً روی شناسه ایرنیک شخصی شما ثبت می‌شوند و دامنه‌های بین‌المللی دارای Registrar Lock و کد انتقال آزاد (EPP) هستند.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-black text-slate-900">
                ۰۲. تنظیم رایگان DNS، CDN و ایمیل برند
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                اتصال دامنه به هاست، راه‌اندازی رکوردهای Cloudflare/ArvanCloud و تاییدیه سرچ کنسول گوگل توسط تیم فنی ما رایگان انجام می‌شود.
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-2">
              <Database className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-black text-slate-900">
                ۰۳. یادآوری هوشمند تمدید قبل از انقضا
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                پیش از تاریخ انقضای دامنه از طریق پیامک و واتساپ اطلاع‌رسانی می‌کنیم تا برند ارزشمند شما هرگز منقضی یا از دسترس خارج نشود.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* ================================================================= */}
      {/* FAQ ACCORDION (ALWAYS IN DOM FOR GOOGLE & AI SEARCH ENGINES)      */}
      {/* ================================================================= */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-black text-slate-900">
            پرسش‌های متداول خرید هاست ابری و ثبت دامنه در پاشالان
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            پاسخ‌های شفاف درباره مالکیت، انتخاب دیتاسنتر، انتقال بدون قطعی و ضمانت بازگشت وجه
          </p>
        </div>

        <div className="divide-y divide-slate-200">
          {HOSTING_DOMAINS_FAQS.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 text-right cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                <p
                  className={`text-xs sm:text-sm text-slate-600 leading-relaxed mt-2.5 ${
                    isOpen ? 'block' : 'sr-only'
                  }`}
                >
                  {faq.a}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dedicated SEO & AI-Search Citation Block */}
      <PageSeoContentBlock page={activeTab === 'hosting' ? 'hosting' : 'domains'} />
    </div>
  );
};
