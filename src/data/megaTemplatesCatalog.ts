import { SpatialKit, IndustryCategory } from './spatialCatalog';

const heroComPackageImg = '/images/hero_slide_com_package_1795277500340.jpg';
const heroCustomEngImg = '/images/hero_slide_custom_engineering_1795277500987.jpg';
const heroGrowthSpeedImg = '/images/hero_slide_growth_speed_1795277500873.jpg';
const heroReadyTemplatesImg = '/images/hero_slide_ready_templates_1795277501044.jpg';
const pluginAutomationImg = '/images/plugin_cat_automation_1795286096784.jpg';
const pluginCommunicationImg = '/images/plugin_cat_communication_1795285926358.jpg';
const pluginPaymentImg = '/images/plugin_cat_payment_1795285927334.jpg';
const pluginSalesImg = '/images/plugin_cat_sales_1795286096782.jpg';
const pluginSecurityImg = '/images/plugin_cat_security_1795285926700.jpg';
const pluginSeoSpeedImg = '/images/plugin_cat_seo_speed_1795285925292.jpg';
const showcaseFashionImg = '/images/showcase_fashion_streetwear_1793284711966.jpg';
const showcaseFintechImg = '/images/showcase_fintech_exchange_1793284715041.jpg';
const showcaseClinicImg = '/images/showcase_luxury_clinic_1793284712610.jpg';
const showcaseRealEstateImg = '/images/showcase_real_estate_villa_1793284716020.jpg';
const showcaseRoasteryImg = '/images/showcase_specialty_roastery_1793284715025.jpg';

export interface CategoryShelfDefinition {
  id: Exclude<IndustryCategory, 'all'>;
  title: string;
  subtitle: string;
  badgeText: string;
  accentColor: string;
  surfaceBg: string;
}

export const CATEGORY_SHELVES: CategoryShelfDefinition[] = [
  {
    id: 'ecommerce-shop',
    title: 'طرح‌های فروشگاهی، سوپرمارکت و مارکت‌پلیس آنلاین',
    subtitle: '۲۰ نمونه زنده فروشگاهی با اتصال آماده به ترب، ایمالز، درگاه اقساطی اسنپ‌پی/تارا و انبارداری هوشمند',
    badgeText: '۲۰ طرح فروشگاهی زنده',
    accentColor: '#2563EB',
    surfaceBg: '#EFF6FF',
  },
  {
    id: 'clinic-wellness',
    title: 'طرح‌های پزشکی، کلینیک زیبایی، دندانپزشکی و سلامت',
    subtitle: '۲۰ نمونه زنده نوبت‌دهی آنلاین پزشکان، پرونده الکترونیک، گالری قبل و بعد و مشاوره آنلاین',
    badgeText: '۲۰ طرح پزشکی و کلینیک',
    accentColor: '#0D9488',
    surfaceBg: '#F0FDFA',
  },
  {
    id: 'corporate-industrial',
    title: 'طرح‌های شرکتی، خدماتی، صنعتی، کارخانجات و صادراتی',
    subtitle: '۲۰ نمونه زنده سایت‌های رسمی شرکتی، کاتالوگ صنعتی، پیمانکاری، لجستیک و استعلام پیش‌فاکتور B2B',
    badgeText: '۲۰ طرح شرکتی و خدماتی',
    accentColor: '#1E40AF',
    surfaceBg: '#F8FAFC',
  },
  {
    id: 'fashion-retail',
    title: 'طرح‌های مد و پوشاک، مزون، کیف و کفش، طلا و جواهرات',
    subtitle: '۲۰ نمونه زنده ویژه بوتیک‌ها، برندهای لباس، عطر و ادکلن، ساعت و اکسسوری با جدول سایزبندی هوشمند',
    badgeText: '۲۰ طرح مد و پوشاک',
    accentColor: '#9333EA',
    surfaceBg: '#FAF5FF',
  },
  {
    id: 'real-estate',
    title: 'طرح‌های املاک، هلدینگ ساختمانی، معماری و دکوراسیون',
    subtitle: '۲۰ نمونه زنده دپارتمان املاک، جستجوی ملک روی نقشه، پیش‌فروش پروژه‌های ساختمانی و ویلا',
    badgeText: '۲۰ طرح املاک و معماری',
    accentColor: '#059669',
    surfaceBg: '#ECFDF5',
  },
  {
    id: 'cafe-restaurant',
    title: 'طرح‌های رستوران، کافه‌قنادی، فست‌فود، هتل و گردشگری',
    subtitle: '۲۰ نمونه زنده منوی دیجیتال QR، سفارش آنلاین غذا با محدوده پیک، رزرو میز و آژانس مسافرتی',
    badgeText: '۲۰ طرح رستوران و گردشگری',
    accentColor: '#D97706',
    surfaceBg: '#FFFBEB',
  },
  {
    id: 'education-lms',
    title: 'طرح‌های آموزشگاه آنلاین، آکادمی، موسسه حقوقی و مشاوره',
    subtitle: '۲۰ نمونه زنده فروش دوره ویدیویی، آزمون آنلاین، مدرک معتبر، دفاتر وکالت و موسسات مهاجرتی',
    badgeText: '۲۰ طرح آموزشی و تخصصی',
    accentColor: '#4F46E5',
    surfaceBg: '#EEF2FF',
  },
];

export interface SubTemplateSeed {
  title: string;
  englishName: string;
  engineLabel: string;
  subDomain: string;
  externalUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  ctaLabel: string;
  accent: string;
  imageIndex: number;
  navLinks: string[];
  sampleItems: { name: string; spec: string; price: number; tag: string }[];
}

const LOCAL_POOL_BY_CATEGORY: Record<Exclude<IndustryCategory, 'all'>, string[]> = {
  'ecommerce-shop': [
    pluginSalesImg,
    pluginPaymentImg,
    heroReadyTemplatesImg,
    showcaseFintechImg,
    heroGrowthSpeedImg,
  ],
  'clinic-wellness': [
    showcaseClinicImg,
    pluginCommunicationImg,
    heroCustomEngImg,
    pluginAutomationImg,
  ],
  'corporate-industrial': [
    heroCustomEngImg,
    pluginSecurityImg,
    heroComPackageImg,
    pluginSeoSpeedImg,
    showcaseFintechImg,
  ],
  'fashion-retail': [
    showcaseFashionImg,
    heroReadyTemplatesImg,
    pluginSalesImg,
    heroGrowthSpeedImg,
  ],
  'real-estate': [
    showcaseRealEstateImg,
    heroCustomEngImg,
    heroComPackageImg,
    pluginSeoSpeedImg,
  ],
  'cafe-restaurant': [
    showcaseRoasteryImg,
    pluginSalesImg,
    heroReadyTemplatesImg,
    pluginCommunicationImg,
  ],
  'education-lms': [
    pluginAutomationImg,
    heroGrowthSpeedImg,
    pluginSeoSpeedImg,
    heroComPackageImg,
    pluginCommunicationImg,
  ],
  'fintech-crypto': [showcaseFintechImg, pluginPaymentImg, pluginSecurityImg],
  'beauty-pharmacy': [showcaseClinicImg, showcaseFashionImg, pluginSalesImg],
  'travel-tourism': [showcaseRealEstateImg, showcaseRoasteryImg, heroComPackageImg],
  'home-furniture': [showcaseRealEstateImg, heroReadyTemplatesImg, pluginSalesImg],
  'legal-consulting': [pluginSecurityImg, heroCustomEngImg, pluginCommunicationImg],
};

function getTopicMatchedImage(
  title: string,
  category: Exclude<IndustryCategory, 'all'>,
  idx: number
): string {
  const t = title;
  if (t.includes('کلینیک') || t.includes('دندان') || t.includes('زیبایی') || t.includes('پزشک') || t.includes('داروخانه')) {
    return idx % 2 === 0 ? showcaseClinicImg : pluginCommunicationImg;
  }
  if (t.includes('پوشاک') || t.includes('مانتو') || t.includes('مزون') || t.includes('طلا') || t.includes('جواهر') || t.includes('ساعت') || t.includes('کفش') || t.includes('عطر')) {
    return idx % 2 === 0 ? showcaseFashionImg : pluginSalesImg;
  }
  if (t.includes('ملک') || t.includes('ویلا') || t.includes('معماری') || t.includes('دکوراسیون') || t.includes('ساختمان') || t.includes('هتل')) {
    return idx % 2 === 0 ? showcaseRealEstateImg : heroCustomEngImg;
  }
  if (t.includes('قهوه') || t.includes('کافه') || t.includes('رستوران') || t.includes('فست‌فود') || t.includes('قنادی') || t.includes('کیک')) {
    return idx % 2 === 0 ? showcaseRoasteryImg : heroReadyTemplatesImg;
  }
  if (t.includes('مالی') || t.includes('بورس') || t.includes('ارز') || t.includes('حسابداری') || t.includes('پرداخت')) {
    return idx % 2 === 0 ? showcaseFintechImg : pluginPaymentImg;
  }
  if (t.includes('امنیت') || t.includes('حقوقی') || t.includes('وکالت')) {
    return idx % 2 === 0 ? pluginSecurityImg : heroComPackageImg;
  }

  const categoryPool = LOCAL_POOL_BY_CATEGORY[category] || [
    showcaseFintechImg,
    showcaseClinicImg,
    showcaseFashionImg,
    showcaseRealEstateImg,
    showcaseRoasteryImg,
  ];
  return categoryPool[idx % categoryPool.length];
}

const CATEGORY_SEEDS: Partial<
  Record<
    Exclude<IndustryCategory, 'all'>,
    {
      title: string;
      englishName: string;
      engineLabel: string;
      subDomain: string;
      externalUrl: string;
      heroTitle: string;
      ctaLabel: string;
      accent: string;
      navLinks: string[];
      items: { name: string; spec: string; price: number; tag: string }[];
    }[]
  >
