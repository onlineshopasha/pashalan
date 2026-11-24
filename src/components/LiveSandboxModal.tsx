import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Monitor,
  CheckCircle2,
  Gift,
  Server,
  Globe,
  Layers,
  ShoppingCart,
  ShieldCheck,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Sliders,
  Palette,
  RefreshCw,
  CreditCard,
  Award,
  Truck,
  Headphones,
  Check,
  BarChart3,
  Package,
  Bell,
  TrendingUp,
} from 'lucide-react';
import {
  SpatialKit,
  calculateReadyPlanPriceByPages,
  SERVICES_RATE_CARD,
} from '../data/spatialCatalog';

interface LiveSandboxModalProps {
  kit: SpatialKit | null;
  initialPageCount?: number;
  initialTab?:
    | 'live-site'
    | 'customizer-studio'
    | 'admin-3d'
    | 'specs-pricing';
  customBrandFromParent?: string;
  customBrandLogo?: string | null;
  customBrandColor?: string | null;
  onChangeCustomBrand?: (brand: string) => void;
  onClose: () => void;
  onOrderKit: (
    kit: SpatialKit,
    mode: 'ready-kit' | 'custom-agency',
    pageCount: number
  ) => void;
}

const IRAN_BRAND_PALETTES = [
  { id: 'digikala-red', name: 'قرمز فروشگاهی (دیجی‌استایل)', hex: '#EF394E' },
  { id: 'techno-blue', name: 'آبی دیجیتال (تکنولایف)', hex: '#2563EB' },
  { id: 'snapp-green', name: 'سبز سوپراپ (اسنپ / فین‌تک)', hex: '#00D170' },
  { id: 'clinic-teal', name: 'فیروزه‌ای کلینیک (دکترتو)', hex: '#0D9488' },
  { id: 'royal-gold', name: 'طلایی لوکس (گالری طلا و مزون)', hex: '#D97706' },
  { id: 'academy-purple', name: 'بنفش آکادمی (آموزش و وکالت)', hex: '#7C3AED' },
];

const VERIFIED_LIVE_IRAN_SITES = [
  { label: 'تکنولایف (فروشگاه دیجیتال)', url: 'https://www.technolife.ir' },
  { label: 'خانومی (آرایشی و زیبایی)', url: 'https://www.khanoumi.com' },
  { label: 'بانی‌مد (پوشاک و مد)', url: 'https://www.banimode.com' },
  { label: 'دکترتو (نوبت‌دهی پزشکی)', url: 'https://doctoreto.com' },
  { label: 'داروکده (داروخانه آنلاین)', url: 'https://www.darukade.com' },
  { label: 'دلتا املاک (پورتال مسکن)', url: 'https://delta.ir' },
  { label: 'جاجیگا (رزرو ویلا و اقامتگاه)', url: 'https://www.jajiga.com' },
  { label: 'فلای‌تودی (بلیط و هتل)', url: 'https://www.flytoday.ir' },
  { label: 'فرادرس (آموزشگاه آنلاین)', url: 'https://faradars.org' },
  { label: 'ابر آروان (شرکتی و ابری)', url: 'https://www.arvancloud.ir' },
  { label: 'زرین‌پال (درگاه پرداخت)', url: 'https://www.zarinpal.com' },
  { label: 'باما (خرید و فروش خودرو)', url: 'https://www.bama.ir' },
];

