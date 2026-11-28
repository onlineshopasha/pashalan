import React, { useState, useMemo, useEffect } from 'react';
import {
  Lightbulb,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ArrowUpLeft,
  Search,
  ChevronRight,
  Check,
  ShieldCheck,
  UserCheck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  DID_YOU_KNOW_FACTS,
  COMPREHENSIVE_FAQS,
  BLOG_ARTICLES,
  BlogArticle,
  DidYouKnowItem,
  FaqItem,
} from '../data/contentPagesData';

interface AutoEditorialFeedPayload {
  lastUpdatedJalali?: string;
  activeTrendingQueries?: string[];
  articles?: BlogArticle[];
  didYouKnowFacts?: DidYouKnowItem[];
  faqs?: FaqItem[];
}

interface KnowledgeFaqSectionProps {
  mode: 'home-preview' | 'full-blog-page';
  onOpenArticleInBlog?: (article: BlogArticle) => void;
  onNavigateToBlog?: () => void;
}

export const KnowledgeFaqSection: React.FC<KnowledgeFaqSectionProps> = ({
  mode,
  onOpenArticleInBlog,
  onNavigateToBlog,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(
    null
  );
  const [articleCategory, setArticleCategory] = useState<string>('همه');
  const [articleSearch, setArticleSearch] = useState<string>('');
  const [faqCategory, setFaqCategory] = useState<string>('همه');
  const [dykCategory, setDykCategory] = useState<string>('همه');
  const [openFaqId, setOpenFaqId] = useState<string>(COMPREHENSIVE_FAQS[0].id);
  const [showAllDyk, setShowAllDyk] = useState<boolean>(mode === 'full-blog-page');
  const [liveFeed, setLiveFeed] = useState<AutoEditorialFeedPayload | null>(null);

  useEffect(() => {
    fetch('/data/auto-editorial-feed.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((data: AutoEditorialFeedPayload | null) => {
        if (data && typeof data === 'object') {
          setLiveFeed(data);
        }
      })
      .catch(() => {});
  }, []);

  const allArticles = useMemo(() => {
    const autoList = liveFeed?.articles || [];
    const pillarArticle = BLOG_ARTICLES.find(
      (a) => a.slug === 'convert-instagram-followers-to-website-buyers'
    );
    const orderedSource = pillarArticle
      ? [pillarArticle, ...autoList, ...BLOG_ARTICLES]
      : [...autoList, ...BLOG_ARTICLES];
    const seen = new Set<string>();
    const merged: BlogArticle[] = [];
    for (const art of orderedSource) {
      if (!seen.has(art.slug)) {
        seen.add(art.slug);
        merged.push(art);
      }
    }
    return merged;
  }, [liveFeed]);

  const allDykFacts = useMemo(() => {
    const autoDyk = liveFeed?.didYouKnowFacts || [];
    const seen = new Set<string>();
    const merged: DidYouKnowItem[] = [];
    for (const item of [...autoDyk, ...DID_YOU_KNOW_FACTS]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [liveFeed]);

  const allFaqs = useMemo(() => {
    const autoFaqs = liveFeed?.faqs || [];
    const seen = new Set<string>();
    const merged: FaqItem[] = [];
    for (const item of [...autoFaqs, ...COMPREHENSIVE_FAQS]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }, [liveFeed]);

  const articleCategories = useMemo(
    () => ['همه', ...Array.from(new Set(allArticles.map((a) => a.category)))],
    [allArticles]
  );

  const dykCategories = useMemo(
    () => ['همه', ...Array.from(new Set(allDykFacts.map((f) => f.category)))],
    [allDykFacts]
  );

  const faqCategories = useMemo(
    () => [
      'همه',
      'رشد و دیده‌شدن',
      'فنی و سئو',
      'تعرفه و دامنه',
      'طراحی اختصاصی',
      'اعتماد و قرارداد',
    ],
    []
  );

  const filteredArticles = useMemo(() => {
    const q = articleSearch.trim().toLowerCase();
    return allArticles.filter((a) => {
      const catMatch =
        articleCategory === 'همه' || a.category === articleCategory;
      const searchMatch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        (a.searchIntentQuery && a.searchIntentQuery.toLowerCase().includes(q));
      return catMatch && searchMatch;
    });
  }, [allArticles, articleCategory, articleSearch]);

  const pillarHighlightArticle = allArticles.find(
    (a) => a.slug === 'convert-instagram-followers-to-website-buyers'
  );
  const showPillarSpotlight =
    Boolean(pillarHighlightArticle) &&
    articleCategory === 'همه' &&
    !articleSearch.trim();

  const gridArticles = showPillarSpotlight
    ? filteredArticles.filter(
        (a) => a.slug !== 'convert-instagram-followers-to-website-buyers'
      )
    : filteredArticles;

  const visibleArticles =
    mode === 'home-preview' ? gridArticles.slice(0, 8) : gridArticles;

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter(
      (f) => faqCategory === 'همه' || f.category === faqCategory
    );
  }, [allFaqs, faqCategory]);

  const filteredDyk = useMemo(() => {
    return allDykFacts.filter(
      (f) => dykCategory === 'همه' || f.category === dykCategory
    );
  }, [allDykFacts, dykCategory]);

  const visibleDyk =
    showAllDyk || dykCategory !== 'همه'
      ? filteredDyk
      : filteredDyk.slice(0, 6);

  const handleCardClick = (art: BlogArticle) => {
    if (onOpenArticleInBlog) {
      onOpenArticleInBlog(art);
    } else {
      setSelectedArticle(art);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (selectedArticle && mode === 'full-blog-page') {
    return (
      <section className="w-full py-10 sm:py-14 bg-[#F8FAFC]">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8">
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
            <button
              type="button"
              onClick={() => setSelectedArticle(null)}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>بازگشت به آرشیو {allArticles.length.toLocaleString('fa-IR')} مقاله تخصصی</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="font-bold text-blue-700">
                {selectedArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedArticle.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>تاریخ انتشار: {selectedArticle.publishDate}</span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {selectedArticle.title}
            </h1>

            {/* Google E-E-A-T Author & Human Editorial Review Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-slate-900">
                    نویسنده: {selectedArticle.author}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    {selectedArticle.authorRole}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-slate-900">
                    بازبینی علمی و فنی: {selectedArticle.reviewedBy || 'هیئت تحریریه مهندسی پاشالان'}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    {selectedArticle.humanExperienceNote || 'تدوین‌شده بر اساس تجربه اجرایی پروژه‌های واقعی در بازار ایران'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[16/9] bg-slate-100">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-2.5">
              <div className="text-xs font-extrabold text-blue-900">
                نکات کلیدی و خلاصه اجرایی این مقاله:
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-800">
                {selectedArticle.keyTakeaways.map((kt) => (
                  <li key={kt} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{kt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 pt-2">
              {selectedArticle.sections.map((sec) => (
                <div key={sec.heading} className="space-y-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {sec.heading}
                  </h2>
                  <p className="text-sm text-slate-700 leading-loose">
                    {sec.body}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  return (
    <div className="w-full">
      {/* ================================================================= */}
      {/* 1. PROFESSIONAL SEO ARTICLES FIRST (مقالات تخصصی با استاندارد E-E-A-T) */}
      {/* ================================================================= */}
      <section
        id="articles-hub"
        className="w-full py-12 sm:py-16 bg-white border-b border-slate-200"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>مرکز دانش و تحریریه تخصصی کسب‌وکار آنلاین ({allArticles.length.toLocaleString('fa-IR')} مقاله کاربردی)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {allArticles.length.toLocaleString('fa-IR')} مقاله تخصصی طراحی سایت، بهینه‌سازی موتور جستجو و رشد فروش اینترنتی
              </h2>
            </div>

            {mode === 'home-preview' && onNavigateToBlog && (
              <button
                type="button"
                onClick={onNavigateToBlog}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold cursor-pointer self-start shrink-0 transition-colors"
              >
                مشاهده کامل هر {allArticles.length.toLocaleString('fa-IR')} مقاله تخصصی ←
              </button>
            )}
          </div>

          {/* Featured Pillar Guide Spotlight Card (Shown once without duplicating in grid below) */}
          {showPillarSpotlight && pillarHighlightArticle && (
            <div
              onClick={() => handleCardClick(pillarHighlightArticle)}
              className="group rounded-3xl bg-gradient-to-l from-slate-950 via-blue-950 to-slate-900 text-white border border-blue-800/70 p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center cursor-pointer shadow-lg hover:border-emerald-400/70 transition-all"
            >
              <div className="lg:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-extrabold">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950">
                    ★ مقاله ویژه جامع (+۴۰۰۰ کلمه)
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/10 text-emerald-300 border border-white/15">
                    شامل ۲۰ نمونه زنده تبدیل پیج اینستاگرام به سایت
                  </span>
                  <span className="text-slate-300">{pillarHighlightArticle.readTime}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold leading-snug group-hover:text-emerald-300 transition-colors">
                  {pillarHighlightArticle.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                  {pillarHighlightArticle.excerpt}
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <span className="px-4 py-2.5 rounded-xl bg-emerald-400 group-hover:bg-emerald-300 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 transition-colors">
                    <span>مطالعه کامل مقاله + مشاهده ۲۰ نمونه تبدیل‌شده</span>
                    <ArrowUpLeft className="w-4 h-4" />
                  </span>
                  <span className="text-[11px] text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{pillarHighlightArticle.author} · تاییدشده با استاندارد Google E-E-A-T</span>
                  </span>
                </div>
              </div>
              <div className="lg:col-span-4 aspect-[16/10] rounded-2xl overflow-hidden border border-white/15 bg-slate-800">
                <img
                  src={pillarHighlightArticle.image}
                  alt={pillarHighlightArticle.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}

          {/* Live Google Suggest Search Intent Bar (E-E-A-T Compliant) */}
          {liveFeed && liveFeed.activeTrendingQueries && liveFeed.activeTrendingQueries.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>موضوعات پرتکرار جستجوی روز در گوگل (پوشش داده‌شده توسط تیم تحریریه فنی پاشالان با استاندارد E-E-A-T):</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-0.5 rounded-lg">
                  نگارش انسانی و بازبینی مهندسی
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {liveFeed.activeTrendingQueries.slice(0, 8).map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      const matched = allArticles.find(
                        (a) =>
                          a.searchIntentQuery === q ||
                          a.title.includes(q) ||
                          q.split(' ').some((w) => w.length > 3 && a.title.includes(w))
                      );
                      if (matched) {
                        handleCardClick(matched);
                      } else {
                        setArticleCategory('همه');
                        setArticleSearch(q);
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-600 hover:text-white border border-emerald-200 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    🔍 {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {articleCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setArticleCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                    articleCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-xl px-3 py-1.5 md:w-72">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                aria-label="جستجو در مقالات تخصصی"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder={`جستجو در ${allArticles.length.toLocaleString('fa-IR')} مقاله...`}
                className="w-full bg-transparent text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleArticles.map((art, index) => (
              <article
                key={art.id}
                onClick={() => handleCardClick(art)}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all cursor-pointer group"
              >
                <div>
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-200">
                    <img
                      src={art.image}
                      alt={art.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <span className="font-mono font-bold text-slate-600">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-bold text-blue-700 truncate">
                        {art.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="shrink-0">{art.readTime}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {art.excerpt}
                    </p>
                    <div className="pt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{art.author} · {art.publishDate}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-extrabold text-blue-600">
                  <span>مطالعه کامل مقاله</span>
                  <ArrowUpLeft className="w-4 h-4" />
                </div>
              </article>
            ))}
          </div>

          {mode === 'home-preview' &&
            filteredArticles.length > 8 &&
            onNavigateToBlog && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onNavigateToBlog}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-colors"
                >
                  مشاهده باقی مقالات (کل {allArticles.length.toLocaleString('fa-IR')} مقاله تخصصی) ←
                </button>
              </div>
            )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. DID YOU KNOW? (آیا می‌دانید؟ و دانستنی‌های طلایی)               */}
      {/* ================================================================= */}
      <section
        id="did-you-know"
        className="w-full py-14 sm:py-18 bg-[#F8FAFC] border-b border-slate-200"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>آیا می‌دانید؟ و دانستنی‌های طلایی راه‌اندازی و رشد سایت ({allDykFacts.length.toLocaleString('fa-IR')} نکته)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {allDykFacts.length.toLocaleString('fa-IR')} حقیقت و دانستنی کلیدی برای راه‌اندازی، دیده‌شدن و رتبه‌گیری سایت
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAllDyk((prev) => !prev)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-extrabold text-slate-800 cursor-pointer self-start shrink-0"
            >
              {showAllDyk
                ? 'نمایش خلاصه (۶ مورد)'
                : `مشاهده هر ${allDykFacts.length.toLocaleString('fa-IR')} مورد آیا می‌دانید`}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {dykCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setDykCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                  dykCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleDyk.map((fact) => (
              <div
                key={fact.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-3.5"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500">
                      {fact.category}
                    </span>
                    <span className="font-mono font-extrabold text-blue-700 tabular-nums">
                      {fact.stat}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {fact.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {fact.detail}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700">
                  راهکار پاشالان: {fact.actionTip}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. COMPREHENSIVE CATEGORIZED FAQ (پرسش و پاسخ متداول)              */}
      {/* ================================================================= */}
      <section
        id="faq-section"
        className="w-full py-14 sm:py-18 bg-[#F8FAFC] border-b border-slate-200"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>پرسش و پاسخ جامع ({allFaqs.length.toLocaleString('fa-IR')} پرسش کلیدی)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                پاسخ شفاف به سوالات راه‌اندازی، دیده‌شدن، سئو گوگل، هوش مصنوعی و تعرفه‌ها
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors whitespace-nowrap ${
                    faqCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full text-right p-5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-blue-600 block">
                        {faq.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {faq.q}
                      </h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
