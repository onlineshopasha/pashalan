import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  ShoppingCart,
  ArrowUpLeft,
  RotateCcw,
  Loader2,
  Bot,
  PhoneCall,
  Crown,
  Gift,
  Compass,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Mic,
  MicOff,
  UserCheck,
} from 'lucide-react';
import {
  PRO_PLUGINS_CATALOG,
  PRO_PLUGIN_BUNDLES,
  ProPluginItem,
} from '../data/pluginsCatalog';
import { CartOrderItem } from './ShoppingCartDrawer';
import { PluginLogoEmblem } from './PluginVisuals';

export interface AiChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  recommendedIds?: string[];
  followUpQuestions?: string[];
  error?: boolean;
}

export interface PashalanAiActionHandlers {
  livePlugins: ProPluginItem[];
  cartItemIds: Set<string>;
  onToggleCartItem: (item: CartOrderItem) => void;
  onOpenCart: () => void;
  onSelectPlugin: (plugin: ProPluginItem) => void;
  onNavigatePage: (page: 'templates' | 'tools' | 'services' | 'contact') => void;
}

interface ResolvedRecommendation {
  id: string;
  kind: 'package' | 'plugin' | 'bundle' | 'nav';
  title: string;
  subtitle: string;
  priceLabel: string;
  badgeText: string;
  plugin?: ProPluginItem;
  cartItem?: CartOrderItem;
  navTarget?: 'templates' | 'tools' | 'services' | 'contact';
}

