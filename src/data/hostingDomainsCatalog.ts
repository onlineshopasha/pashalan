export type HostingCategoryId =
  | 'cloud-nvme'
  | 'nodejs-dev'
  | 'cloud-vps'
  | 'email-reseller';

export type DatacenterId = 'iran-tehran' | 'germany-hetzner' | 'netherlands-ams';

export type BillingCycleId = 'monthly' | 'annual' | 'biennial';

export interface HostingPlanSpec {
  storage: string;
  cpu: string;
  ram: string;
  bandwidth: string;
  domainsAllowed: string;
  backup: string;
  webServer: string;
}

export interface HostingPlanItem {
  id: string;
  category: HostingCategoryId;
  name: string;
  englishName: string;
  tagline: string;
  recommended?: boolean;
  monthlyPriceToman: number;
  freeDomainOnAnnual?: string;
  specs: HostingPlanSpec;
  highlights: string[];
  bestFor: string;
}

export interface HostingAddonItem {
  id: string;
  title: string;
  description: string;
  monthlyPriceToman: number;
  oneTime?: boolean;
}

export interface DomainTldItem {
  tld: string;
  label: string;
  register1YrToman: number;
  register5YrToman?: number;
  renew1YrToman: number;
  transferToman: number;
  popular?: boolean;
  whoisPrivacyFree: boolean;
  registryNote: string;
  bestFor: string;
}

export interface DatacenterOption {
  id: DatacenterId;
  name: string;
  location: string;
  pingLabel: string;
  trafficNote: string;
  priceMultiplier: number; // 1 = base, 1.08 = EU slight diff
  highlights: string[];
}

export interface HostingFaqItem {
  q: string;
  a: string;
}

export const BILLING_CYCLES: {
  id: BillingCycleId;
  label: string;
  discountPercent: number;
  months: number;
  note: string;
}[] = [
  {
    id: 'monthly',
    label: 'ماهانه',
    discountPercent: 0,
    months: 1,
    note: 'بدون تعهد بلندمدت',
  },
  {
    id: 'annual',
    label: 'سالانه (۲۰٪ تخفیف)',
    discountPercent: 20,
    months: 12,
    note: '۲ ماه رایگان + دامنه هدیه روی پلن‌های منتخب',
  },
  {
    id: 'biennial',
    label: 'دوساله (۳۰٪ تخفیف)',
    discountPercent: 30,
    months: 24,
    note: 'بیشترین صرفه‌جویی + تثبیت نرخ ۲ ساله',
  },
];

export const DATACENTER_OPTIONS: DatacenterOption[] = [
  {
    id: 'iran-tehran',
    name: 'دیتاسنتر ایران (تهران)',
    location: 'آسیاتک / افرانت Tier-III',
    pingLabel: 'پینگ داخلی ~۸ میلی‌ثانیه',
    trafficNote: 'ترافیک نیم‌بها برای کاربران ایران · مناسب اینماد و فروشگاه',
    priceMultiplier: 1,
    highlights: [
      'بالاترین سرعت باز شدن سایت در اینترنت ایران',
      'تایید سریع‌تر درگاه بانکی شاپرک و اینماد',
      'فایروال سخت‌افزاری ضدحمله DDoS داخلی',
    ],
  },
  {
    id: 'germany-hetzner',
    name: 'دیتاسنتر آلمان (هتزنر)',
    location: 'Falkenstein · Hetzner Cloud',
    pingLabel: 'پینگ اروپا ~۴۵ میلی‌ثانیه',
    trafficNote: 'بدون محدودیت APIهای جهانی (گوگل، هوش مصنوعی، ایمیل)',
    priceMultiplier: 1.05,
    highlights: [
      'پایداری ۹۹.۹۹٪ روی سرورهای Enterprise NVMe Gen4',
      'خزش فوق‌سریع ربات‌های گوگل و موتورهای AI',
      'مناسب سایت‌های صادراتی، بین‌المللی و استارتاپ‌ها',
    ],
  },
  {
    id: 'netherlands-ams',
    name: 'دیتاسنتر هلند (آمستردام)',
    location: 'Amsterdam · Equinix Hub',
    pingLabel: 'پینگ اروپا ~۴۸ میلی‌ثانیه',
    trafficNote: 'پهنای باند نامحدود ۱۰Gbps · ضد DDoS پیشرفته',
    priceMultiplier: 1.08,
    highlights: [
      'اتصال مستقیم به گره اصلی اینترنت اروپا (AMS-IX)',
      'تحویل ایمیل سازمانی با نرخ Inbox بالای ۹۹٪',
      'مناسب سایت‌های پربازدید، آموزشی و محتوایی',
    ],
  },
];

