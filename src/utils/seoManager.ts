import { PRO_PLUGINS_CATALOG, ProPluginItem } from '../data/pluginsCatalog';
import { BLOG_ARTICLES, BlogArticle } from '../data/contentPagesData';
import { CATEGORY_SHELVES } from '../data/megaTemplatesCatalog';

export type SeoPageKey =
  | 'home'
  | 'templates'
  | 'tools'
  | 'plugin-detail'
  | 'services'
  | 'blog'
  | 'about'
  | 'contact'
  | 'auth'
  | 'domain-checker'
  | 'ai-studio'
  | 'calculator'
  | 'tracker'
  | 'hosting'
  | 'domains';

export interface PageSeoMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  jsonLd: Record<string, unknown>;
}

const SITE_ORIGIN = 'https://pashalan.ir';

function trimMeta(text: string, maxLen = 158): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLen) return normalized;
  return `${normalized.slice(0, maxLen - 1).trim()}…`;
}

export function getPageSeoMetadata(params: {
  page: string;
  plugin?: ProPluginItem | null;
  article?: BlogArticle | null;
  industryId?: string | null;
  industryTitle?: string | null;
}): PageSeoMetadata {
  const { page, plugin, article, industryId, industryTitle } = params;

  if (page === 'plugin-detail' && plugin) {
    const isFree = plugin.priceToman === 0;
    const priceIrr = plugin.priceToman * 10;
    return {
      title: `${plugin.shortName} (${isFree ? 'رایگان + VIP' : `${plugin.priceToman.toLocaleString('fa-IR')} ت`}) — پاشالان`,
      description: trimMeta(
        `${plugin.title}: ${plugin.subtitle}. نصب ${plugin.deliveryLabel} با ${plugin.warrantyLabel}، مقایسه نسخه پایه و VIP و پشتیبانی فنی پاشالان.`
      ),
      keywords: `${plugin.shortName}, ${plugin.title}, ${plugin.categoryLabel}, افزونه سایت ایرانی, ${isFree ? 'افزونه رایگان سایت' : 'افزونه حرفه‌ای سایت'}, پاشالان`,
      canonicalUrl: `${SITE_ORIGIN}/plugin/${plugin.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: plugin.title,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        softwareVersion: plugin.version,
        description: plugin.description,
        url: `${SITE_ORIGIN}/plugin/${plugin.slug}`,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: plugin.rating,
          reviewCount: String(plugin.reviewsCount),
          bestRating: '5',
        },
        offers: {
          '@type': 'Offer',
          price: String(priceIrr),
          priceCurrency: 'IRR',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'پاشالان (Pashalan.ir)',
            telephone: '+989197254078',
          },
        },
      },
    };
  }

  if (page === 'blog' && article) {
    const isoDate = article.isoDate || '2026-11-22';
    return {
      title: `${article.title} | مجله تخصصی پاشالان`,
      description: trimMeta(article.excerpt, 158),
      keywords: `${article.category}, ${article.title}, ${article.searchIntentQuery || 'آموزش طراحی سایت'}, مجله مهندسی پاشالان`,
      canonicalUrl: `${SITE_ORIGIN}/blog/${article.slug}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.excerpt,
        image: article.image.startsWith('http')
          ? article.image
          : `${SITE_ORIGIN}${article.image}`,
        datePublished: isoDate,
        dateModified: isoDate,
        inLanguage: 'fa-IR',
        author: {
          '@type': 'Person',
          name: article.author,
          jobTitle: article.authorRole,
          url: `${SITE_ORIGIN}/about`,
        },
        reviewedBy: {
          '@type': 'Organization',
          name: article.reviewedBy || 'هیئت تحریریه مهندسی پاشالان',
        },
        publisher: {
          '@type': 'Organization',
          name: 'پاشالان (Pashalan.ir)',
          logo: { '@type': 'ImageObject', url: `${SITE_ORIGIN}/pwa-512x512.png` },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_ORIGIN}/blog/${article.slug}`,
        },
      },
    };
  }

  if (page === 'templates' && industryId && industryTitle) {
    return {
      title: `طراحی سایت ${industryTitle} | ۲۰ طرح زنده ایرانی — پاشالان`,
      description: trimMeta(
        `مشاهده و تست زنده ۲۰ نمونه طراحی سایت ${industryTitle} با قابلیت بارگذاری لوگوی برند شما، ۶ ماه هاست ابری رایگان، دامنه رایگان و تحویل ۴۸ ساعته.`
      ),
      keywords: `طراحی سایت ${industryTitle}, قالب سایت ${industryTitle}, نمونه کار ${industryTitle}, سفارش سایت ${industryTitle}, پاشالان`,
      canonicalUrl: `${SITE_ORIGIN}/industry/${industryId}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `۲۰ طرح زنده طراحی سایت ${industryTitle} — پاشالان`,
        url: `${SITE_ORIGIN}/industry/${industryId}`,
        numberOfItems: 20,
        inLanguage: 'fa-IR',
      },
    };
  }

  const PAGE_MAP: Record<string, PageSeoMetadata> = {
    home: {
      title: 'طراحی سایت و اپلیکیشن | دامنه .com رایگان ۲۰ میلیونی — پاشالان',
      description:
        'سفارش طراحی سایت با ۱۴۰ طرح زنده ایرانی، پکیج ۲۰ میلیونی دامنه .com و هاست رایگان، ۱۴ افزونه رایگان تا VIP، مشاور هوش مصنوعی و پرداخت امن بله.',
      keywords:
        'طراحی سایت, طراحی سایت فروشگاهی, طراحی سایت با دامنه com رایگان, طراحی سایت ۲۰ میلیونی, ۱۴۰ طرح زنده ایرانی, مشاور هوش مصنوعی طراحی سایت, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'پاشالان — پلتفرم مهندسی طراحی سایت، ۱۴۰ طرح زنده و هوش مصنوعی',
        url: `${SITE_ORIGIN}/`,
        inLanguage: 'fa-IR',
      },
    },
    templates: {
      title: '۱۴۰ طرح آماده زنده ایرانی در ۷ صنف (۸ تا ۱۸ میلیون) — پاشالان',
      description:
        'مشاهده و تست زنده ۱۴۰ نمونه سایت ایرانی در ۷ دسته‌بندی (فروشگاهی، کلینیک، شرکتی، مد، املاک، رستوران و آموزشگاه) با تست لوگو، ۶ ماه هاست و دامنه رایگان.',
      keywords:
        'نمونه کار طراحی سایت, قالب آماده سایت ایرانی, طراحی سایت فروشگاهی, طراحی سایت کلینیک, طراحی سایت املاک, طراحی سایت شرکتی, پیش نمایش زنده سایت',
      canonicalUrl: `${SITE_ORIGIN}/templates`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'کاتالوگ ۱۴۰ طرح زنده ایرانی پاشالان',
        url: `${SITE_ORIGIN}/templates`,
        numberOfItems: 140,
      },
    },
    tools: {
      title: '۶ ابزار رایگان وب‌مستر و ۱۴ افزونه رایگان تا VIP — پاشالان',
      description:
        'استفاده از ۶ ابزار ۱۰۰٪ رایگان (استعلام دامنه، تست سرعت و امنیت، متاتگ‌ساز گوگل، محاسبه‌گر ROI) + ۱۴ افزونه تخصصی رایگان، Pro و VIP با صفحه فنی مجزا.',
      keywords:
        'استعلام آزاد بودن دامنه, تست سرعت سایت, افزونه درگاه پرداخت بله, افزونه اتصال به ترب, افزونه فروش اقساطی اسنپ پی, افزونه رایگان سایت, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/tools`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'مرکز ابزارهای رایگان و مارکت‌پلیس ۱۴ افزونه پاشالان',
        url: `${SITE_ORIGIN}/tools`,
      },
    },
    'domain-checker': {
      title: 'استعلام زنده آزاد بودن دامنه .com و .ir (رایگان) — پاشالان',
      description:
        'بررسی آنی و واقعی آزاد بودن دامنه .com، .ir، .net و .co با پروتکل RDAP و DNS زنده همراه با ثبت رایگان دامنه در پکیج‌های طراحی سایت پاشالان.',
      keywords:
        'استعلام آزاد بودن دامنه, چک کردن دامنه com, ثبت دامنه رایگان, استعلام دامنه ir, خرید دامنه بین‌المللی, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/domain-checker`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ابزار استعلام زنده آزاد بودن دامنه پاشالان',
        url: `${SITE_ORIGIN}/domain-checker`,
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IRR' },
      },
    },
    'ai-studio': {
      title: 'استودیوی هوش مصنوعی پاشالان | آنالیز رقیب و پروپوزال ۱۰ ثانیه‌ای',
      description:
        'اسکن زنده سئو و سرعت سایت رقیب، تولید پروپوزال PDF اختصاصی برند در ۱۰ ثانیه، امضای قرارداد دیجیتال آنلاین و دریافت کد معرف ۲ میلیون تومانی پاشالان.',
      keywords:
        'آنالیز سایت رقیب, تولید پروپوزال طراحی سایت هوش مصنوعی, قرارداد آنلاین طراحی سایت, کد معرف پاشالان, مشاور هوش مصنوعی سایت',
      canonicalUrl: `${SITE_ORIGIN}/ai-studio`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'استودیوی رشد و هوش مصنوعی پاشالان',
        url: `${SITE_ORIGIN}/ai-studio`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IRR' },
      },
    },
    calculator: {
      title: 'ماشین‌حساب آنلاین برآورد هزینه طراحی سایت ۱۴۰۵ — پاشالان',
      description:
        'محاسبه دقیق و شفاف هزینه طراحی سایت، فروشگاه اینترنتی و امکانات اختصاصی در ۳۰ ثانیه همراه با دریافت پیش‌فاکتور رسمی PDF و افزودن مستقیم به سبد خرید.',
      keywords:
        'محاسبه هزینه طراحی سایت, ماشین حساب قیمت سایت, تعرفه طراحی سایت ۱۴۰۵, پیش فاکتور طراحی سایت, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/calculator`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'ماشین‌حساب آنلاین برآورد قیمت طراحی سایت پاشالان',
        url: `${SITE_ORIGIN}/calculator`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'IRR' },
      },
    },
    tracker: {
      title: 'پیگیری آنلاین مراحل طراحی سایت با کد PSH — پاشالان',
      description:
        'مشاهده زنده درصد پیشرفت طراحی سایت، وضعیت ثبت دامنه رایگان، اتصال درگاه پرداخت و تاریخ تحویل قطعی پروژه خود با وارد کردن کد رهگیری PSH در پاشالان.',
      keywords:
        'پیگیری سفارش طراحی سایت, سامانه رهگیری پروژه پاشالان, کد پیگیری PSH, وضعیت تحویل سایت',
      canonicalUrl: `${SITE_ORIGIN}/tracker`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'سامانه رهگیری آنلاین پروژه‌های پاشالان',
        url: `${SITE_ORIGIN}/tracker`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
      },
    },
    services: {
      title: 'تعرفه خدمات سئو گوگل، سئو AI، پشتیبانی و امنیت ۱۴۰۵ — پاشالان',
      description:
        'تعرفه شفاف خدمات سئو گوگل و سئو هوش مصنوعی (GEO)، پشتیبانی فنی ۲۴ ساعته، افزایش سرعت PageSpeed +95، امنیت WAF و بازطراحی سایت با قرارداد رسمی.',
      keywords:
        'تعرفه سئو سایت ۱۴۰۵, پشتیبانی فنی سایت, افزایش سرعت سایت, سئو هوش مصنوعی GEO, تولید محتوای سئو شده, بازطراحی سایت',
      canonicalUrl: `${SITE_ORIGIN}/services`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'خدمات سئو، پشتیبانی و بهینه‌سازی سرعت وب‌سایت پاشالان',
        provider: { '@type': 'Organization', name: 'پاشالان (Pashalan.ir)' },
        areaServed: 'IR',
      },
    },
    blog: {
      title: '۲۰ مقاله تخصصی طراحی سایت، سئو، اینماد و فروش ۱۴۰۵ — پاشالان',
      description:
        'مطالعه ۲۰ مقاله جامع درباره هزینه طراحی سایت ۱۴۰۵، دامنه .com در برابر .ir، دریافت سریع اینماد، اتصال ترب و اسنپ‌پی، سرعت گوگل + ۱۲ پرسش‌وپاسخ کلیدی.',
      keywords:
        'مقالات طراحی سایت, آموزش سئو گوگل, هزینه طراحی سایت ۱۴۰۵, راهنمای اینماد, افزایش فروش فروشگاه اینترنتی',
      canonicalUrl: `${SITE_ORIGIN}/blog`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'آکادمی و ۲۰ مقاله تخصصی طراحی سایت پاشالان',
        url: `${SITE_ORIGIN}/blog`,
      },
    },
    about: {
      title: 'درباره پاشالان | تیم مهندسی، تضمین پرداخت امن و نمونه‌کارها',
      description:
        'آشنایی با پلتفرم مهندسی پاشالان (Pashalan.ir)، تضمین پرداخت امن مرحله‌ای، مالکیت ۱۰۰٪ دامنه و سورس‌کد، نتایج واقعی مشتریان و ۱ سال گارانتی رایگان.',
      keywords:
        'درباره پاشالان, شرکت طراحی سایت معتبر ایران, قرارداد رسمی طراحی سایت, پرداخت امانی طراحی سایت',
      canonicalUrl: `${SITE_ORIGIN}/about`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'درباره پلتفرم مهندسی پاشالان',
        url: `${SITE_ORIGIN}/about`,
      },
    },
    contact: {
      title: 'تماس مستقیم با پاشالان | مشاوره رایگان و سفارش آنلاین سایت',
      description:
        'ارتباط مستقیم تلفنی، واتساپ و رزرو رایگان زمان تماس با تیم فنی و فروش پاشالان (پاسخگویی زیر ۱۵ دقیقه)، چت هوش مصنوعی ۲۴ ساعته و قرارداد رسمی.',
      keywords:
        'تماس با پاشالان, مشاوره رایگان طراحی سایت, سفارش آنلاین سایت, استعلام قیمت طراحی سایت',
      canonicalUrl: `${SITE_ORIGIN}/contact`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'صفحه تماس مستقیم و مشاوره پاشالان',
        url: `${SITE_ORIGIN}/contact`,
        mainEntity: {
          '@type': 'Organization',
          name: 'پاشالان (Pashalan.ir)',
          telephone: '+989197254078',
        },
      },
    },
    auth: {
      title: 'ورود و ثبت‌نام کارفرمایان (۱.۵ میلیون هدیه) — پاشالان',
      description:
        'عضویت سریع در پنل کارفرمایان پاشالان جهت دریافت ۱,۵۰۰,۰۰۰ تومان اعتبار هدیه، پیگیری آنلاین پروژه، امضای قرارداد دیجیتال و دریافت کد معرف ۲ میلیونی.',
      keywords: 'پنل کارفرما پاشالان, ثبت نام سفارش سایت, کد معرف پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/auth`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'پنل کارفرمایان پاشالان',
        url: `${SITE_ORIGIN}/auth`,
      },
    },
    hosting: {
      title: 'خرید هاست ابری NVMe ایران و آلمان (شروع از ۱۲۹ هزار تومان) — پاشالان',
      description:
        'فروش هاست ابری NVMe، هاست وردپرس و فروشگاهی LiteSpeed، هاست Node.js، سرور ابری VPS ایران و آلمان هتزنر و ایمیل سازمانی با SSL رایگان و مهاجرت بدون قطعی.',
      keywords:
        'خرید هاست ابری NVMe, هاست فروشگاهی پرسرعت, هاست ایران پینگ پایین, هاست آلمان هتزنر, سرور مجازی VPS ابری, هاست Node.js, ایمیل سازمانی, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/hosting`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'سرویس‌های هاست ابری NVMe و سرور مجازی پاشالان',
        url: `${SITE_ORIGIN}/hosting`,
        provider: {
          '@type': 'Organization',
          name: 'پاشالان (Pashalan.ir)',
          telephone: '+989197254078',
        },
        areaServed: ['IR', 'DE', 'NL'],
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '1290000',
          highPrice: '15900000',
          priceCurrency: 'IRR',
          offerCount: '12',
        },
      },
    },
    domains: {
      title: 'خرید و ثبت آنلاین دامنه .ir، .com، .shop و .ai با مالکیت ۱۰۰٪ — پاشالان',
      description:
        'استعلام زنده و ثبت فوری دامنه .ir (۱۷۸ هزار ت)، .com، .shop، .net، .org، .co و .ai به نام خودتان در پنل ایرنیک و بین‌المللی با قفل امنیتی و تنظیم رایگان DNS.',
      keywords:
        'خرید دامنه ir, ثبت دامنه com ارزان, فروش دامنه بین‌المللی, ثبت دامنه shop و ai, استعلام آزاد بودن دامنه آنلاین, انتقال دامنه, پاشالان',
      canonicalUrl: `${SITE_ORIGIN}/domains`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'ثبت آنلاین و فروش دامنه ملی و بین‌المللی پاشالان',
        url: `${SITE_ORIGIN}/domains`,
        provider: {
          '@type': 'Organization',
          name: 'پاشالان (Pashalan.ir)',
          telephone: '+989197254078',
        },
        offers: {
          '@type': 'AggregateOffer',
          lowPrice: '1780000',
          highPrice: '257250000',
          priceCurrency: 'IRR',
          offerCount: '10',
        },
      },
    },
  };

  return PAGE_MAP[page] || PAGE_MAP.home;
}

