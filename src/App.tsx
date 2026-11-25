import React, { useState, useMemo, useEffect, Suspense } from 'react';
import {
  Search,
  Check,
  ArrowUpLeft,
  ShieldCheck,
  ChevronRight,
  Wrench,
  PhoneCall,
  BookOpen,
  UserPlus,
  Building2,
  Award,
  CheckCircle2,
  Globe,
  LayoutGrid,
  BadgeCheck,
  Sparkles,
  ShoppingCart,
  SlidersHorizontal,
  Upload,
  Palette,
  X,
} from 'lucide-react';
import {
  CUSTOM_DESIGN_TIERS,
  SERVICES_RATE_CARD,
  INITIAL_TRACKED_PROJECTS,
  calculateReadyPlanPriceByPages,
  SpatialKit,
  PricingTier,
  IndustryCategory,
  TrackedProject,
  CalculatorFeature,
} from './data/spatialCatalog';
import {
  CATEGORY_SHELVES,
  SHELF_TEMPLATES_BY_CATEGORY,
} from './data/megaTemplatesCatalog';
import {
  BRAND_TRUST_PARTNERS,
  OFFICIAL_GUARANTEES,
  BLOG_ARTICLES,
  BlogArticle,
} from './data/contentPagesData';
import { CategoryHorizontalShelf } from './components/CategoryHorizontalShelf';
import { ProjectTrackerSection } from './components/ProjectTrackerSection';
import { HeroShowcaseSlider } from './components/HeroShowcaseSlider';
import { TrumpCardsSection } from './components/TrumpCardsSection';
import type { CartOrderItem } from './components/ShoppingCartDrawer';
import { DomainCheckerWidget } from './components/DomainCheckerWidget';
import { SmartPackageQuiz } from './components/SmartPackageQuiz';
import {
  PashalanAiFloatingWidget,
  PashalanAiConsultantSection,
  PashalanAiActionHandlers,
} from './components/PashalanAiAssistant';
import { PRO_PLUGINS_CATALOG, ProPluginItem } from './data/pluginsCatalog';
import { PWAInstallButton, OfflineIndicator } from './components/PWAInstallBanner';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { PageSeoContentBlock } from './components/PageSeoContentBlock';
import {
  getPageSeoMetadata,
  applyDynamicSeoMetadata,
} from './utils/seoManager';

import { CostCalculatorSection } from './components/CostCalculatorSection';
import { KnowledgeFaqSection } from './components/KnowledgeFaqSection';
import { AiGrowthToolsStudio } from './components/AiGrowthToolsStudio';
import { ShoppingCartDrawer } from './components/ShoppingCartDrawer';
import { QuickOrderModal } from './components/QuickOrderModal';
import { LiveSandboxModal } from './components/LiveSandboxModal';
import { ToolsHubPage } from './components/ToolsHubPage';
import { PluginDetailPage } from './components/PluginDetailPage';
import { ContactPage } from './components/ContactPage';
import { AdminPanelModal } from './components/AdminPanelModal';
export type ActivePageView =
  | 'home'
  | 'templates'
  | 'tools'
  | 'plugin-detail'
  | 'services'
  | 'blog'
  | 'about'
  | 'contact'
  | 'auth';