export const HOSTING_CATEGORIES: {
  id: HostingCategoryId;
  title: string;
  subtitle: string;
}[] = [
  {
    id: 'cloud-nvme',
    title: 'هاست ابری NVMe و فروشگاهی',
    subtitle: 'وب‌سرور LiteSpeed Enterprise + Redis + SSL رایگان + بکاپ دوگانه',
  },
  {
    id: 'nodejs-dev',
    title: 'هاست Node.js / React / Python',
    subtitle: 'استقرار مستقیم از Git، دسترسی SSH، دیتابیس PostgreSQL و Redis اختصاصی',
  },
  {
    id: 'cloud-vps',
    title: 'سرور ابری و مجازی (Cloud VPS)',
    subtitle: 'منابع ۱۰۰٪ اختصاصی KVM، پورت ۱۰ گیگابیت، دسترسی Root و اسنپ‌شات آنی',
  },
  {
    id: 'email-reseller',
    title: 'ایمیل سازمانی و نمایندگی هاست',
    subtitle: 'ایمیل اختصاصی برند بدون اسپم و پنل نمایندگی White-Label با سود بالا',
  },
];

export const HOSTING_PLANS: HostingPlanItem[] = [
  // 1. Cloud NVMe & E-Commerce
  {
    id: 'host-nvme-starter',
    category: 'cloud-nvme',
    name: 'هاست ابری استارتر NVMe',
    englishName: 'Cloud Starter NVMe',
    tagline: 'شروع سریع برای سایت‌های شرکتی، شخصی و لندینگ‌پیج‌ها',
    monthlyPriceToman: 129000,
    specs: {
      storage: '۵ گیگابایت NVMe Gen4',
      cpu: '۲ هسته پردازشی (۲۰۰٪)',
      ram: '۲ گیگابایت رم DDR5',
      bandwidth: 'ترافیک ماهانه نامحدود',
      domainsAllowed: '۱ دامنه اصلی + ۵ ساب‌دامین',
      backup: 'بکاپ خودکار روزانه (۷ روزه)',
      webServer: 'LiteSpeed Enterprise + HTTP/3',
    },
    highlights: [
      'گواهی SSL رایگان همیشگی با تمدید خودکار',
      'سپر ضدبدافزار Imunify360 و فایروال WAF فعال',
      'نصب خودکار وردپرس و سیستم‌های مدیریت محتوا',
      'انتقال رایگان سایت فعلی شما بدون قطعی',
    ],
    bestFor: 'وب‌سایت‌های شرکتی، رزومه، کلینیک و استارتاپ‌های تازه تاسیس',
  },
  {
    id: 'host-nvme-pro-store',
    category: 'cloud-nvme',
    name: 'هاست فروشگاهی پرو NVMe',
    englishName: 'Pro Store NVMe',
    tagline: 'پرفروش‌ترین پلن برای فروشگاه‌های آنلاین و سایت‌های در حال رشد',
    recommended: true,
    monthlyPriceToman: 269000,
    freeDomainOnAnnual: 'دامنه .ir رایگان ۱ ساله',
    specs: {
      storage: '۲۰ گیگابایت NVMe Gen4',
      cpu: '۴ هسته پردازشی (۴۰۰٪)',
      ram: '۴ گیگابایت رم DDR5',
      bandwidth: 'ترافیک ماهانه نامحدود',
      domainsAllowed: '۳ دامنه مجزا + ساب‌دامین نامحدود',
      backup: 'بکاپ روزانه روی سرور مجزا (۱۴ روزه)',
      webServer: 'LiteSpeed Enterprise + Redis Object Cache',
    },
    highlights: [
      'کش اختصاصی Redis و LSCache برای امتیاز سبز Core Web Vitals',
      'تضمین عملکرد روان در کمپین‌های فروش و اتصال ترب/اسنپ‌پی',
      'محیط تست جداگانه (Staging) برای بررسی تغییرات قبل از انتشار',
      'دامنه .ir رایگان در سفارش سالانه و دوساله',
    ],
    bestFor: 'فروشگاه‌های اینترنتی، سایت‌های خدماتی پربازدید و کلینیک‌های چندشعبه',
  },
  {
    id: 'host-nvme-turbo',
    category: 'cloud-nvme',
    name: 'هاست توربو پرترافیک',
    englishName: 'Turbo Commerce NVMe',
    tagline: 'توان پردازشی بالا برای فروشگاه‌های پرمحصول و آموزشگاه‌های آنلاین',
    monthlyPriceToman: 490000,
    freeDomainOnAnnual: 'دامنه .ir رایگان + تنظیم CDN رایگان',
    specs: {
      storage: '۵۰ گیگابایت NVMe Gen4',
      cpu: '۶ هسته پردازشی (۶۰۰٪)',
      ram: '۸ گیگابایت رم DDR5',
      bandwidth: 'ترافیک نامحدود · پورت ۱۰Gbps',
      domainsAllowed: '۱۰ دامنه مجزا + ایمیل نامحدود',
      backup: 'بکاپ دوگانه روزانه + ساعتی دیتابیس (۳۰ روزه)',
      webServer: 'LiteSpeed Enterprise + Redis + Memcached',
    },
    highlights: [
      'ایزوله‌سازی کامل منابع CloudLinux بدون تاثیرپذیری از سایت‌های دیگر',
      'بهینه‌سازی رایگان دیتابیس و کوئری‌های سنگین فروشگاه',
      'اتصال رایگان به Cloudflare یا ArvanCloud با قواعد امنیتی اختصاصی',
      'پشتیبانی فنی اولویت‌دار با زمان پاسخگویی زیر ۱۰ دقیقه',
    ],
    bestFor: 'فروشگاه‌های بالای ۵,۰۰۰ محصول، آکادمی‌های LMS و خبرگزاری‌ها',
  },
  {
    id: 'host-nvme-vip',
    category: 'cloud-nvme',
    name: 'هاست اختصاصی VIP سازمانی',
    englishName: 'Enterprise VIP Cloud',
    tagline: 'قدرت یک سرور اختصاصی بدون دردسر مدیریت لینوکس',
    monthlyPriceToman: 890000,
    freeDomainOnAnnual: 'دامنه .com یا .ir رایگان ۱ ساله',
    specs: {
      storage: '۱۲۰ گیگابایت NVMe RAID-10',
      cpu: '۸ هسته اختصاصی AMD EPYC',
      ram: '۱۶ گیگابایت رم اختصاصی DDR5',
      bandwidth: 'ترافیک نامحدود · IP اختصاصی رایگان',
      domainsAllowed: 'دامنه و اکانت ایمیل نامحدود',
      backup: 'بکاپ غیرقابل تغییر (Immutable) در ۲ دیتاسنتر',
      webServer: 'LiteSpeed Enterprise + WAF لایه ۷ اختصاصی',
    },
    highlights: [
      'تضمین کتبی آپتایم ۹۹.۹۹٪ (SLA رسمی) در قرارداد',
      'IP اختصاصی رایگان برای اعتبار بالاتر ایمیل و سئو',
      'مانیتورینگ لحظه‌ای ۲۴/۷ و مهندس دوآپس اختصاصی',
      'دامنه بین‌المللی .com رایگان در خرید سالانه و دوساله',
    ],
    bestFor: 'برندهای بزرگ، مارکت‌پلیس‌ها، هلدینگ‌ها و کمپین‌های پرترافیک',
  },

  // 2. Node.js / React / Python
  {
    id: 'host-node-dev',
    category: 'nodejs-dev',
    name: 'پلتفرم ابری Node.js استارتاپ',
    englishName: 'Node / React Starter',
    tagline: 'اجرای فوق‌سریع اپلیکیشن‌های React، Vite، Next.js و Express',
    monthlyPriceToman: 245000,
    specs: {
      storage: '۱۵ گیگابایت NVMe Gen4',
      cpu: '۲ هسته اختصاصی vCPU',
      ram: '۴ گیگابایت رم DDR5',
      bandwidth: 'ترافیک ماهانه نامحدود',
      domainsAllowed: '۳ اپلیکیشن مستقل + SSL خودکار',
      backup: 'اسنپ‌شات خودکار روزانه',
      webServer: 'Nginx Reverse Proxy + HTTP/3 + Brotli',
    },
    highlights: [
      'استقرار خودکار مستقیم از GitHub/GitLab با یک Push',
      'پشتیبانی کامل از Node 20/22، Python 3.12 و PM2 Cluster',
      'دیتابیس آماده PostgreSQL یا MongoDB + Redis داخلی',
      'دسترسی کامل SSH و متغیرهای محیطی امن (Env Vault)',
    ],
    bestFor: 'اپلیکیشن‌های اختصاصی، ربات‌های بله/تلگرام و APIهای تجاری',
  },
  {
    id: 'host-node-scale',
    category: 'nodejs-dev',
    name: 'پلتفرم ابری Full-Stack پرو',
    englishName: 'Full-Stack Scale Pro',
    tagline: 'معماری بدون قطعی برای SaaS، وب‌اپلیکیشن و سرویس‌های هوش مصنوعی',
    recommended: true,
    monthlyPriceToman: 520000,
    freeDomainOnAnnual: 'دامنه .ir رایگان + مانیتورینگ زنده',
    specs: {
      storage: '۴۵ گیگابایت NVMe RAID-10',
      cpu: '۴ هسته اختصاصی AMD EPYC',
      ram: '۸ گیگابایت رم DDR5',
      bandwidth: 'ترافیک نامحدود · پورت ۱۰Gbps',
      domainsAllowed: '۱۰ سرویس میکروسرویس + Docker',
      backup: 'بکاپ ساعتی دیتابیس + Rollback آنی',
      webServer: 'Docker / Nginx + Zero-Downtime Blue/Green',
    },
    highlights: [
      'دیپلوی بدون حتی ۱ ثانیه قطعی (Zero-Downtime Rolling Deploy)',
      'پشتیبانی کامل از WebSocket، Worker صف پردازش و Cron Job',
      'لاگ زنده و هشدار خودکار در بله/تلگرام هنگام افزایش مصرف',
      'بهینه برای سرویس‌های متصل به API هوش مصنوعی و پرداخت آنلاین',
    ],
    bestFor: 'استارتاپ‌های SaaS، پلتفرم‌های فروشگاهی مدرن و سیستم‌های رزرواسیون',
  },
  {
    id: 'host-node-cluster',
    category: 'nodejs-dev',
    name: 'کلاستر اختصاصی سازمانی DevOps',
    englishName: 'Enterprise DevOps Cluster',
    tagline: 'مقیاس‌پذیری خودکار برای ترافیک‌های سنگین و سرویس‌های حیاتی',
    monthlyPriceToman: 1190000,
    freeDomainOnAnnual: 'دامنه .com رایگان + Load Balancer',
    specs: {
      storage: '۱۵۰ گیگابایت NVMe RAID-10',
      cpu: '۸ هسته اختصاصی EPYC',
      ram: '۲۴ گیگابایت رم اختصاصی',
      bandwidth: 'ترافیک نامحدود + ۲ IP اختصاصی',
      domainsAllowed: 'نامحدود + کلاستر دیتابیس HA',
      backup: 'بکاپ لحظه‌ای PITR + رپلیکا',
      webServer: 'Kubernetes / Docker Swarm + WAF اختصاصی',
    },
    highlights: [
      'متعادل‌ساز بار (Load Balancer) برای تحمل ده‌ها هزار کاربر همزمان',
      'جداسازی شبکه خصوصی (Private VLAN) بین اپلیکیشن و دیتابیس',
      'مهندس DevOps پشتیبان در قرارداد SLA ۹۹.۹۹٪',
      'راه‌اندازی کامل CI/CD، مانیتورینگ Grafana و امنیت سرور',
    ],
    bestFor: 'پلتفرم‌های بزرگ ملی، فین‌تک‌ها و سامانه‌های پرتراکنش',
  },

  // 3. Cloud VPS
  {
    id: 'vps-cloud-s1',
    category: 'cloud-vps',
    name: 'سرور ابری Cloud-S1',
    englishName: 'Cloud VPS S1',
    tagline: 'سرور مجازی پرسرعت KVM با دسترسی کامل Root و نصب سیستم‌عامل آنی',
    monthlyPriceToman: 390000,
    specs: {
      storage: '۴۰ گیگابایت NVMe خالص',
      cpu: '۲ هسته اختصاصی vCPU',
      ram: '۴ گیگابایت رم اختصاصی',
      bandwidth: '۵ ترابایت روی پورت ۱۰Gbps',
      domainsAllowed: 'نامحدود (کنترل کامل Root)',
      backup: 'اسنپ‌شات دستی و خودکار هفتگی',
      webServer: 'انتخابی: Ubuntu / Debian / AlmaLinux / Windows',
    },
    highlights: [
      'تحویل آنی در کمتر از ۳ دقیقه با IP اختصاصی تمیز',
      'کنترل‌پنل مدرن روشن/خاموش، کنسول VNC و نصب مجدد ۱ کلیکی',
      'امکان ارتقای لحظه‌ای CPU، رم و هارد بدون از دست رفتن اطلاعات',
      'سخت‌افزار نسل جدید AMD EPYC با دیسک‌های NVMe واقعی',
    ],
    bestFor: 'توسعه‌دهندگان، نصب پنل اختصاصی، دیتابیس مستقل و پروژه‌های شرکتی',
  },
  {
    id: 'vps-cloud-m2',
    category: 'cloud-vps',
    name: 'سرور ابری مدیریت‌شده Cloud-M2',
    englishName: 'Managed Cloud VPS M2',
    tagline: 'قدرت سرور مجازی همراه با کانفیگ، امنیت و مدیریت رایگان توسط تیم پاشالان',
    recommended: true,
    monthlyPriceToman: 780000,
    freeDomainOnAnnual: 'دامنه .ir رایگان + کانفیگ امنیتی رایگان',
    specs: {
      storage: '۱۰۰ گیگابایت NVMe RAID-10',
      cpu: '۴ هسته اختصاصی AMD EPYC',
      ram: '۸ گیگابایت رم DDR5',
      bandwidth: '۱۰ ترابایت روی پورت ۱۰Gbps',
      domainsAllowed: 'نامحدود + نصب رایگان CyberPanel / DirectAdmin',
      backup: 'بکاپ روزانه آف‌سایت + اسنپ‌شات آنی',
      webServer: 'OpenLiteSpeed / Nginx کانفیگ‌شده و سخت‌سازی‌شده',
    },
    highlights: [
      'سخت‌سازی کامل امنیتی سرور، فایروال CSF و Anti-DDoS به‌صورت رایگان',
      'بدون نیاز به دانش لینوکس — تیم فنی ما سرور را مدیریت و مانیتور می‌کند',
      'پینگ فوق‌العاده پایین در ایران یا پایداری بی‌نقص در آلمان هتزنر',
      'مهاجرت کامل همه سایت‌های شما روی سرور جدید بدون قطعی',
    ],
    bestFor: 'کسب‌وکارهایی که قدرت سرور اختصاصی می‌خواهند اما تیم لینوکس ندارند',
  },
  {
    id: 'vps-cloud-xl',
    category: 'cloud-vps',
    name: 'سرور ابری قدرتمند Cloud-XL',
    englishName: 'High-Compute VPS XL',
    tagline: 'ویژه اپلیکیشن‌های سنگین، پردازش داده، فروشگاه‌های عظیم و میزبانی چندین برند',
    monthlyPriceToman: 1590000,
    freeDomainOnAnnual: 'دامنه .com رایگان + فایروال لایه ۷',
    specs: {
      storage: '۲۴۰ گیگابایت NVMe RAID-10',
      cpu: '۸ هسته اختصاصی AMD EPYC',
      ram: '۱۶ گیگابایت رم DDR5',
      bandwidth: 'نامحدود منصفانه · پورت ۱۰Gbps',
      domainsAllowed: 'نامحدود + ۲ عدد IP اختصاصی',
      backup: 'بکاپ روزانه خارج از سرور (۵۰ گیگ رایگان)',
      webServer: 'مدیریت کامل + بهینه‌سازی MySQL/Postgres',
    },
    highlights: [
      'سرعت خواندن و نوشتن دیسک بالای ۳,۵۰۰ مگابایت بر ثانیه',
      'مناسب میزبانی همزمان ۲۰+ وب‌سایت شرکتی و فروشگاهی پرترافیک',
      'مانیتورینگ ۲۴ ساعته سلامت دیسک، رم و سرویس‌ها',
      'امکان اتصال شبکه خصوصی به سایر سرورهای ابری پاشالان',
    ],
    bestFor: 'آژانس‌های دیجیتال، فروشگاه‌های میلیاردی و سامانه‌های پرترافیک',
  },

  // 4. Email & Reseller
  {
    id: 'host-business-email',
    category: 'email-reseller',
    name: 'ایمیل سازمانی حرفه‌ای (ضداسپم)',
    englishName: 'Enterprise Business Mail',
    tagline: 'ایمیل رسمی با نام دامنه برند شما (info@yourbrand.com) با نرخ تحویل ۹۹٪ در Inbox',
    recommended: true,
    monthlyPriceToman: 165000,
    specs: {
      storage: '۲۵ گیگابایت فضای اختصاصی ایمیل',
      cpu: 'سرور مجزای ایمیل با IP تمیز',
      ram: 'فیلتر هوشمند ضداسپم و آنتی‌ویروس',
      bandwidth: 'ارسال نامحدود مکاتبات سازمانی',
      domainsAllowed: 'تا ۱۵ صندوق ایمیل اختصاصی برند',
      backup: 'آرشیو و بکاپ روزانه ایمیل‌ها',
      webServer: 'وب‌میل مدرن + IMAP/SMTP/Mobile Sync',
    },
    highlights: [
      'تنظیم کامل رکوردهای امنیتی SPF، DKIM و DMARC توسط تیم فنی',
      'ضمانت رفتن ایمیل‌ها به Inbox جیمیل، یاهو و اوت‌لوک (نه Spam)',
      'هماهنگ با موبایل، Outlook، Apple Mail و تقویم سازمانی',
      'بدون افت سرعت روی هاست اصلی وب‌سایت شما',
    ],
    bestFor: 'شرکت‌های بازرگانی، صادراتی، استارتاپ‌ها و سازمان‌های رسمی',
  },
  {
    id: 'host-reseller-pro',
    category: 'email-reseller',
    name: 'پنل نمایندگی فروش هاست (White-Label)',
    englishName: 'Agency Reseller NVMe',
    tagline: 'مناسب طراحان سایت و آژانس‌ها برای میزبانی مشتریان با برند اختصاصی خودشان',
    monthlyPriceToman: 640000,
    freeDomainOnAnnual: 'دامنه .ir رایگان + نیم‌سرور اختصاصی',
    specs: {
      storage: '۸۰ گیگابایت NVMe Gen4',
      cpu: 'منابع مستقل برای هر اکانت مشتری',
      ram: '۲ گیگ رم برای هر اکانت زیرمجموعه',
      bandwidth: 'ترافیک ماهانه نامحدود',
      domainsAllowed: 'تا ۴۰ اکانت هاست مستقل مشتری',
      backup: 'بکاپ خودکار روزانه برای تک‌تک مشتریان',
      webServer: 'WHM / DirectAdmin + LiteSpeed + Private NS',
    },
    highlights: [
      'نیم‌سرور اختصاصی به نام برند شما (ns1.youragency.ir)',
      'بدون درج هیچ نامی از پاشالان در پنل مشتریان شما (۱۰۰٪ White-Label)',
      'پشتیبانی فنی پشت‌پرده از طرف تیم مهندسی پاشالان',
      'حاشیه سود بالای ۲۰۰٪ در فروش هاست به مشتریان طراحی سایت خودتان',
    ],
    bestFor: 'فریلنسرها، تیم‌های طراحی وب و آژانس‌های دیجیتال مارکتینگ',
  },
];