export const LiveSandboxModal: React.FC<LiveSandboxModalProps> = ({
  kit,
  initialPageCount = 5,
  initialTab = 'live-site',
  customBrandFromParent = '',
  customBrandLogo = null,
  customBrandColor = null,
  onChangeCustomBrand,
  onClose,
  onOrderKit,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [activeMode, setActiveMode] = useState<
    'live-site' | 'customizer-studio' | 'admin-3d' | 'specs-pricing'
  >('live-site');
  const [liveSubView, setLiveSubView] = useState<
    'real-iran-iframe' | 'persian-localized'
  >('real-iran-iframe');
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [currentIranLiveUrl, setCurrentIranLiveUrl] = useState<string>('');
  const [injectedSrcDoc, setInjectedSrcDoc] = useState<string | null>(null);
  const [barsVisible, setBarsVisible] = useState<boolean>(true);
  const lastScrollTopRef = React.useRef<number>(0);

  const [pageCount, setPageCount] = useState<number>(initialPageCount);
  const [pricingMode, setPricingMode] = useState<'ready-kit' | 'custom-agency'>(
    'ready-kit'
  );

  // Live Customizer States (مدل ایرانی)
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [customDomainIr, setCustomDomainIr] = useState<string>('yourbrand.ir');
  const [customHeroTitle, setCustomHeroTitle] = useState<string>('');
  const [customHeroSub, setCustomHeroSub] = useState<string>('');
  const [customCtaText, setCustomCtaText] = useState<string>('');
  const [customAccent, setCustomAccent] = useState<string>('#2563EB');

  // Iranian Ecosystem Feature Toggles
  const [enableSnappPay, setEnableSnappPay] = useState<boolean>(true);
  const [enableTorobBadge, setEnableTorobBadge] = useState<boolean>(true);
  const [enableEnamadFooter, setEnableEnamadFooter] = useState<boolean>(true);
  const [enableTopPromoBar, setEnableTopPromoBar] = useState<boolean>(true);
  const [enableKavenegarOtp, setEnableKavenegarOtp] = useState<boolean>(true);

  // Live Editable Products/Services
  const [editableItems, setEditableItems] = useState<
    { id: string; name: string; spec: string; priceToman: number; tag: string }[]
  >([]);
  const [newItemName, setNewItemName] = useState<string>('');
  const [newItemPrice, setNewItemPrice] = useState<string>('2850000');

  // Interactive Cart inside Branded Preview
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  useEffect(() => {
    if (kit) {
      setPageCount(initialPageCount);
      setActiveMode(initialTab);
      setLiveSubView(
        initialTab === 'customizer-studio'
          ? 'persian-localized'
          : 'real-iran-iframe'
      );
      setIframeLoaded(false);
      setBarsVisible(true);
      const targetUrl = kit.liveReferenceUrl || kit.realExternalDemoUrl;
      setCurrentIranLiveUrl(targetUrl);

      const defaultBrand =
        customBrandFromParent.trim() ||
        kit.title.split('—')[0].split('،')[0].trim();
      setCustomBrandName(defaultBrand);
      setCustomDomainIr(
        kit.liveUrlSlug.replace('https://', '').replace('.pashalan.ir', '.ir')
      );
      setCustomHeroTitle(kit.sandboxTheme.heroHeadline);
      setCustomHeroSub(kit.sandboxTheme.heroSub);
      setCustomCtaText(kit.sandboxTheme.ctaLabel);
      setCustomAccent(customBrandColor || kit.sandboxTheme.accent);
      setEditableItems(
        kit.sandboxTheme.items.map((it) => ({
          id: it.id,
          name: it.name,
          spec: it.spec,
          priceToman: it.priceToman,
          tag: it.tag,
        }))
      );
      setCartIds([kit.sandboxTheme.items[0]?.id || '']);
      setCartOpen(false);
    }
  }, [kit, initialPageCount, initialTab]);

  // Fetch proxied HTML and inject scroll/wheel listener so scrolling inside the live Iranian website
  // automatically hides the top/bottom bars on scroll down and reveals them on scroll up
  useEffect(() => {
    if (!kit || !currentIranLiveUrl || liveSubView !== 'real-iran-iframe') {
      setInjectedSrcDoc(null);
      return;
    }
    let cancelled = false;
    setInjectedSrcDoc(null);
    const proxyUrl = `https://www.pashalan.com/api/live-site-proxy?url=${encodeURIComponent(
      currentIranLiveUrl
    )}`;

    fetch(proxyUrl)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error('Failed'))))
      .then((html) => {
        if (cancelled || !html || html.length < 200) return;
        const scrollBridgeScript = `
<script>
(function(){
  var lastY = 0;
  var touchStartY = 0;
  window.addEventListener('scroll', function(){
    var y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (y > lastY + 12 && y > 40) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'down' }, '*');
    } else if (y < lastY - 12 || y <= 15) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'up' }, '*');
    }
    lastY = y;
  }, { passive: true });
  window.addEventListener('wheel', function(e){
    if (e.deltaY > 10) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'down' }, '*');
    } else if (e.deltaY < -10) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'up' }, '*');
    }
  }, { passive: true });
  window.addEventListener('touchstart', function(e){
    if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchmove', function(e){
    if (!e.touches || !e.touches[0]) return;
    var dy = touchStartY - e.touches[0].clientY;
    if (dy > 18) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'down' }, '*');
      touchStartY = e.touches[0].clientY;
    } else if (dy < -18) {
      window.parent.postMessage({ type: 'PASHA_LIVE_SCROLL', dir: 'up' }, '*');
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });
})();
</script>`;
        const hasBase = /<base\s/i.test(html);
        const baseTag = hasBase ? '' : `<base href="${currentIranLiveUrl}/">`;
        const modified = html.includes('</head>')
          ? html.replace('</head>', `${baseTag}${scrollBridgeScript}</head>`)
          : `${baseTag}${scrollBridgeScript}${html}`;
        setInjectedSrcDoc(modified);
        setIframeLoaded(true);
      })
      .catch(() => {
        // Fallback to direct proxy src if fetch fails
        if (!cancelled) setInjectedSrcDoc(null);
      });

    const timer = setTimeout(() => {
      if (!cancelled) setIframeLoaded(true);
    }, 2400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [kit, currentIranLiveUrl, liveSubView]);

  // Listen to scroll direction messages from inside the live iframe
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'PASHA_LIVE_SCROLL') {
        if (e.data.dir === 'down') {
          setBarsVisible(false);
        } else if (e.data.dir === 'up') {
          setBarsVisible(true);
        }
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const handleContainerScroll = (e: React.UIEvent<HTMLElement>) => {
    const currentTop = e.currentTarget.scrollTop;
    const prevTop = lastScrollTopRef.current;
    if (currentTop > prevTop + 12 && currentTop > 40) {
      setBarsVisible(false);
    } else if (currentTop < prevTop - 12 || currentTop <= 15) {
      setBarsVisible(true);
    }
    lastScrollTopRef.current = currentTop;
  };

  const handleContainerWheel = (e: React.WheelEvent<HTMLElement>) => {
    if (e.deltaY > 12) {
      setBarsVisible(false);
    } else if (e.deltaY < -12) {
      setBarsVisible(true);
    }
  };

  if (!kit) return null;

  const readyPriceForSelectedPages = calculateReadyPlanPriceByPages(pageCount);
  const currentTotalToman =
    pricingMode === 'ready-kit'
      ? readyPriceForSelectedPages
      : kit.customPriceToman;

  const toggleCartItem = (id: string) => {
    setCartIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const numericPrice = Number(newItemPrice.replace(/[^0-9]/g, '')) || 1500000;
    const newItem = {
      id: `custom-${Date.now()}`,
      name: newItemName.trim(),
      spec: 'اضافه‌شده توسط شما در استودیو شخصی‌سازی زنده',
      priceToman: numericPrice,
      tag: 'محصول اختصاصی شما',
    };
    setEditableItems((prev) => [newItem, ...prev]);
    setNewItemName('');
  };

  const handleRemoveProduct = (id: string) => {
    setEditableItems((prev) => prev.filter((it) => it.id !== id));
    setCartIds((prev) => prev.filter((cid) => cid !== id));
  };

  const selectedItems = editableItems.filter((item) =>
    cartIds.includes(item.id)
  );
  const cartTotalToman = selectedItems.reduce(
    (acc, item) => acc + item.priceToman,
    0
  );
  const snappPayInstallment = Math.round(cartTotalToman / 4);

  const proxyIframeSrc = `https://www.pashalan.com/api/live-site-proxy?url=${encodeURIComponent(
    currentIranLiveUrl
  )}`;
  const cleanLiveHost = currentIranLiveUrl
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/$/, '');

  const handleBrandInput = (val: string) => {
    setCustomBrandName(val);
    if (onChangeCustomBrand) onChangeCustomBrand(val);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#05070C] w-screen h-screen flex flex-col overflow-hidden"
      dir="rtl"
      onWheel={handleContainerWheel}
    >
      {/* Invisible Top & Bottom Hover Sensor Strips so moving mouse to top/bottom reveals bars */}
      <div
        onMouseEnter={() => setBarsVisible(true)}
        className="fixed top-0 inset-x-0 h-3 z-50"
      />
      <div
        onMouseEnter={() => setBarsVisible(true)}
        className="fixed bottom-0 inset-x-0 h-3 z-50"
      />

      {/* Minimal Floating Pill when bars are auto-hidden on scroll down */}
      {!barsVisible && (
        <div className="fixed top-3 left-3 z-50 flex items-center gap-1.5 bg-[#0B0E17]/85 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 shadow-2xl text-white transition-all">
          <button
            type="button"
            onClick={() => setBarsVisible(true)}
            className="text-[11px] font-black text-emerald-300 hover:text-emerald-200 flex items-center gap-1 cursor-pointer"
          >
            <span>نمایش منو و ابزارها ▾</span>
          </button>
          <span className="text-white/25">|</span>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-black text-rose-400 hover:text-rose-300 flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      )}

      {/* ================================================================= */}
      {/* AUTO-HIDING TOP BAR (Fades out on scroll down, fades in on scroll up) */}
      {/* ================================================================= */}
      <div
        className={`fixed top-0 inset-x-0 z-50 bg-[#0B0E17]/95 backdrop-blur-xl border-b border-white/15 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 text-white transition-all duration-300 ease-out ${
          barsVisible
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        {/* Right: Template Name + Iranian Reference Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-black shrink-0">
            کد {kit.code}
          </span>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black text-white truncate max-w-[180px] sm:max-w-[300px]">
              {customBrandName || kit.title}
            </h2>
            <div className="text-[10px] text-slate-400 truncate">
              سایت واقعی مرجع ایرانی:{' '}
              <span className="text-emerald-300 font-bold">
                {kit.referenceBrandFa || cleanLiveHost}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Iranian Website Selector & URL Bar */}
        <div className="hidden xl:flex items-center gap-2 bg-black/70 border border-emerald-500/35 rounded-xl px-3 py-1 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="text-[11px] text-slate-300 shrink-0">
            سایت زنده ایرانی:
          </span>
          <select
            value={currentIranLiveUrl}
            onChange={(e) => {
              setIframeLoaded(false);
              setCurrentIranLiveUrl(e.target.value);
              setActiveMode('live-site');
              setLiveSubView('real-iran-iframe');
            }}
            className="bg-transparent text-emerald-300 font-bold text-xs focus:outline-none cursor-pointer"
          >
            {!VERIFIED_LIVE_IRAN_SITES.some(
              (s) => s.url === currentIranLiveUrl
            ) && (
              <option value={currentIranLiveUrl} className="bg-slate-900">
                {kit.referenceBrandFa || cleanLiveHost} ({cleanLiveHost})
              </option>
            )}
            {VERIFIED_LIVE_IRAN_SITES.map((site) => (
              <option
                key={site.url}
                value={site.url}
                className="bg-slate-900 text-white"
              >
                {site.label} — {site.url.replace('https://', '')}
              </option>
            ))}
          </select>
          <a
            href={currentIranLiveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-200 font-mono text-[10px] font-bold flex items-center gap-1 shrink-0"
          >
            <span>Open</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>

        {/* Left: Sub-Mode Switcher + Hide Bar Button + Order Button */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveMode('live-site');
                setLiveSubView('real-iran-iframe');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeMode === 'live-site' &&
                liveSubView === 'real-iran-iframe'
                  ? 'bg-emerald-400 text-slate-950 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>🌐 سایت واقعی زنده ایرانی</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('customizer-studio');
                setLiveSubView('persian-localized');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-black cursor-pointer transition-all flex items-center gap-1.5 ${
                activeMode === 'customizer-studio' ||
                (activeMode === 'live-site' &&
                  liveSubView === 'persian-localized')
                  ? 'bg-amber-400 text-slate-950 shadow-lg'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>✨ نسخه اختصاصی و ادیت با برند شما</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setBarsVisible(false)}
            className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] cursor-pointer"
            title="مخفی کردن نوارها برای دید ۱۰۰٪ تمام‌صفحه"
          >
            مخفی کردن منو ▴
          </button>

          <button
            type="button"
            onClick={() => onOrderKit(kit, pricingMode, pageCount)}
            className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1 cursor-pointer"
          >
            <span>
              سفارش با برند من ({(currentTotalToman / 1000000).toFixed(1)} م.ت)
            </span>
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MAIN 100% FULL-SCREEN WORKSPACE (100vw x 100vh unobstructed)       */}
      {/* ================================================================= */}
      <div className="flex-1 w-full h-full overflow-hidden flex flex-col lg:flex-row relative">
        {/* =============================================================== */}
        {/* VIEW 1: REAL IRANIAN LIVE WEBSITE IFRAME (لایو واقعی سایت ایرانی) */}
        {/* =============================================================== */}
        {activeMode === 'live-site' && liveSubView === 'real-iran-iframe' && (
          <div className="relative flex-1 w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden">
            {/* Small Non-Blocking Loading Pill in Corner */}
            {!iframeLoaded && (
              <div className="fixed bottom-16 right-4 z-30 pointer-events-none bg-[#0B0E17]/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl px-3.5 py-2 flex items-center gap-2 text-xs text-white shadow-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>در حال اتصال به سایت زنده ({cleanLiveHost})...</span>
              </div>
            )}

            {/* Live Iranian Website Iframe (100% Full Screen) */}
            <div
              className={`w-full h-full transition-all duration-300 flex flex-col ${
                viewport === 'mobile'
                  ? 'max-w-[420px] my-3 rounded-3xl overflow-hidden border-4 border-slate-700 shadow-2xl'
                  : 'w-full flex-1'
              }`}
            >
              {injectedSrcDoc ? (
                <iframe
                  key={`${currentIranLiveUrl}-srcdoc`}
                  srcDoc={injectedSrcDoc}
                  title={kit.title}
                  onLoad={() => setIframeLoaded(true)}
                  className="w-full flex-1 h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              ) : (
                <iframe
                  key={`${currentIranLiveUrl}-src`}
                  src={proxyIframeSrc}
                  title={kit.title}
                  onLoad={() => setIframeLoaded(true)}
                  className="w-full flex-1 h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                />
              )}
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW 2: CUSTOM BRANDED IRANIAN PREVIEW + LIVE EDITOR STUDIO      */}
        {/* =============================================================== */}
        {(activeMode === 'customizer-studio' ||
          (activeMode === 'live-site' &&
            liveSubView === 'persian-localized')) && (
          <div className="flex-1 w-full h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Right Sidebar: Live Customizer Studio Controls */}
            <aside
              onScroll={handleContainerScroll}
              className="w-full lg:w-[370px] xl:w-[400px] h-[44vh] lg:h-full bg-[#0F131F] text-white border-b lg:border-b-0 lg:border-l border-white/15 overflow-y-auto p-4 sm:p-5 pt-16 space-y-5 shrink-0 pb-24"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      استودیو شخصی‌سازی و ادیت زنده
                    </h3>
                    <p className="text-[11px] text-emerald-400">
                      تغییرات شما در لحظه روی سایت روبرو اعمال می‌شود
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomBrandName(
                      kit.title.split('—')[0].split('،')[0].trim()
                    );
                    setCustomHeroTitle(kit.sandboxTheme.heroHeadline);
                    setCustomHeroSub(kit.sandboxTheme.heroSub);
                    setCustomCtaText(kit.sandboxTheme.ctaLabel);
                    setCustomAccent(kit.sandboxTheme.accent);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>ریست</span>
                </button>
              </div>

              {/* 1. Brand Name, .ir Domain & Hero Text */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <div className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>۱. نام برند، دامنه .ir و تیتر اصلی</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      نام برند یا فروشگاه شما:
                    </label>
                    <input
                      type="text"
                      value={customBrandName}
                      onChange={(e) => handleBrandInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      دامنه هدیه .ir رایگان:
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={customDomainIr}
                      onChange={(e) => setCustomDomainIr(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-300 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">
                    تیتر اصلی بنر بالای سایت:
                  </label>
                  <textarea
                    rows={2}
                    value={customHeroTitle}
                    onChange={(e) => setCustomHeroTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Iranian Brand Color Palette */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>۲. پالت رنگ سازمانی (سبک برندهای ایرانی)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {IRAN_BRAND_PALETTES.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setCustomAccent(p.hex)}
                      className={`p-2 rounded-xl border text-right flex items-center gap-2 cursor-pointer transition-all ${
                        customAccent === p.hex
                          ? 'bg-slate-800 border-white text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shrink-0 border border-white/30"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="text-[10px] font-bold truncate">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Iranian E-Commerce Modules Toggles */}
              <div className="space-y-2.5 bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <div className="text-xs font-extrabold text-sky-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>۳. ماژول‌های بومی تجارت الکترونیک ایران</span>
                </div>

                {[
                  {
                    label: 'خرید اقساطی ۴ قسطه اسنپ‌پی (SnappPay) و تارا',
                    state: enableSnappPay,
                    setter: setEnableSnappPay,
                  },
                  {
                    label: 'نشان تضمین کمترین قیمت در ترب (Torob) و ایمالز',
                    state: enableTorobBadge,
                    setter: setEnableTorobBadge,
                  },
                  {
                    label: 'نماد اعتماد اینماد (eNamad) و درگاه شاپرک در فوتر',
                    state: enableEnamadFooter,
                    setter: setEnableEnamadFooter,
                  },
                  {
                    label: 'نوار جشنواره فروش ویژه در بالای هدر',
                    state: enableTopPromoBar,
                    setter: setEnableTopPromoBar,
                  },
                ].map((mod) => (
                  <label
                    key={mod.label}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer"
                  >
                    <span className="text-[11px] font-bold text-slate-200">
                      {mod.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={mod.state}
                      onChange={(e) => mod.setter(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              {/* 4. Add Custom Product / Service Live */}
              <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <div className="text-xs font-extrabold text-purple-400 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>۴. افزودن زنده محصول / خدمت خودتان به سایت</span>
                </div>
                <form onSubmit={handleAddCustomProduct} className="space-y-2">
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="نام کالا یا خدمت (مثلاً: پکیج ویژه برند من)"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="قیمت به تومان"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white focus:border-emerald-400 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold cursor-pointer shrink-0"
                    >
                      + افزودن
                    </button>
                  </div>
                </form>
              </div>
            </aside>

            {/* Left Main Canvas: Live Branded Iranian Website */}
            <div
              onScroll={handleContainerScroll}
              className="flex-1 h-full overflow-y-auto bg-slate-900 flex justify-center pt-14 pb-24"
            >
              <div
                className={`bg-white text-slate-900 transition-all duration-300 flex flex-col ${
                  viewport === 'mobile'
                    ? 'w-[390px] my-4 rounded-[32px] border-[6px] border-slate-700 shadow-2xl overflow-hidden shrink-0'
                    : 'w-full min-h-full'
                }`}
              >
                {enableTopPromoBar && (
                  <div
                    style={{ backgroundColor: customAccent }}
                    className="w-full py-2 px-4 text-white text-[11px] sm:text-xs font-bold flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/25 font-mono text-[10px]">
                        پیشنهاد ویژه {customBrandName}
                      </span>
                      <span>
                        ارسال رایگان سراسر ایران + پرداخت ۴ قسطه اسنپ‌پی بدون ضامن!
                      </span>
                    </div>
                    <span className="font-mono text-[11px]" dir="ltr">
                      www.{customDomainIr}
                    </span>
                  </div>
                )}

                {/* Iranian Store Header */}
                <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {customBrandLogo ? (
                        <img
                          src={customBrandLogo}
                          alt={customBrandName}
                          className="w-10 h-10 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-1 shadow-sm"
                        />
                      ) : (
                        <div
                          style={{ backgroundColor: customAccent }}
                          className="w-10 h-10 rounded-2xl text-white font-black text-base flex items-center justify-center shadow-sm"
                        >
                          {customBrandName.slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{customBrandName}</span>
                          {enableTorobBadge && (
                            <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold">
                              عضو رسمی ترب و ایمالز ✓
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          دامنه رسمی: www.{customDomainIr} · دارای نماد اعتماد اینماد
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCartOpen(!cartOpen)}
                        style={{ backgroundColor: customAccent }}
                        className="px-4 py-2.5 rounded-xl text-white text-xs font-extrabold flex items-center gap-2 shadow-sm cursor-pointer"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>
                          سبد خرید ({cartIds.length.toLocaleString('fa-IR')})
                        </span>
                      </button>
                    </div>
                  </div>
                </header>

                {/* Hero Banner */}
                <section className="px-4 sm:px-8 py-6 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
                  <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          style={{
                            backgroundColor: `${customAccent}15`,
                            color: customAccent,
                          }}
                          className="px-3 py-1 rounded-full text-xs font-extrabold"
                        >
                          نسخه اختصاصی بومی‌سازی شده برای «{customBrandName}»
                        </span>
                        {enableSnappPay && (
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                            خرید اقساطی ۴ قسطه اسنپ‌پی فعال است
                          </span>
                        )}
                      </div>
                      <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                        {customHeroTitle}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {customHeroSub}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <a
                          href="#custom-products-grid"
                          style={{ backgroundColor: customAccent }}
                          className="px-6 py-3 rounded-xl text-white text-xs sm:text-sm font-extrabold shadow-md"
                        >
                          {customCtaText}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMode('live-site');
                            setLiveSubView('real-iran-iframe');
                          }}
                          className="px-4 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>بازگشت به سایت واقعی زنده ({cleanLiveHost})</span>
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-5">
                      <div className="rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl aspect-[16/10] bg-slate-900">
                        <img
                          src={kit.image}
                          alt={customBrandName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* Interactive Products Grid */}
                <section
                  id="custom-products-grid"
                  className="px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full space-y-5"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-base sm:text-xl font-extrabold text-slate-900">
                      محصولات و خدمات «{customBrandName}» (قابل تغییر از پنل سمت
                      راست)
                    </h2>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                      قیمت به تومان + اقساط اسنپ‌پی
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {editableItems.map((item) => {
                      const isAdded = cartIds.includes(item.id);
                      const installment = Math.round(item.priceToman / 4);
                      return (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                            isAdded
                              ? 'border-blue-600 bg-blue-50/20 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span
                                style={{
                                  backgroundColor: `${customAccent}15`,
                                  color: customAccent,
                                }}
                                className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold"
                              >
                                {item.tag}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveProduct(item.id)}
                                className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                                title="حذف آیتم"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900">
                              {item.name}
                            </h3>
                            <p className="text-xs text-slate-500">{item.spec}</p>
                            {enableSnappPay && (
                              <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-200/70 flex items-center justify-between text-[11px] text-blue-900">
                                <span className="font-bold">
                                  ۴ قسط ماهانه اسنپ‌پی:
                                </span>
                                <span className="font-mono font-extrabold">
                                  {installment.toLocaleString('fa-IR')} تومان
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div>
                              <span className="text-base font-mono font-extrabold text-slate-900">
                                {item.priceToman.toLocaleString('fa-IR')}
                              </span>
                              <span className="text-[11px] text-slate-500 mr-1">
                                تومان
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleCartItem(item.id)}
                              style={{
                                backgroundColor: isAdded
                                  ? '#059669'
                                  : customAccent,
                              }}
                              className="px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer"
                            >
                              {isAdded
                                ? '✓ در سبد خرید شما'
                                : '+ افزودن به سبد'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Iranian Footer with eNamad & Shaparak */}
                <footer className="bg-slate-900 text-white px-4 sm:px-8 py-8 mt-auto">
                  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-extrabold">
                        {customBrandName} — www.{customDomainIr}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        مجهز به درگاه پرداخت مستقیم شاپرک، اقساط اسنپ‌پی و ۶ ماه
                        هاست ابری رایگان
                      </p>
                    </div>
                    {enableEnamadFooter && (
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-2 rounded-xl bg-white text-slate-900 text-center">
                          <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto" />
                          <span className="text-[10px] font-extrabold block">
                            اینماد ۵ ستاره
                          </span>
                        </div>
                        <div className="px-3 py-2 rounded-xl bg-white text-slate-900 text-center">
                          <Award className="w-5 h-5 text-emerald-600 mx-auto" />
                          <span className="text-[10px] font-extrabold block">
                            شاپرک بانک مرکزی
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </footer>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW 3: 3D & MOTION IRANIAN ADMIN PANEL (پنل مدیریت 3D)          */}
        {/* =============================================================== */}
        {activeMode === 'admin-3d' && (
          <div
            onScroll={handleContainerScroll}
            className="flex-1 w-full h-full overflow-y-auto bg-[#070910] text-white p-4 sm:p-8 pt-16 pb-28"
          >
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141826] p-5 rounded-3xl border border-purple-500/40 shadow-xl">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-black">
                    پنل مدیریت سه‌بعدی و هوشمند فارسی (تحویل رایگان همراه سایت)
                  </span>
                  <h3 className="text-base sm:text-xl font-black text-white mt-1">
                    داشبورد مدیریت فروشگاه و سایت «{customBrandName}» (www.
                    {customDomainIr})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveMode('live-site');
                      setLiveSubView('real-iran-iframe');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs cursor-pointer"
                  >
                    🌐 بازگشت به سایت واقعی زنده
                  </button>
                  <button
                    type="button"
                    onClick={() => onOrderKit(kit, pricingMode, pageCount)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer"
                  >
                    سفارش این سایت + پنل مدیریت ←
                  </button>
                </div>
              </div>

              {/* 4 Live Iranian KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#111522] border border-emerald-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>فروش امروز (درگاه زرین‌پال/شاپرک)</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl font-mono font-black text-emerald-400">
                    ۴۸,۶۵۰,۰۰۰ تومان
                  </div>
                  <div className="text-[11px] text-emerald-300">
                    +۳۴٪ رشد نسبت به دیروز
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#111522] border border-blue-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>سفارش‌های اقساطی اسنپ‌پی</span>
                    <CreditCard className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xl font-mono font-black text-white">
                    ۱۹ سفارش فعال
                  </div>
                  <div className="text-[11px] text-blue-300">
                    تسویه آنی با فروشگاه شما
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#111522] border border-amber-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>کلیک ورودی از ترب و گوگل</span>
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-mono font-black text-amber-300">
                    ۴,۸۲۰ بازدیدکننده
                  </div>
                  <div className="text-[11px] text-slate-300">
                    فید خودکار ترب و اسکیما فعال
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-[#111522] border border-purple-500/30 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>پیامک‌های OTP کاوه‌نگار</span>
                    <Bell className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-xl font-mono font-black text-purple-300">
                    ارسال زیر ۲ ثانیه
                  </div>
                  <div className="text-[11px] text-slate-300">
                    خط خدماتی اختصاصی فعال
                  </div>
                </div>
              </div>

              {/* Iranian Gateways & Integrations Control inside 3D Admin */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 bg-[#111522] border border-white/10 rounded-3xl p-5 space-y-4">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <span>
                      مدیریت سریع کالاها و خدمات «{customBrandName}» (بدون نیاز به
                      کدنویسی)
                    </span>
                  </h4>

                  <form
                    onSubmit={handleAddCustomProduct}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-black/40 p-3 rounded-2xl border border-white/10"
                  >
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="نام محصول یا خدمت جدید..."
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="قیمت (تومان)"
                      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-300"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer"
                    >
                      + درج فوری در سایت
                    </button>
                  </form>

                  <div className="space-y-2">
                    {editableItems.map((it) => (
                      <div
                        key={it.id}
                        className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <div className="font-bold text-white">{it.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {it.spec}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono font-bold text-emerald-400">
                            {it.priceToman.toLocaleString('fa-IR')} تومان
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(it.id)}
                            className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 bg-[#111522] border border-white/10 rounded-3xl p-5 space-y-3">
                  <h4 className="text-sm font-black text-white">
                    وضعیت اتصال سرویس‌های رسمی ایران در پنل شما
                  </h4>
                  {[
                    {
                      title: 'درگاه مستقیم شاپرک و زرین‌پال',
                      state: true,
                      sub: 'تسویه خودکار روزانه به شبا',
                    },
                    {
                      title: 'درگاه خرید اقساطی ۴ قسطه اسنپ‌پی',
                      state: enableSnappPay,
                      sub: 'افزایش ۲ برابری میانگین سبد خرید',
                      toggle: () => setEnableSnappPay(!enableSnappPay),
                    },
                    {
                      title: 'ربات همگام‌سازی قیمت با ترب و ایمالز',
                      state: enableTorobBadge,
                      sub: 'آپدیت خودکار موجودی و قیمت',
                      toggle: () => setEnableTorobBadge(!enableTorobBadge),
                    },
                    {
                      title: 'سامانه پیامک سریع OTP کاوه‌نگار',
                      state: enableKavenegarOtp,
                      sub: 'ورود مشتریان با کد تایید ۵ رقمی',
                      toggle: () => setEnableKavenegarOtp(!enableKavenegarOtp),
                    },
                  ].map((srv) => (
                    <div
                      key={srv.title}
                      onClick={() => srv.toggle && srv.toggle()}
                      className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {srv.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {srv.sub}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                          srv.state
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {srv.state ? 'فعال ✓' : 'غیرفعال'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =============================================================== */}
        {/* VIEW 4: FULL SPECS, PAGE COUNT SLIDER (1-10) & SERVICES RATES    */}
        {/* =============================================================== */}
        {activeMode === 'specs-pricing' && (
          <div
            onScroll={handleContainerScroll}
            className="flex-1 w-full h-full overflow-y-auto bg-[#070910] text-white p-4 sm:p-8 pt-16 pb-28"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#111522] border border-white/10 rounded-3xl p-6 space-y-3">
                  <span className="text-xs font-bold text-emerald-400">
                    مشخصات فنی کامل طرح کد {kit.code}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {kit.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {kit.fullSpecifications}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3">
                      <Server className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-white">
                          ۶ ماه هاست ابری رایگان
                        </div>
                        <div className="text-[11px] text-emerald-300">
                          سرور اختصاصی ایران (آروان‌کلود) + SSL
                        </div>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center gap-3">
                      <Gift className="w-5 h-5 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-white">
                          دامنه .ir رایگان یک‌ساله
                        </div>
                        <div className="text-[11px] text-blue-300">
                          ثبت رسمی در ایرنیک به نام کارفرما
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ongoing Services Rate Card */}
                <div className="bg-[#111522] border border-white/10 rounded-3xl p-6 space-y-3">
                  <h3 className="text-base font-extrabold text-white">
                    تعرفه خدمات پشتیبانی، سئو مستمر و تولید محتوا
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES_RATE_CARD.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="font-bold text-white">
                          {srv.title}
                        </span>
                        <span className="font-mono font-extrabold text-emerald-400">
                          {srv.priceRangeLabel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Calculator (1 to 10 Pages: 8M to 18M Toman) */}
              <div className="lg:col-span-5">
                <div className="bg-[#141826] border-2 border-emerald-500/40 rounded-3xl p-6 space-y-5 sticky top-6">
                  <h3 className="text-base font-extrabold text-white">
                    محاسبه آنلاین تعرفه بر اساس تعداد صفحات
                  </h3>

                  <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        تعداد صفحات سایت شما:
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-emerald-400 text-slate-950 font-mono text-xs font-black">
                        {pageCount.toLocaleString('fa-IR')} صفحه
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={pageCount}
                      onChange={(e) => setPageCount(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>۱ صفحه (۸ میلیون تومان)</span>
                      <span>۵ صفحه (۱۲.۴ میلیون)</span>
                      <span>۱۰ صفحه (۱۸ میلیون تومان)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between">
                    <span className="text-xs text-emerald-200 font-bold">
                      مبلغ کل طرح آماده ({pageCount.toLocaleString('fa-IR')} صفحه):
                    </span>
                    <span className="text-xl font-mono font-black text-emerald-400">
                      {currentTotalToman.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOrderKit(kit, pricingMode, pageCount)}
                    className="w-full py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-sm cursor-pointer shadow-lg"
                  >
                    ثبت سفارش این طرح (با ۶ ماه هاست + دامنه .ir رایگان)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* AUTO-HIDING FLOATING BOTTOM CONTROL DOCK                          */}
      {/* ================================================================= */}
      <div
        className={`fixed bottom-3 inset-x-0 z-50 pointer-events-none flex justify-center px-2 sm:px-4 transition-all duration-300 ease-out ${
          barsVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-24 opacity-0'
        }`}
      >
        <div
          className={`${
            barsVisible ? 'pointer-events-auto' : 'pointer-events-none'
          } bg-[#090C15]/95 backdrop-blur-2xl border border-white/20 rounded-2xl px-3 sm:px-4 py-2 shadow-2xl flex flex-wrap items-center justify-between gap-2 max-w-6xl w-full text-white`}
        >
          {/* Live Brand Name Input in Bottom Dock */}
          <div className="hidden lg:flex items-center gap-2 bg-black/60 border border-emerald-500/40 rounded-xl px-3 py-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={customBrandName}
              onChange={(e) => handleBrandInput(e.target.value)}
              placeholder="نام برندتان را بنویسید..."
              className="bg-transparent text-xs font-black text-emerald-300 placeholder:text-white/45 focus:outline-none w-44"
            />
          </div>

          {/* 4 Mode Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveMode('live-site');
                setLiveSubView('real-iran-iframe');
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer transition-all ${
                activeMode === 'live-site' &&
                liveSubView === 'real-iran-iframe'
                  ? 'bg-emerald-400 text-slate-950 shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              🌐 سایت واقعی زنده ایرانی
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveMode('customizer-studio');
                setLiveSubView('persian-localized');
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer transition-all ${
                activeMode === 'customizer-studio'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              ✨ استودیو شخصی‌سازی و ادیت
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('admin-3d')}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer transition-all ${
                activeMode === 'admin-3d'
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              🎛️ پنل مدیر 3D
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('specs-pricing')}
              className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-black cursor-pointer transition-all ${
                activeMode === 'specs-pricing'
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-blue-300 hover:text-white'
              }`}
            >
              📋 تعرفه و مشخصات (۸ تا ۱۸ م.ت)
            </button>
          </div>

          {/* Viewport Switcher & Exit Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setViewport((v) => (v === 'desktop' ? 'mobile' : 'desktop'))
              }
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold cursor-pointer"
            >
              {viewport === 'desktop' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>موبایل</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>دسکتاپ</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black flex items-center gap-1 cursor-pointer shadow"
            >
              <X className="w-4 h-4" />
              <span>خروج و بازگشت به طرح‌ها</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