/**
 * Resolves any clean URL pathname (e.g. /plugin/..., /blog/..., /industry/..., /domain-checker)
 * to its exact PageSeoMetadata. Used by BOTH Express SSR meta injection and client routing.
 */
export function resolveSeoForPathname(rawPathname: string): PageSeoMetadata {
  const cleanPath = (rawPathname || '/').split('?')[0].split('#')[0].replace(/\/+$/, '') || '/';

  if (cleanPath === '/') return getPageSeoMetadata({ page: 'home' });
  if (cleanPath === '/templates') return getPageSeoMetadata({ page: 'templates' });
  if (cleanPath === '/tools') return getPageSeoMetadata({ page: 'tools' });
  if (cleanPath === '/services') return getPageSeoMetadata({ page: 'services' });
  if (cleanPath === '/blog') return getPageSeoMetadata({ page: 'blog' });
  if (cleanPath === '/about') return getPageSeoMetadata({ page: 'about' });
  if (cleanPath === '/contact') return getPageSeoMetadata({ page: 'contact' });
  if (cleanPath === '/auth') return getPageSeoMetadata({ page: 'auth' });
  if (cleanPath === '/domain-checker') return getPageSeoMetadata({ page: 'domain-checker' });
  if (cleanPath === '/ai-studio') return getPageSeoMetadata({ page: 'ai-studio' });
  if (cleanPath === '/calculator') return getPageSeoMetadata({ page: 'calculator' });
  if (cleanPath === '/tracker') return getPageSeoMetadata({ page: 'tracker' });
  if (cleanPath === '/hosting' || cleanPath === '/domains') {
    return getPageSeoMetadata({ page: 'home' });
  }

  if (cleanPath.startsWith('/plugin/')) {
    const slug = decodeURIComponent(cleanPath.slice('/plugin/'.length)).trim();
    const plugin = PRO_PLUGINS_CATALOG.find((p) => p.slug === slug || p.id === slug);
    if (plugin) return getPageSeoMetadata({ page: 'plugin-detail', plugin });
    return getPageSeoMetadata({ page: 'tools' });
  }

  if (cleanPath.startsWith('/blog/')) {
    const slug = decodeURIComponent(cleanPath.slice('/blog/'.length)).trim();
    const article = BLOG_ARTICLES.find((a) => a.slug === slug || a.id === slug);
    if (article) return getPageSeoMetadata({ page: 'blog', article });
    return getPageSeoMetadata({ page: 'blog' });
  }

  if (cleanPath.startsWith('/industry/')) {
    const catId = decodeURIComponent(cleanPath.slice('/industry/'.length)).trim();
    const shelf = CATEGORY_SHELVES.find((s) => s.id === catId);
    if (shelf) {
      return getPageSeoMetadata({
        page: 'templates',
        industryId: shelf.id,
        industryTitle: shelf.title,
      });
    }
    return getPageSeoMetadata({ page: 'templates' });
  }

  return getPageSeoMetadata({ page: 'home' });
}

export function applyDynamicSeoMetadata(meta: PageSeoMetadata): void {
  if (typeof document === 'undefined') return;
  document.title = meta.title;

  const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  setMeta('name', 'description', meta.description);
  setMeta('name', 'keywords', meta.keywords);
  setMeta('property', 'og:title', meta.title);
  setMeta('property', 'og:description', meta.description);
  setMeta('property', 'og:url', meta.canonicalUrl);
  setMeta('name', 'twitter:title', meta.title);
  setMeta('name', 'twitter:description', meta.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', meta.canonicalUrl);

  const scriptId = 'pashalan-dynamic-jsonld';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(meta.jsonLd);
}