export const HOSTING_ADDONS: HostingAddonItem[] = [
  {
    id: 'addon-dedicated-ip',
    title: 'آی‌پی اختصاصی تمیز (Dedicated IPv4)',
    description: 'بهبود اعتبار ایمیل‌های خروجی، سئو و دسترسی مستقیم بدون اشتراک IP',
    monthlyPriceToman: 95000,
  },
  {
    id: 'addon-offsite-backup-50',
    title: 'فضای بکاپ آف‌سایت ۵۰ گیگابایت (ضدباج‌افزار)',
    description: 'نگهداری نسخه‌های رمزنگاری‌شده سایت در دیتاسنتر دوم با بازگردانی ۱ کلیکی',
    monthlyPriceToman: 79000,
  },
  {
    id: 'addon-speed-95-tune',
    title: 'کانفیگ تخصصی سرعت +95 گوگل (یک‌بار)',
    description: 'تنظیم Redis، بهینه‌سازی دیتابیس، WebP/Brotli و تست Core Web Vitals',
    monthlyPriceToman: 490000,
    oneTime: true,
  },
  {
    id: 'addon-cdn-waf-pro',
    title: 'اتصال و کانفیگ حرفه‌ای CDN + فایروال WAF',
    description: 'پیاده‌سازی کامل ArvanCloud یا Cloudflare با قوانین ضد ربات و ضد DDoS',
    monthlyPriceToman: 350000,
    oneTime: true,
  },
];