export default function App() {
  // Multi-Page Navigation State
  const [activePage, setActivePage] = useState<ActivePageView>('home');
  const [selectedBlogArticle, setSelectedBlogArticle] = useState<BlogArticle | null>(
    null
  );
  const [selectedPluginSlug, setSelectedPluginSlug] = useState<string | null>(null);
  const [livePluginsList, setLivePluginsList] =
    useState<ProPluginItem[]>(PRO_PLUGINS_CATALOG);

  // Persistent Shopping Cart State (سبد خرید حرفه‌ای کارفرما)
  const [cartItems, setCartItems] = useState<CartOrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('pashalan_cart_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [pluginsRefreshNonce, setPluginsRefreshNonce] = useState<number>(0);
  const secretTapRef = React.useRef<{ count: number; lastTap: number }>({
    count: 0,
    lastTap: 0,
  });

  // Sync live plugin catalog from server (reflects Admin Panel edits on dedicated plugin pages)
  useEffect(() => {
    fetch('/api/plugins')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.plugins)) {
          setLivePluginsList(data.plugins);
        }
      })
      .catch(() => {
        setLivePluginsList(PRO_PLUGINS_CATALOG);
      });
  }, [pluginsRefreshNonce]);

  // Dedicated Home section deep-link route for unique URL + Meta SEO (/domain-checker, /ai-studio, /calculator, /tracker)
  const [activeHomeSectionRoute, setActiveHomeSectionRoute] = useState<
    null | 'domain-checker' | 'ai-studio' | 'calculator' | 'tracker'
  >(null);

  // Sync clean URL paths (/templates, /tools, /plugin/:slug, /industry/:id, /blog/:slug, /domain-checker, /ai-studio, /calculator, /tracker, /services, /about, /contact, /auth) + legacy hash redirects
  useEffect(() => {
    const syncFromLocation = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#plugin/')) {
        const slug = decodeURIComponent(hash.replace('#plugin/', '')).trim();
        if (slug) {
          window.history.replaceState(null, '', `/plugin/${encodeURIComponent(slug)}`);
          setSelectedPluginSlug(slug);
          setSelectedBlogArticle(null);
          setActiveHomeSectionRoute(null);
          setActivePage('plugin-detail');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      if (hash.startsWith('#industry/')) {
        const catId = decodeURIComponent(hash.replace('#industry/', '')).trim();
        if (CATEGORY_SHELVES.some((s) => s.id === catId)) {
          window.history.replaceState(null, '', `/industry/${encodeURIComponent(catId)}`);
          setSelectedCategory(catId as IndustryCategory);
          setSelectedBlogArticle(null);
          setSelectedPluginSlug(null);
          setActiveHomeSectionRoute(null);
          setActivePage('templates');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }

      const rawPath = (window.location.pathname || '/').replace(/\/+$/, '') || '/';

      if (rawPath === '/templates') {
        setActivePage('templates');
        setSelectedCategory('all');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath.startsWith('/industry/')) {
        const catId = decodeURIComponent(rawPath.slice('/industry/'.length)).trim();
        if (CATEGORY_SHELVES.some((s) => s.id === catId)) {
          setSelectedCategory(catId as IndustryCategory);
          setActivePage('templates');
          setSelectedBlogArticle(null);
          setSelectedPluginSlug(null);
          setActiveHomeSectionRoute(null);
          return;
        }
      }
      if (rawPath === '/tools') {
        setActivePage('tools');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath.startsWith('/plugin/')) {
        const slug = decodeURIComponent(rawPath.slice('/plugin/'.length)).trim();
        if (slug) {
          setSelectedPluginSlug(slug);
          setActivePage('plugin-detail');
          setSelectedBlogArticle(null);
          setActiveHomeSectionRoute(null);
          return;
        }
      }
      if (rawPath === '/services') {
        setActivePage('services');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath === '/blog') {
        setActivePage('blog');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath.startsWith('/blog/')) {
        const slug = decodeURIComponent(rawPath.slice('/blog/'.length)).trim();
        const found = BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug) || null;
        setActivePage('blog');
        setSelectedBlogArticle(found);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath === '/about') {
        setActivePage('about');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath === '/contact') {
        setActivePage('contact');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (rawPath === '/auth') {
        setActivePage('auth');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(null);
        return;
      }
      if (
        rawPath === '/domain-checker' ||
        rawPath === '/ai-studio' ||
        rawPath === '/calculator' ||
        rawPath === '/tracker'
      ) {
        const secKey = rawPath.slice(1) as
          | 'domain-checker'
          | 'ai-studio'
          | 'calculator'
          | 'tracker';
        setActivePage('home');
        setSelectedBlogArticle(null);
        setSelectedPluginSlug(null);
        setActiveHomeSectionRoute(secKey);
        const anchorMap = {
          'domain-checker': 'domain-check',
          'ai-studio': 'ai-studio-section',
          calculator: 'calculator-section',
          tracker: 'tracker-section',
        };
        setTimeout(() => {
          document
            .getElementById(anchorMap[secKey])
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 120);
        return;
      }

      setActivePage('home');
      setSelectedBlogArticle(null);
      setSelectedPluginSlug(null);
      setActiveHomeSectionRoute(null);
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    window.addEventListener('hashchange', syncFromLocation);
    return () => {
      window.removeEventListener('popstate', syncFromLocation);
      window.removeEventListener('hashchange', syncFromLocation);
    };
  }, []);

  const selectedPlugin = useMemo(() => {
    if (!selectedPluginSlug) return null;
    return (
      livePluginsList.find(
        (p) => p.slug === selectedPluginSlug || p.id === selectedPluginSlug
      ) ||
      PRO_PLUGINS_CATALOG.find(
        (p) => p.slug === selectedPluginSlug || p.id === selectedPluginSlug
      ) ||
      null
    );
  }, [selectedPluginSlug, livePluginsList]);

  // Hidden 3-tap trigger on Pashalan "P" Logo Emblem -> opens Super-Pro Admin Panel
  const handleSecretAdminTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    if (now - secretTapRef.current.lastTap > 1400) {
      secretTapRef.current.count = 1;
    } else {
      secretTapRef.current.count += 1;
    }
    secretTapRef.current.lastTap = now;
    if (secretTapRef.current.count >= 3) {
      secretTapRef.current.count = 0;
      setAdminOpen(true);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('pashalan_cart_v1', JSON.stringify(cartItems));
    } catch {
      // ignore storage quota errors
    }
  }, [cartItems]);

  const showCartToast = (msg: string) => {
    setCartToast(msg);
    setTimeout(() => setCartToast(null), 2600);
  };

  // Ready Plans & Custom Mode State
  const [pricingMode, setPricingMode] = useState<'ready-kit' | 'custom-agency'>(
    'ready-kit'
  );
  const [selectedPageCount, setSelectedPageCount] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Hero Interactive Category Preview State
  const [heroActiveCatId, setHeroActiveCatId] =
    useState<Exclude<IndustryCategory, 'all'>>('ecommerce-shop');

  // Modals & Interactive States
  const [customBrandName, setCustomBrandName] = useState<string>('');
  const [customBrandLogo, setCustomBrandLogo] = useState<string | null>(null);
  const [customBrandColor, setCustomBrandColor] = useState<string>('#2563EB');
  const [livePreviewKit, setLivePreviewKit] = useState<SpatialKit | null>(null);
  const [livePreviewTab, setLivePreviewTab] = useState<
    'live-site' | 'customizer-studio' | 'admin-3d' | 'specs-pricing'
  >('live-site');

  const handleBrandLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/') || file.size > 2 * 1024 * 1024) {
      showCartToast('لطفاً یک فایل تصویر معتبر (حداکثر ۲ مگابایت) انتخاب کنید.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomBrandLogo(reader.result);
        showCartToast('لوگوی برند شما روی پیش‌نمایش تمام ۱۴۰ طرح زنده اعمال شد ✓');
      }
    };
    reader.readAsDataURL(file);
  };

  // Dynamic Per-Page, Per-Section, Per-Plugin, Per-Article & Per-Industry SEO + JSON-LD Engine
  useEffect(() => {
    const activeShelf =
      selectedCategory !== 'all'
        ? CATEGORY_SHELVES.find((s) => s.id === selectedCategory)
        : null;
    const effectiveSeoPage =
      activePage === 'home' && activeHomeSectionRoute
        ? activeHomeSectionRoute
        : activePage;
    const meta = getPageSeoMetadata({
      page: effectiveSeoPage,
      plugin: selectedPlugin,
      article: selectedBlogArticle,
      industryId: activeShelf ? activeShelf.id : null,
      industryTitle: activeShelf ? activeShelf.title : null,
    });
    applyDynamicSeoMetadata(meta);
  }, [
    activePage,
    activeHomeSectionRoute,
    selectedPlugin,
    selectedBlogArticle,
    selectedCategory,
  ]);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [orderTargetKit, setOrderTargetKit] = useState<SpatialKit | null>(null);
  const [orderTargetTier, setOrderTargetTier] = useState<PricingTier | null>(null);
  const [customServiceTitle, setCustomServiceTitle] = useState<string | null>(null);
  const [customServicePrice, setCustomServicePrice] = useState<number | null>(null);

  const [trackedProjects, setTrackedProjects] = useState<TrackedProject[]>(
    INITIAL_TRACKED_PROJECTS
  );

  const [aiOpenNonce, setAiOpenNonce] = useState<number>(0);

  // Auth Interactive States

  const [authForm, setAuthForm] = useState({
    fullName: '',
    phone: '',
    companyName: '',
    projectType: 'طرح آماده (۱ تا ۱۰ صفحه با هاست و دامنه رایگان)',
  });
  const [loggedInUser, setLoggedInUser] = useState<{
    fullName: string;
    phone: string;
    companyName: string;
    walletBonusToman: number;
  } | null>(null);

  const currentReadyPriceByPages = calculateReadyPlanPriceByPages(selectedPageCount);

  const cartItemIds = useMemo(() => cartItems.map((i) => i.id), [cartItems]);
  const cartItemIdSet = useMemo(() => new Set(cartItemIds), [cartItemIds]);
  const cartTotalToman = useMemo(
    () => cartItems.reduce((sum, i) => sum + (i.priceToman || 0), 0),
    [cartItems]
  );
  const isComPackageInCart = cartItemIds.includes('special-com-20m');

  const toggleCartOrderItem = (item: CartOrderItem) => {
    setCartItems((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      if (exists) {
        showCartToast(`«${item.title}» از سبد خرید حذف شد`);
        return prev.filter((x) => x.id !== item.id);
      }
      showCartToast(`«${item.title}» به سبد خرید اضافه شد ✓`);
      return [item, ...prev];
    });
  };

  const addMultipleCartItems = (newItems: CartOrderItem[]) => {
    setCartItems((prev) => {
      const next = [...prev];
      newItems.forEach((item) => {
        if (!next.some((x) => x.id === item.id)) {
          next.unshift(item);
        }
      });
      return next;
    });
    showCartToast(
      `${newItems.length.toLocaleString('fa-IR')} مورد پیشنهادی به سبد خرید اضافه شد ✓`
    );
  };

  const toggleComPackageInCart = () => {
    toggleCartOrderItem({
      id: 'special-com-20m',
      title: 'پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان',
      categoryLabel: 'پکیج ویژه .com (قطعی)',
      priceToman: 20000000,
      freeGiftNote:
        'دامنه .com رایگان ۱ ساله + هاست ابری رایگان + اینماد، درگاه شاپرک، اسنپ‌پی و ترب',
      deliveryLabel: 'تحویل ۴۸ تا ۷۲ ساعته',
    });
  };

  const toggleKitInCart = (
    kit: SpatialKit,
    mode: 'ready-kit' | 'custom-agency'
  ) => {
    const isCustom = mode === 'custom-agency';
    toggleCartOrderItem({
      id: `kit-${kit.id}`,
      title: isCustom
        ? `طراحی اختصاصی بر اساس ${kit.title} (کد ${kit.code})`
        : `${kit.title} (کد ${kit.code} · ${selectedPageCount.toLocaleString('fa-IR')} صفحه)`,
      categoryLabel: isCustom ? 'طراحی اختصاصی (استعلام)' : 'طرح آماده زنده',
      priceToman: isCustom ? 0 : currentReadyPriceByPages,
      isInquiryOnly: isCustom,
      freeGiftNote:
        '۶ ماه هاست ابری رایگان + دامنه .ir رایگان ۱ ساله + اینماد و درگاه پرداخت',
      deliveryLabel: isCustom ? 'طبق زمان‌بندی قرارداد' : 'تحویل ۴۸ ساعته',
    });
  };

  const addCalculatorFeaturesToCart = (features: CalculatorFeature[]) => {
    setCartItems((prev) => {
      const next = [...prev];
      features.forEach((f) => {
        const cid = `calc-${f.id}`;
        if (!next.some((x) => x.id === cid)) {
          next.push({
            id: cid,
            title: f.title,
            categoryLabel: f.category === 'platform' ? 'پکیج پایه' : 'ماژول انتخابی',
            priceToman: f.priceToman,
            isInquiryOnly: f.priceToman === 0,
            freeGiftNote:
              f.id === 'plat-com-20m'
                ? 'دامنه .com رایگان + هاست رایگان'
                : f.id === 'plat-ready-kit'
                ? '۶ ماه هاست رایگان + دامنه .ir رایگان'
                : undefined,
            deliveryLabel: `${f.days} روز کاری`,
          });
        }
      });
      return next;
    });
    setCartOpen(true);
  };

  const heroFeaturedTemplates = useMemo(
    () => (SHELF_TEMPLATES_BY_CATEGORY[heroActiveCatId] || []).slice(0, 4),
    [heroActiveCatId]
  );

  const visibleCategoryShelves = useMemo(() => {
    return CATEGORY_SHELVES.filter(
      (shelf) => selectedCategory === 'all' || shelf.id === selectedCategory
    ).map((shelf) => {
      const q = searchQuery.trim().toLowerCase();
      const allItems = SHELF_TEMPLATES_BY_CATEGORY[shelf.id] || [];
      const filteredItems = !q
        ? allItems
        : allItems.filter(
            (k) =>
              k.title.toLowerCase().includes(q) ||
              k.summary.toLowerCase().includes(q) ||
              k.engineLabel.toLowerCase().includes(q) ||
              k.code.includes(q)
          );
      return { shelf, items: filteredItems };
    });
  }, [selectedCategory, searchQuery]);

  const navigateToPage = (page: ActivePageView) => {
    setActivePage(page);
    setSelectedBlogArticle(null);
    setActiveHomeSectionRoute(null);
    if (page !== 'plugin-detail') {
      setSelectedPluginSlug(null);
    }
    if (page === 'templates') {
      setSelectedCategory('all');
    }
    const pathMap: Record<ActivePageView, string> = {
      home: '/',
      templates: '/templates',
      tools: '/tools',
      'plugin-detail': '/tools',
      services: '/services',
      blog: '/blog',
      about: '/about',
      contact: '/contact',
      auth: '/auth',
    };
    const nextPath = pathMap[page] || '/';
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openHomeSectionRoute = (
    section: 'domain-checker' | 'ai-studio' | 'calculator' | 'tracker'
  ) => {
    setActivePage('home');
    setSelectedBlogArticle(null);
    setSelectedPluginSlug(null);
    setActiveHomeSectionRoute(section);
    const nextPath = `/${section}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    const anchorMap = {
      'domain-checker': 'domain-check',
      'ai-studio': 'ai-studio-section',
      calculator: 'calculator-section',
      tracker: 'tracker-section',
    };
    setTimeout(() => {
      document
        .getElementById(anchorMap[section])
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 90);
  };

  const openIndustryLanding = (catId: Exclude<IndustryCategory, 'all'>) => {
    setSelectedCategory(catId);
    setSelectedBlogArticle(null);
    setSelectedPluginSlug(null);
    setActiveHomeSectionRoute(null);
    setActivePage('templates');
    const nextPath = `/industry/${encodeURIComponent(catId)}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openPluginPage = (plugin: ProPluginItem) => {
    setSelectedPluginSlug(plugin.slug);
    setSelectedBlogArticle(null);
    setActiveHomeSectionRoute(null);
    setActivePage('plugin-detail');
    const nextPath = `/plugin/${encodeURIComponent(plugin.slug)}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBlogArticle = (article: BlogArticle) => {
    setSelectedBlogArticle(article);
    setSelectedPluginSlug(null);
    setActiveHomeSectionRoute(null);
    setActivePage('blog');
    const nextPath = `/blog/${encodeURIComponent(article.slug)}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOrderForKit = (
    kit: SpatialKit,
    mode: 'ready-kit' | 'custom-agency',
    pageCountOverride?: number
  ) => {
    if (pageCountOverride) {
      setSelectedPageCount(pageCountOverride);
    }
    setLivePreviewKit(null);
    setPricingMode(mode);
    setOrderTargetKit(kit);
    setOrderTargetTier(null);
    setCustomServiceTitle(null);
    setCustomServicePrice(null);
    setOrderModalOpen(true);
  };

  const handleOpenOrderForCustomService = (title: string, basePrice: number) => {
    setOrderTargetKit(null);
    setOrderTargetTier(null);
    setCustomServiceTitle(title);
    setCustomServicePrice(basePrice);
    setOrderModalOpen(true);
  };

  const handleOrderCreated = (orderData: {
    clientName: string;
    phone: string;
    domainName: string;
    title: string;
    packageType: string;
    priceToman: number;
  }): string => {
    const newCode = `PSH-${Math.floor(4110 + Math.random() * 880)}`;
    const newTracked: TrackedProject = {
      code: newCode,
      clientName: orderData.clientName,
      projectTitle: orderData.title,
      packageType: orderData.packageType,
      startDate: '۱۴۰۵/۰۸/۰۸',
      deliveryDate:
        pricingMode === 'ready-kit' ? '۱۴۰۵/۰۸/۱۰ (۴۸ ساعته)' : '۱۴۰۵/۰۸/۲۴',
      progressPercent: 25,
      currentStage: 'ثبت دامنه رایگان .ir و تخصیص هاست ابری ۶ ماهه رایگان',
      domain: orderData.domainName,
      arvanCdnStatus: 'در حال تنظیم DNS',
      milestones: [
        {
          title: 'ثبت رایگان سفارش، دامنه .ir رایگان و هاست ۶ ماهه',
          status: 'completed',
          date: 'امروز',
        },
        {
          title: 'چیدمان صفحات انتخابی، لوگو و بارگذاری محتوا',
          status: 'in-progress',
          date: 'فردا',
        },
        {
          title: 'اتصال درگاه پرداخت، اینماد، ترب و اسنپ‌پی',
          status: 'upcoming',
          date: '۲ روز دیگر',
        },
        {
          title: 'تایید نهایی کارفرما و تسویه از طریق پرداخت امن',
          status: 'upcoming',
          date: 'تحویل قطعی',
        },
      ],
    };
    setTrackedProjects((prev) => [newTracked, ...prev]);
    return newCode;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.phone.trim()) return;
    setLoggedInUser({
      fullName: authForm.fullName.trim() || 'کارفرمای گرامی پاشالان',
      phone: authForm.phone.trim(),
      companyName: authForm.companyName.trim() || 'کسب‌وکار آنلاین',
      walletBonusToman: 1500000,
    });
  };

  const aiActionHandlers: PashalanAiActionHandlers = {
    livePlugins: livePluginsList,
    cartItemIds: cartItemIdSet,
    onToggleCartItem: toggleCartOrderItem,
    onOpenCart: () => setCartOpen(true),
    onSelectPlugin: openPluginPage,
    onNavigatePage: (page) => navigateToPage(page),
  };

  return (
    <div
      id="top-page"
      className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#F8FAFC] text-slate-900 flex flex-col pb-16"
    >
      {/* Top Fixed Header with 7 Clear Page Buttons */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-2xs">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo (Triple-Tap on 'P' Emblem opens hidden Admin Panel) */}
          <div className="text-right flex items-center gap-2.5 shrink-0">
            <div
              onClick={handleSecretAdminTap}
              className="w-9 h-9 rounded-xl bg-blue-600 text-white font-mono font-extrabold text-base flex items-center justify-center select-none cursor-pointer"
            >
              P
            </div>
            <button
              type="button"
              onClick={() => navigateToPage('home')}
              className="text-right cursor-pointer"
            >
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                پاشالان <span className="text-blue-600 font-mono text-xs">Pashalan.ir</span>
              </div>
              <span className="text-[10px] text-slate-500 font-bold block mt-0.5">
                ۱۴۰ سایت زنده · هاست ۶ ماهه و دامنه .ir رایگان
              </span>
            </button>
          </div>

          {/* Desktop Fixed Page Switcher */}
          <nav className="hidden lg:flex items-center gap-1">
            {(
              [
                { id: 'home', label: 'صفحه اصلی' },
                { id: 'templates', label: '۱۴۰ طرح زنده' },
                { id: 'tools', label: 'ابزارها و افزونه' },
                { id: 'services', label: 'خدمات و رشد' },
                { id: 'blog', label: 'مقالات و دانش' },
                { id: 'about', label: 'درباره ما' },
                { id: 'contact', label: 'تماس' },
              ] as { id: ActivePageView; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateToPage(item.id)}
                className={`px-2.5 py-2 rounded-xl text-xs font-extrabold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activePage === item.id ||
                  (item.id === 'tools' && activePage === 'plugin-detail')
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* PWA Install, Auth & Live Shopping Cart Button */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton />
            <button
              type="button"
              onClick={() => navigateToPage('auth')}
              className={`hidden sm:inline-flex px-3 py-2 rounded-xl text-xs font-bold border transition-colors items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activePage === 'auth'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-300'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 text-blue-600" />
              <span>{loggedInUser ? loggedInUser.fullName : 'ورود / ثبت‌نام'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative px-3.5 py-2 text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span>سبد خرید</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-400 text-slate-950 font-mono text-[11px] font-black tabular-nums">
                {cartItems.length.toLocaleString('fa-IR')}
              </span>
              {cartTotalToman > 0 && (
                <span className="hidden xl:inline font-mono text-[11px] text-blue-100 border-r border-white/25 pr-2 tabular-nums">
                  {(cartTotalToman / 1000000).toFixed(1)} م.ت
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Toast Feedback when Ticking Items into Cart */}
      {cartToast && (
        <div className="fixed top-20 left-4 z-50 bg-slate-900 text-white border border-emerald-400/50 rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 text-xs font-bold">
          <span className="text-emerald-400">✓</span>
          <span>{cartToast}</span>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 font-black text-[11px] cursor-pointer"
          >
            مشاهده سبد و پرداخت
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MAIN CONTENT                                                          */}
      {/* ===================================================================== */}
      <main className="flex-1 w-full overflow-x-hidden">
        {activePage === 'home' && (
          <>
            {/* 0. FULL-WIDTH TOP HERO SLIDER BANNER (Single Photos + Free Options + .com 20M Offer) */}
            <HeroShowcaseSlider
              onAddComPackageToCart={toggleComPackageInCart}
              isComPackageInCart={isComPackageInCart}
              onOpenCustomInquiry={() => {
                document
                  .getElementById('custom-design')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 0.5 REAL LIVE DOMAIN AVAILABILITY CHECKER (.com / .ir / .net / .org / .co / .shop) */}
            <section
              id="domain-check"
              className="w-full py-8 sm:py-10 bg-[#F8FAFC] border-b border-slate-200"
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6">
                <DomainCheckerWidget
                  compact
                  cartItemIds={cartItemIdSet}
                  onAddDomainPackageToCart={(item) => toggleCartOrderItem(item)}
                  onOpenToolsPage={() => navigateToPage('tools')}
                />
                <SmartPackageQuiz
                  onAddBundleToCart={addMultipleCartItems}
                  onOpenCart={() => setCartOpen(true)}
                />
              </div>
            </section>

            {/* 1. LIVE IRANIAN SHOWCASE & INSTANT BRAND TESTER */}
            <section className="w-full bg-white border-b border-slate-200 py-8 sm:py-12">
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Right Column in RTL (6 Cols): Clear Value Prop, Search & Category Pills */}
                  <div className="lg:col-span-6 space-y-5">
                    <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>
                        پلتفرم طراحی سایت و اپلیکیشن با پرداخت امن مرحله‌ای + ۱۴۰ دموی زنده
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 leading-[1.28] tracking-tight">
                      طرح آماده یا اختصاصی صنف خودتان را{' '}
                      <span className="text-blue-600">زنده تست کنید</span> و ۴۸ ساعته تحویل بگیرید
                    </h1>

                    <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                      بیش از <strong className="text-slate-900">۱۴۰ سایت کامل و زنده</strong> در ۷ دسته‌بندی مختلف (هر دسته ۲۰ طرح مجزا). قیمت طرح‌های آماده از{' '}
                      <strong className="text-blue-600">۱ صفحه (۸ میلیون) تا ۱۰ صفحه (۱۸ میلیون تومان)</strong> به همراه{' '}
                      <strong className="text-emerald-700">
                        ۶ ماه هاست ابری رایگان + دامنه .ir رایگان یک‌ساله
                      </strong>.
                    </p>

                    {/* Instant Live Brand Name + Logo Upload + Brand Color Picker */}
                    <div className="p-2.5 rounded-2xl bg-[#11141E] border border-emerald-500/40 space-y-2.5 shadow-md">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-400 mr-1 shrink-0" />
                        <input
                          type="text"
                          value={customBrandName}
                          onChange={(e) => setCustomBrandName(e.target.value)}
                          placeholder="نام برند یا شرکت خود را بنویسید تا روی تمام ۱۴۰ سایت زنده اعمال شود..."
                          className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none"
                        />
                        {customBrandName && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 font-black text-[11px] shrink-0">
                            اعمال شد ✓
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-[11px]">
                        <div className="flex items-center gap-2">
                          <label className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-300 font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {customBrandLogo ? 'تغییر لوگوی برند' : 'آپلود لوگوی خودتان'}
                            </span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/svg+xml"
                              onChange={handleBrandLogoUpload}
                              className="hidden"
                            />
                          </label>
                          {customBrandLogo && (
                            <button
                              type="button"
                              onClick={() => setCustomBrandLogo(null)}
                              className="px-2 py-1 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 font-bold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                              <span>حذف لوگو</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400">رنگ برند:</span>
                          {['#2563EB', '#10B981', '#EF394E', '#D97706', '#7C3AED'].map(
                            (hex) => (
                              <button
                                key={hex}
                                type="button"
                                onClick={() => setCustomBrandColor(hex)}
                                aria-label={`انتخاب رنگ ${hex}`}
                                style={{ backgroundColor: hex }}
                                className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                                  customBrandColor === hex
                                    ? 'ring-2 ring-white scale-110'
                                    : 'opacity-75 hover:opacity-100'
                                }`}
                              />
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Instant Search Bar */}
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded-2xl flex items-center gap-2 shadow-2xs">
                      <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="جستجو در بین ۱۴۰ طرح (مثلاً: موبایل، کلینیک، طلا، املاک، رستوران، وکالت...)"
                        className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 focus:outline-none"
                      />
                      <a
                        href="#category-shelves"
                        className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shrink-0 transition-colors"
                      >
                        مشاهده ۱۴۰ طرح
                      </a>
                    </div>

                    {/* Quick Category Switcher Buttons */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 block">
                        انتخاب سریع دسته‌بندی (هر دسته ۲۰ سایت زنده ایرانی دارد):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {CATEGORY_SHELVES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setHeroActiveCatId(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              heroActiveCatId === cat.id
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {cat.title.split('،')[0]} (۲۰ طرح)
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Left Column in RTL (6 Cols): Exact pashalan.com/web-design Live Iranian Showcase Grid */}
                  <div className="lg:col-span-6 bg-[#0B0E17] rounded-3xl p-4 sm:p-5 border border-slate-800 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between text-xs text-white px-1">
                      <span className="font-extrabold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                        <span>
                          ۴ نمونه سایت زنده ایرانی از ۲۰ طرحِ این دسته (کلیک = لایو سایت):
                        </span>
                      </span>
                      <a
                        href="#category-shelves"
                        className="text-emerald-400 hover:underline font-bold shrink-0"
                      >
                        دیدن هر ۲۰ طرح ←
                      </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {heroFeaturedTemplates.map((item) => {
                        const liveUrl =
                          item.liveReferenceUrl || item.realExternalDemoUrl;
                        const cleanHost = liveUrl
                          .replace(/^https?:\/\/(www\.)?/, '')
                          .replace(/\/$/, '');
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              setLivePreviewTab('live-site');
                              setLivePreviewKit(item);
                            }}
                            className="group relative rounded-2xl overflow-hidden border border-white/15 hover:border-emerald-400 bg-[#141824] p-2 cursor-pointer transition-all flex flex-col justify-between"
                          >
                            {/* Top Browser Bar */}
                            <div className="flex items-center justify-between gap-1 px-2 py-1 rounded-t-xl bg-[#181D2C] border border-b-0 border-white/10 text-[9.5px]">
                              <span className="font-mono font-bold text-emerald-400 shrink-0">
                                IRAN LIVE
                              </span>
                              <span
                                dir="ltr"
                                className="px-2 py-0.5 rounded bg-black/60 text-emerald-300 font-mono truncate flex items-center gap-1"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                {cleanHost}
                              </span>
                              <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-amber-300 hover:underline font-bold shrink-0"
                              >
                                لینک ↗
                              </a>
                            </div>

                            <div className="relative aspect-[16/9] rounded-b-xl overflow-hidden border border-white/10 bg-[#0A0E17]">
                              <img
                                src={item.image}
                                alt={item.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#060911]/75 to-[#060911]/35 p-2 flex flex-col justify-between">
                                {/* Mini Website Top Navbar */}
                                <div className="flex items-center justify-between bg-white/95 text-slate-900 rounded-lg px-2 py-1 shadow">
                                  <div className="flex items-center gap-1 min-w-0">
                                    {customBrandLogo ? (
                                      <img
                                        src={customBrandLogo}
                                        alt={customBrandName || item.title}
                                        className="w-4 h-4 rounded object-contain bg-white shrink-0"
                                      />
                                    ) : (
                                      <span
                                        style={{
                                          backgroundColor:
                                            customBrandColor ||
                                            item.sandboxTheme.accent,
                                        }}
                                        className="w-3.5 h-3.5 rounded text-white text-[8px] font-black flex items-center justify-center shrink-0"
                                      >
                                        {(
                                          customBrandName.trim() || item.title
                                        ).slice(0, 1)}
                                      </span>
                                    )}
                                    <span className="text-[9px] font-black truncate">
                                      {customBrandName.trim() ||
                                        item.title
                                          .split('—')[0]
                                          .split('،')[0]
                                          .trim()}
                                    </span>
                                  </div>
                                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-extrabold shrink-0">
                                    {item.referenceBrandFa || cleanHost}
                                  </span>
                                </div>

                                <div className="space-y-1">
                                  <h3 className="text-[11px] font-extrabold text-white line-clamp-1">
                                    {customBrandName.trim()
                                      ? `${customBrandName.trim()} — ${item.title}`
                                      : item.title}
                                  </h3>
                                  <div className="grid grid-cols-2 gap-1">
                                    {item.sandboxTheme.items
                                      .slice(0, 2)
                                      .map((subIt) => (
                                        <div
                                          key={subIt.id}
                                          className="bg-white/95 text-slate-900 rounded px-1.5 py-0.5 flex items-center justify-between gap-1 text-[8.5px]"
                                        >
                                          <span className="font-bold truncate">
                                            {subIt.name}
                                          </span>
                                          <span className="font-mono font-black text-emerald-700 shrink-0">
                                            {(
                                              subIt.priceToman / 1000000
                                            ).toFixed(1)}
                                            M
                                          </span>
                                        </div>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-3 gap-1 text-[9.5px] pt-0.5">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLivePreviewTab('live-site');
                                        setLivePreviewKit(item);
                                      }}
                                      className="py-1 px-1 rounded-lg bg-emerald-400 text-slate-950 font-black cursor-pointer truncate"
                                    >
                                      سایت زنده
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLivePreviewTab('admin-3d');
                                        setLivePreviewKit(item);
                                      }}
                                      className="py-1 px-1 rounded-lg bg-purple-500/80 text-white font-bold cursor-pointer truncate"
                                    >
                                      پنل 3D
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setLivePreviewTab('customizer-studio');
                                        setLivePreviewKit(item);
                                      }}
                                      className="py-1 px-1 rounded-lg bg-amber-400 text-slate-950 font-black cursor-pointer truncate"
                                    >
                                      شخصی‌سازی
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 px-1">
                      <span>
                        همه طرح‌ها شامل <strong className="text-emerald-400">۶ ماه هاست رایگان</strong> +{' '}
                        <strong className="text-amber-300">دامنه .ir رایگان</strong> هستند.
                      </span>
                      <button
                        type="button"
                        onClick={() => setOrderModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer"
                      >
                        مشاوره و ثبت سفارش رایگان
                      </button>
                    </div>
                  </div>
                </div>

                {/* 4 Official Trust Guarantees Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {OFFICIAL_GUARANTEES.map((g) => (
                    <div
                      key={g.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3"
                    >
                      <BadgeCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {g.title}
                        </h2>
                        <span className="text-[11px] font-bold text-emerald-700 block mt-0.5">
                          {g.codeOrLicense}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 1.5 TRUMP CARDS: Free Options + .com 20M + 5s Brand Logo Share + Speed/Loss Calc + Before/After + Contract */}
            <TrumpCardsSection
              customBrandName={customBrandName}
              onChangeCustomBrand={setCustomBrandName}
              isComPackageInCart={isComPackageInCart}
              onToggleComPackage={toggleComPackageInCart}
              onOpenCustomInquiry={() => {
                document
                  .getElementById('custom-design')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2. SEPARATE HORIZONTAL SHELVES FOR EACH CATEGORY (7 Categories × 20 Templates = 140 Live Templates) */}
            <section
              id="category-shelves"
              className="w-full py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200"
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
                {/* Sticky Price & Category Filter Control Bar */}
                <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 shadow-xs space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center pb-4 border-b border-slate-100">
                    <div className="lg:col-span-5">
                      <h2 className="text-base sm:text-xl font-extrabold text-slate-900">
                        تنظیم تعداد صفحات طرح آماده (۱ تا ۱۰ صفحه: ۸ تا ۱۸ میلیون تومان)
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        با تغییر تعداد صفحات، قیمت تمام ۱۴۰ طرح زیر به صورت لحظه‌ای بروزرسانی می‌شود.
                      </p>
                    </div>

                    <div className="lg:col-span-4 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-700">تعداد صفحات انتخابی:</span>
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-mono">
                          {selectedPageCount.toLocaleString('fa-IR')} صفحه کامل
                        </span>
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={selectedPageCount}
                        onChange={(e) => setSelectedPageCount(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>۱ صفحه (۸ میلیون)</span>
                        <span>۵ صفحه (۱۲.۵ میلیون)</span>
                        <span>۱۰ صفحه (۱۸ میلیون)</span>
                      </div>
                    </div>

                    <div className="lg:col-span-3 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-bold text-emerald-900 block">
                          تعرفه طرح آماده ({selectedPageCount.toLocaleString('fa-IR')} صفحه):
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          + هاست ۶ ماهه و دامنه .ir رایگان
                        </span>
                      </div>
                      <span className="text-base sm:text-lg font-mono font-extrabold text-blue-600">
                        {currentReadyPriceByPages.toLocaleString('fa-IR')} ت
                      </span>
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                          selectedCategory === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        نمایش همه ۷ دسته‌بندی (۱۴۰ طرح زنده)
                      </button>
                      {CATEGORY_SHELVES.map((shelf) => (
                        <button
                          key={shelf.id}
                          type="button"
                          onClick={() => setSelectedCategory(shelf.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            selectedCategory === shelf.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {shelf.title.split('،')[0]} (۲۰)
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setPricingMode('ready-kit')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          pricingMode === 'ready-kit'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        قیمت طرح آماده
                      </button>
                      <button
                        type="button"
                        onClick={() => setPricingMode('custom-agency')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          pricingMode === 'custom-agency'
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        قیمت اختصاصی
                      </button>
                    </div>
                  </div>
                </div>

                {/* Render Separate Horizontal Row for Each Category (هر دسته‌بندی یک ردیف افقی مجزا با ۲۰ طرح) */}
                <div className="space-y-8">
                  {visibleCategoryShelves.map(({ shelf, items }) =>
                    items.length > 0 ? (
                      <CategoryHorizontalShelf
                        key={shelf.id}
                        shelf={shelf}
                        templates={items}
                        selectedPageCount={selectedPageCount}
                        pricingMode={pricingMode}
                        customBrandName={customBrandName}
                        cartItemIds={cartItemIds}
                        onToggleCartKit={toggleKitInCart}
                        onOpenFullScreen={(k, tab) => {
                          setLivePreviewTab(tab || 'live-site');
                          setLivePreviewKit(k);
                        }}
                        onOrderKit={(k, mode) =>
                          handleOpenOrderForKit(k, mode, selectedPageCount)
                        }
                      />
                    ) : null
                  )}
                </div>
              </div>
            </section>

            {/* 3. CUSTOM WEBSITE & MOBILE APP SECTION (استعلام قیمت طبق خواسته‌های شما) */}
            <section
              id="custom-design"
              className="w-full py-14 sm:py-18 bg-white border-b border-slate-200"
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                  <div className="max-w-3xl space-y-1.5">
                    <span className="text-xs font-bold text-blue-600">
                      طراحی اختصاصی صفر تا صد در Figma + کدنویسی اختصاصی
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                      طراحی سایت اختصاصی و اپلیکیشن موبایل (استعلام قیمت طبق خواسته‌های شما)
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600">
                      برای پروژه‌های اختصاصی هیچ قیمت حدسی یا اضافه اعلام نمی‌کنیم؛ امکانات و خواسته‌های خودتان را تیک بزنید یا استعلام بگیرید تا پیش‌فاکتور دقیق و زمان‌بندی رسمی دریافت کنید.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {CUSTOM_DESIGN_TIERS.map((customTier) => {
                    const isHighlighted = Boolean(customTier.highlighted);
                    const inCart = cartItemIds.includes(`custom-${customTier.id}`);
                    return (
                      <div
                        key={customTier.id}
                        className={`rounded-3xl p-6 flex flex-col justify-between border ${
                          isHighlighted
                            ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
                            : 'bg-slate-50 text-slate-900 border-slate-200'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`px-2.5 py-1 rounded-lg font-bold ${
                                isHighlighted
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {customTier.badge}
                            </span>
                            <span className="font-mono opacity-80">
                              تحویل: {customTier.timeline}
                            </span>
                          </div>
                          <h3 className="text-lg font-extrabold">{customTier.title}</h3>
                          <div className="text-base sm:text-lg font-extrabold text-amber-500">
                            {customTier.priceRangeLabel}
                          </div>
                          <p className="text-xs opacity-85 leading-relaxed">
                            {customTier.summary}
                          </p>
                          <ul className="space-y-2 text-xs pt-1">
                            {(customTier.deliverables || []).map((d) => (
                              <li key={d} className="flex items-start gap-2">
                                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 space-y-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleCartOrderItem({
                                id: `custom-${customTier.id}`,
                                title: customTier.title,
                                categoryLabel: 'سایت اختصاصی (استعلام قیمت)',
                                priceToman: 0,
                                isInquiryOnly: true,
                                freeGiftNote:
                                  'مشاوره و برآورد دقیق رایگان + قرارداد رسمی مرحله‌ای',
                                deliveryLabel: customTier.timeline,
                              })
                            }
                            className={`w-full py-3 rounded-xl text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                              inCart
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                          >
                            {inCart ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <ShoppingCart className="w-4 h-4" />
                            )}
                            <span>
                              {inCart
                                ? 'درخواست استعلام در سبد شما ثبت شد ✓'
                                : 'تیک بزن و به سبد استعلام قیمت اضافه کن'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleOpenOrderForCustomService(
                                `استعلام قیمت اختصاصی: ${customTier.title}`,
                                0
                              )
                            }
                            className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              isHighlighted
                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            ثبت سریع مشخصات و دریافت تماس کارشناس
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 4. ONGOING SERVICES & SUPPORT RATE CARD SECTION (با قابلیت تیک زدن در سبد خرید) */}
            <section
              id="services-rates"
              className="w-full py-14 sm:py-18 bg-[#F8FAFC] border-b border-slate-200"
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600">
                      خدمات فنی، نگهداری، سئو و تولید محتوا (هر مورد را تیک بزنید وارد سبد می‌شود)
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      تعرفه خدمات پشتیبانی، سئو مستمر، تولید محتوا و بازطراحی
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateToPage('services')}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-800 cursor-pointer self-start"
                  >
                    مشاهده صفحه کامل خدمات ←
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SERVICES_RATE_CARD.map((srv) => {
                    const inCart = cartItemIds.includes(`srv-${srv.id}`);
                    return (
                      <div
                        key={srv.id}
                        className={`bg-white border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-2xs transition-colors ${
                          inCart ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-blue-700">
                              {srv.categoryBadge}
                            </span>
                            <span className="text-slate-400">{srv.billingCycle}</span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900">
                            {srv.title}
                          </h3>
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <span className="text-xs text-slate-500">تعرفه پیشنهادی:</span>
                            <span className="text-sm font-mono font-extrabold text-blue-600 tabular-nums">
                              {srv.priceRangeLabel}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {srv.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            toggleCartOrderItem({
                              id: `srv-${srv.id}`,
                              title: `خدمات: ${srv.title}`,
                              categoryLabel: srv.billingCycle,
                              priceToman: srv.baseOrderPriceToman,
                              freeGiftNote: 'شامل گزارش ماهانه شفاف و قرارداد رسمی',
                              deliveryLabel: srv.billingCycle,
                            })
                          }
                          className={`w-full py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors flex items-center justify-center gap-1.5 ${
                            inCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-900 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {inCart ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                          <span>
                            {inCart
                              ? 'تیک خورده در سبد خرید شما ✓'
                              : `تیک بزن و به سبد خرید اضافه کن`}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 5. BRANDS & OFFICIAL INTEGRATIONS TRUST WALL */}
            <section className="w-full py-14 bg-white border-b border-slate-200">
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-6">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center">
                  اتصال رسمی و آماده به معتبرترین سرویس‌ها و زیرساخت‌های تجارت الکترونیک ایران
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {BRAND_TRUST_PARTNERS.map((partner) => (
                    <div
                      key={partner.id}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-extrabold text-slate-900">
                          {partner.name}
                        </span>
                        <span className="text-[11px] font-bold text-blue-700">
                          {partner.verifiedStat}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {partner.integrationNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 6. COST CALCULATOR + PDF PROFORMA + PROJECT TRACKER */}
            <div id="calculator-section">
              <Suspense
                fallback={
                  <div className="py-12 text-center text-xs text-slate-500">
                    در حال بارگذاری ماشین‌حساب هوشمند تعرفه...
                  </div>
                }
              >
                <CostCalculatorSection
                  onAddAllToCart={addCalculatorFeaturesToCart}
                  onSubmitEstimate={(payload) => {
                    handleOrderCreated({
                      clientName: payload.clientName,
                      phone: payload.phone,
                      domainName: `${payload.businessName.replace(/\s+/g, '-').toLowerCase()}.ir`,
                      title: `پروژه محاسبه‌شده (${payload.selectedFeatures.length} ماژول انتخابی)`,
                      packageType:
                        payload.paymentPlan === 'installment'
                          ? 'پرداخت امن ۳ مرحله‌ای'
                          : 'پرداخت نقدی با ۸٪ تخفیف ویژه',
                      priceToman: payload.totalPriceToman,
                    });
                  }}
                />
              </Suspense>
            </div>

            <div id="tracker-section">
              <ProjectTrackerSection projects={trackedProjects} />
            </div>

            {/* 6.5 DEDICATED PASHALAN AI BUSINESS & TECHNICAL CONSULTATION STUDIO */}
            <section
              id="ai-studio-section"
              className="w-full py-12 sm:py-16 bg-white border-b border-slate-200"
            >
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
                <PashalanAiConsultantSection handlers={aiActionHandlers} />
                <Suspense
                  fallback={
                    <div className="py-10 text-center text-xs text-slate-500">
                      در حال بارگذاری استودیوی هوش مصنوعی...
                    </div>
                  }
                >
                  <AiGrowthToolsStudio
                    cartItemIds={cartItemIdSet}
                    onToggleCartItem={toggleCartOrderItem}
                    defaultBrandName={customBrandName}
                  />
                </Suspense>
                <CaseStudiesSection onSelectIndustry={openIndustryLanding} />
              </div>
            </section>

            {/* 7. DID YOU KNOW (12 FACTS) + 20 SEO ARTICLES + 12 CATEGORIZED FAQS */}
            <Suspense
              fallback={
                <div className="py-10 text-center text-xs text-slate-500">
                  در حال بارگذاری مقالات و پرسش‌وپاسخ‌ها...
                </div>
              }
            >
              <KnowledgeFaqSection
                mode="home-preview"
                onOpenArticleInBlog={openBlogArticle}
                onNavigateToBlog={() => navigateToPage('blog')}
              />
            </Suspense>

            {/* 8. HOME PAGE RICH SEO & AI-SEARCH (GEO/AEO) EDITORIAL BLOCK */}
            <section className="w-full py-10 bg-[#F8FAFC] border-t border-slate-200">
              <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8">
                <PageSeoContentBlock page="home" />
              </div>
            </section>
          </>
        )}

        {/* =================================================================== */}
        {/* PAGE 2: ALL 140 TEMPLATES PAGE                                       */}
        {/* =================================================================== */}
        {activePage === 'templates' && (
          <section className="w-full py-10 sm:py-14 bg-[#F8FAFC]">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400">
                    آرشیو کامل ۱۴۰ سایت زنده در ۷ دسته‌بندی تخصصی
                  </span>
                  <h1 className="text-xl sm:text-3xl font-extrabold">
                    کاتالوگ طرح‌های آماده (۸ تا ۱۸ میلیون تومان) + طراحی اختصاصی
                  </h1>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl">
                  <span className="text-xs">تعداد صفحات:</span>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={selectedPageCount}
                    onChange={(e) => setSelectedPageCount(Number(e.target.value))}
                    className="w-32 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {selectedPageCount.toLocaleString('fa-IR')} صفحه (
                    {currentReadyPriceByPages.toLocaleString('fa-IR')} ت)
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                {(selectedCategory === 'all'
                  ? CATEGORY_SHELVES
                  : CATEGORY_SHELVES.filter((s) => s.id === selectedCategory)
                ).map((shelf) => (
                  <CategoryHorizontalShelf
                    key={shelf.id}
                    shelf={shelf}
                    templates={SHELF_TEMPLATES_BY_CATEGORY[shelf.id]}
                    selectedPageCount={selectedPageCount}
                    pricingMode={pricingMode}
                    customBrandName={customBrandName}
                    cartItemIds={cartItemIds}
                    onToggleCartKit={toggleKitInCart}
                    onOpenFullScreen={(k, tab) => {
                      setLivePreviewTab(tab || 'live-site');
                      setLivePreviewKit(k);
                    }}
                    onOrderKit={(k, mode) =>
                      handleOpenOrderForKit(k, mode, selectedPageCount)
                    }
                  />
                ))}
              </div>
              {selectedCategory !== 'all' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      window.history.replaceState(null, '', window.location.pathname);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold cursor-pointer"
                  >
                    نمایش همه ۷ دسته‌بندی (۱۴۰ طرح زنده)
                  </button>
                </div>
              )}
              <PageSeoContentBlock page="templates" />
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* PAGE 3: SERVICES & SEO RATES PAGE                                    */}
        {/* =================================================================== */}
        {activePage === 'services' && (
          <section className="w-full py-10 sm:py-14 bg-white">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-2">
                <h1 className="text-2xl sm:text-4xl font-extrabold">
                  خدمات صفر تا ۱۰۰ راه‌اندازی، دیده‌شدن، سئو گوگل، هوش مصنوعی و رشد در پلتفرم‌ها
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  از نصب Search Console و Microsoft Clarity تا سئوی محلی (گوگل‌مپ، نشان و بلد)، سئوی هوش مصنوعی (GEO)، گوگل ادز، رپورتاژ و رشد اینستاگرام/آپارات/ترب — هر خدمتی را تیک بزنید بلافاصله وارد سبد خرید می‌شود.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES_RATE_CARD.map((service) => {
                  const inCart = cartItemIds.includes(`srv-${service.id}`);
                  return (
                    <div
                      key={service.id}
                      className={`bg-slate-50 border rounded-3xl p-6 flex flex-col justify-between space-y-5 ${
                        inCart ? 'border-emerald-500 ring-1 ring-emerald-500/30' : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-3">
                        <span className="text-xs font-bold text-blue-700 block">
                          {service.categoryBadge} · {service.billingCycle}
                        </span>
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {service.title}
                        </h2>
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                          <span className="text-xs text-slate-500">تعرفه مصوب:</span>
                          <span className="text-sm font-mono font-extrabold text-blue-600 tabular-nums">
                            {service.priceRangeLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {service.description}
                        </p>
                        <ul className="space-y-2 text-xs text-slate-700">
                          {(service.includedTasks || []).map((t) => (
                            <li key={t} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCartOrderItem({
                            id: `srv-${service.id}`,
                            title: `خدمات: ${service.title}`,
                            categoryLabel: service.billingCycle,
                            priceToman: service.baseOrderPriceToman,
                            freeGiftNote: 'شامل گزارش ماهانه شفاف و قرارداد رسمی',
                            deliveryLabel: service.billingCycle,
                          })
                        }
                        className={`w-full py-3 rounded-xl font-extrabold text-xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors ${
                          inCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {inCart ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <ShoppingCart className="w-4 h-4" />
                        )}
                        <span>
                          {inCart
                            ? 'در سبد خرید شما تیک خورده ✓'
                            : `تیک زدن و افزودن ${service.title} به سبد`}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
              <PageSeoContentBlock page="services" />
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* PAGE 4: 20 ARTICLES + DID YOU KNOW + 12 FAQS                         */}
        {/* =================================================================== */}
        {activePage === 'blog' && (
          <div className="w-full">
            {selectedBlogArticle ? (
              <section className="w-full py-10 sm:py-14 bg-[#F8FAFC]">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6">
                    <button
                      type="button"
                      onClick={() => navigateToPage('blog')}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>بازگشت به لیست {BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی</span>
                    </button>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-blue-700">
                        {selectedBlogArticle.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedBlogArticle.readTime}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedBlogArticle.publishDate}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedBlogArticle.author}</span>
                    </div>
                    <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                      {selectedBlogArticle.title}
                    </h1>
                    <img
                      src={selectedBlogArticle.image}
                      alt={selectedBlogArticle.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full rounded-2xl aspect-[16/9] object-cover"
                    />
                    <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2">
                      <div className="text-xs font-extrabold text-blue-900">
                        نکات کلیدی مقاله:
                      </div>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-800">
                        {selectedBlogArticle.keyTakeaways.map((kt) => (
                          <li key={kt} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{kt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-5">
                      {selectedBlogArticle.sections.map((sec) => (
                        <div key={sec.heading} className="space-y-2">
                          <h2 className="text-lg font-extrabold text-slate-900">
                            {sec.heading}
                          </h2>
                          <p className="text-sm text-slate-700 leading-loose">
                            {sec.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <Suspense
                fallback={
                  <div className="py-16 text-center text-xs text-slate-500">
                    در حال بارگذاری آرشیو ۲۰ مقاله تخصصی...
                  </div>
                }
              >
                <KnowledgeFaqSection
                  mode="full-blog-page"
                  onOpenArticleInBlog={openBlogArticle}
                />
              </Suspense>
            )}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 pb-10">
              <PageSeoContentBlock page="blog" />
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PAGE 5: ABOUT US PAGE                                                */}
        {/* =================================================================== */}
        {activePage === 'about' && (
          <section className="w-full py-10 sm:py-14 bg-white">
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-10">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 space-y-4">
                <h1 className="text-2xl sm:text-4xl font-extrabold">
                  درباره پلتفرم مهندسی پاشالان (Pashalan.ir)
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  پاشالان مرجع تخصصی طراحی وب‌سایت، ۱۴۰ طرح آماده زنده (با ۶ ماه هاست ابری رایگان و دامنه .ir رایگان ۱ ساله) و توسعه اختصاصی اپلیکیشن موبایل با تضمین پرداخت امن مرحله‌ای در ایران است.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {OFFICIAL_GUARANTEES.map((g) => (
                  <div
                    key={g.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2"
                  >
                    <Award className="w-7 h-7 text-blue-600" />
                    <h3 className="text-base font-extrabold text-slate-900">
                      {g.title}
                    </h3>
                    <div className="text-xs font-bold text-emerald-700">
                      {g.codeOrLicense}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {g.description}
                    </p>
                  </div>
                ))}
              </div>
              <CaseStudiesSection onSelectIndustry={openIndustryLanding} />
              <PageSeoContentBlock page="about" />
            </div>
          </section>
        )}

        {/* =================================================================== */}
        {/* PAGE 6: ULTRA-PRO CONTACT US PAGE (09197254078 + AI CONSULTANT)      */}
        {/* =================================================================== */}
        {activePage === 'contact' && (
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-bold text-slate-500">
                در حال بارگذاری صفحه تماس مستقیم و مشاوره پاشالان...
              </div>
            }
          >
            <ContactPage
              aiHandlers={aiActionHandlers}
              onOpenFloatingAi={() => setAiOpenNonce((n) => n + 1)}
            />
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 pb-10">
              <PageSeoContentBlock page="contact" />
            </div>
          </Suspense>
        )}

        {/* =================================================================== */}
        {/* PAGE 7: CLIENT AUTH & PORTAL PAGE                                    */}
        {/* =================================================================== */}
        {activePage === 'auth' && (
          <section className="w-full py-10 sm:py-14 bg-[#F8FAFC]">
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  ورود / ثبت‌نام کارفرمایان (همراه با ۱,۵۰۰,۰۰۰ تومان اعتبار هدیه)
                </h1>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={authForm.fullName}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, fullName: e.target.value })
                      }
                      placeholder="نام و نام خانوادگی *"
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs"
                    />
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={authForm.phone}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, phone: e.target.value })
                      }
                      placeholder="09123456789 *"
                      className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-xs font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs cursor-pointer"
                  >
                    فعال‌سازی پنل کارفرما و دریافت ۱.۵ میلیون هدیه
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}
        {/* =================================================================== */}
        {/* PAGE 8: DEDICATED TOOLS HUB (FREE LIVE TOOLS + 14 PLUGINS)          */}
        {/* =================================================================== */}
        {activePage === 'tools' && (
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-bold text-slate-500">
                در حال بارگذاری مرکز ابزارهای رایگان و ۱۴ افزونه تخصصی...
              </div>
            }
          >
            <ToolsHubPage
              cartItemIds={cartItemIdSet}
              onToggleCartItem={toggleCartOrderItem}
              onAddDomainPackageToCart={(item) => toggleCartOrderItem(item)}
              onAddMultipleToCart={addMultipleCartItems}
              onOpenCart={() => setCartOpen(true)}
              onSelectPlugin={openPluginPage}
              pluginsRefreshNonce={pluginsRefreshNonce}
            />
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 pb-10">
              <PageSeoContentBlock page="tools" />
            </div>
          </Suspense>
        )}

        {/* =================================================================== */}
        {/* PAGE 9: STANDALONE DEDICATED PLUGIN DETAIL PAGE (14 UNIQUE PAGES)   */}
        {/* =================================================================== */}
        {activePage === 'plugin-detail' && selectedPlugin && (
          <Suspense
            fallback={
              <div className="py-20 text-center text-xs font-bold text-slate-500">
                در حال بارگذاری صفحه اختصاصی و مشخصات فنی افزونه...
              </div>
            }
          >
            <PluginDetailPage
              key={selectedPlugin.id}
              plugin={selectedPlugin}
              allPlugins={livePluginsList}
              cartItemIds={cartItemIdSet}
              onToggleCartItem={toggleCartOrderItem}
              onOpenCart={() => setCartOpen(true)}
              onBackToTools={() => navigateToPage('tools')}
              onSelectPlugin={openPluginPage}
            />
          </Suspense>
        )}
      </main>

      {/* ===================================================================== */}
      {/* CRAWLABLE SEO DIRECTORY FOOTER (DEDICATED CLEAN LINKS FOR ALL PAGES)  */}
      {/* ===================================================================== */}
      <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 pt-10 pb-20">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="text-sm font-extrabold text-white">
              پلتفرم مهندسی پاشالان (Pashalan.ir)
            </div>
            <p className="text-slate-400 leading-relaxed">
              طراحی سایت اختصاصی و ۱۴۰ طرح زنده ایرانی با دامنه .com رایگان (پکیج ۲۰ میلیونی)، هاست ابری رایگان، ۱۴ افزونه رایگان تا VIP و پرداخت امن درگاه بله.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
              <PhoneCall className="w-4 h-4" />
              <a href="tel:09197254078" dir="ltr" className="hover:underline">
                09197254078
              </a>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-extrabold text-white">صفحات اصلی و ابزارها</div>
            <ul className="space-y-1.5">
              {[
                { href: '/', label: 'صفحه اصلی پاشالان', action: () => navigateToPage('home') },
                { href: '/templates', label: 'گالری ۱۴۰ طرح آماده زنده', action: () => navigateToPage('templates') },
                { href: '/tools', label: '۶ ابزار رایگان و ۱۴ افزونه', action: () => navigateToPage('tools') },
                { href: '/domain-checker', label: 'استعلام زنده آزاد بودن دامنه .com و .ir', action: () => openHomeSectionRoute('domain-checker') },
                { href: '/ai-studio', label: 'استودیوی هوش مصنوعی و آنالیزور رقیب', action: () => openHomeSectionRoute('ai-studio') },
                { href: '/calculator', label: 'ماشین‌حساب آنلاین تعرفه سایت', action: () => openHomeSectionRoute('calculator') },
                { href: '/tracker', label: 'پیگیری زنده سفارش (کد PSH)', action: () => openHomeSectionRoute('tracker') },
              ].map((lnk) => (
                <li key={lnk.href}>
                  <a
                    href={lnk.href}
                    onClick={(e) => {
                      e.preventDefault();
                      lnk.action();
                    }}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {lnk.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-extrabold text-white">لینک مستقیم طراحی سایت ۷ صنف</div>
            <ul className="space-y-1.5">
              {CATEGORY_SHELVES.map((shelf) => (
                <li key={shelf.id}>
                  <a
                    href={`/industry/${shelf.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      openIndustryLanding(shelf.id as Exclude<IndustryCategory, 'all'>);
                    }}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    طراحی سایت {shelf.title} (۲۰ طرح زنده)
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="text-xs font-extrabold text-white">خدمات، آموزش و نقشه سایت</div>
            <ul className="space-y-1.5">
              {[
                { href: '/services', label: 'خدمات صفر تا ۱۰۰ سئو، GEO و رشد پلتفرم‌ها', action: () => navigateToPage('services') },
                { href: '/blog', label: `${BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی + ۲۰ آیا می‌دانید و ۲۰ پرسش‌وپاسخ`, action: () => navigateToPage('blog') },
                { href: '/about', label: 'درباره پاشالان و مطالعات موردی', action: () => navigateToPage('about') },
                { href: '/contact', label: 'تماس مستقیم و رزرو مشاوره رایگان', action: () => navigateToPage('contact') },
                { href: '/auth', label: 'ورود کارفرمایان (۱.۵ میلیون هدیه)', action: () => navigateToPage('auth') },
              ].map((lnk) => (
                <li key={lnk.href}>
                  <a
                    href={lnk.href}
                    onClick={(e) => {
                      e.preventDefault();
                      lnk.action();
                    }}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {lnk.label}
                  </a>
                </li>
              ))}
              <li className="pt-1 flex flex-wrap gap-3 text-[11px] font-mono text-slate-500">
                <a href="/sitemap.xml" className="hover:text-emerald-400">sitemap.xml</a>
                <a href="/robots.txt" className="hover:text-emerald-400">robots.txt</a>
                <a href="/llms.txt" className="hover:text-emerald-400">llms.txt</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* FIXED FULL-WIDTH BOTTOM ACCESS BAR WITH TOOLS & LIVE SHOPPING CART    */}
      {/* ===================================================================== */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 bg-white border-t border-slate-200 shadow-lg">
        <div className="w-full max-w-[1440px] mx-auto h-full px-1.5 sm:px-6 grid grid-cols-7 items-center gap-1">
          {(
            [
              { id: 'home', label: 'اصلی', icon: Globe },
              { id: 'templates', label: '۱۴۰ طرح', icon: LayoutGrid },
              { id: 'tools', label: 'افزونه‌ها', icon: SlidersHorizontal },
              { id: 'services', label: 'خدمات', icon: Wrench },
              { id: 'blog', label: 'مقالات', icon: BookOpen },
              { id: 'contact', label: 'تماس', icon: PhoneCall },
            ] as { id: ActivePageView; label: string; icon: React.ElementType }[]
          ).map((btn) => {
            const IconComp = btn.icon;
            const isActive =
              activePage === btn.id ||
              (btn.id === 'tools' && activePage === 'plugin-detail');
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => navigateToPage(btn.id)}
                className={`h-11 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-extrabold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : btn.id === 'tools'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="truncate">{btn.label}</span>
              </button>
            );
          })}

          {/* Dedicated Live Shopping Cart & Payment Button in Bottom Bar */}
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs font-extrabold transition-colors cursor-pointer shadow-xs"
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span className="truncate">سبد خرید</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-300 font-mono text-[10px] font-black tabular-nums">
              {cartItems.length.toLocaleString('fa-IR')}
            </span>
          </button>
        </div>
      </nav>

      {/* Professional Shopping Cart & Checkout Drawer */}
      {cartOpen && (
        <Suspense fallback={null}>
          <ShoppingCartDrawer
            isOpen={cartOpen}
            onClose={() => setCartOpen(false)}
            items={cartItems}
            onRemoveItem={(id) =>
              setCartItems((prev) => prev.filter((item) => item.id !== id))
            }
            onClearCart={() => setCartItems([])}
            onAddComPackage={toggleComPackageInCart}
            userBonusToman={loggedInUser?.walletBonusToman || 0}
            defaultClientName={loggedInUser?.fullName || ''}
            defaultPhone={loggedInUser?.phone || ''}
            onCheckoutComplete={handleOrderCreated}
          />
        </Suspense>
      )}

      {/* Hidden Super-Pro Admin Panel (Triple-tap on header 'P' emblem) */}
      {adminOpen && (
        <Suspense fallback={null}>
          <AdminPanelModal
            isOpen={adminOpen}
            onClose={() => setAdminOpen(false)}
            onPluginsUpdated={() => setPluginsRefreshNonce((n) => n + 1)}
          />
        </Suspense>
      )}

      {/* 100% Full-Screen Live Sandbox Modal */}
      {livePreviewKit && (
        <Suspense fallback={null}>
          <LiveSandboxModal
            kit={livePreviewKit}
            initialPageCount={selectedPageCount}
            initialTab={livePreviewTab}
            customBrandFromParent={customBrandName}
            customBrandLogo={customBrandLogo}
            customBrandColor={customBrandColor}
            onChangeCustomBrand={setCustomBrandName}
            onClose={() => setLivePreviewKit(null)}
            onOrderKit={handleOpenOrderForKit}
          />
        </Suspense>
      )}

      {/* Quick Order Modal */}
      {orderModalOpen && (
        <Suspense fallback={null}>
          <QuickOrderModal
            isOpen={orderModalOpen}
            onClose={() => setOrderModalOpen(false)}
            selectedKit={orderTargetKit}
            selectedTier={orderTargetTier}
            selectedPageCount={selectedPageCount}
            customServiceTitle={customServiceTitle}
            customServicePrice={customServicePrice}
            orderMode={pricingMode}
            onOrderCreated={handleOrderCreated}
          />
        </Suspense>
      )}
      {/* Site-Wide Floating Pashalan AI Assistant */}
      <PashalanAiFloatingWidget
        handlers={aiActionHandlers}
        externalOpenNonce={aiOpenNonce}
      />
      {/* Global PWA Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}