function resolveRecommendations(
  ids: string[] | undefined,
  livePlugins: ProPluginItem[]
): ResolvedRecommendation[] {
  if (!ids || ids.length === 0) return [];
  const results: ResolvedRecommendation[] = [];

  for (const id of ids) {
    if (id === 'special-com-20m') {
      results.push({
        id,
        kind: 'package',
        title: 'پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان',
        subtitle: 'تحویل ۴۸ تا ۷۲ ساعته + اینماد، درگاه بله، شاپرک، ترب و اسنپ‌پی',
        priceLabel: '۲۰,۰۰۰,۰۰۰ تومان',
        badgeText: 'پرفروش‌ترین پیشنهاد',
        cartItem: {
          id: 'special-com-20m',
          title: 'پکیج ویژه طراحی سایت + دامنه .com رایگان + هاست رایگان',
          categoryLabel: 'پکیج ویژه .com (قطعی)',
          priceToman: 20000000,
          isInquiryOnly: false,
          freeGiftNote:
            'دامنه .com رایگان ۱ ساله + هاست ابری رایگان + اینماد، درگاه بله/شاپرک، اسنپ‌پی و ترب',
          deliveryLabel: 'تحویل ۴۸ تا ۷۲ ساعته',
        },
      });
      continue;
    }

    if (id === 'ready-5-pages') {
      results.push({
        id,
        kind: 'package',
        title: 'طرح آماده زنده ۵ صفحه‌ای + دامنه .ir و ۶ ماه هاست رایگان',
        subtitle: 'انتخاب از بین ۱۴۰ سایت زنده ایرانی در ۷ دسته‌بندی تخصصی',
        priceLabel: '۱۲,۵۰۰,۰۰۰ تومان',
        badgeText: 'تحویل ۴۸ ساعته',
        cartItem: {
          id: 'ai-ready-5-pages',
          title: 'طرح آماده ۵ صفحه‌ای پاشالان + دامنه .ir و ۶ ماه هاست رایگان',
          categoryLabel: 'طرح آماده زنده',
          priceToman: 12500000,
          isInquiryOnly: false,
          freeGiftNote: '۶ ماه هاست ابری رایگان + دامنه .ir رایگان ۱ ساله',
          deliveryLabel: 'تحویل ۴۸ ساعته',
        },
      });
      continue;
    }

    if (id === 'custom-inquiry') {
      results.push({
        id,
        kind: 'package',
        title: 'طراحی ۱۰۰٪ اختصاصی سایت و اپلیکیشن طبق خواسته‌های شما',
        subtitle: 'معماری اختصاصی، قرارداد رسمی، مالکیت کامل سورس‌کد و پرداخت امانی',
        priceLabel: 'استعلام رایگان',
        badgeText: 'طراحی اختصاصی',
        cartItem: {
          id: 'ai-custom-inquiry',
          title: 'درخواست طراحی ۱۰۰٪ اختصاصی سایت / اپلیکیشن (مشاوره هوش مصنوعی)',
          categoryLabel: 'طراحی اختصاصی (استعلام)',
          priceToman: 0,
          isInquiryOnly: true,
          freeGiftNote: 'جلسه آنالیز فنی رایگان + صدور پیش‌فاکتور رسمی',
          deliveryLabel: 'طبق قرارداد رسمی',
        },
      });
      continue;
    }

    if (id.startsWith('nav:')) {
      const target = id.replace('nav:', '') as
        | 'templates'
        | 'tools'
        | 'services'
        | 'contact';
      const navLabels: Record<
        typeof target,
        { title: string; subtitle: string; badge: string }
      > = {
        templates: {
          title: 'مشاهده ۱۴۰ طرح زنده ایرانی',
          subtitle: 'تست زنده با نام برند خودتان در ۷ دسته‌بندی',
          badge: 'دموی زنده',
        },
        tools: {
          title: 'ورود به مرکز ابزارهای رایگان و ۱۴ افزونه',
          subtitle: 'استعلام زنده دامنه، تست سرعت/امنیت و مارکت‌پلیس افزونه‌ها',
          badge: 'ابزارها و افزونه‌ها',
        },
        services: {
          title: 'تعرفه خدمات سئو، پشتیبانی و تولید محتوا',
          subtitle: 'خدمات مستمر رشد فروش و نگهداری فنی سایت',
          badge: 'خدمات سئو',
        },
        contact: {
          title: 'تماس مستقیم و رزرو مشاوره (09197254078)',
          subtitle: 'ارتباط فوری تلفنی، واتساپ یا ثبت زمان تماس دلخواه',
          badge: 'تماس مستقیم',
        },
      };
      if (navLabels[target]) {
        results.push({
          id,
          kind: 'nav',
          title: navLabels[target].title,
          subtitle: navLabels[target].subtitle,
          priceLabel: 'باز کردن بخش',
          badgeText: navLabels[target].badge,
          navTarget: target,
        });
      }
      continue;
    }

    const bundle = PRO_PLUGIN_BUNDLES.find((b) => b.id === id);
    if (bundle) {
      results.push({
        id: bundle.id,
        kind: 'bundle',
        title: bundle.title,
        subtitle: bundle.tagline,
        priceLabel: `${bundle.bundlePriceToman.toLocaleString('fa-IR')} تومان`,
        badgeText: bundle.badge,
        cartItem: {
          id: bundle.id,
          title: bundle.title,
          categoryLabel: 'پکیج جامع افزونه‌ها',
          priceToman: bundle.bundlePriceToman,
          isInquiryOnly: false,
          freeGiftNote: `شامل ${bundle.pluginIds.length} افزونه کامل + نصب و گارانتی`,
          deliveryLabel: bundle.deliveryLabel,
        },
      });
      continue;
    }

    const plugin =
      livePlugins.find((p) => p.id === id) ||
      PRO_PLUGINS_CATALOG.find((p) => p.id === id);
    if (plugin) {
      const isFree = plugin.priceToman === 0 || plugin.tier === 'free';
      results.push({
        id: plugin.id,
        kind: 'plugin',
        title: plugin.title,
        subtitle: plugin.subtitle,
        priceLabel: isFree
          ? 'رایگان (۰ تومان)'
          : `${plugin.priceToman.toLocaleString('fa-IR')} تومان`,
        badgeText: isFree
          ? 'افزونه رایگان'
          : plugin.tier === 'vip'
          ? 'افزونه VIP'
          : 'افزونه Pro',
        plugin,
        cartItem: {
          id: plugin.id,
          title: isFree ? `${plugin.title} (نسخه رایگان)` : plugin.title,
          categoryLabel: isFree
            ? `${plugin.categoryLabel} · رایگان`
            : plugin.categoryLabel,
          priceToman: plugin.priceToman,
          isInquiryOnly: false,
          freeGiftNote: `${plugin.warrantyLabel} · نصب و تست زنده`,
          deliveryLabel: plugin.deliveryLabel,
        },
      });
    }
  }

  return results;
}