> = {
  'ecommerce-shop': [
    {
      title: 'دیجی‌استور پرو — سوپرمارکت کالاهای دیجیتال و موبایل',
      englishName: 'DigiStore Pro Electronics',
      engineLabel: 'اتصال ترب + اسنپ‌پی ۴ قسطه',
      subDomain: 'digistore',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'فروشگاه تخصصی موبایل، لپ‌تاپ و گجت‌های هوشمند با گارانتی ۱۸ ماهه',
      ctaLabel: 'افزودن به سبد خرید و تسویه آنی',
      accent: '#2563EB',
      navLinks: ['گوشی موبایل', 'لپ‌تاپ و سیستم', 'ساعت هوشمند', 'خرید اقساطی', 'شگفت‌انگیزها'],
      items: [
        { name: 'آیفون ۱۶ پرو مکس ۲۵۶ گیگابایت ZA/A', spec: 'گارانتی شرکتی + ریجستری', price: 89500000, tag: 'ارسال فوری امروز' },
        { name: 'لپ‌تاپ مک‌بوک ایر M3 صفحه ۱۵ اینچ', spec: 'رم ۱۶ گیگ · ۵۱۲ گیگ SSD', price: 78200000, tag: 'اقساط ۴ ماهه اسنپ‌پی' },
        { name: 'اپل واچ اولترا ۲ تیتانیوم بند آلپاین', spec: 'اصلی با ضمانت تطابق سریال', price: 42900000, tag: 'پرفروش‌ترین هفته' },
        { name: 'هدفون بی‌سیم سونی مدل WH-1000XM5', spec: 'حذف نویز هوشمند نسل پنجم', price: 18400000, tag: 'تخفیف ویژه ۱۰٪' },
      ],
    },
    {
      title: 'هایپرجت — سوپرمارکت آنلاین و تحویل فوری زیر ۴۵ دقیقه',
      englishName: 'HyperJet Instant Grocery',
      engineLabel: 'انتخاب بازه زمانی پیک موتوری',
      subDomain: 'hyperjet',
      externalUrl: 'https://snapp.market',
      heroTitle: 'خرید آنلاین اقلام سوپرمارکتی، پروتئینی و میوه تازه با ارسال رایگان',
      ctaLabel: 'ثبت سفارش فوری سوپرمارکت',
      accent: '#16A34A',
      navLinks: ['لبنیات و صبحانه', 'گوشت و پروتئین', 'میوه و سبزیجات', 'نوشیدنی', 'تخفیف‌های۵۰٪'],
      items: [
        { name: 'پک کامل صبحانه خانواده (پنیر، کره، عسل طبیعی، خامه)', spec: 'تازه به تاریخ روز', price: 485000, tag: '۲۰٪ تخفیف ویژه' },
        { name: 'گوشت گوساله ممتاز خورشتی بدون چربی ۱ کیلوگرم', spec: 'بسته‌بندی وکیوم بهداشتی', price: 690000, tag: 'تحویل با باکس سرد' },
        { name: 'روغن زیتون فرابکر ارگانیک رودبار ۱ لیتری', spec: 'پرس سرد درجه یک', price: 540000, tag: 'پرفروش' },
        { name: 'پک میوه دست‌چین درجه یک مهمانی (۵ کیلوگرم)', spec: 'سیب، پرتقال، موز، کیوی', price: 420000, tag: 'چینش روزانه' },
      ],
    },
    {
      title: 'روژابیوتی — فروشگاه اینترنتی لوازم آرایشی و مراقبت پوست',
      englishName: 'RojaBeauty Cosmetics Shop',
      engineLabel: 'مشاور هوشمند نوع پوست + اصالت کالا',
      subDomain: 'rojabeauty',
      externalUrl: 'https://www.khanoumi.com',
      heroTitle: 'مرجع تخصصی محصولات مراقبت پوست، مو و عطرهای اورجینال با تضمین اصالت',
      ctaLabel: 'خرید آنلاین با ضمانت اصالت',
      accent: '#DB2777',
      navLinks: ['مراقبت پوست', 'آرایش صورت', 'مراقبت مو', 'ضدآفتاب تخصصی', 'عطر و ادکلن'],
      items: [
        { name: 'سرم نیاسینامید ۱۰٪ و زینک ۱٪ اوردینری کانادا', spec: 'کنترل چربی و منافذ باز · ۳۰ میل', price: 790000, tag: 'بارکد اصالت کالا' },
        { name: 'ضدآفتاب فلوئیدی بی‌رنگ فیوژن واتر ایزدین SPF50', spec: 'پایه آب، جذب فوری بدون رد سفیدی', price: 1380000, tag: 'توصیه متخصصین پوست' },
        { name: 'ادوپرفیوم زنانه لانکوم لاویه بل اصلی ۱۰۰ میل', spec: 'ماندگاری ۴۸ ساعته · بچ‌کد معتبر', price: 6450000, tag: 'ارسال رایگان' },
        { name: 'ماسک موی کراتینه و آرگان بدون سولفات ۵۰۰ میل', spec: 'احیاکننده موهای رنگ و دکلره‌شده', price: 620000, tag: 'امتیاز ۴.۹ از ۵' },
      ],
    },
    {
      title: 'داروخانه آنلاین دکترفارما — مکمل‌های ورزشی و تجهیزات پزشکی',
      englishName: 'DrPharma Online Pharmacy',
      engineLabel: 'استعلام کد IRC سازمان غذا و دارو',
      subDomain: 'drpharma',
      externalUrl: 'https://darukade.com',
      heroTitle: 'خرید اینترنتی مکمل‌های بدنسازی، ویتامین‌ها و محصولات داروخانه‌ای تحت نظر دکتر داروساز',
      ctaLabel: 'ثبت سفارش از داروخانه رسمی',
      accent: '#0284C7',
      navLinks: ['مکمل بدنسازی', 'مولتی‌ویتامین و مفاصل', 'پوست و مو داروخانه‌ای', 'تجهیزات پزشکی', 'مشاوره داروساز'],
      items: [
        { name: 'پروتئین وی ایزوله گلد استاندارد اپتیموم ۲.۲۷ کیلوگرم', spec: 'لیبل اصالت سازمان غذا و دارو', price: 4950000, tag: 'اورجینال تضمینی' },
        { name: 'قرص کلاژن گلد هیرتامین آمریکا (۶۰ عددی)', spec: 'تقویت رشد مو و جوانسازی پوست', price: 1650000, tag: 'پرفروش‌ترین مکمل' },
        { name: 'فشارسنج دیجیتال بازویی سخنگو امبلفام آلمان', spec: 'آداپتور رایگان + ۵ سال گارانتی تعویض', price: 2150000, tag: 'دقت کلینیکی' },
        { name: 'پک کامل ویتامین‌های تقویت سیستم ایمنی خانواده', spec: 'ویتامین C، زینک پلاس، ویتامین D3', price: 480000, tag: 'ارسال سراسر کشور' },
      ],
    },
    {
      title: 'یدک‌پرو — فروشگاه آنلاین لوازم یدکی خودروهای ایرانی و خارجی',
      englishName: 'YadakPro Auto Parts Store',
      engineLabel: 'جستجوی قطعه بر اساس مدل و سال خودرو',
      subDomain: 'yadakpro',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'تامین مستقیم قطعات اصلی ایساکو، سایپایدک، هیوندای، کیا و خودروهای چینی',
      ctaLabel: 'انتخاب خودرو و خرید قطعه',
      accent: '#EA580C',
      navLinks: ['قطعات موتوری', 'جلوبندی و تعلیق', 'لنت و دیسک ترمز', 'روغن موتور و فیلتر', 'لوازم اسپرت'],
      items: [
        { name: 'ست کامل تسمه تایم و بلبرینگ اصلی پاورگریپ', spec: 'ضمانت ۶۰ هزار کیلومتر کارکرد', price: 2450000, tag: 'هولوگرام اصلی' },
        { name: 'لنت ترمز جلو سرامیکی بدون صدا الیجی ژاپن', spec: 'مناسب دنا پلاس، پژو ۲۰۷ و تارا', price: 1180000, tag: 'ترمزگیری عالی' },
        { name: 'روغن موتور تمام سنتتیک ۵W-40 بهران رانا ۴ لیتری', spec: 'سطح کیفی API SN پیشرفته', price: 790000, tag: 'قیمت مصوب' },
        { name: 'مانیتور فابریک اندروید ۱۱ اینچ همراه دوربین دنده عقب', spec: 'صفحه IPS + کارپلی بی‌سیم', price: 6800000, tag: 'نصب در محل تهران' },
      ],
    },
    {
      title: 'ابزارمارکت — فروشگاه تخصصی ابزارآلات صنعتی، برقی و شارژی',
      englishName: 'AbzarMarket Industrial Tools',
      engineLabel: 'مقایسه فنی توان و گشتاور ابزارها',
      subDomain: 'abzarmarket',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'نمایندگی رسمی فروش ابزارآلات بوش، ماکیتا، رونیکس و توسن با گارانتی شرکتی',
      ctaLabel: 'خرید ابزار با فاکتور رسمی',
      accent: '#DC2626',
      navLinks: ['دریل و پیچ‌گوشتی شارژی', 'اینورتر و جوشکاری', 'مینی‌فرز و برش', 'کمپرسور باد', 'جعبه ابزار کامل'],
      items: [
        { name: 'دریل پیچ‌گوشتی چکشی شارژی ۱۸ ولت براش‌لس رونیکس', spec: '۲ عدد باتری لیتیوم + کیف BMC', price: 4850000, tag: '۱ سال گارانتی رونیکس' },
        { name: 'دستگاه جوش اینورتر ۲۰۰ آمپر صنعتی دو ولوم دیجیتال', spec: 'قابلیت جوش الکترود ۳ و ۴ مداوم', price: 3920000, tag: 'کابل و انبر رایگان' },
        { name: 'مینی‌فرز ۱۱۰۰ وات دسته بلند دیمردار صنعتی', spec: '۱۱۰۰۰ دور در دقیقه · بلبرینگ ضدغبار', price: 2350000, tag: 'پرفروش کارگاهی' },
        { name: 'ست بکس و آچار ۱۱۸ پارچه کروم وانادیوم تایوان', spec: 'گارانتی مادام‌العمر شکستگی آلیاژ', price: 5400000, tag: 'کیفیت صادراتی' },
      ],
    },
    {
      title: 'پت‌لند — پت‌شاپ آنلاین غذا و لوازم حیوانات خانگی',
      englishName: 'PetLand Online PetShop',
      engineLabel: 'اشتراک ماهانه غذای سگ و گربه',
      subDomain: 'petland',
      externalUrl: 'https://snapp.market',
      heroTitle: 'فروشگاه جامع غذای خشک رویال کنین، تشویقی، خاک گربه و لوازم نگهداری پت',
      ctaLabel: 'ثبت سفارش پت‌شاپ',
      accent: '#7C3AED',
      navLinks: ['غذای گربه', 'غذای سگ', 'تشویقی و مکمل', 'باکس و جای خواب', 'مشاوره دامپزشک'],
      items: [
        { name: 'غذای خشک گربه عقیم‌شده رویال کنین استریلایز ۴ کیلوگرم', spec: 'اورجینال فرانسه · تاریخ ۲۰۲۷', price: 2950000, tag: 'ارسال ۲ ساعته تهران' },
        { name: 'بستنی و تشویقی مایع گربه وینستون (بسته ۲۴ عددی)', spec: 'غنی از تورین و ویتامین', price: 590000, tag: 'محبوب‌ترین تشویقی' },
        { name: 'کوله پشتی حمل گربه و سگ کوچک مدل فضایی حباب‌دار', spec: 'تهویه ۹ کاناله + کفی ضدآب', price: 1280000, tag: 'رنگ‌بندی متنوع' },
        { name: 'خاک گربه کلونی ضدبو و آنتی‌باکتریال ۱۰ کیلویی', spec: 'کلامپینگ فوق‌سریع بدون گرد و غبار', price: 340000, tag: 'اقتصادی' },
      ],
    },
    {
      title: 'هوم‌لند — فروشگاه لوازم خانگی، جهیزیه و آشپزخانه',
      englishName: 'HomeLand Kitchen & Appliances',
      engineLabel: 'پکیج‌ساز هوشمند جهیزیه عروس',
      subDomain: 'homeland',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'مرجع خرید یخچال، لباسشویی، تلویزیون، اسپرسوساز و سرخ‌کن بدون روغن',
      ctaLabel: 'خرید نقدی یا اقساطی چکی',
      accent: '#0891B2',
      navLinks: ['لوازم پخت‌وپز', 'دم‌آوری قهوه', 'یخچال و لباسشویی', 'جاروبرقی و نظافت', 'پکیج جهیزیه'],
      items: [
        { name: 'سرخ‌کن بدون روغن فیلیپس مدل XXL دیجیتال ۹ لیتری', spec: 'تکنولوژی Rapid Air · منوی لمسی', price: 11400000, tag: '۲۴ ماه گارانتی' },
        { name: 'اسپرسوساز نیمه‌صنعتی مباشی فشار ۲۰ بار اولکا ایتالیا', spec: 'بدنه تمام استیل + نازل بخار حرفه‌ای', price: 7850000, tag: 'پرفروش‌ترین اسپرسوساز' },
        { name: 'جاروبرقی رباتیک هوشمند شیائومی مدل S10+ لیزری', spec: 'مکش ۴۰۰۰ پاسکال + تی چرخشی دوگانه', price: 19600000, tag: 'نقشه‌برداری ۳ بعدی' },
        { name: 'سرویس قابلمه ۱۴ پارچه گرانیتی کره‌ای نچسب', spec: 'پوشش ۵ لایه PTFE بدون سرب', price: 6200000, tag: 'رنگ نسکافه‌ای و مشکی' },
      ],
    },
    {
      title: 'بوک‌سیتی — فروشگاه آنلاین کتاب، نوشت‌افزار و بازی فکری',
      englishName: 'BookCity Online Bookstore',
      engineLabel: 'پیش‌نمایش ۲۰ صفحه اول کتاب PDF و صوتی',
      subDomain: 'bookcity',
      externalUrl: 'https://fidibo.com',
      heroTitle: 'خرید اینترنتی کتاب‌های چاپی، صوتی، کمک‌درسی و نوشت‌افزار فانتزی با تخفیف دائمی',
      ctaLabel: 'افزودن کتاب به سبد خرید',
      accent: '#059669',
      navLinks: ['رمان و ادبیات', 'روانشناسی و موفقیت', 'مدیریت و کسب‌وکار', 'کتاب کودک', 'نوشت‌افزار'],
      items: [
        { name: 'پک ۵ جلدی پرفروش‌ترین کتاب‌های توسعه فردی و ثروت', spec: 'عادت‌های اتمی، اثر مرکب، پدر پولدار...', price: 980000, tag: '۲۵٪ تخفیف پکیج' },
        { name: 'روانشناس خودت باش + تئوری انتخاب (چاپ جدید گالینگور)', spec: 'کاغذ بالکی سوئدی درجه یک', price: 420000, tag: 'ارسال پیشتاز رایگان' },
        { name: 'پلنر برنامه‌ریزی روزانه و هدف‌گذاری سالانه چرمی', spec: '۲۴۰ صفحه رنگی + استیکر برنامه‌ریزی', price: 360000, tag: 'هدیه ویژه' },
        { name: 'بردگیم و بازی فکری گروهی مافیا و استوژیت (نسخه لوکس)', spec: 'مناسب ۴ تا ۱۲ نفر', price: 750000, tag: 'سرگرمی خانوادگی' },
      ],
    },
    {
      title: 'اسپرت‌لند — فروشگاه تجهیزات ورزشی، کوهنوردی و بدنسازی',
      englishName: 'SportLand Fitness & Outdoor',
      engineLabel: 'انتخاب وزن و سایز تخصصی تجهیزات ورزشی',
      subDomain: 'sportland',
      externalUrl: 'https://www.banimode.com',
      heroTitle: 'فروشگاه تخصصی تردمیل خانگی، دمبل متغیر، کفش رانینگ و تجهیزات کمپینگ',
      ctaLabel: 'ثبت سفارش تجهیزات ورزشی',
      accent: '#2563EB',
      navLinks: ['هوازی و تردمیل', 'بدنسازی در خانه', 'کوهنوردی و کمپینگ', 'کفش و لباس ورزشی', 'تغذیه ورزشی'],
      items: [
        { name: 'دمبل متغیر تنظیم‌شونده حرفه‌ای ۲۴ کیلویی (جفت)', spec: 'تغییر وزن در ۲ ثانیه با چرخش ضامن', price: 8900000, tag: 'جایگزین ۱۵ جفت دمبل' },
        { name: 'چادر کوهنوردی و کمپینگ ۴ نفره دوپوش ضدآب طوفان', spec: 'تیرک آلومینیوم هوافضا · وزن ۲.۶ کیلو', price: 5400000, tag: 'مقاوم در برابر باران' },
        { name: 'مت یوگا و پیلاتس استاندارد TPE ضدلغزش ۸ میلی‌متر', spec: 'دو لایه دولوکس همراه کاور حمل', price: 780000, tag: 'رنگ‌بندی کامل' },
        { name: 'دوچرخه ثابت اسپینینگ باشگاهی دیسک ۱۸ کیلویی', spec: 'تحمل وزن تا ۱۴۰ کیلوگرم · بی‌صدا', price: 16500000, tag: 'نصب رایگان' },
      ],
    },
    {
      title: 'گیم‌سنتر — فروشگاه کنسول بازی، PS5، اکانت قانونی و سیستم گیمینگ',
      englishName: 'GameCenter Console & PC Hub',
      engineLabel: 'اسمبل آنلاین سیستم گیمینگ هوشمند',
      subDomain: 'gamecenter',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'خرید پلی‌استیشن ۵ اسلیم، ایکس‌باکس، دسته‌های بازی و اسمبل تخصصی کامپیوتر گیمینگ',
      ctaLabel: 'خرید کنسول با مهلت تست',
      accent: '#4F46E5',
      navLinks: ['کنسول PS5 & Xbox', 'اسمبل PC گیمینگ', 'مانیتور و تجهیزات', 'اکانت و گیفت‌کارت', 'نصب بازی'],
      items: [
        { name: 'پلی‌استیشن ۵ اسلیم دیجیتال ۱ ترابایت اروپا (کد ۲۰۱۶)', spec: 'پلمپ اصلی + ۱۰ روز مهلت تست تعویض', price: 34800000, tag: 'قیمت کف بازار' },
        { name: 'دسته بازی اضافی DualSense Edge حرفه‌ای پلی‌استیشن', spec: 'پدل‌های پشت قابل برنامه‌ریزی', price: 11200000, tag: 'اورجینال سونی' },
        { name: 'کیس گیمینگ اسمبل‌شده RTX 4060 Ti + Core i5 14400F', spec: 'رم ۳۲ گیگ DDR5 · خنک‌کننده مایع', price: 68500000, tag: 'اجرای 4K تمام بازی‌ها' },
        { name: 'هدست گیمینگ بی‌سیم ریزر BlackShark V2 Pro', spec: 'صدای فضایی THX · باتری ۷۰ ساعته', price: 9400000, tag: 'مخصوص استریمرها' },
      ],
    },
    {
      title: 'زعفران‌کده — فروشگاه زعفران صادراتی، خشکبار، پسته و آجیل ممتاز',
      englishName: 'ZafaranKadeh Saffron & Nuts',
      engineLabel: 'فروش خرد و عمده با بسته‌بندی کادویی خاتم',
      subDomain: 'zafarankadeh',
      externalUrl: 'https://snapp.market',
      heroTitle: 'خرید مستقیم زعفران سوپرنگین قائنات و آجیل دست‌چین بدون واسطه از کشاورز',
      ctaLabel: 'سفارش زعفران و آجیل تازه',
      accent: '#B91C1C',
      navLinks: ['زعفران سوپرنگین', 'پسته و آجیل ممتاز', 'پک‌های هدیه سازمانی', 'عسل و دمنوش', 'خرید عمده صادراتی'],
      items: [
        { name: 'زعفران سوپرنگین اتویی صادراتی قائنات (یک مثقال / ۴.۶ گرم)', spec: 'ظرف خاتم فلزی + برگه آزمایشگاه کروسین', price: 540000, tag: 'عطر و رنگ فوق‌العاده' },
        { name: 'آجیل چهارمغز دست‌چین ممتاز برشته زعفرانی (۱ کیلوگرم)', spec: 'پسته اکبری، بادام هندی، فندق، بادام درختی', price: 980000, tag: 'برشته‌شده روز' },
        { name: 'پک هدیه سازمانی لوکس چرمی (زعفران، هل، گل‌محمدی و عسل)', spec: 'امکان حکاکی لیزری لوگوی شرکت شما', price: 1850000, tag: 'ویژه هدایای تبلیغاتی' },
        { name: 'پسته اکبری دست‌چین رفسنجان شور زعفرانی ۱ کیلوگرم', spec: 'خندان یکدست درشت', price: 1120000, tag: 'تضمین تازگی' },
      ],
    },
    {
      title: 'فلوریا — گلفروشی آنلاین، سفارش باکس گل، گیاهان آپارتمانی و کیک',
      englishName: 'Floria Online Flower Delivery',
      engineLabel: 'تحویل ۳ ساعته گل در روز و ساعت مشخص + متن کارت‌پستال',
      subDomain: 'floria',
      externalUrl: 'https://snapp.market',
      heroTitle: 'ارسال فوری باکس گل رز هلندی، تاج گل تبریک و گیاهان آپارتمانی در سراسر کشور',
      ctaLabel: 'انتخاب زمان تحویل و ثبت سفارش',
      accent: '#E11D48',
      navLinks: ['باکس گل رز', 'دسته گل تولد و سالگرد', 'گیاهان آپارتمانی', 'پک گل و کیک', 'تاج گل رسمی'],
      items: [
        { name: 'باکس چرمی ۵۰ شاخه رز هلندی قرمز ممتاز', spec: 'گل‌های تازه چیده‌شده امروز + کارت تبریک رایگان', price: 2450000, tag: 'ارسال رایگان با خودرو' },
        { name: 'گیاه آپارتمانی باباآدم و مونسترا در گلدان سرامیکی مدرن', spec: 'ارتفاع ۱۱۰ سانتی‌متر · خاک غنی‌شده', price: 1680000, tag: 'مناسب هدیه افتتاحیه' },
        { name: 'پک سورپرایز تولد (باکس گل رز و ارکیده + کیک شکلاتی بلژیکی)', spec: 'تحویل در ساعت دقیق انتخابی شما', price: 2190000, tag: 'پرفروش‌ترین سورپرایز' },
        { name: 'تاج گل دوطبقه تشریفاتی ویژه افتتاحیه و مراسم رسمی', spec: 'ارتفاع ۲.۵ متر · گل‌آرایی VIP', price: 4800000, tag: 'چاپ بنر اختصاصی' },
      ],
    },
    {
      title: 'نی‌نی‌مارکت — فروشگاه سیسمونی نوزاد، اسباب‌بازی و پوشاک کودک',
      englishName: 'NiniMarket Baby & Kids Store',
      engineLabel: 'چک‌لیست هوشمند خرید سیسمونی کامل',
      subDomain: 'ninimarket',
      externalUrl: 'https://www.banimode.com',
      heroTitle: 'تخصصی‌ترین فروشگاه اینترنتی کالسکه، کریر، سرویس خواب نوزاد و اسباب‌بازی فکری',
      ctaLabel: 'مشاهده و خرید سیسمونی',
      accent: '#0284C7',
      navLinks: ['کالسکه و گردش', 'سرویس خواب نوزاد', 'بهداشت و تغذیه', 'لباس نوزادی نخ‌پنبه', 'اسباب‌بازی'],
      items: [
        { name: 'سرویس کالسکه و کریر ۴ تکه مبله چیکو ایتالیا', spec: 'قابلیت چرخش ۳۶۰ درجه · جمع‌شو با یک دست', price: 24500000, tag: 'اقساط ۶ ماهه' },
        { name: 'پک ۱۹ تکه لباس نوزادی ۱۰۰٪ پنبه ارگانیک ضدحساسیت', spec: 'سایز صفر تا ۶ ماه · دوخت بدون درز', price: 1890000, tag: 'بسته‌بندی هدیه' },
        { name: 'صندلی خودرو کودک ایزوفیکس‌دار (بدوتولد تا ۱۲ سالگی)', spec: 'استاندارد ایمنی اروپا ECE R44', price: 8900000, tag: 'ایمنی ۵ ستاره' },
        { name: 'تخت کنار مادر قابل تنظیم ارتفاع و شیب آنتی‌رفلاکس', spec: 'تشک طبی + پشه‌بند رایگان', price: 5200000, tag: 'پرفروش' },
      ],
    },
    {
      title: 'اپتیک‌ویژن — فروشگاه آنلاین عینک آفتابی و طبی با تست مجازی روی صورت',
      englishName: 'OpticVision Eyewear Store',
      engineLabel: 'بارگذاری نسخه چشم‌پزشک و ساخت عدسی طبی',
      subDomain: 'opticvision',
      externalUrl: 'https://www.banimode.com',
      heroTitle: 'خرید عینک‌های آفتابی اورجینال ری‌بن، پلیس و سفارش ساخت عدسی طبی تدریجی و بلوکات',
      ctaLabel: 'انتخاب فریم و عدسی',
      accent: '#0F172A',
      navLinks: ['عینک آفتابی زنانه و مردانه', 'فریم عینک طبی', 'سفارش عدسی با نسخه', 'لنز رنگی و طبی', 'تست فرم صورت'],
      items: [
        { name: 'عینک آفتابی ری‌بن کلاب‌مستر اصلی پلاریزه UV400', spec: 'شیشه کریستال ضدخش · شناسنامه اصالت', price: 5800000, tag: 'ارسال با جعبه چرمی' },
        { name: 'فریم طبی تیتانیوم فوق‌سبک ۱۲ گرمی نشکن + عدسی بلوکات', spec: 'محافظت کامل در برابر نور آبی مانیتور و موبایل', price: 2950000, tag: 'مخصوص برنامه‌نویسان' },
        { name: 'عدسی طبی فتوکرومیک نسل هشتم اسیلور فرانسه (جفت)', spec: 'تغییر رنگ زیر ۵ ثانیه در آفتاب', price: 4200000, tag: 'کارت گارانتی ۲ ساله' },
        { name: 'لنز طبی و رنگی سالانه سولوتیکا برزیل (آبرسان بالا)', spec: 'مایع لنز رایگان', price: 2400000, tag: 'طبیعی‌ترین رنگ‌ها' },
      ],
    },
    {
      title: 'کارتریج‌سنتر — فروشگاه ماشین‌های اداری، پرینتر، اسکنر و مواد مصرفی',
      englishName: 'CartridgeCenter Office Tech',
      engineLabel: 'جستجوی فوری کارتریج بر اساس مدل پرینتر',
      subDomain: 'cartridgecenter',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'فروش تخصصی پرینترهای لیزری اچ‌پی، کانن، کاغذ A4 و کارتریج‌های طرح و فابریک با فاکتور رسمی',
      ctaLabel: 'ثبت سفارش سازمانی و اداری',
      accent: '#1D4ED8',
      navLinks: ['پرینتر لیزری و چهارکاره', 'کارتریج و تونر', 'اسکنر اداری', 'کاغذ و ملزومات', 'تعمیر و شارژ در محل'],
      items: [
        { name: 'پرینتر لیزری چهارکاره اچ‌پی مدل M141w وای‌فای‌دار', spec: 'پرینت، کپی، اسکن · چاپ مستقیم از موبایل', price: 14900000, tag: 'گارانتی ۱۸ ماهه' },
        { name: 'پک ۳ عددی کارتریج لیزری 85A درجه یک با چیپست جدید', spec: 'ظرفیت چاپ ۴۸۰۰ برگ مشکی پررنگ', price: 1350000, tag: 'ضمانت تعویض بی‌قیدوشرط' },
        { name: 'کارتن ۵ بسته‌ای کاغذ A4 هشتاد گرم دبل‌ای (Double A) اصلی', spec: '۲۵۰۰ برگ بدون پرز و گیر کردن در دستگاه', price: 1620000, tag: 'ارسال رایگان اداری' },
        { name: 'اسکنر بایگانی دوطرفه سریع کداک (۴۰ برگ در دقیقه)', spec: 'مناسب دفاتر اسناد رسمی و شرکت‌ها', price: 22800000, tag: 'فاکتور رسمی ارزش‌افزوده' },
      ],
    },
    {
      title: 'سفیرچرم — فروشگاه اینترنتی کیف، کفش، کمربند و ست هدیه چرم طبیعی',
      englishName: 'SafirCharm Natural Leather',
      engineLabel: 'حکاکی رایگان نام دلخواه روی محصولات چرمی',
      subDomain: 'safircharm',
      externalUrl: 'https://www.banimode.com',
      heroTitle: 'تولیدات دست‌دوز ۱۰۰٪ چرم طبیعی گاوی و بزی با ۲ سال گارانتی چرم و یراق‌آلات',
      ctaLabel: 'خرید محصول چرم طبیعی',
      accent: '#78350F',
      navLinks: ['کیف اداری و لپ‌تاپ', 'کفش چرم مردانه و زنانه', 'کیف پول و جاکارتی', 'ست هدیه نفیس', 'کاپشن چرم'],
      items: [
        { name: 'کیف اداری و مهندسی تمام چرم طبیعی گاوی فلوتر', spec: 'محفظه ضربه‌گیر لپ‌تاپ ۱۵.۶ اینچ + قفل رمزدار', price: 4650000, tag: '۲ سال گارانتی طلایی' },
        { name: 'ست هدیه ۳ تکه چرم طبیعی (کیف پول، کمربند دوطرفه و جاکلیدی)', spec: 'جعبه چوبی لوکس + حکاکی لیزری نام رایگان', price: 2380000, tag: 'بهترین هدیه مدیریتی' },
        { name: 'کفش رسمی و طبی مردانه چرم تبریز زیره ترمو ضدسایش', spec: 'کفی چرم طبیعی تنفس‌پذیر · سایز ۴۰ تا ۴۵', price: 2890000, tag: 'تعویض سایز رایگان' },
        { name: 'کیف دوشی و دستی زنانه چرم طبیعی مدل ورسای', spec: 'یراق‌آلات رنگ ثابت ایتالیایی', price: 3450000, tag: 'طراحی جدید ۱۴۰۵' },
      ],
    },
    {
      title: 'ملودی‌مارکت — فروشگاه تخصصی سازهای موسیقی، پیانو، گیتار و تجهیزات استودیو',
      englishName: 'MelodyMarket Musical Instruments',
      engineLabel: 'پخش نمونه صدای واقعی هر ساز قبل از خرید',
      subDomain: 'melodymarket',
      externalUrl: 'https://www.technolife.ir',
      heroTitle: 'مرجع خرید پیانو دیجیتال یاماها، گیتار، ویولن، سازهای سنتی ایرانی و کارت صدای استودیویی',
      ctaLabel: 'مشاوره و خرید ساز با تایید استاد',
      accent: '#9333EA',
      navLinks: ['پیانو دیجیتال و آکوستیک', 'گیتار و ویولن', 'سازهای سنتی ایرانی', 'تجهیزات استودیو', 'خرید اقساطی ساز'],
      items: [
        { name: 'پیانو دیجیتال یاماها مدل Clavinova CLP-735 همراه صندلی', spec: 'کلاویه سنگین استاندارد + ۳ سال گارانتی', price: 118000000, tag: 'حمل و نصب تخصصی رایگان' },
        { name: 'گیتار کلاسیک یاماها C70 اصلی اندونزی + کاور ضربه‌گیر', spec: 'تست و رگلاژ شده توسط استاد گیتار', price: 9850000, tag: 'بهترین انتخاب هنرجویان' },
        { name: 'تار و سه‌تار دست‌ساز مهر استاد با چوب توت کهنه ۱۵ ساله', spec: 'صدادهی زنگ‌دار و کوک پایدار', price: 14500000, tag: 'ضمانت تایید استاد شما' },
        { name: 'پکیج استودیو خانگی فوکوس‌رایت Scarlett 2i2 نسل ۴', spec: 'کارت صدا + میکروفون کندانسر + هدفون مانیتورینگ', price: 21400000, tag: 'آماده ضبط حرفه‌ای' },
      ],
    },
    {
      title: 'سفره‌پلاس — فروشگاه ظروف پذیرایی، کریستال، چینی استخوانی و دکوری',
      englishName: 'SofrehPlus Tableware & Crystal',
      engineLabel: 'بسته‌بندی ضدضربه با ضمانت ۱۰۰٪ سلامت فیزیکی در ارسال',
      subDomain: 'sofrehplus',
      externalUrl: 'https://www.banimode.com',
      heroTitle: 'فروشگاه اینترنتی سرویس غذاخوری چینی زرین، کریستال بوهمیا و قاشق‌چنگال استیل',
      ctaLabel: 'سفارش با ضمانت سلامت بار',
      accent: '#0D9488',
      navLinks: ['سرویس چینی و آرکوپال', 'کریستال و بلور پذیرایی', 'سرویس قاشق و چنگال', 'ظروف چوبی و بامبو', 'اکسسوری میز'],
      items: [
        { name: 'سرویس چینی استخوانی ۱۰۲ پارچه ۱۲ نفره کامل طلاکوب', spec: 'قابل استفاده در ماشین ظرفشویی · درجه عالی', price: 18900000, tag: 'بیمه شکستگی در ارسال' },
        { name: 'سرویس قاشق و چنگال ۱۲۸ پارچه استیل ۱۸/۱۰ ضدزنگ صندوق‌دار', spec: 'ضخامت ۴ میلی‌متر · ۲۵ سال ضمانت رنگ', price: 12400000, tag: 'پرفروش جهیزیه' },
        { name: 'ست ۴ تکه پذیرایی کریستال ۲۴٪ سرب بوهمیا چک (میوه، شیرینی، آجیل، شکلات)', spec: 'تراش دست با درخشش الماسی', price: 15600000, tag: 'لوکس و تشریفاتی' },
        { name: 'اردوخوری و سینی مزه چوب گردو طبیعی روستیک ۵ خانه', spec: 'پوشش روغن گیاهی خوراکی ضدآب', price: 980000, tag: 'ساخت دست' },
      ],
    },
    {
      title: 'پارس‌تحریر — فروشگاه عمده و خرد لوازم‌التحریر، ملزومات اداری و هنری',
      englishName: 'ParsTahrir Stationery & Art',
      engineLabel: 'پکیج‌بندی خودکار لیست لوازم‌التحریر مدارس',
      subDomain: 'parstahrir',
      externalUrl: 'https://fidibo.com',
      heroTitle: 'تامین کامل نوشت‌افزار دانش‌آموزی، کوله‌پشتی ارگونومیک، رنگ و بوم نقاشی حرفه‌ای',
      ctaLabel: 'خرید نوشت‌افزار با تخفیف پلکانی',
      accent: '#2563EB',
      navLinks: ['نوشت‌افزار مدرسه', 'کوله‌پشتی و جامدادی', 'ابزار طراحی و نقاشی', 'ملزومات بایگانی اداری', 'خودنویس‌های لوکس'],
      items: [
        { name: 'پک کامل بازگشایی مدارس (۱۲ دفتر سیمی، مدادرنگی ۲۴ رنگ، جامدادی و نوشت‌افزار)', spec: 'کیفیت ممتاز ایرانی و فابرکاستل', price: 1450000, tag: 'صرفه‌جویی ۳۰ درصدی' },
        { name: 'کوله‌پشتی طبی و ارگونومیک ضدآب دارای پورت USB', spec: 'پد ضدتعریق ستون فقرات · ۲ سال ضمانت زیپ', price: 1890000, tag: 'مناسب مدرسه و دانشگاه' },
        { name: 'جعبه چوبی مدادرنگی حرفه‌ای ۷۲ رنگ پلی‌کروم فابرکاستل آلمان', spec: 'مخصوص طراحان و هنرمندان حرفه‌ای', price: 9800000, tag: 'اورجینال آلمان' },
        { name: 'ست خودنویس و روانشناس مدیریتی پارکر در جعبه مخمل', spec: 'بدنه فلزی با گیره طلایی', price: 2150000, tag: 'هدیه نفیس' },
      ],
    },
  ],
  'clinic-wellness': [
    {
      title: 'کلینیک زیبایی و لیزر آئورا — نوبت‌دهی آنلاین و گالری قبل و بعد',
      englishName: 'Aura Aesthetic & Laser Clinic',
      engineLabel: 'رزرو شیفت پزشک و اپراتور + بیعانه آنلاین',
      subDomain: 'auraclinic',
      externalUrl: 'https://doctoreto.com',
      heroTitle: 'مرکز تخصصی لیزر موهای زائد، تزریق ژل، بوتاکس و هایفوتراپی تحت نظر متخصص پوست',
      ctaLabel: 'رزرو آنلاین نوبت کلینیک',
      accent: '#0D9488',
      navLinks: ['لیزر موهای زائد', 'تزریق ژل و فیلر', 'جوانسازی و هایفو', 'گالری قبل و بعد', 'نوبت‌دهی اینترنتی'],
      items: [
        { name: 'پکیج فول‌بادی لیزر الکساندرایت کندلا ۲۰۲۶ (شات نامحدود)', spec: 'کولینگ نیتروژن بدون درد + سری شخصی', price: 1150000, tag: 'نوبت فردا خالی است' },
        { name: 'تزریق فیلر لب و زاویه‌سازی فک با ژل نورامیس و رووفیل کره‌ای', spec: 'پلمپ بازشده در حضور مراجعه‌کننده', price: 3800000, tag: 'توسط پزشک متخصص' },
        { name: 'هایفوتراپی ۷ بعدی اولترافرمر کل صورت و غبغب (تک‌جلسه‌ای)', spec: 'لیفت غیرجراحی با ماندگاری ۱۸ ماهه', price: 4200000, tag: 'رضایت ۹۸٪ مراجعین' },
        { name: 'فیشیال تخصصی ۷ مرحله‌ای و آبرسانی عمیق هیدرافیشیال', spec: 'مواد تالگو فرانسه · ۹۰ دقیقه', price: 1450000, tag: 'پاکسازی کامل' },
      ],
    },
    {
      title: 'دنتال‌پلاس — کلینیک تخصصی دندانپزشکی، ایمپلنت دیجیتال و لمینت',
      englishName: 'DentalPlus Implant & Smile Design',
      engineLabel: 'ماشین‌حساب آنلاین هزینه ایمپلنت و اقساط',
      subDomain: 'dentalplus',
      externalUrl: 'https://doctoreto.com',
      heroTitle: 'اصلاح طرح لبخند، لمینت سرامیکی و کاشت ایمپلنت فوری یک‌روزه بدون جراحی و بخیه',
      ctaLabel: 'رزرو معاینه و عکس OPG رایگان',
      accent: '#0284C7',
      navLinks: ['ایمپلنت دیجیتال', 'لمینت و کامپوزیت', 'ارتودنسی نامرئی', 'محاسبه هزینه و اقساط', 'نوبت‌دهی فوری'],
      items: [
        { name: 'ایمپلنت کامل سوئیسی اشترومن همراه روکش زیرکونیا دیجیتال', spec: 'ضمانت‌نامه کتبی مادام‌العمر ایمپلنت', price: 19500000, tag: 'اقساط ۶ ماهه با چک' },
        { name: 'اصلاح طرح لبخند با کامپوزیت سارمکو سوئیس (هر فک ۸ واحد)', spec: 'بدون تراش دندان · پالیش رایگان ۱ ساله', price: 14800000, tag: 'انجام در ۱ جلسه' },
        { name: 'لمینت سرامیکی فوق‌نازک ایمکس (IPS e.max) آلمان هر واحد', spec: 'طراحی دیجیتال لبخند سه بعدی قبل از شروع', price: 8900000, tag: 'طبیعی و ضدلک' },
        { name: 'بلیچینگ تخصصی سفید کردن دندان با لیزر در مطب (هر دو فک)', spec: 'روشن‌تر شدن ۳ تا ۴ درجه در ۴۵ دقیقه', price: 4500000, tag: 'بدون حساسیت' },
      ],
    },
  ],
  'corporate-industrial': [],
  'fashion-retail': [],
  'real-estate': [],
  'cafe-restaurant': [],
  'education-lms': [],
};

