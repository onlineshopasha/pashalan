import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  Instagram,
  Monitor,
  PhoneCall,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  X,
  CreditCard,
  ArrowRightLeft,
} from 'lucide-react';
import {
  CONVERTED_SHOP_STOREFRONTS,
  DemoStoreProduct,
} from '../data/instagramShopDemosCatalog';

export interface ActiveConvertedShopPreview {
  shopId: string;
  brandName: string;
  instagramHandle: string;
  convertedDomain: string;
  followersLabel: string;
  beforePainPoint: string;
  conversionBoost: string;
  liveDemoUrl: string;
  liveDemoBrandLabel: string;
}

interface InstagramConvertedShopModalProps {
  preview: ActiveConvertedShopPreview | null;
  onClose: () => void;
  onOrderSimilarSite?: () => void;
}

interface DemoCartItem {
  product: DemoStoreProduct;
  selectedVariant: string;
  qty: number;
}

export const InstagramConvertedShopModal: React.FC<InstagramConvertedShopModalProps> = ({
  preview,
  onClose,
  onOrderSimilarSite,
}) => {
  const [viewMode, setViewMode] = useState<'live-real-site' | 'custom-simulator'>(
    'live-real-site'
  );
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('همه محصولات');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [demoCart, setDemoCart] = useState<DemoCartItem[]>([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [checkoutDone, setCheckoutDone] = useState<boolean>(false);
  const [showCompareBanner, setShowCompareBanner] = useState<boolean>(false);

  const storefront = useMemo(() => {
    if (!preview) return null;
    return (
      CONVERTED_SHOP_STOREFRONTS[preview.shopId] ||
      CONVERTED_SHOP_STOREFRONTS['ig-demo-01']
    );
  }, [preview]);

  useEffect(() => {
    if (!preview || viewMode !== 'live-real-site') return;
    setIframeLoaded(false);
    const timer = setTimeout(() => setIframeLoaded(true), 2200);
    return () => clearTimeout(timer);
  }, [preview, viewMode]);

  if (!preview || !storefront) return null;

  const cleanLiveHost = preview.liveDemoUrl
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(/\/.*$/, '');

  const filteredProducts = storefront.products.filter((p) => {
    const catOk =
      activeCategory === 'همه محصولات' || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const qOk =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.specs.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return catOk && qOk;
  });

  const handleAddToDemoCart = (product: DemoStoreProduct) => {
    const variant = selectedVariants[product.id] || product.variants[0];
    setDemoCart((prev) => {
      const idx = prev.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedVariant === variant
      );
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product, selectedVariant: variant, qty: 1 }];
    });
    setCheckoutDone(false);
    setCartDrawerOpen(true);
  };

  const cartCount = demoCart.reduce((acc, i) => acc + i.qty, 0);
  const cartSubtotal = demoCart.reduce(
    (acc, i) => acc + i.product.priceToman * i.qty,
    0
  );
  const shippingCost = cartSubtotal >= 1500000 || cartSubtotal === 0 ? 0 : 68000;
  const cartTotal = cartSubtotal + shippingCost;
  const snappPayInstallment = Math.round(cartTotal / 4);

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[94vh] bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ================================================================= */}
        {/* TOP BROWSER BAR + VIEWPORT SWITCHER + INSTANT ORDER CTA           */}
        {/* ================================================================= */}
        <div className="bg-slate-950 text-white px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن پیش‌نمایش"
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold truncate">
                <span className="inline-flex items-center gap-1 text-emerald-400 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>سایت زنده:</span>
                </span>
                <span className="truncate">{preview.brandName}</span>
                <span className="hidden lg:inline px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 text-[10px] font-bold truncate">
                  {storefront.niche}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 truncate">
                <span className="truncate text-slate-300">
                  {preview.liveDemoBrandLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span dir="ltr" className="font-mono text-emerald-300 shrink-0">
                  {cleanLiveHost}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher: Real Live Site (Default) vs Custom Brand Simulator */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('live-real-site')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'live-real-site'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>سایت زنده واقعی</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('custom-simulator')}
                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  viewMode === 'custom-simulator'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>با نام پیج شما</span>
              </button>
            </div>

            {/* Desktop / Mobile Switcher */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  viewport === 'desktop'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">دسکتاپ</span>
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  viewport === 'mobile'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">موبایل</span>
              </button>
            </div>

            <a
              href={preview.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="باز کردن مستقیم سایت زنده در تب جدید"
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-slate-200 inline-flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline">تب جدید</span>
            </a>

            <button
              type="button"
              onClick={() => setShowCompareBanner((prev) => !prev)}
              className="hidden lg:inline-flex px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] font-bold text-slate-200 items-center gap-1 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-300" />
              <span>مقایسه</span>
            </button>

            {onOrderSimilarSite && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOrderSimilarSite();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs cursor-pointer transition-colors"
              >
                سفارش مشابه این سایت
              </button>
            )}
          </div>
        </div>

        {/* Before vs After Strip (Toggleable) */}
        {showCompareBanner && (
          <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-bold">
                <Instagram className="w-3.5 h-3.5" />
                <span>قبل ({preview.instagramHandle}):</span>
              </span>
              <span className="text-slate-300">{preview.beforePainPoint}</span>
            </div>
            <div className="flex items-center gap-2 font-extrabold text-emerald-300">
              <span>نتیجه تبدیل به سایت: {preview.conversionBoost}</span>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* VIEW 1 (DEFAULT): DIRECT ZERO-PROXY REAL LIVE IRANIAN WEBSITE     */}
        {/* ================================================================= */}
        {viewMode === 'live-real-site' ? (
          <div className="flex-1 w-full h-full bg-slate-200/90 relative flex items-center justify-center overflow-hidden">
            {!iframeLoaded && (
              <div className="absolute bottom-4 right-4 z-20 bg-slate-950/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-xl flex items-center gap-2 text-xs font-bold pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>اتصال مستقیم به سایت زنده ({cleanLiveHost})...</span>
              </div>
            )}

            <div
              className={`h-full transition-all duration-300 flex flex-col bg-white ${
                viewport === 'mobile'
                  ? 'w-[400px] max-w-full my-2 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl'
                  : 'w-full'
              }`}
            >
              <iframe
                key={preview.liveDemoUrl}
                src={preview.liveDemoUrl}
                title={`${preview.brandName} — ${preview.liveDemoBrandLabel}`}
                onLoad={() => setIframeLoaded(true)}
                className="w-full flex-1 h-full border-0 bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        ) : (
        /* ================================================================= */
        /* VIEW 2 (OPTIONAL): CUSTOM BRAND NAME SIMULATOR                    */
        /* ================================================================= */
        <div className="flex-1 overflow-y-auto bg-slate-200/80 p-2 sm:p-4 flex justify-center">
          <div
            className={`w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 h-fit min-h-full ${
              viewport === 'mobile' ? 'max-w-[400px]' : 'max-w-full'
            }`}
          >
            {/* Storefront Announcement Bar */}
            <div
              className="px-4 py-2 text-center text-[11px] font-extrabold text-white"
              style={{ backgroundColor: storefront.accentColor }}
            >
              {storefront.announcementBar}
            </div>

            {/* Storefront Header */}
            <header className="px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-2xl text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0"
                  style={{ backgroundColor: storefront.accentColor }}
                >
                  {preview.brandName.slice(0, 1)}
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {preview.brandName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500" dir="ltr">
                    {preview.convertedDomain} · اینماد تاییدشده ✓
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`جستجو در ${preview.brandName}...`}
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setCartDrawerOpen(true)}
                  className="px-3.5 py-2 rounded-xl text-white text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  style={{ backgroundColor: storefront.accentColor }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>سبد خرید</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-white text-slate-900 font-mono text-[11px] font-black">
                    {cartCount.toLocaleString('fa-IR')}
                  </span>
                </button>
              </div>
            </header>

            {/* Storefront Hero Banner */}
            <div
              className="px-4 sm:px-8 py-7 sm:py-9 border-b border-slate-200"
              style={{ backgroundColor: storefront.secondaryBg }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-8 space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-[11px] font-extrabold text-slate-800 shadow-2xs">
                    <Sparkles
                      className="w-3.5 h-3.5"
                      style={{ color: storefront.accentColor }}
                    />
                    <span>{storefront.heroBadge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                    {storefront.heroTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                    {storefront.heroSubtitle}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-extrabold">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 inline-flex items-center gap-1">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>۴ قسط بدون سود اسنپ‌پی</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 inline-flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>پست پیشتاز و تیپاکس خودکار</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>اینماد + درگاه شاپرک و بله</span>
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <div className="text-[11px] font-bold text-slate-500">
                    مزیت کلیدی این صنف در سایت:
                  </div>
                  <div
                    className="text-sm font-black"
                    style={{ color: storefront.accentColor }}
                  >
                    {storefront.specialFeatureTitle}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    {storefront.specialFeatureValue}
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">مشتریان پیج اینستاگرام:</span>
                    <span className="font-extrabold text-slate-900">
                      {preview.followersLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-4 sm:px-8 pt-5 pb-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {storefront.categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                      activeCategory === cat
                        ? 'text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                    style={
                      activeCategory === cat
                        ? { backgroundColor: storefront.accentColor }
                        : undefined
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                روی گزینه‌های سایز/وزن/مدل و «افزودن به سبد» کلیک کنید تا زنده تست شود
              </span>
            </div>

            {/* Niche-Matched Interactive Products Grid */}
            <div
              className={`px-4 sm:px-8 py-5 grid gap-4 ${
                viewport === 'mobile'
                  ? 'grid-cols-1'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}
            >
              {filteredProducts.map((product) => {
                const chosenVariant =
                  selectedVariants[product.id] || product.variants[0];
                const installmentPrice = Math.round(product.priceToman / 4);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-slate-200 hover:border-slate-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all shadow-2xs"
                  >
                    <div>
                      {/* Clean Instant Product Visual Header (Zero External Lag) */}
                      <div
                        className="p-4 flex items-center justify-between border-b border-slate-100 relative"
                        style={{ backgroundColor: storefront.secondaryBg }}
                      >
                        <span className="text-4xl select-none" aria-hidden="true">
                          {product.emojiIcon}
                        </span>
                        <div className="text-left space-y-1">
                          {product.badge && (
                            <span
                              className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black text-white"
                              style={{ backgroundColor: storefront.accentColor }}
                            >
                              {product.badge}
                            </span>
                          )}
                          <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 space-y-2.5">
                        <div className="text-[10px] font-bold text-slate-500">
                          {product.category} · موجودی: {product.stockCount.toLocaleString('fa-IR')} عدد
                        </div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {product.specs}
                        </p>

                        {/* Interactive Niche Variant Picker */}
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] font-extrabold text-slate-500">
                            {product.variantLabel}:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {product.variants.map((v) => (
                              <button
                                key={v}
                                type="button"
                                onClick={() =>
                                  setSelectedVariants((prev) => ({
                                    ...prev,
                                    [product.id]: v,
                                  }))
                                }
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-colors ${
                                  chosenVariant === v
                                    ? 'text-white border-transparent'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                                style={
                                  chosenVariant === v
                                    ? { backgroundColor: storefront.accentColor }
                                    : undefined
                                }
                              >
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price + SnappPay + Instant Add to Cart */}
                    <div className="p-4 pt-2 border-t border-slate-100 space-y-2.5 bg-slate-50/50">
                      <div className="flex items-end justify-between">
                        <div>
                          {product.oldPriceToman && (
                            <div className="text-[10px] text-slate-400 line-through font-mono">
                              {product.oldPriceToman.toLocaleString('fa-IR')} ت
                            </div>
                          )}
                          <div className="text-sm sm:text-base font-black text-slate-900">
                            {product.priceToman.toLocaleString('fa-IR')}{' '}
                            <span className="text-[10px] font-bold text-slate-500">
                              تومان
                            </span>
                          </div>
                        </div>
                        <div className="text-left text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-lg">
                          ۴ قسط {installmentPrice.toLocaleString('fa-IR')} ت
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToDemoCart(product)}
                        className="w-full py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: storefront.accentColor }}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>افزودن به سبد خرید</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Storefront Mini Trust Footer */}
            <footer className="mt-auto px-4 sm:px-8 py-4 bg-slate-900 text-slate-300 flex flex-wrap items-center justify-between gap-3 text-[11px]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-extrabold text-white">{preview.brandName}</span>
                <span>✓ نماد اعتماد الکترونیکی (اینماد)</span>
                <span>✓ اتصال خودکار ترب و اسنپ‌پی</span>
                <span>✓ ورود پیامکی زیر ۳۰ ثانیه</span>
              </div>
              <a
                href="tel:+989197254078"
                aria-label="تماس فوری با مشاور راه‌اندازی این سایت"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>مشاوره ساخت همین سایت</span>
              </a>
            </footer>
          </div>
        </div>
        )}

        {/* ================================================================= */}
        {/* INTERACTIVE DEMO CART DRAWER (PROVES 30-SEC CHECKOUT FLOW)        */}
        {/* ================================================================= */}
        {cartDrawerOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/50 flex justify-start"
            onClick={() => setCartDrawerOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4 overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="font-black text-sm text-slate-900">
                    سبد خرید زنده ({preview.brandName})
                  </div>
                  <button
                    type="button"
                    onClick={() => setCartDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {checkoutDone ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2.5">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div className="text-sm font-black text-emerald-950">
                      سفارش تستی با موفقیت در ۲۸ ثانیه ثبت شد!
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      دقیقاً به همین سادگی مشتریان پیج اینستاگرام شما بدون نیاز به دایرکت و کارت‌به‌کارت دستی، از سایت شما خرید نقدی یا ۴ قسطه انجام می‌دهند.
                    </p>
                  </div>
                ) : demoCart.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    هنوز محصولی به سبد خرید تستی اضافه نکرده‌اید.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {demoCart.map((item) => (
                      <div
                        key={`${item.product.id}-${item.selectedVariant}`}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-extrabold text-slate-900 truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {item.selectedVariant} · تعداد: {item.qty.toLocaleString('fa-IR')}
                          </div>
                        </div>
                        <div className="font-black text-slate-900 shrink-0">
                          {(item.product.priceToman * item.qty).toLocaleString('fa-IR')} ت
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {demoCart.length > 0 && !checkoutDone && (
                <div className="pt-4 border-t border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>هزینه پست پیشتاز خودکار ۱۴۰۵:</span>
                    <span className="font-bold text-emerald-700">
                      {shippingCost === 0
                        ? 'رایگان (سفارش بالای ۱.۵ میلیون)'
                        : `${shippingCost.toLocaleString('fa-IR')} تومان`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-900">
                    <span>مبلغ قابل پرداخت:</span>
                    <span>{cartTotal.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-bold text-[11px] flex items-center justify-between">
                    <span>پرداخت ۴ قسطه اسنپ‌پی (قسط اول):</span>
                    <span className="font-black">
                      {snappPayInstallment.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutDone(true)}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>تست پرداخت آنی (ورود پیامکی OTP + شاپرک)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