export const DOMAIN_TLDS_CATALOG: DomainTldItem[] = [
  {
    tld: '.ir',
    label: 'دامنه ملی ایران',
    register1YrToman: 178000,
    register5YrToman: 524000,
    renew1YrToman: 178000,
    transferToman: 168000,
    popular: true,
    whoisPrivacyFree: false,
    registryNote: 'ثبت مستقیم در ایرنیک (NIC.ir) به نام و کد ملی شما — کف قیمت بازار + ۵٪ کارمزد خدمات',
    bestFor: 'کسب‌وکارهای ایرانی، دریافت سریع اینماد و سئوی محلی ایران',
  },
  {
    tld: '.com',
    label: 'محبوب‌ترین دامنه بین‌المللی',
    register1YrToman: 3149000,
    renew1YrToman: 3915000,
    transferToman: 3915000,
    popular: true,
    whoisPrivacyFree: true,
    registryNote: 'ثبت رجیسترار بین‌المللی با کنترل پنل کامل DNS و قفل امنیتی (تخفیف سال اول)',
    bestFor: 'برندهای حرفه‌ای، فروشگاه‌های معتبر و اعتبار جهانی (رایگان در پکیج ۲۰ میلیونی)',
  },
  {
    tld: '.shop',
    label: 'پسوند اختصاصی فروشگاه آنلاین',
    register1YrToman: 1076000,
    renew1YrToman: 9850000,
    transferToman: 9450000,
    popular: true,
    whoisPrivacyFree: true,
    registryNote: 'تخفیف ویژه سال اول · نام‌های کوتاه و جذاب فروشگاهی هنوز آزاد هستند',
    bestFor: 'فروشگاه‌های اینترنتی، آنلاین‌شاپ‌های اینستاگرامی و برندهای مد',
  },
  {
    tld: '.online',
    label: 'دامنه اقتصادی و همه‌کاره',
    register1YrToman: 1250000,
    renew1YrToman: 9650000,
    transferToman: 9250000,
    whoisPrivacyFree: true,
    registryNote: 'گزینه اقتصادی سال اول برای کمپین‌ها، استارتاپ‌ها و لندینگ‌پیج‌ها',
    bestFor: 'لندینگ‌پیج‌های تبلیغاتی، رویدادها و سرویس‌های آنلاین',
  },
  {
    tld: '.ir.com',
    label: 'پسوند ترکیبی برندینگ ایران',
    register1YrToman: 4305000,
    renew1YrToman: 4490000,
    transferToman: 4305000,
    whoisPrivacyFree: true,
    registryNote: 'مناسب زمانی که .com اصلی پر است و به هویت جهانی نیاز دارید',
    bestFor: 'استارتاپ‌ها و شرکت‌های صادراتی ایرانی',
  },
  {
    tld: '.org',
    label: 'دامنه سازمانی و آکادمیک',
    register1YrToman: 4485000,
    renew1YrToman: 4590000,
    transferToman: 4485000,
    whoisPrivacyFree: true,
    registryNote: 'اعتبار بالا در موتورهای جستجو برای موسسات و آموزشگاه‌ها',
    bestFor: 'موسسات آموزشی، کلینیک‌ها، انجمن‌ها و برندهای علمی',
  },
  {
    tld: '.net',
    label: 'دامنه شبکه‌ای و فناوری',
    register1YrToman: 5299000,
    renew1YrToman: 5450000,
    transferToman: 5299000,
    whoisPrivacyFree: true,
    registryNote: 'پشتیبانی کامل DNSSEC و محافظت Whois رایگان',
    bestFor: 'شرکت‌های فناوری، هاستینگ، خدمات آنلاین و شبکه‌های تجاری',
  },
  {
    tld: '.co',
    label: 'دامنه مدرن استارتاپی',
    register1YrToman: 13839000,
    renew1YrToman: 14250000,
    transferToman: 13839000,
    whoisPrivacyFree: true,
    registryNote: 'کوتاه، شیک و مورد علاقه شرکت‌ها و استارتاپ‌های مدرن',
    bestFor: 'استارتاپ‌ها، آژانس‌ها و شرکت‌های نوآور (Company)',
  },
  {
    tld: '.io',
    label: 'دامنه تخصصی برنامه‌نویسان و SaaS',
    register1YrToman: 16170000,
    renew1YrToman: 16800000,
    transferToman: 16170000,
    whoisPrivacyFree: true,
    registryNote: 'محبوب‌ترین پسوند برای پلتفرم‌های ابری و نرم‌افزارهای آنلاین',
    bestFor: 'پلتفرم‌های SaaS، اپلیکیشن‌ها و محصولات نرم‌افزاری',
  },
  {
    tld: '.ai',
    label: 'دامنه هوش مصنوعی و فناوری روز',
    register1YrToman: 25725000,
    renew1YrToman: 26400000,
    transferToman: 25725000,
    whoisPrivacyFree: true,
    registryNote: 'حداقل دوره ثبت رجیستری ۲ ساله (نرخ معادل سالانه درج شده)',
    bestFor: 'استارتاپ‌های هوش مصنوعی، SaaS و ابزارهای هوشمند',
  },
];