// Algorithmic generator to ensure EVERY category has exactly 20 rich, distinct, realistic Persian live templates (140 total)
const EXTRA_VARIATIONS_BY_CATEGORY: Partial<
  Record<
    Exclude<IndustryCategory, 'all'>,
    { name: string; sub: string; engine: string; priceReady: number; priceCustom: number }[]
  >
> = {
  'ecommerce-shop': [],
  'clinic-wellness': [
    { name: 'مرکز تخصصی کاشت مو و ابرو به روش MicroFIT و SUT', sub: 'طراحی خط رویش با لیزر + ضمانت‌نامه تراکم کتبی', engine: 'ارسال عکس سر و برآورد تعداد گرافت آنلاین', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'مطب فوق‌تخصص جراحی زیبایی بینی و پلاستیک صورت', sub: 'شبیه‌سازی سه بعدی فرم بینی قبل از عمل + نوبت مشاوره', engine: 'گالری ویدیویی نمونه عمل‌های طبیعی و نیمه‌فانتزی', priceReady: 12000000, priceCustom: 34000000 },
    { name: 'کلینیک تخصصی تغذیه، رژیم‌درمانی آنلاین و لاغری موضعی', sub: 'دریافت برنامه غذایی اختصاصی آنلاین + دستگاه کرایولیپولیز', engine: 'محاسبه‌گر هوشمند BMI و صدور رژیم خودکار', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'مرکز روانشناسی، مشاوره خانواده و روان‌درمانی آنلاین', sub: 'رزرو جلسه مشاوره حضوری، تلفنی و تصویری (ویژه ایرانیان خارج از کشور)', engine: 'تست‌های روانشناسی استاندارد با تفسیر فوری', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'کلینیک جامع فیزیوتراپی، توانبخشی ورزشی و درمان دیسک', sub: 'لیزردرمانی پرتوان، مگنت‌تراپی و فیزیوتراپی در منزل', engine: 'نوبت‌دهی ۱۰ جلسه‌ای با طرف قرارداد بیمه‌های تکمیلی', priceReady: 9500000, priceCustom: 26500000 },
    { name: 'آزمایشگاه تشخیص طبی و پاتولوژی — نمونه‌گیری رایگان در منزل', sub: 'مشاهده آنلاین جواب آزمایش با کد ملی و ارسال پیامکی PDF', engine: 'درخواست اعزام نمونه‌گیر به منزل یا محل کار', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'مرکز تصویربرداری پزشکی، سونوگرافی، MRI و ماموگرافی', sub: 'نوبت‌دهی بدون انتظار + مشاهده آنلاین تصاویر رادیولوژی (PACS)', engine: 'آمادگی‌های قبل از سونوگرافی + جواب‌دهی آنلاین', priceReady: 13000000, priceCustom: 38000000 },
    { name: 'کلینیک فوق‌تخصصی چشم‌پزشکی، لیزیک، فمتولیزیک و آب‌مروارید', sub: 'تعیین نوبت معاینه بینایی‌سنجی و جراحی‌های 굴절ی چشم', engine: 'تست آنلاین اولیه بینایی و جدول تعرفه عمل‌ها', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'بیمارستان دامپزشکی و کلینیک تخصصی حیوانات خانگی', sub: 'واکسیناسیون، جراحی، سونوگرافی، آرایشگاه پت و اورژانس ۲۴ ساعته', engine: 'پرونده سلامت دیجیتال پت و یادآور پیامکی واکسن', priceReady: 10000000, priceCustom: 27500000 },
    { name: 'مرکز تخصصی شنوایی‌سنجی، تجویز سمعک نامرئی و گفتاردرمانی', sub: 'تست ادیومتری، قالب‌گیری سمعک هوشمند و تنظیم در منزل سالمندان', engine: 'مقایسه برندهای سمعک زیمنس، اتیکن و ویدکس', priceReady: 9500000, priceCustom: 26000000 },
    { name: 'کلینیک تخصصی ارتوپدی فنی، اسکن کف پا و ساخت کفی طبی', sub: 'اصلاح صافی کف پا، بریس ستون فقرات و کفش‌های طبی سفارشی', engine: 'رزرو نوبت اسکن سه بعدی لیزری کف پا', priceReady: 9500000, priceCustom: 26500000 },
    { name: 'مطب متخصص زنان، زایمان، نازایی و مراقبت‌های بارداری', sub: 'تقویم هفته به هفته بارداری، نوبت‌دهی سونوگرافی و مشاوره آنلاین', engine: 'ماشین‌حساب تاریخ زایمان و غربالگری جنین', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'کلینیک تخصصی قلب و عروق، اکوکاردیوگرافی، تست ورزش و هولتر', sub: 'نوبت‌دهی فوری نوار قلب، آنژیوگرافی و چکاپ کامل قلبی', engine: 'ارزیابی آنلاین ریسک فشار خون و سلامت قلب', priceReady: 11000000, priceCustom: 30000000 },
    { name: 'مرکز خدمات پرستاری در منزل، ویزیت پزشک و اجاره تجهیزات ICU', sub: 'اعزام فوری پزشک، پرستار سالمند/کودک، سرم‌تراپی و اکسیژن‌ساز در منزل', engine: 'ثبت درخواست فوری اعزام پرستار در کمتر از ۳۰ دقیقه', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'کلینیک تخصصی کودکان، نوزادان و پایش رشد و واکسیناسیون', sub: 'نمودار رشد کودک، مشاوره تغذیه نوزاد و نوبت‌دهی بدون معطلی', engine: 'جدول هوشمند زمان‌بندی واکسن‌ها و پایش قد و وزن', priceReady: 9500000, priceCustom: 26000000 },
    { name: 'مرکز تخصصی طب سنتی، حجامت، فصد خون و گیاهان دارویی', sub: 'مزاج‌شناسی آنلاین هوشمند و تجویز پکیج‌های درمانی گیاهی', engine: 'آزمون ۴۰ سوالی تعیین مزاج (دموی، صفراوی، بلغمی، سوداوی)', priceReady: 10000000, priceCustom: 27000000 },
    { name: 'مرکز اسپا، ماساژ درمانی تخصصی، ریلکسیشن و حمام ترکی', sub: 'رزرو آنلاین پکیج‌های ماساژ تایلندی، سوئدی، سنگ داغ و گیفت‌کارت هدیه', engine: 'انتخاب ماسور، اتاق VIP و خرید کارت هدیه دیجیتال', priceReady: 10500000, priceCustom: 28500000 },
    { name: 'کلینیک تخصصی ترک اعتیاد، نوروفیدبک و rTMS مغزی', sub: 'مشاوره کاملاً محرمانه، سم‌زدایی فوق‌سریع و درمان اضطراب و افسردگی', engine: 'رزرو محرمانه نوبت و چت مستقیم با روانپزشک', priceReady: 11000000, priceCustom: 31000000 },
  ],
  'corporate-industrial': [
    { name: 'هلدینگ پیمانکاری، راه‌سازی، ابنیه و پروژه‌های عمرانی', sub: 'معرفی رزومه پروژه‌های ملی، ماشین‌آلات سنگین و گواهینامه‌های صلاحیت رتبه ۱', engine: 'کاتالوگ پروژه‌ها + دانلود رزومه رسمی شرکت PDF', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'کارخانه تولید فولاد، مقاطع فلزی، میلگرد، تیرآهن و ورق', sub: 'جدول اعلام قیمت روزانه آهن‌آلات + صدور پیش‌فاکتور رسمی آنلاین', engine: 'محاسبه‌گر وزن میلگرد و ورق + نمودار لحظه‌ای قیمت آهن', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'شرکت بازرگانی صادرات و واردات، ترخیص کالا و گمرک', sub: 'سایت ۳ زبانه (فارسی/انگلیسی/عربی) ویژه تجار، ثبت سفارش و حمل بین‌المللی', engine: 'استعلام آنلاین هزینه حمل دریایی، هوایی و ترخیص گمرکی', priceReady: 12000000, priceCustom: 34500000 },
    { name: 'شرکت مهندسی صنایع پتروشیمی، نفت، گاز و تامین شیرآلات صنعتی', sub: 'کاتالوگ فنی تجهیزات پالایشگاهی (Vendor List) با استانداردهای API و ISO', engine: 'جستجوی فنی پارت‌نامبر تجهیزات و استعلام قیمت B2B', priceReady: 13000000, priceCustom: 38000000 },
    { name: 'کارخانه صنایع غذایی، لبنیات، کنسروجات و پخش مویرگی سراسری', sub: 'معرفی سبد محصولات، جدول ارزش غذایی، جذب نمایندگی فروش و صادرات', engine: 'فرم اخذ نمایندگی استانی + کاتالوگ محصولات صادراتی', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'شرکت حمل‌ونقل بین‌المللی، فورواردری، باربری و لجستیک هوشمند', sub: 'رهگیری لحظه‌ای کانتینر و بارنامه با کد رهگیری + استعلام کرایه حمل', engine: 'سامانه ترکینگ بارنامه و محاسبه تناژ و کرایه ترانزیت', priceReady: 12000000, priceCustom: 35000000 },
    { name: 'شرکت مهندسی برق، تابلو برق صنعتی، اتوماسیون و نیروگاه خورشیدی', sub: 'طراحی و اجرای سولار پنل، دیزل ژنراتور و تابلوهای فشار متوسط و ضعیف', engine: 'ماشین‌حساب توان مصرفی و برآورد هزینه پنل خورشیدی', priceReady: 11000000, priceCustom: 31500000 },
    { name: 'شرکت نرم‌افزاری، هوش مصنوعی، فناوری اطلاعات و خدمات شبکه', sub: 'فروش نرم‌افزارهای سازمانی، خدمات پشتیبانی سرور، امنیت سایبری و ویپ', engine: 'دموی آنلاین نرم‌افزار + پنل قراردادهای پشتیبانی SLA', priceReady: 11500000, priceCustom: 33000000 },
    { name: 'آژانس دیجیتال مارکتینگ، تبلیغات محیطی، بیلبورد و ساخت تیزر', sub: 'نقشه بیلبوردهای شهری، نمونه‌کارهای ویدیویی، برندبوک و کمپین‌های تبلیغاتی', engine: 'پلیر اختصاصی تیزرها + تقویم رزرو رسانه و بیلبورد', priceReady: 11000000, priceCustom: 30000000 },
    { name: 'کارخانه تولید قطعات خودرو، تزریق پلاستیک و قالب‌سازی صنعتی', sub: 'معرفی خطوط تولید رباتیک، آزمایشگاه کنترل کیفیت و تامین قطعه خودروسازان', engine: 'ارسال فایل سه بعدی قطعه (CAD) جهت استعلام ساخت قالب', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'شرکت تولید کود، سموم کشاورزی، بذر اصلاح‌شده و گلخانه‌سازی', sub: 'راهنمای مصرف کودها برای محصولات مختلف، مشاوره گیاه‌پزشکی و فروش عمده', engine: 'جدول برنامه کوددهی درختان و محصولات زراعی', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'کارخانه تولید دارو، مکمل‌های دارویی و تجهیزات بیمارستانی', sub: 'معرفی خطوط تولید GMP، بانک اطلاعات داروها ویژه پزشکان و داروخانه‌ها', engine: 'جستجوگر تخصصی داروها بر اساس ماده موثره و گروه درمانی', priceReady: 12500000, priceCustom: 35500000 },
    { name: 'شرکت خدمات حسابداری، حسابرسی، مشاوره مالیاتی و سامانه مودیان', sub: 'اعزام مدیر مالی، دفاعیه مالیاتی، ارسال صورتحساب الکترونیکی و ثبت شرکت', engine: 'ماشین‌حساب آنلاین مالیات عملکرد و حقوق سال ۱۴۰۵', priceReady: 10000000, priceCustom: 27500000 },
    { name: 'کارخانه چاپ و بسته‌بندی، کارتن‌سازی، لیبل و جعبه فانتزی', sub: 'سفارش آنلاین چاپ جعبه اختصاصی، ساک دستی کاغذی و لیبل پشت‌چسب‌دار', engine: 'محاسبه‌گر آنلاین قیمت چاپ بر اساس ابعاد، گرماژ و تیراژ', priceReady: 11500000, priceCustom: 33000000 },
    { name: 'شرکت طراحی، نصب و سرویس آسانسور، پله‌برقی و بالابر صنعتی', sub: 'معرفی پکیج‌های آسانسور کششی و هیدرولیک، اخذ استاندارد و سرویس ماهانه', engine: 'فرم محاسبه ظرفیت کابین و درخواست اعزام سرویس‌کار', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'شرکت تاسیسات حرارتی و برودتی، چیلر، فن‌کویل و تهویه مطبوع', sub: 'طراحی موتورخانه مرکزی، فروش VRF، داکت اسپلیت و پکیج‌های صنعتی', engine: 'محاسبه‌گر ظرفیت برودتی (BTU) بر اساس متراژ ساختمان', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'شرکت خدمات تشریفات مجالس، همایش‌های بین‌المللی و غرفه‌سازی نمایشگاهی', sub: 'طراحی سه بعدی غرفه نمایشگاه بین‌المللی، تامین تجهیزات کنفرانس و پذیرایی VIP', engine: 'گالری غرفه‌های نمایشگاهی اجراشده + فرم استعلام متراژ', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'شرکت سیستم‌های حفاظتی، دوربین مداربسته IP، دزدگیر و خانه هوشمند', sub: 'پکیج‌های آماده نظارت تصویری، کنترل تردد تشخیص چهره و هوشمندسازی BMS', engine: 'پکیج‌ساز هوشمند تعداد دوربین مداربسته و هارد مورد نیاز', priceReady: 10500000, priceCustom: 28500000 },
    { name: 'هلدینگ معدن، استخراج سنگ‌های ساختمانی، مرمر، تراورتن و گرانیت', sub: 'ویترین اسلب‌های سنگ صادراتی با ابعاد و قیمت، ویژه سازندگان و تجار بین‌المللی', engine: 'نمایشگر کیفیت و سورت‌بندی سنگ‌های اسلب و تایل', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'شرکت خدمات نظافتی، تامین نیروی انسانی و نگهداری مجتمع‌های اداری', sub: 'رزرو آنلاین نظافت منزل، راه‌پله، کفسابی و قرارداد سالانه شرکت‌ها', engine: 'رزرو ساعتی نیروی خدماتی احراز هویت شده به صورت آنلاین', priceReady: 9500000, priceCustom: 26500000 },
  ],
  'fashion-retail': [
    { name: 'استریت‌مد — فروشگاه آنلاین پوشاک، هودی، تیشرت و کتانی اورجینال', sub: 'جدول سایزبندی هوشمند بر اساس قد و وزن + اتصال اسنپ‌پی ۴ قسطه', engine: 'انتخاب رنگ و سایز زنده + ست کردن استایل کامل', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'مزون تخصصی لباس عروس، لباس مجلسی و مانتوهای فاخر کتی', sub: 'رزرو وقت پرو حضوری در مزون + سفارش دوخت بر اساس سایز اختصاصی مشتری', engine: 'لوک‌بوک ویدیویی کالکشن فصل و فرم ثبت اندازه‌های دوخت', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'گالری طلا و جواهرات ۱۸ عیار — محاسبه لحظه‌ای قیمت بر اساس مظنه طلا', sub: 'آپدیت ثانیه‌ای قیمت تمام گردنبندها، دستبندها و انگشترها بر اساس نرخ لحظه‌ای طلا', engine: 'فرمول اتوماتیک (وزن × نرخ لحظه‌ای طلا + اجرت + سود)', priceReady: 13500000, priceCustom: 39000000 },
    { name: 'فروشگاه تخصصی ساعت مچی لوکس و هوشمند (گارانتی اصالت موتور)', sub: 'مقایسه مشخصات فنی موتور اتوماتیک و کوارتز، مقاومت آب و خرید اقساطی', engine: 'فیلتر پیشرفته برند، جنس بند، قطر صفحه و موتور ساعت', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'فروشگاه اینترنتی مانتو، شومیز، پالتو و پوشاک بانوان', sub: 'کالکشن‌های فصلی با راهنمای دقیق دور سینه و قد + تعویض سایز رایگان', engine: 'نمایش استایل روی مانکن با قد و سایزهای مختلف', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'بوتیک کت‌وشلوار رسمی، پیراهن دامادی و پوشاک کلاسیک مردانه', sub: 'سفارش شخصی‌دوزی (Tailor-Made) کت‌وشلوار با پارچه‌های فاستونی و ایتالیایی', engine: 'راهنمای انتخاب سایز کت و شلوار + رزرو وقت اندازه‌گیری', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'فروشگاه آنلاین شال، روسری، مینی‌اسکارف ابریشم و اکسسوری مو', sub: 'خرید تکی و پک‌های هدیه با قیمت اقتصادی و ارسال فوری پستی', engine: 'انتخاب سریع طرح و قواره روسری با زوم بافت پارچه', priceReady: 9500000, priceCustom: 26500000 },
    { name: 'فروشگاه تخصصی کتانی، اسنیکرز، کفش پیاده‌روی و رانینگ', sub: 'راهنمای انتخاب سایز بر اساس سانتی‌متر کفی پا (CM) برای جلوگیری از خطای سایز', engine: 'تبدیل سایز اروپایی به سانتی‌متر پا + تضمین تعویض', priceReady: 11000000, priceCustom: 30000000 },
    { name: 'گالری نقره‌جات، بدلیجات رنگ ثابت ژوپینگ و سنگ‌های قیمتی', sub: 'انگشتر نقره ۹۲۵، سرویس جواهرات نقره آبکاری طلا سفید و دستبند سنگ', engine: 'راهنمای تعیین سایز انگشتر در خانه + بسته‌بندی کادویی', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'فروشگاه تخصصی عطر، ادکلن اورجینال، دکانت و تسترهای دست‌ریز', sub: 'جستجوی عطر بر اساس طبع (گرم، خنک، شیرین، تلخ)، فصل و نت‌های بویایی', engine: 'عالی‌ترین سیستم پیشنهادگر عطر بر اساس سلیقه بویایی', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'فروشگاه اینترنتی لباس زیر، لباس راحتی، خواب و جوراب', sub: 'بسته‌بندی کاملاً محرمانه بدون درج نام کالا روی بسته پستی', engine: 'محاسبه‌گر سایز استاندارد + ارسال محرمانه سریع', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'برند پوشاک ورزشی، لگ، نیم‌تنه باشگاهی و ست‌های اسلش', sub: 'پارچه‌های فلامنت و لاکرا ضدتعریق ویژه باشگاه بدنسازی و یوگا', engine: 'خرید ست کامل ورزشی با ۱۵٪ تخفیف ترکیبی', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'فروشگاه آنلاین چمدان، ساک مسافرتی، کوله‌پشتی و لوازم سفر', sub: 'ست ۳ تایی چمدان پلی‌کربنات نشکن با چرخ‌های ۳۶۰ درجه سایلنت', engine: 'مقایسه ابعاد کابین، متوسط و بزرگ چمدان‌ها', priceReady: 10000000, priceCustom: 28500000 },
    { name: 'فروشگاه پوشاک کودک و نوجوان، لباس ست مادر و کودک', sub: 'جدول سایزبندی دقیق بر اساس ماه و سال سن کودک (نوزادی تا ۱۴ سال)', engine: 'فیلتر سن، جنسیت و جنس نخ‌پنبه ضدحساسیت', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'فروشگاه اینترنتی پارچه‌سرا — خرید متری پارچه مجلسی، مانتویی و کتانی', sub: 'انتخاب متراژ دلخواه (حتی نیم متر) همراه با ویدیوی ریزش و ایستایی پارچه', engine: 'ماشین‌حساب متراژ پارچه بر اساس مدل لباس و سایز', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'گالری صنایع دستی، فرش دستباف، گلیم، ترمه و میناکاری اصفهان', sub: 'ویترین دو زبانه فروش فرش ابریشم و صنایع دستی فاخر با شناسنامه هنرمند', engine: 'پرو مجازی فرش در دکوراسیون منزل + ارسال بین‌المللی', priceReady: 12000000, priceCustom: 34000000 },
    { name: 'فروشگاه تخصصی لباس کار، فرم اداری، روپوش پزشکی و ایمنی (HSE)', sub: 'سفارش تک و عمده لباس فرم پرسنل با گلدوزی و چاپ اختصاصی لوگوی شرکت', engine: 'فرم سفارش عمده سازمانی با جدول سایزبندی پرسنل', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'بوتیک لباس‌های سایز بزرگ (Plus Size) زنانه و مردانه', sub: 'تنوع کامل از سایز ۴۶ تا ۶۰ با جدول دقیق دور سینه، دور کمر و باسن', engine: 'راهنمای اختصاصی اندازه‌گیری سایز بزرگ بدون خطا', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'فروشگاه آنلاین کلاه، شال‌گردن، دستکش چرم و اکسسوری زمستانه', sub: 'کلاه‌های کپ اورجینال، فدورا، بافتنی و دستکش‌های لمسی موبایل', engine: 'فیلتر فرم صورت و راهنمای سایز دور سر', priceReady: 9500000, priceCustom: 26000000 },
    { name: 'پلتفرم حراجی آنلاین و اوت‌لت برندهای پوشاک (تخفیف‌های آخر فصل)', sub: 'تایمر شمارنده معکوس حراجی‌های ۲۴ ساعته و خرید گروهی با قیمت عمده', engine: 'موتور حراج فلش‌سیل (Flash Sale) و کوپن‌های پلکانی', priceReady: 12000000, priceCustom: 34500000 },
  ],
  'real-estate': [
    { name: 'البرز ملک — پورتال جامع خرید، فروش، رهن و اجاره املاک روی نقشه', sub: 'جستجوی هوشمند آپارتمان و ویلا بر اساس منطقه، متراژ، بودجه و سال ساخت', engine: 'نقشه تعاملی املاک + تبدیل رهن و اجاره + پنل مشاوران', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'هلدینگ ساختمانی و پیش‌فروش برج‌های لوکس مسکونی و اداری', sub: 'نمایش پلان طبقات، پیشرفت فیزیکی پروژه، جدول اقساط پیش‌خرید و تور ۳۶۰ درجه', engine: 'انتخاب طبقه و واحد روی نمای سه بعدی برج + جدول اقساط', priceReady: 13000000, priceCustom: 38000000 },
    { name: 'پورتال تخصصی خرید و فروش ویلا و زمین در شمال (مازندران و گیلان)', sub: 'فیلتر ویلاهای شهرکی، جنگلی، ساحلی، سند تک‌برگ و جواز ساخت با ویدیوی پهپاد', engine: 'تور ویدیویی هوایی + استعلام اصالت سند و کاربری زمین', priceReady: 12000000, priceCustom: 34500000 },
    { name: 'استودیو معماری، طراحی داخلی، بازسازی لوکس ساختمان و روف‌گاردن', sub: 'اسلایدر مقایسه‌ای قبل و بعد از بازسازی + ماشین‌حساب برآورد هزینه بازسازی هر متر', engine: 'مقایسه‌گر تصویری Before/After و محاسبه‌گر هزینه بازسازی', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'سامانه رزرو آنلاین اقامتگاه بوم‌گردی، اجاره روزانه ویلا و سوئیت (مشابه جاجیگا)', sub: 'تقویم آنلاین روزهای خالی و پر، محاسبه نرخ آخر هفته و پرداخت امن بیعانه', engine: 'تقویم رزرواسیون روزانه + پنل میزبانان و مهمانان', priceReady: 14000000, priceCustom: 44000000 },
    { name: 'گالری مبلمان، سرویس خواب، ناهارخوری و دکوراسیون منزل', sub: 'انتخاب آنلاین رنگ چوب و کالیته پارچه مبل + شرایط خرید اقساطی با چک صیادی', engine: 'انتخابگر کالیته پارچه و رنگ چوب + محاسبه اقساط چکی', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'فروشگاه تخصصی کابینت آشپزخانه، کمد دیواری مدرن، نئوکلاسیک و انزو', sub: 'محاسبه‌گر آنلاین قیمت مترطول کابینت + درخواست اعزام کارشناس اندازه‌گیری رایگان', engine: 'فرمول محاسبه مترمربع کابینت بر اساس جنس ورق و یراق', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'کلینیک ساختمانی — فروش کاشی، سرامیک اسلب، شیرآلات توکار و چینی بهداشتی', sub: 'محاسبه‌گر تعداد کارتن سرامیک بر اساس متراژ کف و دیوار + مشاهده در فضای سه بعدی', engine: 'ماشین‌حساب متراژ و پرت کاشی + کاتالوگ ابعاد اسلب', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'فروشگاه تخصصی پرده زبرا، ورتیکال، پانچ، کاغذ دیواری و پارکت لمینت', sub: 'وارد کردن عرض و ارتفاع پنجره توسط مشتری و محاسبه آنی قیمت دوخت و نصب پرده', engine: 'محاسبه‌گر دقیق قیمت بر اساس عرض×ارتفاع پنجره یا دیوار', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'مرکز تخصصی مشارکت در ساخت، تهاتر ملک و سرمایه‌گذاری ملکی', sub: 'معرفی سازندگان برند منطقه، محاسبه قدرالسهم مالک و سازنده و درصد بلاعوض', engine: 'ماشین‌حساب آنلاین قدرالسهم مشارکت در ساخت و تراکم', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'پورتال تخصصی املاک صنعتی — خرید و اجاره کارخانه، سوله، کارگاه و انبار', sub: 'فیلتر شهرک صنعتی، متراژ سوله، آمپراژ برق سه‌فاز، جرثقیل سقفی و ارتفاع تاج', engine: 'جستجوگر تخصصی شهرک‌های صنعتی سراسر کشور', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'مشاوره سرمایه‌گذاری و خرید ملک در ترکیه، امارات (دبی)، قبرس و اروپا', sub: 'پروژه‌های دلاری و درهمی با شرایط اقساط سازنده و اخذ اقامت/پاسپورت از طریق خرید ملک', engine: 'نمایش قیمت به ریال، دلار و درهم + محاسبه بازدهی اجاره (ROI)', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'فروشگاه آنلاین لوستر، چراغ‌های خطی مدرن (لاینر)، آباژور و نورپردازی', sub: 'انتخاب تعداد شاخه لوستر، رنگ بدنه و دمای نور (آفتابی/مهتابی/نچرال)', engine: 'محاسبه‌گر شدت روشنایی مورد نیاز هر اتاق (لومن)', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'شرکت طراحی و اجرای فضای سبز، محوطه‌سازی ویلا، استخر و آلاچیق', sub: 'پکیج‌های ساخت استخر بتنی، جکوزی، آتشکده، باربیکیو و آبیاری قطره‌ای هوشمند', engine: 'گالری محوطه‌سازی ویلاها + برآورد هزینه ساخت استخر', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'فروشگاه درب‌های ضدسرقت، درب داخلی ABS/پلی‌وود و قفل دیجیتال هوشمند', sub: 'انتخاب روکش چوب راش/گردو، دستگیره اثرانگشتی و تشخیص چهره با نصب فوری', engine: 'شخصی‌سازی یراق و قفل هوشمند روی هر مدل درب ضدسرقت', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'تولیدی پنجره‌های دوجداره UPVC، آلومینیوم ترمال‌بریک و شیشه‌های بالکنی تاشو', sub: 'محاسبه آنلاین قیمت تعویض پنجره قدیمی بدون تخریب بر اساس ابعاد و پروفیل وین‌تک/هافمن', engine: 'ماشین‌حساب ابعاد پنجره دوجداره و نوع بازشو', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'فروشگاه فرش ماشینی ۱۲۰۰ و ۱۵۰۰ شانه کاشان، تابلوفرش و موکت تایل', sub: 'انتخاب سایز ۶ متری، ۹ متری، ۱۲ متری، قالیچه و کناره با ارسال مستقیم از کارخانه کاشان', engine: 'زوم باکیفیت بافت فرش + خرید اقساطی بدون ضامن', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'مرکز فروش مصالح ساختمانی، سیمان، گچ، بلوک هبلکس، آجرنما و ایزوگام', sub: 'فروش عمده و خرده مصالح پای کار ساختمان با محاسبه کرایه خاور و تریلی', engine: 'استعلام قیمت روز مصالح و ثبت سفارش تناژی آنلاین', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'سامانه مدیریت هوشمند ساختمان، شارژ مجتمع‌های مسکونی و برج‌ها', sub: 'پرداخت آنلاین شارژ ماهانه، گزارش هزینه‌های مشاعات، تابلوی اعلانات و رزرو سالن اجتماعات', engine: 'پنل مدیر ساختمان و پنل ساکنین با پرداخت قبض', priceReady: 12000000, priceCustom: 35000000 },
    { name: 'دفتر مهندسی نقشه‌برداری، اخذ جواز ساخت، پایانکار و سند تک‌برگ (ماده ۱۰۰)', sub: 'استعلام وضعیت پهنه شهرداری، محاسبه تراکم مجاز و پیگیری پرونده‌های ثبتی و نظام مهندسی', engine: 'فرم ارسال پلاک ثبتی جهت بررسی رایگان ضوابط ملک', priceReady: 10000000, priceCustom: 28000000 },
  ],
  'cafe-restaurant': [
    { name: 'رستری قهوه تخصصی و کافه آنلاین — سفارش دانه قهوه با انتخاب درجه آسیاب', sub: 'انتخاب نوع دستگاه دم‌آوری (اسپرسو، موکاپات، کمکس، فرانسه) و منوی دیجیتال کافه', engine: 'شخصی‌سازی آسیاب قهوه + منوی QR سر میز کافه', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'رستوران ایرانی، کبابی و کترینگ بیرون‌بر — سفارش آنلاین بدون کمیسیون', sub: 'حذف کمیسیون سنگین پلتفرم‌ها؛ سفارش مستقیم غذا با محاسبه محدوده پیک روی نقشه و چاپ فیش', engine: 'محدوده‌بندی پیک روی نقشه + اتصال پرینتر حرارتی صندوق', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'فست‌فود، پیتزا و برگر تخصصی — پیتزاساز سفارشی و سفارش آنلاین شبانه', sub: 'امکان اضافه کردن پنیر، تاپینگ و سس دلخواه به هر برگر و پیتزا + باشگاه مشتریان کش‌بک', engine: 'ماژول شخصی‌سازی مواد پیتزا + کد تخفیف سفارش اول', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'قنادی آنلاین، کیک تولد سفارشی، شیرینی تر و خشک و پکیج پذیرایی', sub: 'انتخاب وزن کیک، طعم فیلینگ (موز و گردو، نوتلا، کارامل)، آپلود عکس روی کیک و متن تبریک', engine: 'سفارش‌ساز کیک تولد با انتخاب لایه‌ها و ساعت تحویل', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'آژانس مسافرتی و جهانگردی — رزرو تورهای خارجی و داخلی + سفر اقساطی', sub: 'جدول مقایسه هتل‌های ۳ تا ۵ ستاره هر تور، ماشین‌حساب اقساط چک صیادی و خدمات ویزا', engine: 'موتور پکیج‌ساز تور + محاسبه‌گر اقساط سفر', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'وب‌سایت رسمی هتل ۵ ستاره، هتل‌آپارتمان و مجتمع اقامتی تفریحی', sub: 'رزرو مستقیم اتاق و سوئیت بدون واسطه با تقویم ظرفیت، گالری ۳۶۰ درجه و صدور واچر آنی', engine: 'موتور رزرواسیون هتل (Booking Engine) + صدور واچر PDF', priceReady: 13000000, priceCustom: 38000000 },
    { name: 'پلتفرم تهیه غذای رژیمی، سالم‌خوری، پک‌های پروتئینی ورزشی و گیاهی', sub: 'نمایش دقیق کالری، پروتئین، کربوهیدرات و چربی هر پرس غذا + اشتراک هفتگی و ماهانه ناهار', engine: 'محاسبه‌گر ماکروهای غذایی + اشتراک ارسال روزانه غذا', priceReady: 11500000, priceCustom: 33000000 },
    { name: 'کترینگ سازمانی، تامین غذای پرسنل شرکت‌ها، کارخانجات و مجالس', sub: 'تنظیم برنامه غذایی ماهانه پرسنل شرکت‌ها، سفارش عمده مجالس و صدور فاکتور رسمی ارزش‌افزوده', engine: 'پنل سفارش غذای سازمانی ویژه شرکت‌ها با تسویه ماهانه', priceReady: 11000000, priceCustom: 31500000 },
    { name: 'باغ‌تالار عروسی، عمارت تشریفاتی و سالن عقد و تولد', sub: 'محاسبه‌گر آنلاین هزینه مراسم عروسی بر اساس تعداد مهمان، منوی شام و خدمات تشریفات', engine: 'ماشین‌حساب آنلاین پکیج عروسی + تقویم شب‌های خالی تالار', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'منوی دیجیتال QR Code هوشمند ویژه کافه‌ها، رستوران‌ها و فودکورت‌ها', sub: 'فراخوان گارسون از طریق موبایل، درخواست صورتحساب، پرداخت آنلاین سر میز و ثبت نظر', engine: 'منوی فوق‌سریع موبایل + دکمه پیجر فراخوان سالن‌دار', priceReady: 8500000, priceCustom: 24000000 },
    { name: 'فروشگاه آنلاین پروتئینی، قصابی مدرن، استیک‌های مرینیت‌شده و شیلات تازه', sub: 'انتخاب نوع خرد کردن گوشت، مرینیت آماده کباب/جوجه و ارسال با خودروی یخچال‌دار', engine: 'انتخاب وزن و نوع برش گوشت + زمان‌بندی ارسال سرد', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'کافه بیکری، نان‌های حجیم فرانسوی (کروسان و خمیرترش) و صبحانه‌خوری', sub: 'پیش‌سفارش نان داغ صبحگاهی و پک‌های صبحانه کاری و مهمانی (فینگرفود)', engine: 'زمان‌بندی پخت روزانه نان + سفارش پک فینگرفود مهمانی', priceReady: 10000000, priceCustom: 28000000 },
    { name: 'مرکز تفریحات دریایی، گردشگری کیش و قشم، اجاره یات و ورزش‌های آبی', sub: 'خرید آنلاین بلیط شاتل، پاراسل، غواصی، گشت جزیره، کنسرت و اجاره خودروهای لوکس با تخفیف', engine: 'صدور بلیط دیجیتال QR Code با تایید لحظه‌ای ظرفیت', priceReady: 12000000, priceCustom: 34500000 },
    { name: 'پلتفرم تورهای طبیعت‌گردی، کویرنوردی، رفتینگ و کمپینگ‌های گروهی', sub: 'نمایش درجه سختی سفر، لیست لوازم مورد نیاز، معرفی لیدر و ثبت‌نام گروهی همسفران', engine: 'سیستم ثبت‌نام همسفران با بیمه مسافرتی خودکار', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'آبمیوه، بستنی طبیعی، اسموتی بار و دسرهای سنتی و بین‌المللی', sub: 'ترکیب سفارشی میوه‌ها و ویتامین‌ها توسط مشتری + سفارش آنلاین پک‌های معجون و بستنی', engine: 'میکسر آنلاین ترکیب اسموتی و آبمیوه طبیعی', priceReady: 9500000, priceCustom: 26500000 },
    { name: 'رستوران بین‌المللی، ایتالیایی، سوشی‌بار و استیک‌هاوس لوکس (Fine Dining)', sub: 'رزرو آنلاین میز (داخل سالن، تراس VIP یا روف‌گاردن) برای تاریخ و ساعت مشخص به همراه پیش‌سفارش', engine: 'نقشه چیدمان میزهای رستوران جهت رزرو میز دلخواه', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'مرکز تخصصی اخذ ویزای شنگن، کانادا، انگلیس، وقت سفارت و پیکاپ ویزا', sub: 'بررسی آنلاین مدارک متقاضی، رزرو واچر هتل و پرواز سفارت و پیگیری وضعیت پرونده ویزا', engine: 'چک‌لیست هوشمند مدارک ویزا به تفکیک هر سفارت', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'سایت زیارتی و کاروان‌های تخصصی کربلا، نجف، مشهد مقدس و عمره مفرده', sub: 'ثبت‌نام کاروان‌های هوایی و زمینی، معرفی هتل‌های نزدیک حرم و شرایط سفر اقساطی بازنشستگان', engine: 'ثبت‌نام گروهی و خانوادگی زائرین با کسر از حقوق/چک', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'مجتمع تفریحی، شهربازی سرپوشیده، اتاق فرار (Escape Room) و بولینگ', sub: 'رزرو سانس اتاق فرار و بولینگ، شارژ کارت بازی شهربازی و رزرو جشن تولد کودک', engine: 'تقویم سانس‌های ساعتی اتاق فرار با پرداخت بیعانه', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'فروشگاه تخصصی تجهیزات کافه و رستوران صنعتی (اسپرسوساز صنعتی، فر، یخچال)', sub: 'مشاوره راه‌اندازی صفر تا صد کافه و فست‌فود، طراحی چیدمان آشپزخانه صنعتی و فروش تجهیز', engine: 'پکیج‌ساز هزینه راه‌اندازی کافه بر اساس متراژ', priceReady: 11500000, priceCustom: 32000000 },
  ],
  'education-lms': [
    { name: 'آکادمی لرن‌پلاس — سامانه جامع آموزشگاه آنلاین، فروش دوره و آزمون (LMS)', sub: 'پخش امن ویدیوها با واترمارک شماره موبایل دانشجو، کوئیز آنلاین و صدور گواهینامه QR', engine: 'پلیر ضددانلود HLS + آزمون‌ساز + صدور مدرک معتبر', priceReady: 12000000, priceCustom: 35000000 },
    { name: 'موسسه حقوقی، وکالت و داوری بین‌المللی — رزرو وقت مشاوره وکیل پایه یک', sub: 'رزرو جلسه مشاوره حضوری/تلفنی با وکیل ملکی، خانواده و کیفری + فرم ارزیابی پرونده', engine: 'رزرو آنلاین تایم وکیل + پنل پیگیری پرونده موکلین', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'آکادمی آموزش زبان‌های خارجی (آیلتس، تافل، آلمانی و مکالمه فشرده)', sub: 'آزمون تعیین سطح آنلاین هوشمند در ۱۰ دقیقه + رزرو کلاس‌های گروهی و خصوصی با استاد', engine: 'تعیین سطح خودکار آنلاین + تقویم رزرو استاد خصوصی', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'موسسه کنکور، مشاوره تحصیلی، انتخاب رشته و پانسیون مطالعاتی', sub: 'فروش بسته‌های جامع کنکوری، آزمون‌های آزمایشی شبیه‌ساز، کارنامه تراز و رزرو مشاور', engine: 'تخمین رتبه کنکور + پنل گزارش ساعت مطالعه دانش‌آموز', priceReady: 12000000, priceCustom: 34500000 },
    { name: 'موسسه مهاجرت تحصیلی، اپلای دانشگاه‌های خارج، بورسیه و اقامت کاری', sub: 'فرم ارزیابی رایگان شانس پذیرش و ویزا، معرفی دانشگاه‌ها به تفکیک کشور و نگارش SOP/CV', engine: 'فرم چندمرحله‌ای محاسبه امتیاز مهاجرتی و شانس اپلای', priceReady: 11500000, priceCustom: 32000000 },
    { name: 'آکادمی آموزش بازارهای مالی، بورس، فارکس، پرایس‌اکشن و ارز دیجیتال', sub: 'فروش دوره‌های ترید، وبینارهای تحلیل هفتگی زنده، ماشین‌حساب مدیریت سرمایه و سیگنال', engine: 'نمودار زنده TradingView + پنل اشتراک ویژه اعضا (VIP)', priceReady: 12000000, priceCustom: 34000000 },
    { name: 'آموزشگاه فنی‌وحرفه‌ای آزاد (آشپزی، زیبایی، تعمیرات موبایل، حسابداری و...)', sub: 'ثبت‌نام دوره‌های عملی کارگاهی با تقسیط شهریه و استعلام مدرک رسمی سازمان فنی‌وحرفه‌ای', engine: 'تقویم شروع ورکشاپ‌های عملی + پرداخت اقساطی شهریه', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'وب‌سایت رسمی مدرسه غیرانتفاعی، دبستان، دبیرستان و پیش‌دبستانی هوشمند', sub: 'پیش‌ثبت‌نام آنلاین دانش‌آموزان، کارنامه ماهانه، پرداخت شهریه، گالری فعالیت‌ها و پنل اولیا', engine: 'سامانه پیش‌ثبت‌نام و مصاحبه + پورتال ارتباط اولیا و مدرسه', priceReady: 11000000, priceCustom: 31000000 },
    { name: 'آکادمی موسیقی، هنرهای تجسمی، بازیگری، عکاسی و تدوین سینما', sub: 'معرفی اساتید هر ساز، رزرو تایم کلاس‌های تک‌نفره هفتگی و گالری آثار هنرجویان', engine: 'رزرو تایم هفتگی کلاس با استاد + نمونه صدای اساتید', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'پلتفرم برگزاری وبینار، سمینار، ایونت، کنفرانس و فروش بلیط رویداد (مشابه ایوند)', sub: 'تعریف صندلی و بلیط VIP/عادی، صدور بلیط QR Code، اتصال به اسکای‌روم/بیگ‌بلوباتن و ویدیو ضبط‌شده', engine: 'سیستم بلیط‌فروشی رویداد + چک‌این بارکدخوان در ورودی سالن', priceReady: 12500000, priceCustom: 36000000 },
    { name: 'دارالترجمه رسمی قوه قضاییه — سفارش آنلاین ترجمه رسمی مدارک با مهر دادگستری', sub: 'آپلود تصویر مدارک، محاسبه خودکار تعرفه مصوب ترجمه، اخذ تاییدیه دادگستری و خارجه و پیک رایگان', engine: 'محاسبه‌گر تعرفه ترجمه رسمی مدارک + بارگذاری امن فایل', priceReady: 11000000, priceCustom: 30500000 },
    { name: 'مرکز مشاوره مدیریت کسب‌وکار، کوچینگ مدیران، برندینگ و ثبت برند/اختراع', sub: 'استعلام رایگان نام برند و لوگو، ثبت شرکت، تدوین بیزینس‌پلن (طرح توجیهی) و منتورینگ', engine: 'فرم استعلام قابلیت ثبت برند + رزرو جلسه کوچینگ', priceReady: 10500000, priceCustom: 29500000 },
    { name: 'موسسه آموزش عالی آزاد، دوره‌های MBA، DBA و مدیریت اجرایی با مدرک وزارت علوم', sub: 'ثبت‌نام آنلاین مدیران، سرفصل دروس، تقویم آموزشی و اعتبارسنجی آنلاین گواهینامه‌های دانش‌پذیران', engine: 'سامانه استعلام اصالت مدرک با کد رهگیری و QR Code', priceReady: 11500000, priceCustom: 32500000 },
    { name: 'باشگاه ورزشی، آکادمی فوتبال، شنا، تنیس و برنامه تمرینی خصوصی', sub: 'ثبت‌نام ترم‌های آموزشی ورزشی، خرید اشتراک ماهانه باشگاه و دریافت برنامه تمرینی و غذایی مربی', engine: 'پنل ورزشکار جهت ثبت رکوردها و دریافت برنامه تمرینی', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'پلتفرم آموزش برنامه‌نویسی، هوش مصنوعی، طراحی سایت و بوت‌کمپ‌های استخدامی', sub: 'مسیرهای یادگیری گام‌به‌گام (Roadmap)، تمرین‌های کدنویسی تعاملی و معرفی فارغ‌التحصیلان به شرکت‌ها', engine: 'نقشه راه تعاملی یادگیری + سیستم ارسال پروژه و رفع اشکال', priceReady: 12000000, priceCustom: 34500000 },
    { name: 'پایگاه خبری، مجله اینترنتی تخصصی، خبرگزاری و رسانه تحلیلی', sub: 'چیدمان خبری چندستونه، زیرنویس اخبار فوری، جدول نرخ ارز و طلا، پادکست و جایگاه رپورتاژ و بنر', engine: 'قالب خبری فوق‌سریع Google News + مدیریت تبلیغات بنری', priceReady: 11000000, priceCustom: 31500000 },
    { name: 'موسسه خیریه، نیکوکاری، حمایت از ایتام و تامین جهیزیه و درمان', sub: 'پرداخت آنلاین صدقه، فطریه، کفاره، مشارکت در کمپین‌های درمانی با نوار پیشرفت شفاف و سفارش تاج‌گل خیریه', engine: 'کمپین‌ساز تامین مالی جمعی (Crowdfunding) + رسید آنی', priceReady: 9500000, priceCustom: 26000000 },
    { name: 'پورتال کاریابی تخصصی، استخدام، بانک رزومه و رزومه‌ساز آنلاین دوزبانه', sub: 'ثبت آگهی استخدام توسط کارفرمایان، ساخت رزومه استاندارد PDF توسط کارجویان و ارسال یک‌کلیکی رزومه', engine: 'رزومه‌ساز آنلاین هوشمند + پنل کارفرما و کارجو', priceReady: 13000000, priceCustom: 38000000 },
    { name: 'مرکز استعدادیابی کودکان و نوجوانان، مهدکودک دو زبانه و کارگاه‌های خلاقیت', sub: 'تست‌های هوش چندگانه گاردنر، ثبت‌نام کارگاه‌های رباتیک، شطرنج، چرتکه و گزارش تصویری روزانه به والدین', engine: 'کارنامه استعدادسنجی کودک + گالری اختصاصی والدین', priceReady: 10500000, priceCustom: 29000000 },
    { name: 'وب‌سایت شخصی اساتید دانشگاه، سخنرانان، نویسندگان، پزشکان و مشاوران برجسته', sub: 'معرفی بیوگرافی، مقالات علمی، فروش کتاب‌ها و دوره‌های استاد، پادکست و رزرو وقت دعوت به سخنرانی', engine: 'پورتفولیو شخصی VIP + فروشگاه کتاب و دوره استاد', priceReady: 9000000, priceCustom: 25000000 },
  ],
  'fintech-crypto': [],
  'beauty-pharmacy': [],
  'travel-tourism': [],
  'home-furniture': [],
  'legal-consulting': [],
};