const RecommendationCards: React.FC<{
  ids?: string[];
  handlers: PashalanAiActionHandlers;
  compact?: boolean;
}> = ({ ids, handlers, compact = false }) => {
  const items = resolveRecommendations(ids, handlers.livePlugins);
  if (items.length === 0) return null;

  return (
    <div className={`space-y-2 ${compact ? 'mt-2.5' : 'mt-4'}`}>
      <div className="text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5" />
        <span>پیشنهادهای آماده خرید و اقدام فوری پاشالان:</span>
      </div>
      <div
        className={`grid grid-cols-1 ${
          compact ? '' : 'md:grid-cols-2 lg:grid-cols-3'
        } gap-2.5`}
      >
        {items.map((rec) => {
          const inCart = rec.cartItem
            ? handlers.cartItemIds.has(rec.cartItem.id)
            : false;
          return (
            <div
              key={rec.id}
              className="rounded-2xl bg-white border border-slate-200 hover:border-blue-400 p-3 flex flex-col justify-between gap-2.5 shadow-2xs transition-colors"
            >
              <div className="flex items-start gap-2.5">
                {rec.plugin ? (
                  <PluginLogoEmblem plugin={rec.plugin} size="sm" />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0">
                    {rec.kind === 'bundle' ? (
                      <Crown className="w-4 h-4 text-amber-400" />
                    ) : rec.kind === 'nav' ? (
                      <Compass className="w-4 h-4 text-blue-400" />
                    ) : (
                      <Gift className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                )}

                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="text-[10px] font-black text-blue-700">
                      {rec.badgeText}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-black shrink-0 ${
                        rec.priceLabel.includes('رایگان')
                          ? 'text-emerald-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {rec.priceLabel}
                    </span>
                  </div>
                  <div className="text-xs font-extrabold text-slate-900 leading-snug">
                    {rec.title}
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed line-clamp-2">
                    {rec.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {rec.cartItem && (
                  <button
                    type="button"
                    onClick={() => handlers.onToggleCartItem(rec.cartItem!)}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-extrabold cursor-pointer inline-flex items-center justify-center gap-1 transition-colors ${
                      inCart
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                    <span>{inCart ? 'در سبد خرید ✓' : 'افزودن به سبد'}</span>
                  </button>
                )}

                {rec.plugin && (
                  <button
                    type="button"
                    onClick={() => handlers.onSelectPlugin(rec.plugin!)}
                    className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-[11px] font-bold cursor-pointer inline-flex items-center gap-1 shrink-0"
                  >
                    <span>صفحه فنی</span>
                    <ArrowUpLeft className="w-3 h-3" />
                  </button>
                )}

                {rec.navTarget && (
                  <button
                    type="button"
                    onClick={() => handlers.onNavigatePage(rec.navTarget!)}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-extrabold cursor-pointer inline-flex items-center justify-center gap-1"
                  >
                    <span>مشاهده این بخش</span>
                    <ArrowUpLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

async function sendAiChatRequest(params: {
  message: string;
  history: AiChatMessage[];
  mode: 'general' | 'consultant';
}): Promise<{
  reply: string;
  recommendedIds: string[];
  followUpQuestions: string[];
}> {
  const resp = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: params.message,
      mode: params.mode,
      history: params.history
        .filter((m) => !m.error)
        .slice(-10)
        .map((m) => ({ role: m.role, text: m.text })),
    }),
  });
  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    throw new Error(
      data.error || 'خطا در ارتباط با دستیار هوش مصنوعی پاشالان.'
    );
  }
  return {
    reply: data.reply,
    recommendedIds: Array.isArray(data.recommendedIds) ? data.recommendedIds : [],
    followUpQuestions: Array.isArray(data.followUpQuestions)
      ? data.followUpQuestions
      : [],
  };
}

// ============================================================================
// 1. FLOATING SITE-WIDE PASHALAN AI CHAT WIDGET
// ============================================================================
const GENERAL_STARTER_PROMPTS = [
  'بهترین پکیج برای راه‌اندازی فروشگاه آنلاین چیه؟',
  'تفاوت پکیج ۲۰ میلیونی دامنه .com با طرح‌های آماده چیست؟',
  'کدام افزونه‌های پاشالان کاملاً رایگان هستند؟',
  'برای افزایش فروش از ترب و فروش اقساطی چه پیشنهاد می‌دی؟',
];

interface FloatingWidgetProps {
  handlers: PashalanAiActionHandlers;
  externalOpenNonce?: number;
}

export const PashalanAiFloatingWidget: React.FC<FloatingWidgetProps> = ({
  handlers,
  externalOpenNonce = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'سلام! من «دستیار هوشمند پاشالان» هستم. هر سوالی درباره طراحی سایت، ۱۴۰ طرح زنده، پکیج ۲۰ میلیونی دامنه .com رایگان، ۱۴ افزونه (رایگان تا VIP)، درگاه پرداخت بله یا انتخاب بهترین پکیج خرید دارید بپرسید تا دقیق راهنمایی و پیشنهاد خرید اختصاصی بدهم.',
      followUpQuestions: GENERAL_STARTER_PROMPTS.slice(0, 3),
    },
  ]);

  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffPhone, setHandoffPhone] = useState('');
  const [handoffSending, setHandoffSending] = useState(false);
  const [handoffDone, setHandoffDone] = useState(false);

  const startVoiceInput = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void } }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void } }).webkitSpeechRecognition;
    if (!SpeechRec) {
      setMessages((prev) => [
        ...prev,
        {
          id: `v-${Date.now()}`,
          role: 'model',
          text: 'مرورگر فعلی شما از تایپ صوتی فارسی پشتیبانی نمی‌کند (در Chrome یا Edge فعال است). می‌توانید سوالتان را تایپ کنید یا با 09197254078 تماس بگیرید.',
        },
      ]);
      return;
    }
    try {
      const rec = new SpeechRec();
      rec.lang = 'fa-IR';
      rec.interimResults = false;
      setIsListening(true);
      rec.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript.trim()) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      rec.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleAiToLeadHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = handoffPhone.replace(/\s+/g, '');
    if (!/^(09\d{9}|\+989\d{9})$/.test(cleanPhone)) return;
    setHandoffSending(true);
    try {
      const lastUserQ =
        [...messages].reverse().find((m) => m.role === 'user')?.text ||
        'درخواست تماس از داخل چت هوش مصنوعی پاشالان';
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'مشتری چت هوش مصنوعی پاشالان',
          phone: cleanPhone,
          subject: 'ارجاع مستقیم از چت هوش مصنوعی (AI-to-Lead)',
          message: `خلاصه گفتگو: ${lastUserQ.slice(0, 350)}`,
        }),
      });
      setHandoffDone(true);
      setHandoffPhone('');
    } finally {
      setHandoffSending(false);
    }
  };

  useEffect(() => {
    if (externalOpenNonce > 0) {
      setIsOpen(true);
    }
  }, [externalOpenNonce]);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (customText?: string) => {
    const text = (customText ?? input).trim();
    if (!text || loading) return;

    const userMsg: AiChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text,
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await sendAiChatRequest({
        message: text,
        history: messages.filter((m) => m.id !== 'welcome'),
        mode: 'general',
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now()}`,
          role: 'model',
          text: res.reply,
          recommendedIds: res.recommendedIds,
          followUpQuestions: res.followUpQuestions,
        },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'model',
          text:
            err instanceof Error
              ? err.message
              : 'ارتباط با سرور هوش مصنوعی پاشالان برقرار نشد.',
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-20 left-3 sm:left-6 z-40" dir="rtl">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 pl-4 pr-3 py-2.5 rounded-2xl bg-slate-950 hover:bg-blue-700 text-white border border-emerald-400/50 shadow-2xl cursor-pointer transition-all"
        >
          <span className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 text-slate-950 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
          </span>
          <div className="text-right leading-tight">
            <div className="text-xs font-black text-white">
              هوش مصنوعی پاشالان
            </div>
            <div className="text-[10px] text-emerald-300 font-bold">
              پاسخ زنده + پیشنهاد خرید
            </div>
          </div>
        </button>
      ) : (
        <div className="w-[calc(100vw-24px)] sm:w-[430px] h-[min(78vh,620px)] bg-white border border-slate-300 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-950 text-white flex items-center justify-between gap-2 shrink-0 border-b border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 text-slate-950 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <span>دستیار هوشمند پاشالان</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-mono">
                    AI LIVE
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 truncate">
                  پاسخ به همه سوالات سایت + پیشنهاد خرید هوشمند
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a
                href="tel:+989197254078"
                title="تماس مستقیم 09197254078"
                className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
              <button
                type="button"
                title="شروع گفتگوی جدید"
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome',
                      role: 'model',
                      text: 'گفتگوی جدید آغاز شد! بفرمایید در مورد چه نوع سایتی، پکیج ۲۰ میلیونی .com یا کدام افزونه راهنمایی می‌خواهید؟',
                      followUpQuestions: GENERAL_STARTER_PROMPTS.slice(0, 3),
                    },
                  ])
                }
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="بستن چت هوش مصنوعی"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm font-medium'
                      : msg.error
                      ? 'bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-2xs'
                  }`}
                >
                  {msg.error && (
                    <div className="flex items-center gap-1.5 font-extrabold mb-1 text-rose-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>پیام سیستم</span>
                    </div>
                  )}
                  {msg.text}
                </div>

                {msg.role === 'model' &&
                  msg.recommendedIds &&
                  msg.recommendedIds.length > 0 && (
                    <div className="w-full">
                      <RecommendationCards
                        ids={msg.recommendedIds}
                        handlers={handlers}
                        compact
                      />
                    </div>
                  )}

                {msg.role === 'model' &&
                  msg.followUpQuestions &&
                  msg.followUpQuestions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 w-full">
                      {msg.followUpQuestions.map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={loading}
                          onClick={() => handleSend(q)}
                          className="text-[11px] font-bold px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 cursor-pointer transition-colors text-right"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5 w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>دستیار هوشمند پاشالان در حال تحلیل و پاسخ...</span>
              </div>
            )}
            <div ref={scrollEndRef} />
          </div>

          {/* AI-to-Lead Instant Human Callback Strip */}
          <div className="px-3 py-2 bg-emerald-50 border-t border-emerald-200 shrink-0">
            {handoffDone ? (
              <div className="text-[11px] font-extrabold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>شماره شما + خلاصه گفتگو به کارشناس ارشد ارسال شد (تماس زیر ۱۵ دقیقه)</span>
              </div>
            ) : !handoffOpen ? (
              <button
                type="button"
                onClick={() => setHandoffOpen(true)}
                className="w-full text-[11px] font-extrabold text-emerald-900 hover:text-blue-700 flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ارسال خلاصه گفتگو برای تماس مستقیم کارشناس؟</span>
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px]">
                  ثبت شماره
                </span>
              </button>
            ) : (
              <form onSubmit={handleAiToLeadHandoff} className="flex items-center gap-1.5">
                <input
                  type="tel"
                  dir="ltr"
                  required
                  value={handoffPhone}
                  onChange={(e) => setHandoffPhone(e.target.value)}
                  placeholder="09123456789"
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-mono text-slate-900 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={handoffSending}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold cursor-pointer shrink-0"
                >
                  {handoffSending ? '...' : 'ارسال به کارشناس'}
                </button>
                <button
                  type="button"
                  onClick={() => setHandoffOpen(false)}
                  className="p-1 text-slate-500 cursor-pointer"
                  aria-label="بستن"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Input Bar with Persian Voice Mic */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={startVoiceInput}
              title="صحبت به فارسی (ورودی صوتی هوشمند)"
              className={`p-2.5 rounded-xl cursor-pointer shrink-0 transition-colors ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              aria-label="تایپ صوتی فارسی"
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? 'در حال شنیدن صدای فارسی شما...'
                  : 'سوال درباره سایت، قیمت، دامنه یا مشاوره خرید بپرسید...'
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white cursor-pointer shrink-0"
              aria-label="ارسال پیام"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 2. DEDICATED AI BUSINESS & TECHNICAL CONSULTATION STUDIO (EMBEDDABLE)
// ============================================================================
const CONSULTANT_BUSINESS_TYPES = [
  'فروشگاه اینترنتی کالا',
  'کلینیک پزشکی و زیبایی',
  'شرکت بازرگانی و خدماتی',
  'املاک، خودرو یا رزرو ویلا',
  'آموزشگاه و فروش دوره',
  'استارتاپ و اپلیکیشن اختصاصی',
];

const CONSULTANT_BUDGETS = [
  'اقتصادی (۸ تا ۱۵ میلیون تومان)',
  'حرفه‌ای + دامنه .com رایگان (۲۰ میلیون)',
  'فروشگاه پیشرفته با افزونه‌های رشد (۲۵ تا ۴۰ میلیون)',
  'اختصاصی و سازمانی (استعلام دقیق)',
];

const CONSULTANT_GOALS = [
  'فروش اقساطی اسنپ‌پی + درگاه بله',
  'رتبه ۱ گوگل و سرعت زیر ۱ ثانیه',
  'اتصال ترب و ایمالز',
  'اتصال حسابداری هلو/سپیدار',
  'امنیت ضد هک و بکاپ خودکار',
];

export const PashalanAiConsultantSection: React.FC<{
  handlers: PashalanAiActionHandlers;
  compactHeader?: boolean;
}> = ({ handlers, compactHeader = false }) => {
  const [bizType, setBizType] = useState(CONSULTANT_BUSINESS_TYPES[0]);
  const [budget, setBudget] = useState(CONSULTANT_BUDGETS[1]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    CONSULTANT_GOALS[0],
    CONSULTANT_GOALS[1],
  ]);
  const [customNote, setCustomNote] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState<AiChatMessage[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);

  const handleConsultantVoice = () => {
    const SpeechRec =
      (window as unknown as { SpeechRecognition?: new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void } }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void } }).webkitSpeechRecognition;
    if (!SpeechRec) return;
    try {
      const rec = new SpeechRec();
      rec.lang = 'fa-IR';
      rec.interimResults = false;
      setVoiceActive(true);
      rec.onresult = (event) => {
        const txt = event.results?.[0]?.[0]?.transcript || '';
        if (txt.trim()) {
          setFollowUpInput((prev) => (prev ? `${prev} ${txt}` : txt));
        }
      };
      rec.onerror = () => setVoiceActive(false);
      rec.onend = () => setVoiceActive(false);
      rec.start();
    } catch {
      setVoiceActive(false);
    }
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const runConsultation = async (promptText: string, resetFirst = false) => {
    if (!promptText.trim() || loading) return;
    const baseHistory = resetFirst ? [] : conversation;
    const userMsg: AiChatMessage = {
      id: `cu-${Date.now()}`,
      role: 'user',
      text: promptText.trim(),
    };
    setConversation([...baseHistory, userMsg]);
    setLoading(true);

    try {
      const res = await sendAiChatRequest({
        message: promptText.trim(),
        history: baseHistory,
        mode: 'consultant',
      });
      setConversation((prev) => [
        ...prev,
        {
          id: `cm-${Date.now()}`,
          role: 'model',
          text: res.reply,
          recommendedIds: res.recommendedIds,
          followUpQuestions: res.followUpQuestions,
        },
      ]);
    } catch (err: unknown) {
      setConversation((prev) => [
        ...prev,
        {
          id: `ce-${Date.now()}`,
          role: 'model',
          text:
            err instanceof Error
              ? err.message
              : 'خطا در دریافت مشاوره هوش مصنوعی پاشالان.',
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBlueprint = (e: React.FormEvent) => {
    e.preventDefault();
    const structuredPrompt = `برای کسب‌وکار من یک مشاوره تخصصی و پیشنهاد خرید دقیق ارائه بده:
- حوزه فعالیت: ${bizType}
- محدوده بودجه: ${budget}
- اولویت‌ها و امکانات مهم: ${
      selectedGoals.length > 0 ? selectedGoals.join('، ') : 'بهترین ترکیب استاندارد'
    }${customNote.trim() ? `\n- توضیحات اختصاصی من: ${customNote.trim()}` : ''}
لطفاً بهترین پکیج طراحی سایت، بهترین افزونه‌های رایگان و پولی متناسب و نقشه راه کوتاه شروع کار را پیشنهاد بده.`;
    runConsultation(structuredPrompt, true);
  };

  return (
    <div
      id="ai-consultant"
      className="bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-xl space-y-6"
      dir="rtl"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-extrabold">
            <Sparkles className="w-4 h-4" />
            <span>اتاق مشاوره اختصاصی هوش مصنوعی پاشالان (Pashalan AI)</span>
          </div>
          <h2
            className={`${
              compactHeader ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
            } font-extrabold leading-snug`}
          >
            مشخصات کسب‌وکارتان را بگویید تا{' '}
            <span className="text-emerald-400">هوش مصنوعی پاشالان</span>{' '}
            بهترین پکیج و افزونه‌ها را مهندسی کند
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            هوش مصنوعی پاشالان به تمام تعرفه‌ها، ۱۴۰ قالب زنده و ۱۴ افزونه رایگان تا VIP مسلط است و دقیقاً متناسب با بودجه و صنف شما پیشنهاد خرید قابل افزودن به سبد ارائه می‌دهد.
          </p>
        </div>

        <a
          href="tel:+989197254078"
          className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-3 shrink-0 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div className="text-right">
            <div className="text-[11px] text-slate-300">
              نیاز به مشاوره تلفنی دارید؟
            </div>
            <div dir="ltr" className="text-sm font-mono font-black text-emerald-300">
              0919 725 4078
            </div>
          </div>
        </a>
      </div>

      {/* Form + Live AI Consultation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Right Column: Interactive Consultation Builder */}
        <form
          onSubmit={handleGenerateBlueprint}
          className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4"
        >
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-emerald-300 block">
              ۱. نوع کسب‌وکار شما:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CONSULTANT_BUSINESS_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setBizType(item)}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-bold text-right border transition-colors cursor-pointer ${
                    bizType === item
                      ? 'bg-emerald-400 text-slate-950 border-emerald-400 font-black'
                      : 'bg-slate-900/70 text-slate-200 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-amber-300 block">
              ۲. محدوده بودجه مدنظر:
            </label>
            <div className="space-y-1.5">
              {CONSULTANT_BUDGETS.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold text-right border transition-colors cursor-pointer flex items-center justify-between ${
                    budget === b
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'bg-slate-900/70 text-slate-200 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <span>{b}</span>
                  {budget === b && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-blue-300 block">
              ۳. اولویت‌های کلیدی (چندانتخابی):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CONSULTANT_GOALS.map((g) => {
                const active = selectedGoals.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGoal(g)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer transition-colors ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                        : 'bg-slate-900/70 text-slate-300 border-slate-700'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">
              ۴. توضیح یا سوال اختصاصی شما (اختیاری):
            </label>
            <textarea
              rows={2}
              aria-label="توضیحات یا سوال اختصاصی شما"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="مثلاً: حدود ۳۰۰ محصول پوشاک دارم و می‌خواهم به ترب و اسنپ‌پی وصل شوم..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 text-slate-950 font-black text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل توسط هوش مصنوعی پاشالان...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>دریافت تحلیل و پیشنهاد خرید از هوش مصنوعی</span>
              </>
            )}
          </button>
        </form>

        {/* Left Column: Live AI Consultation Response & Follow-up Chat */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between min-h-[420px] space-y-4">
          {conversation.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-lg">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-1.5 max-w-md">
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  آماده ارائه مشاوره تخصصی و پیشنهاد خرید دقیق
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  سمت راست حوزه فعالیت و بودجه‌تان را انتخاب کنید و دکمه «دریافت تحلیل» را بزنید، یا همین پایین مستقیماً سوالتان را از هوش مصنوعی پاشالان بپرسید.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {[
                  'با ۲۰ میلیون چه سایت فروشگاهی تحویل می‌گیرم؟',
                  'برای کلینیک زیبایی چه افزونه‌هایی لازمه؟',
                  'می‌خواهم سایتم سرعت ۹۵+ گوگل داشته باشد',
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => runConsultation(q, true)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-emerald-300 cursor-pointer transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 space-y-4 max-h-[460px] overflow-y-auto pl-1">
              {conversation.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-loose whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100'
                        : msg.error
                        ? 'bg-rose-500/15 border border-rose-500/30 text-rose-200'
                        : 'bg-slate-950 border border-slate-800 text-slate-100'
                    }`}
                  >
                    <div className="text-[11px] font-black mb-1.5 flex items-center gap-1.5 text-emerald-400">
                      {msg.role === 'user' ? (
                        <>
                          <MessageSquare className="w-3.5 h-3.5 text-blue-300" />
                          <span className="text-blue-300">درخواست شما</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5" />
                          <span>پیشنهاد تخصصی هوش مصنوعی پاشالان</span>
                        </>
                      )}
                    </div>
                    {msg.text}
                  </div>

                  {msg.role === 'model' &&
                    msg.recommendedIds &&
                    msg.recommendedIds.length > 0 && (
                      <div className="text-slate-900">
                        <RecommendationCards
                          ids={msg.recommendedIds}
                          handlers={handlers}
                        />
                      </div>
                    )}

                  {msg.role === 'model' &&
                    msg.followUpQuestions &&
                    msg.followUpQuestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.followUpQuestions.map((fq, idx) => (
                          <button
                            key={idx}
                            type="button"
                            disabled={loading}
                            onClick={() => runConsultation(fq, false)}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 border border-white/15 text-emerald-300 text-xs font-bold cursor-pointer transition-colors"
                          >
                            {fq}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {loading && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs font-bold text-emerald-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>در حال مهندسی بهترین پیشنهاد خرید برای شما...</span>
                </div>
              )}
            </div>
          )}

          {/* Direct Follow-up Question Input + Persian Voice */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const txt = followUpInput.trim();
              if (!txt) return;
              setFollowUpInput('');
              runConsultation(txt, false);
            }}
            className="flex items-center gap-2 pt-3 border-t border-white/10"
          >
            <button
              type="button"
              onClick={handleConsultantVoice}
              title="پرسش صوتی به فارسی"
              className={`p-3 rounded-xl cursor-pointer shrink-0 transition-colors ${
                voiceActive
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-300'
              }`}
              aria-label="ورودی صوتی فارسی"
            >
              {voiceActive ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            <input
              type="text"
              aria-label="سوال تکمیلی از مشاور هوش مصنوعی پاشالان"
              value={followUpInput}
              onChange={(e) => setFollowUpInput(e.target.value)}
              placeholder={
                voiceActive
                  ? 'در حال شنیدن صدای فارسی شما...'
                  : 'سوال تکمیلی از مشاور هوش مصنوعی پاشالان بپرسید...'
              }
              className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={loading || !followUpInput.trim()}
              className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-extrabold cursor-pointer inline-flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>ارسال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