export const HOSTING_DOMAINS_FAQS: HostingFaqItem[] = [
  {
    q: 'آیا مالکیت دامنه و هاست ۱۰۰٪ به نام خود کارفرما ثبت می‌شود؟',
    a: 'بله؛ دامنه‌های .ir مستقیماً روی شناسه ایرنیک شخصی شما ثبت می‌شوند و برای دامنه‌های بین‌المللی مانند .com نیز کنترل کامل DNS، کد انتقال (EPP) و مالکیت کامل در اختیار شما قرار می‌گیرد. هیچ‌گونه قفل یا وابستگی اجباری وجود ندارد.',
  },
  {
    q: 'دیتاسنتر ایران بهتر است یا آلمان (هتزنر)؟',
    a: 'اگر عمده مشتریان شما در ایران هستند و قصد دریافت سریع اینماد و درگاه بانکی با ترافیک نیم‌بها را دارید، دیتاسنتر ایران (پینگ ~۸ میلی‌ثانیه) عالی است. اما اگر از APIهای بین‌المللی، هوش مصنوعی، ایمیل‌های جهانی یا سئوی بین‌المللی استفاده می‌کنید، دیتاسنتر آلمان هتزنر بهترین انتخاب است.',
  },
  {
    q: 'اگر سایت فعلی من روی هاست دیگری باشد، انتقال به پاشالان چگونه انجام می‌شود؟',
    a: 'تیم فنی پاشالان انتقال کامل فایل‌ها، دیتابیس، ایمیل‌ها و تنظیمات DNS سایت شما را از شرکت قبلی به‌صورت ۱۰۰٪ رایگان و بدون حتی یک ثانیه قطعی (Zero-Downtime) انجام می‌دهد.',
  },
  {
    q: 'اگر همزمان سایت و هاست/دامنه بخواهم، کدام گزینه به‌صرفه‌تر است؟',
    a: 'در پکیج ویژه طراحی سایت ۲۰ میلیون تومانی پاشالان، دامنه .com یک‌ساله و هاست ابری به‌صورت رایگان هدیه داده می‌شوند و در طرح‌های آماده (۸ تا ۱۸ میلیون) نیز ۶ ماه هاست ابری و دامنه .ir رایگان است. خرید جداگانه هاست و دامنه برای کسانی است که سایت آماده دارند یا منابع اختصاصی‌تر می‌خواهند.',
  },
  {
    q: 'آیا ضمانت بازگشت وجه در صورت نارضایتی وجود دارد؟',
    a: 'بله؛ تمام سرویس‌های هاست ابری پاشالان دارای ۱۴ روز ضمانت بازگشت وجه بی‌قیدوشرط هستند. برای ثبت دامنه نیز به دلیل ثبت آنی در رجیستری جهانی/ایرنیک، مالکیت بلافاصله به نام شما صادر می‌شود.',
  },
];

