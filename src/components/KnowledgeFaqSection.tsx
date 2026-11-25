import React, { useState, useMemo } from 'react';
import {
  Lightbulb,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ArrowUpLeft,
  Search,
  ChevronRight,
  Check,
} from 'lucide-react';
import {
  DID_YOU_KNOW_FACTS,
  COMPREHENSIVE_FAQS,
  BLOG_ARTICLES,
  BlogArticle,
} from '../data/contentPagesData';

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

  const articleCategories = useMemo(
    () => ['همه', ...Array.from(new Set(BLOG_ARTICLES.map((a) => a.category)))],
    []
  );

  const dykCategories = useMemo(
    () => ['همه', ...Array.from(new Set(DID_YOU_KNOW_FACTS.map((f) => f.category)))],
    []
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
    return BLOG_ARTICLES.filter((a) => {
      const catMatch =
        articleCategory === 'همه' || a.category === articleCategory;
      const searchMatch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });
  }, [articleCategory, articleSearch]);

  const visibleArticles =
    mode === 'home-preview' ? filteredArticles.slice(0, 8) : filteredArticles;

  const filteredFaqs = useMemo(() => {
    return COMPREHENSIVE_FAQS.filter(
      (f) => faqCategory === 'همه' || f.category === faqCategory
    );
  }, [faqCategory]);

  const filteredDyk = useMemo(() => {
    return DID_YOU_KNOW_FACTS.filter(
      (f) => dykCategory === 'همه' || f.category === dykCategory
    );
  }, [dykCategory]);

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
              <span>بازگشت به آرشیو {BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-bold text-blue-700">
                {selectedArticle.category}
              </span>
              <span aria-hidden="true">·</span>
              <span>{selectedArticle.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>تاریخ انتشار: {selectedArticle.publishDate}</span>
              <span aria-hidden="true">·</span>
              <span>
                نویسنده: {selectedArticle.author} ({selectedArticle.authorRole})
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
              {selectedArticle.title}
            </h1>

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
                نکات کلیدی این مقاله:
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
      {/* 1. DID YOU KNOW? (آیا می‌دانید؟ — ۱۲ حقیقت کاربردی وب و فروش ایران) */}
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
                <span>آیا می‌دانید؟ و دانستنی‌های طلایی راه‌اندازی و رشد سایت ({DID_YOU_KNOW_FACTS.length.toLocaleString('fa-IR')} نکته)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {DID_YOU_KNOW_FACTS.length.toLocaleString('fa-IR')} حقیقت و دانستنی کلیدی برای راه‌اندازی، دیده‌شدن و رتبه‌گیری سایت
              </h2>
            </div>

            <button
              type="button"
              onClick={() => setShowAllDyk((prev) => !prev)}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs font-extrabold text-slate-800 cursor-pointer self-start shrink-0"
            >
              {showAllDyk
                ? 'نمایش خلاصه (۶ مورد)'
                : `مشاهده هر ${DID_YOU_KNOW_FACTS.length.toLocaleString('fa-IR')} مورد آیا می‌دانید`}
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
      {/* 2. 20 PROFESSIONAL SEO ARTICLES (۲۰ مقاله تخصصی و کاربردی)          */}
      {/* ================================================================= */}
      <section
        id="articles-hub"
        className="w-full py-14 sm:py-18 bg-white border-b border-slate-200"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 space-y-7">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>مرکز دانش و راهنمای تخصصی کسب‌وکار آنلاین ({BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله کاربردی)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی طراحی سایت، بهینه‌سازی موتور جستجو و رشد فروش اینترنتی
              </h2>
            </div>

            {mode === 'home-preview' && onNavigateToBlog && (
              <button
                type="button"
                onClick={onNavigateToBlog}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-extrabold cursor-pointer self-start shrink-0 transition-colors"
              >
                مشاهده کامل هر {BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی ←
              </button>
            )}
          </div>

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
                placeholder={`جستجو در ${BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله...`}
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
                  مشاهده باقی مقالات (کل {BLOG_ARTICLES.length.toLocaleString('fa-IR')} مقاله تخصصی) ←
                </button>
              </div>
            )}
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. COMPREHENSIVE CATEGORIZED FAQ (۱۲ پرسش و پاسخ متداول)            */}
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
                <span>پرسش و پاسخ جامع ({COMPREHENSIVE_FAQS.length.toLocaleString('fa-IR')} پرسش کلیدی)</span>
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