function buildCategoryItems(
  category: Exclude<IndustryCategory, 'all'>,
  categoryLabel: string,
  startCode: number
): SpatialKit[] {
  const existingSeeds = CATEGORY_SEEDS[category] || [];
  const extraVariations = EXTRA_VARIATIONS_BY_CATEGORY[category] || [];
  const results: SpatialKit[] = [];

  // First add detailed manual seeds
  existingSeeds.forEach((seed, idx) => {
    const codeStr = String(startCode + idx);
    results.push({
      id: `${category}-${codeStr}`,
      code: codeStr,
      title: seed.title,
      englishName: seed.englishName,
      category,
      categoryLabel,
      engine: 'ecommerce-live',
      engineLabel: seed.engineLabel,
      summary: `${seed.heroTitle}. شامل ۱۰ صفحه استاندارد، پنل مدیریت فارسی، درگاه پرداخت، اینماد، ۶ ماه هاست ابری رایگان و دامنه .ir رایگان ۱ ساله.`,
      fullSpecifications: `این طرح به صورت ۱۰۰٪ تخصصی برای «${seed.title}» مهندسی شده است. دارای کدنویسی استاندارد منطبق با الگوریتم گوگل، نسخه موبایل فوق‌سریع، پنل مدیریت فارسی، اتصال درگاه بانکی و اقساطی، سامانه پیامکی OTP و ۶ ماه هاست ابری رایگان + دامنه .ir یک‌ساله رایگان می‌باشد.`,
      motionDescription: seed.engineLabel,
      image: getTopicMatchedImage(seed.title, category, idx),
      minReadyPriceToman: 8000000,
      maxReadyPriceToman: 18000000,
      readyPriceToman: 11500000,
      customPriceToman: 32000000,
      readyDelivery: '۴۸ ساعته (با هاست ۶ ماهه و دامنه .ir رایگان)',
      customDelivery: '۱۴ روز کاری (طراحی اختصاصی + اپلیکیشن)',
      freeBonuses: [
        '۶ ماه هاست ابری پرسرعت رایگان آروان‌کلود',
        'ثبت دامنه .ir رایگان یک‌ساله به نام کارفرما',
        'اتصال رایگان درگاه پرداخت، اینماد و پنل پیامک',
        '۱ سال گارانتی و پشتیبانی فنی رایگان',
      ],
      includedPagesList: [
        `۱. صفحه اصلی اختصاصی (${seed.title.split('—')[0].trim()})`,
        `۲. صفحه ${seed.navLinks[0] || 'خدمات و محصولات'}`,
        `۳. صفحه ${seed.navLinks[1] || 'لیست کامل و فیلتر هوشمند'}`,
        `۴. صفحه ${seed.navLinks[2] || 'جزئیات کامل و ثبت سفارش'}`,
        `۵. صفحه ${seed.navLinks[3] || 'شرایط اقساطی و تعرفه‌ها'}`,
        '۶. صفحه سبد خرید / رزرواسیون و درگاه پرداخت آنلاین',
        '۷. پنل کاربری مشتریان (ورود با پیامک کد یکبارمصرف OTP)',
        '۸. مجله آموزشی و مقالات تخصصی جهت رتبه یک سئو گوگل',
        '۹. صفحه درباره ما، مجوزها، گواهینامه‌ها و افتخارات',
        '۱۰. صفحه تماس با ما، نقشه مسیریابی و پشتیبانی آنلاین',
      ],
      impactMetric: '+۱۸۵٪ رشد فروش و جذب مشتری از گوگل',
      techStack: ['Next.js / React', 'Mobile First UX', 'ArvanCloud CDN', 'Schema.org SEO'],
      features: [
        seed.engineLabel,
        'واکنش‌گرا (Responsive) کامل برای موبایل، تبلت و دسکتاپ با سرعت زیر ۱ ثانیه',
        'اتصال آماده به درگاه‌های بانکی شاپرک، اسنپ‌پی، ترب و سامانه پیامکی',
        'پنل مدیریت کاملاً فارسی و آسان همراه با ویدیوی آموزشی اختصاصی',
      ],
      liveUrlSlug: `https://${seed.subDomain}.pashalan.ir`,
      realExternalDemoUrl: seed.externalUrl.replace('https://darukade.com', 'https://www.darukade.com').replace('https://fidibo.com', 'https://www.fidibo.com'),
      liveReferenceUrl: seed.externalUrl.replace('https://darukade.com', 'https://www.darukade.com').replace('https://fidibo.com', 'https://www.fidibo.com'),
      referenceBrandFa:
        seed.externalUrl.includes('technolife')
          ? 'تکنولایف (Technolife.ir)'
          : seed.externalUrl.includes('khanoumi')
          ? 'خانومی (Khanoumi.com)'
          : seed.externalUrl.includes('darukade')
          ? 'داروکده (Darukade.com)'
          : seed.externalUrl.includes('banimode')
          ? 'بانی‌مد (Banimode.com)'
          : seed.externalUrl.includes('doctoreto')
          ? 'دکترتو (Doctoreto.com)'
          : seed.externalUrl.includes('fidibo')
          ? 'فیدیبو (Fidibo.com)'
          : 'اسنپ‌مارکت (Snapp.Market)',
      sandboxTheme: {
        bg: '#FFFFFF',
        surface: '#F8FAFC',
        accent: seed.accent,
        text: '#0F172A',
        heroHeadline: seed.heroTitle,
        heroSub:
          'تمامی بخش‌های این سایت زنده و تعاملی است؛ روی محصولات یا خدمات زیر کلیک کنید و فرآیند خرید یا رزرو را امتحان نمایید.',
        ctaLabel: seed.ctaLabel,
        navLinks: seed.navLinks,
        interactiveType: 'rail-store',
        items: seed.items.map((it, i) => ({
          id: `${codeStr}-item-${i}`,
          name: it.name,
          spec: it.spec,
          priceToman: it.price,
          accentColor: seed.accent,
          tag: it.tag,
        })),
      },
    });
  });

  // Verified 200-OK Live Iranian Websites (tested via live-site-proxy)
  const IRANIAN_REAL_BENCHMARKS: Record<
    Exclude<IndustryCategory, 'all'>,
    { url: string; brandFa: string }[]
  > = {
    'ecommerce-shop': [
      { url: 'https://www.technolife.ir', brandFa: 'تکنولایف (Technolife.ir)' },
      { url: 'https://www.mobit.ir', brandFa: 'موبیت (Mobit.ir)' },
      { url: 'https://www.lipak.com', brandFa: 'لیپک (Lipak.com)' },
      { url: 'https://www.kalatik.com', brandFa: 'کالاتیک (Kalatik.com)' },
      { url: 'https://torob.com', brandFa: 'ترب (Torob.com)' },
      { url: 'https://emalls.ir', brandFa: 'ایمالز (Emalls.ir)' },
      { url: 'https://snapp.market', brandFa: 'اسنپ‌مارکت (Snapp.Market)' },
      { url: 'https://www.30book.com', brandFa: 'سی‌بوک (30Book.com)' },
    ],
    'clinic-wellness': [
      { url: 'https://doctoreto.com', brandFa: 'دکترتو (Doctoreto.com)' },
      { url: 'https://www.darukade.com', brandFa: 'داروکده (Darukade.com)' },
      { url: 'https://drdr.ir', brandFa: 'دکتردکتر (Drdr.ir)' },
      { url: 'https://nobat.ir', brandFa: 'نوبت دات‌آی‌آر (Nobat.ir)' },
      { url: 'https://www.paziresh24.com', brandFa: 'پذیرش۲۴ (Paziresh24.com)' },
      { url: 'https://www.kermany.com', brandFa: 'کلینیک کرمانی (Kermany.com)' },
    ],
    'corporate-industrial': [
      { url: 'https://www.arvancloud.ir', brandFa: 'ابر آروان (ArvanCloud.ir)' },
      { url: 'https://www.zarinpal.com', brandFa: 'زرین‌پال (Zarinpal.com)' },
      { url: 'https://www.bama.ir', brandFa: 'باما (Bama.ir)' },
      { url: 'https://karnameh.com', brandFa: 'کارنامه (Karnameh.com)' },
      { url: 'https://khodro45.com', brandFa: 'خودرو۴۵ (Khodro45.com)' },
      { url: 'https://www.azki.com', brandFa: 'ازکی (Azki.com)' },
      { url: 'https://www.vandar.io', brandFa: 'وندار (Vandar.io)' },
      { url: 'https://www.payping.ir', brandFa: 'پی‌پینگ (PayPing.ir)' },
      { url: 'https://www.yektanet.com', brandFa: 'یکتانت (Yektanet.com)' },
      { url: 'https://www.najva.com', brandFa: 'نجوا (Najva.com)' },
      { url: 'https://achareh.co', brandFa: 'آچاره (Achareh.co)' },
      { url: 'https://www.karlancer.com', brandFa: 'کارلنسر (Karlancer.com)' },
    ],
    'fashion-retail': [
      { url: 'https://www.banimode.com', brandFa: 'بانی‌مد (Banimode.com)' },
      { url: 'https://www.khanoumi.com', brandFa: 'خانومی (Khanoumi.com)' },
      { url: 'https://www.sarabara.com', brandFa: 'سارابارا (Sarabara.com)' },
    ],
    'real-estate': [
      { url: 'https://delta.ir', brandFa: 'دلتا املاک (Delta.ir)' },
      { url: 'https://melkana.com', brandFa: 'ملکانا (Melkana.com)' },
      { url: 'https://shab.ir', brandFa: 'شب — اجاره ویلا (Shab.ir)' },
      { url: 'https://www.jajiga.com', brandFa: 'جاجیگا (Jajiga.com)' },
      { url: 'https://www.otaghak.com', brandFa: 'اتاقک (Otaghak.com)' },
    ],
    'cafe-restaurant': [
      { url: 'https://www.flytoday.ir', brandFa: 'فلای‌تودی (FlyToday.ir)' },
      { url: 'https://www.snapptrip.com', brandFa: 'اسنپ‌تریپ (SnappTrip.com)' },
      { url: 'https://snapp.market', brandFa: 'اسنپ‌مارکت (Snapp.Market)' },
      { url: 'https://www.okala.com', brandFa: 'اکالا (Okala.com)' },
      { url: 'https://www.jajiga.com', brandFa: 'جاجیگا گردشگری (Jajiga.com)' },
      { url: 'https://www.otaghak.com', brandFa: 'اتاقک بوم‌گردی (Otaghak.com)' },
    ],
    'education-lms': [
      { url: 'https://faradars.org', brandFa: 'فرادرس (FaraDars.org)' },
      { url: 'https://maktabkhooneh.org', brandFa: 'مکتب‌خونه (Maktabkhooneh.org)' },
      { url: 'https://daneshjooyar.com', brandFa: 'دانشجویار (Daneshjooyar.com)' },
      { url: 'https://www.toplearn.com', brandFa: 'تاپ‌لرن (TopLearn.com)' },
      { url: 'https://www.7learn.com', brandFa: 'سون‌لرن (7Learn.com)' },
      { url: 'https://www.fidibo.com', brandFa: 'فیدیبو (Fidibo.com)' },
      { url: 'https://taaghche.com', brandFa: 'طاقچه (Taaghche.com)' },
      { url: 'https://www.novin.com', brandFa: 'نوین آکادمی (Novin.com)' },
    ],
    'fintech-crypto': [{ url: 'https://www.zarinpal.com', brandFa: 'زرین‌پال (Zarinpal.com)' }],
    'beauty-pharmacy': [{ url: 'https://www.khanoumi.com', brandFa: 'خانومی (Khanoumi.com)' }],
    'travel-tourism': [{ url: 'https://www.flytoday.ir', brandFa: 'فلای‌تودی (FlyToday.ir)' }],
    'home-furniture': [{ url: 'https://www.banimode.com', brandFa: 'بانی‌مد (Banimode.com)' }],
    'legal-consulting': [{ url: 'https://www.karlancer.com', brandFa: 'کارلنسر (Karlancer.com)' }],
  };

  // Then add all remaining variations up to 20 items per category
  extraVariations.forEach((v) => {
    if (results.length >= 20) return;
    const itemIndex = results.length;
    const codeStr = String(startCode + itemIndex);
    const accentColors = ['#2563EB', '#0D9488', '#7C3AED', '#059669', '#D97706', '#1E40AF'];
    const accent = accentColors[itemIndex % accentColors.length];
    const benchmarks = IRANIAN_REAL_BENCHMARKS[category] || [
      { url: 'https://www.technolife.ir', brandFa: 'تکنولایف (Technolife.ir)' },
    ];
    const chosenBenchmark = benchmarks[itemIndex % benchmarks.length];
    const brandShort = v.name.split('—')[0].split('،')[0].trim();

    results.push({
      id: `${category}-${codeStr}`,
      code: codeStr,
      title: v.name,
      englishName: `Iranian Live Site #${codeStr}`,
      category,
      categoryLabel,
      engine: 'ecommerce-live',
      engineLabel: v.engine,
      summary: `${v.sub}. تحویل فوری با ۶ ماه هاست ابری رایگان و دامنه .ir رایگان ۱ ساله.`,
      fullSpecifications: `${v.name}: ${v.sub}. مجهز به «${v.engine}»، پنل مدیریت فارسی، درگاه پرداخت مستقیم شاپرک و اقساطی اسنپ‌پی/تارا، اتصال ترب و ایمالز، اسکیماهای سئو گوگل و ۶ ماه هاست ابری رایگان + دامنه .ir یک‌ساله رایگان.`,
      motionDescription: v.engine,
      image: getTopicMatchedImage(v.name, category, itemIndex),
      minReadyPriceToman: 8000000,
      maxReadyPriceToman: 18000000,
      readyPriceToman: v.priceReady,
      customPriceToman: v.priceCustom,
      readyDelivery: '۴۸ ساعته (با هاست ۶ ماهه و دامنه .ir رایگان)',
      customDelivery: '۱۲ تا ۱۶ روز کاری (طراحی اختصاصی)',
      freeBonuses: [
        '۶ ماه هاست ابری پرسرعت رایگان آروان‌کلود',
        'ثبت دامنه .ir رایگان یک‌ساله به نام کارفرما',
        'اتصال رایگان درگاه پرداخت شاپرک، اینماد و پنل پیامک',
        '۱ سال گارانتی و پشتیبانی فنی رایگان',
      ],
      includedPagesList: [
        `۱. صفحه اول اختصاصی با چیدمان مدرن (${brandShort})`,
        '۲. صفحه کاتالوگ خدمات / محصولات با فیلتر پیشرفته',
        `۳. صفحه تخصصی: ${v.engine}`,
        '۴. صفحه تعرفه‌ها، محاسبه آنلاین هزینه و شرایط اقساط اسنپ‌پی',
        '۵. صفحه ثبت سفارش / رزرو نوبت آنلاین با درگاه بانکی شاپرک',
        '۶. پنل اختصاصی مشتریان با ورود پیامکی کد یکبارمصرف (OTP)',
        '۷. گالری نمونه‌کارها، پروژه‌ها و نظرات تاییدشده مشتریان',
        '۸. وبلاگ و مقالات تخصصی سئو شده برای رتبه یک گوگل',
        '۹. صفحه درباره ما، مجوزهای رسمی (اینماد و صنفی) و تیم ما',
        '۱۰. صفحه تماس با ما، لوکیشن روی نقشه نشان/بلد و مشاوره سریع',
      ],
      impactMetric: '+۱۹۰٪ افزایش جذب مشتری هدفمند از گوگل',
      techStack: ['Next.js / React', 'Shaparak & SnappPay', 'ArvanCloud CDN', 'Torob API'],
      features: [
        v.engine,
        v.sub,
        'طراحی ۱۰۰٪ واکنش‌گرا برای موبایل و دسکتاپ با سرعت بارگذاری زیر ۱ ثانیه',
        'دارای ۶ ماه هاست ابری رایگان + دامنه .ir رایگان یک‌ساله + پرداخت امن',
      ],
      liveUrlSlug: `https://site-${codeStr}.pashalan.ir`,
      realExternalDemoUrl: chosenBenchmark.url,
      liveReferenceUrl: chosenBenchmark.url,
      referenceBrandFa: chosenBenchmark.brandFa,
      sandboxTheme: {
        bg: '#FFFFFF',
        surface: '#F8FAFC',
        accent,
        text: '#0F172A',
        heroHeadline: v.name,
        heroSub: v.sub,
        ctaLabel: 'افزودن به سبد خرید / ثبت درخواست آنلاین',
        navLinks: ['صفحه اصلی', 'لیست محصولات و خدمات', 'خرید اقساطی اسنپ‌پی', 'پیگیری سفارش', 'تماس با ما'],
        interactiveType: 'rail-store',
        items: [
          {
            id: `${codeStr}-1`,
            name: `${brandShort} — پکیج/محصول شماره ۱ (درجه یک ممتاز)`,
            spec: `${v.engine} · گارانتی اصالت و سلامت`,
            priceToman: 2450000,
            accentColor: accent,
            tag: 'پرفروش‌ترین در ایران',
          },
          {
            id: `${codeStr}-2`,
            name: `${brandShort} — مدل حرفه‌ای VIP با خدمات ویژه`,
            spec: 'ارسال فوری / اجرای تخصصی با ضمانت‌نامه کتبی',
            priceToman: 4800000,
            accentColor: accent,
            tag: 'اقساط ۴ ماهه اسنپ‌پی',
          },
          {
            id: `${codeStr}-3`,
            name: `${brandShort} — پکیج اقتصادی و استاندارد`,
            spec: 'شامل مشاوره رایگان + ارسال پیشتاز سراسر کشور',
            priceToman: 1390000,
            accentColor: accent,
            tag: '۱۵٪ تخفیف ویژه امروز',
          },
          {
            id: `${codeStr}-4`,
            name: `${brandShort} — پک کامل سازمانی و خانواده`,
            spec: 'همراه با فاکتور رسمی و پشتیبانی اختصاصی',
            priceToman: 6900000,
            accentColor: accent,
            tag: 'موجود در انبار',
          },
        ],
      },
    });
  });

  return results;
}