export function calculateHostingPrice(params: {
  monthlyBaseToman: number;
  datacenterId: DatacenterId;
  billingCycleId: BillingCycleId;
}): {
  effectiveMonthlyToman: number;
  totalPeriodToman: number;
  originalPeriodToman: number;
  savingsToman: number;
  months: number;
} {
  const dc =
    DATACENTER_OPTIONS.find((d) => d.id === params.datacenterId) ||
    DATACENTER_OPTIONS[0];
  const cycle =
    BILLING_CYCLES.find((c) => c.id === params.billingCycleId) ||
    BILLING_CYCLES[1];

  const adjustedMonthly = Math.round(
    (params.monthlyBaseToman * dc.priceMultiplier) / 1000
  ) * 1000;
  const originalPeriodToman = adjustedMonthly * cycle.months;
  const effectiveMonthlyToman =
    Math.round(
      (adjustedMonthly * (1 - cycle.discountPercent / 100)) / 1000
    ) * 1000;
  const totalPeriodToman = effectiveMonthlyToman * cycle.months;
  const savingsToman = Math.max(0, originalPeriodToman - totalPeriodToman);

  return {
    effectiveMonthlyToman,
    totalPeriodToman,
    originalPeriodToman,
    savingsToman,
    months: cycle.months,
  };
}