export const SHELF_TEMPLATES_BY_CATEGORY: Record<
  Exclude<IndustryCategory, 'all'>,
  SpatialKit[]
> = {
  'ecommerce-shop': buildCategoryItems('ecommerce-shop', 'فروشگاهی و مارکت‌پلیس', 101),
  'clinic-wellness': buildCategoryItems('clinic-wellness', 'پزشکی و کلینیک سلامت', 201),
  'corporate-industrial': buildCategoryItems('corporate-industrial', 'شرکتی، خدماتی و صنعتی', 301),
  'fashion-retail': buildCategoryItems('fashion-retail', 'مد، پوشاک، طلا و جواهر', 401),
  'real-estate': buildCategoryItems('real-estate', 'املاک، ساختمان و دکوراسیون', 501),
  'cafe-restaurant': buildCategoryItems('cafe-restaurant', 'رستوران، کافه و گردشگری', 601),
  'education-lms': buildCategoryItems('education-lms', 'آموزشگاه، حقوقی و تخصصی', 701),
  'fintech-crypto': [],
  'beauty-pharmacy': [],
  'travel-tourism': [],
  'home-furniture': [],
  'legal-consulting': [],
};

export const ALL_140_LIVE_TEMPLATES: SpatialKit[] = CATEGORY_SHELVES.flatMap(
  (shelf) => SHELF_TEMPLATES_BY_CATEGORY[shelf.id]
);
