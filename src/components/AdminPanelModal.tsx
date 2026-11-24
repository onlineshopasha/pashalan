import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  LogOut,
  Package,
  Tag,
  Sliders,
  CreditCard,
  PhoneCall,
  RefreshCw,
  Trash2,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  Bot,
  FileSignature,
  Gift,
  Eye,
  EyeOff,
  KeyRound,
} from 'lucide-react';

interface AdminOrder {
  code: string;
  clientName: string;
  phone: string;
  domain: string;
  projectTitle: string;
  packageType: string;
  priceToman: number;
  progressPercent: number;
  currentStage: string;
  paymentStatus: 'unpaid' | 'escrow-paid' | 'paid' | 'inquiry';
  baleTransactionId?: string;
  startDate: string;
  deliveryDate: string;
  createdAt: string;
  baleAlertSent: boolean;
}

interface AdminLead {
  id: string;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'contacted' | 'converted';
  createdAt: string;
  baleAlertSent: boolean;
}

interface AdminCoupon {
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  active: boolean;
  description: string;
}

interface AdminPlugin {
  id: string;
  title: string;
  categoryLabel: string;
  priceToman: number;
  enabled: boolean;
}

interface AdminBaleTx {
  transactionId: string;
  orderTitle: string;
  clientName: string;
  phone: string;
  domainName: string;
  amountToman: number;
  amountRial: number;
  status: 'pending' | 'verified' | 'paid-webhook';
  mode: string;
  createdAt: string;
  verifiedAt?: string;
}

interface AdminAiLog {
  id: string;
  mode: string;
  question: string;
  replyPreview: string;
  recommendedIds: string[];
  createdAt: string;
}

interface AdminSignedContract {
  contractNo: string;
  clientName: string;
  nationalId: string;
  phone: string;
  domainName: string;
  projectTitle: string;
  totalToman: number;
  signedAt: string;
}

interface AdminReferral {
  code: string;
  ownerName: string;
  ownerPhone: string;
  bonusToman: number;
  createdAt: string;
}

interface AdminOverviewData {
  kpis: {
    totalRevenueToman: number;
    totalOrders: number;
    paidOrdersCount: number;
    totalLeads: number;
    newLeadsCount: number;
    activeCouponsCount: number;
    baleTransactionsCount: number;
    aiChatsCount?: number;
    signedContractsCount?: number;
    referralsCount?: number;
  };
  baleState: {
    mode: string;
    hasWalletToken: boolean;
    hasBotToken: boolean;
    hasAdminChatId: boolean;
    hasWebhookSecret: boolean;
    maskedWalletToken: string | null;
  };
  webhookUrlTemplate: string;
  orders: AdminOrder[];
  leads: AdminLead[];
  coupons: AdminCoupon[];
  plugins: AdminPlugin[];
  baleTransactions: AdminBaleTx[];
  aiLogs?: AdminAiLog[];
  signedContracts?: AdminSignedContract[];
  referrals?: AdminReferral[];
}

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPluginsUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onPluginsUpdated,
}) => {
  // Bearer session token kept STRICTLY in React memory (never localStorage)
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<{
    loading: boolean;
    needsFirstRunClaim: boolean;
    envConfigured: boolean;
  }>({ loading: true, needsFirstRunClaim: false, envConfigured: false });

  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Authenticated change-password form (when not locked by ADMIN_PASSCODE secret)
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');
  const [pwdChanging, setPwdChanging] = useState(false);

  const [activeTab, setActiveTab] = useState<
    'orders' | 'plugins' | 'coupons' | 'bale' | 'leads' | 'ai-crm'
  >('orders');
  const [overview, setOverview] = useState<AdminOverviewData | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // New coupon form
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'fixed' as 'fixed' | 'percent',
    value: '1500000',
    description: 'تخفیف اختصاصی مدیریت',
  });

  // Plugin inline price drafts
  const [pluginDrafts, setPluginDrafts] = useState<
    Record<string, { priceToman: number; enabled: boolean }>
  >({});

  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const showBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 3500);
  };

  const fetchOverview = useCallback(async (token: string) => {
    setLoadingData(true);
    try {
      const resp = await fetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.status === 401) {
        setBearerToken(null);
        setAuthError('نشست شما منقضی شد. مجدداً وارد شوید.');
        return;
      }
      const data = await resp.json();
      if (data.ok) {
        setOverview(data);
        const drafts: Record<string, { priceToman: number; enabled: boolean }> = {};
        (data.plugins as AdminPlugin[]).forEach((p) => {
          drafts[p.id] = { priceToman: p.priceToman, enabled: p.enabled };
        });
        setPluginDrafts(drafts);
      }
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (bearerToken) {
      fetchOverview(bearerToken);
      return;
    }
    setAuthStatus((s) => ({ ...s, loading: true }));
    fetch('/api/admin/auth-status')
      .then((r) => r.json())
      .then((d) => {
        setAuthStatus({
          loading: false,
          needsFirstRunClaim: Boolean(d.needsFirstRunClaim),
          envConfigured: Boolean(d.envConfigured),
        });
      })
      .catch(() => {
        setAuthStatus({
          loading: false,
          needsFirstRunClaim: false,
          envConfigured: false,
        });
      });
  }, [isOpen, bearerToken, fetchOverview]);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (authStatus.needsFirstRunClaim) {
      if (passwordInput.length < 8) {
        setAuthError('رمز عبور مدیریت باید حداقل ۸ کاراکتر باشد.');
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setAuthError('رمز عبور و تکرار آن یکسان نیست.');
        return;
      }
    }
    setAuthSubmitting(true);
    try {
      const endpoint = authStatus.needsFirstRunClaim
        ? '/api/admin/claim'
        : '/api/admin/login';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await resp.json();
      if (!resp.ok || !data.ok) {
        setAuthError(data.error || 'خطا در احراز هویت مدیریت.');
      } else {
        setBearerToken(data.token);
        setPasswordInput('');
        setConfirmPasswordInput('');
        await fetchOverview(data.token);
      }
    } catch {
      setAuthError('خطا در ارتباط با سرور مدیریت.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (bearerToken) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${bearerToken}` },
      }).catch(() => {});
    }
    setBearerToken(null);
    setOverview(null);
  };

  const handleUpdateOrder = async (
    code: string,
    updates: Partial<Pick<AdminOrder, 'progressPercent' | 'currentStage' | 'paymentStatus'>>
  ) => {
    if (!bearerToken) return;
    const resp = await fetch(`/api/admin/orders/${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(updates),
    });
    if (resp.ok) {
      showBanner(`وضعیت سفارش ${code} با موفقیت بروزرسانی شد و برای کارفرما زنده نمایش داده می‌شود.`);
      await fetchOverview(bearerToken);
    }
  };

  const handleSavePlugin = async (pluginId: string) => {
    if (!bearerToken) return;
    const draft = pluginDrafts[pluginId];
    if (!draft) return;
    const resp = await fetch(`/api/admin/plugins/${encodeURIComponent(pluginId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify(draft),
    });
    if (resp.ok) {
      showBanner('قیمت و وضعیت افزونه ذخیره شد و روی سایت زنده اعمال گردید.');
      onPluginsUpdated?.();
      await fetchOverview(bearerToken);
    }
  };

  const handleAddCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bearerToken) return;
    const resp = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({
        code: newCoupon.code,
        type: newCoupon.type,
        value: Number(newCoupon.value),
        description: newCoupon.description,
      }),
    });
    const data = await resp.json();
    if (resp.ok && data.ok) {
      setNewCoupon({ code: '', type: 'fixed', value: '1500000', description: 'تخفیف اختصاصی' });
      showBanner('کد تخفیف جدید ساخته شد و فوراً در سبد خرید فعال است.');
      await fetchOverview(bearerToken);
    } else {
      showBanner(data.error || 'خطا در ایجاد کد تخفیف');
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    if (!bearerToken) return;
    const resp = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    if (resp.ok) {
      showBanner(`کد تخفیف ${code} حذف شد.`);
      await fetchOverview(bearerToken);
    }
  };

  const handleLeadStatus = async (
    id: string,
    status: 'new' | 'contacted' | 'converted'
  ) => {
    if (!bearerToken) return;
    const resp = await fetch(`/api/admin/leads/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      body: JSON.stringify({ status }),
    });
    if (resp.ok) {
      showBanner(`وضعیت درخواست ${id} بروزرسانی شد.`);
      await fetchOverview(bearerToken);
    }
  };

  const handleTestBaleAlert = async () => {
    if (!bearerToken) return;
    const resp = await fetch('/api/admin/test-bale-alert', {
      method: 'POST',
      headers: { Authorization: `Bearer ${bearerToken}` },
    });
    const data = await resp.json();
    showBanner(data.reason || 'تست ارسال پیام به بله انجام شد.');
  };

  const handleInquireBaleTx = async (txId: string) => {
    const resp = await fetch('/api/payment/bale/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId: txId }),
    });
    const data = await resp.json();
    if (data.ok) {
      showBanner(
        `استعلام تراکنش ${txId}: وضعیت «${data.status}» — مبلغ ${data.amountToman.toLocaleString('fa-IR')} تومان`
      );
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bearerToken) return;
    if (newPwd.trim().length < 8) {
      showBanner('رمز عبور جدید باید حداقل ۸ کاراکتر باشد.');
      return;
    }
    if (newPwd !== confirmNewPwd) {
      showBanner('رمز عبور جدید و تکرار آن یکسان نیست.');
      return;
    }
    setPwdChanging(true);
    try {
      const resp = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          currentPassword: currentPwd,
          newPassword: newPwd,
        }),
      });
      const data = await resp.json();
      if (resp.ok && data.ok) {
        setCurrentPwd('');
        setNewPwd('');
        setConfirmNewPwd('');
        showBanner(data.message || 'رمز عبور مدیریت با موفقیت تغییر کرد.');
      } else {
        showBanner(data.error || 'خطا در تغییر رمز عبور.');
      }
    } finally {
      setPwdChanging(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto"
      dir="rtl"
    >
      <div className="w-full max-w-6xl bg-slate-900 text-white border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Admin Header */}
        <div className="px-5 sm:px-7 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                پنل مدیریت فوق‌حرفه‌ای پاشالان (دسترسی مخفی امن)
              </h2>
              <p className="text-[11px] text-slate-400">
                مدیریت زنده سفارش‌ها، قیمت افزونه‌ها، کدهای تخفیف و درگاه پرداخت بله
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bearerToken && (
              <>
                <button
                  type="button"
                  onClick={() => fetchOverview(bearerToken)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
                  title="بروزرسانی داده‌ها"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج امن</span>
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن پنل مدیریت"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auth Screen OR Authenticated Dashboard */}
        {!bearerToken ? (
          <div className="p-6 sm:p-10 flex items-center justify-center">
            <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              {authStatus.loading ? (
                <div className="text-center text-xs text-slate-400 py-4">
                  در حال بررسی وضعیت امنیتی سرور...
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="text-center space-y-2">
                    {authStatus.needsFirstRunClaim && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-extrabold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>مرحله راه‌اندازی اولیه — ساخت رمز دلخواه شما</span>
                      </div>
                    )}
                    <h3 className="text-lg font-extrabold text-white">
                      {authStatus.needsFirstRunClaim
                        ? 'یک رمز عبور جدید برای پنل مدیریت بسازید'
                        : 'ورود امن به پنل مدیریت پاشالان'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {authStatus.needsFirstRunClaim
                        ? 'نیازی به هیچ رمز پیش‌فرضی نیست! همین الان رمز دلخواه خودتان (حداقل ۸ کاراکتر) را در دو کادر زیر وارد کنید تا با رمزنگاری scrypt ذخیره شود و بلافاصله وارد پنل شوید.'
                        : 'رمز عبوری که قبلاً برای پنل مدیریت ثبت کرده‌اید را وارد کنید.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        dir="ltr"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder={
                          authStatus.needsFirstRunClaim
                            ? 'رمز عبور جدید دلخواه شما (حداقل ۸ کاراکتر)'
                            : 'رمز عبور مدیریت'
                        }
                        className="w-full px-4 pl-11 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'مخفی کردن رمز' : 'نمایش رمز'}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {authStatus.needsFirstRunClaim && (
                      <>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          dir="ltr"
                          value={confirmPasswordInput}
                          onChange={(e) => setConfirmPasswordInput(e.target.value)}
                          placeholder="تکرار همان رمز عبور جدید"
                          className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-emerald-400"
                        />
                        <div className="flex items-center justify-between text-[11px] px-1">
                          <span
                            className={
                              passwordInput.trim().length >= 8
                                ? 'text-emerald-400 font-bold'
                                : 'text-slate-400'
                            }
                          >
                            طول رمز: {passwordInput.trim().length.toLocaleString('fa-IR')} از حداقل ۸ کاراکتر
                          </span>
                          {confirmPasswordInput.length > 0 && (
                            <span
                              className={
                                passwordInput === confirmPasswordInput
                                  ? 'text-emerald-400 font-bold'
                                  : 'text-rose-400 font-bold'
                              }
                            >
                              {passwordInput === confirmPasswordInput ? 'تکرار رمز یکسان است ✓' : 'تکرار رمز یکسان نیست'}
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {authError && (
                    <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authSubmitting}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black text-xs sm:text-sm cursor-pointer"
                  >
                    {authSubmitting
                      ? 'در حال تایید امنیتی...'
                      : authStatus.needsFirstRunClaim
                      ? 'ثبت نهایی رمز مدیریت و ورود به پنل'
                      : 'ورود به پنل مدیریت'}
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {statusBanner && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusBanner}</span>
              </div>
            )}

            {/* Live KPIs Strip */}
            {overview && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>حجم کل سفارش‌ها</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400 mt-1 tabular-nums">
                    {overview.kpis.totalRevenueToman.toLocaleString('fa-IR')} ت
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">سفارش‌های ثبت‌شده / پرداختی</div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-white mt-1 tabular-nums">
                    {overview.kpis.totalOrders.toLocaleString('fa-IR')} /{' '}
                    <span className="text-blue-400">
                      {overview.kpis.paidOrdersCount.toLocaleString('fa-IR')}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">تراکنش‌های درگاه بله</div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-amber-300 mt-1 tabular-nums">
                    {overview.kpis.baleTransactionsCount.toLocaleString('fa-IR')} تراکنش
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] text-slate-400">درخواست‌های مشاوره جدید</div>
                  <div className="text-lg sm:text-xl font-mono font-extrabold text-rose-300 mt-1 tabular-nums">
                    {overview.kpis.newLeadsCount.toLocaleString('fa-IR')} از{' '}
                    {overview.kpis.totalLeads.toLocaleString('fa-IR')}
                  </div>
                </div>
              </div>
            )}

            {/* Admin Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
              {(
                [
                  { id: 'orders', label: 'سفارش‌ها و پیگیری PSH', icon: Package },
                  { id: 'plugins', label: 'قیمت ۱۴ افزونه (زنده)', icon: Sliders },
                  { id: 'coupons', label: 'کدهای تخفیف', icon: Tag },
                  { id: 'bale', label: 'درگاه بله و اعلان‌ها', icon: CreditCard },
                  { id: 'leads', label: 'درخواست‌های مشاوره', icon: PhoneCall },
                  { id: 'ai-crm', label: 'CRM هوش مصنوعی و قراردادها', icon: Bot },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-2 transition-colors ${
                      active
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ORDERS & LIVE TRACKER MANAGEMENT */}
            {activeTab === 'orders' && overview && (
              <div className="space-y-3">
                {overview.orders.map((ord) => (
                  <div
                    key={ord.code}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-300 font-mono text-xs font-black">
                          {ord.code}
                        </span>
                        <span className="text-sm font-extrabold text-white">
                          {ord.clientName}
                        </span>
                        <span dir="ltr" className="text-xs font-mono text-slate-400">
                          {ord.phone}
                        </span>
                        <span dir="ltr" className="text-xs font-mono text-emerald-400">
                          {ord.domain}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-extrabold text-amber-300">
                        {ord.priceToman > 0
                          ? `${ord.priceToman.toLocaleString('fa-IR')} تومان`
                          : 'استعلام اختصاصی'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300">
                      <strong>شرح:</strong> {ord.projectTitle} —{' '}
                      <span className="text-slate-400">{ord.packageType}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] text-slate-400">پیشرفت پروژه:</span>
                      {[25, 50, 75, 100].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() =>
                            handleUpdateOrder(ord.code, {
                              progressPercent: pct,
                              currentStage:
                                pct === 25
                                  ? 'ثبت دامنه رایگان و آماده‌سازی هاست ابری'
                                  : pct === 50
                                  ? 'طراحی رابط کاربری، چیدمان صفحات و بارگذاری برند'
                                  : pct === 75
                                  ? 'اتصال درگاه بله، شاپرک، ترب و بهینه‌سازی سرعت ۹۵+'
                                  : 'تحویل قطعی روی دامنه اصلی + ۱ سال گارانتی رایگان',
                            })
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                            ord.progressPercent === pct
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {pct}٪
                        </button>
                      ))}

                      <span className="text-[11px] text-slate-400 mr-3">وضعیت پرداخت:</span>
                      {(
                        [
                          { id: 'inquiry', label: 'استعلام' },
                          { id: 'unpaid', label: 'در انتظار' },
                          { id: 'escrow-paid', label: 'امانی ۵۰٪' },
                          { id: 'paid', label: 'تسویه کامل' },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() =>
                            handleUpdateOrder(ord.code, { paymentStatus: st.id })
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                            ord.paymentStatus === st.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: LIVE PLUGIN PRICES & TOGGLES */}
            {activeTab === 'plugins' && overview && (
              <div className="space-y-2.5">
                {overview.plugins.map((pl) => {
                  const draft = pluginDrafts[pl.id] || {
                    priceToman: pl.priceToman,
                    enabled: pl.enabled,
                  };
                  return (
                    <div
                      key={pl.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[11px] text-blue-400 font-bold">
                          {pl.categoryLabel}
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-white truncate">
                          {pl.title}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <input
                          type="number"
                          dir="ltr"
                          value={draft.priceToman}
                          onChange={(e) =>
                            setPluginDrafts((prev) => ({
                              ...prev,
                              [pl.id]: {
                                ...draft,
                                priceToman: Number(e.target.value) || 0,
                              },
                            }))
                          }
                          className="w-36 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setPluginDrafts((prev) => ({
                              ...prev,
                              [pl.id]: { ...draft, enabled: !draft.enabled },
                            }))
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                            draft.enabled
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {draft.enabled ? 'فعال' : 'مخفی'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSavePlugin(pl.id)}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold cursor-pointer"
                        >
                          ذخیره زنده
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 3: LIVE COUPONS MANAGEMENT */}
            {activeTab === 'coupons' && overview && (
              <div className="space-y-5">
                <form
                  onSubmit={handleAddCoupon}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 sm:grid-cols-5 gap-2.5"
                >
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })
                    }
                    placeholder="کد جدید (مثلاً BALE20)"
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                  <select
                    value={newCoupon.type}
                    onChange={(e) =>
                      setNewCoupon({
                        ...newCoupon,
                        type: e.target.value as 'fixed' | 'percent',
                      })
                    }
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="fixed">مبلغی (تومان)</option>
                    <option value="percent">درصدی (۱ تا ۵۰٪)</option>
                  </select>
                  <input
                    type="number"
                    required
                    dir="ltr"
                    value={newCoupon.value}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, value: e.target.value })
                    }
                    placeholder="مقدار"
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                  />
                  <input
                    type="text"
                    value={newCoupon.description}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, description: e.target.value })
                    }
                    placeholder="توضیح کد"
                    className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>ساخت کد تخفیف</span>
                  </button>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {overview.coupons.map((cp) => (
                    <div
                      key={cp.code}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-emerald-400 text-sm">
                            {cp.code}
                          </span>
                          <span className="text-xs font-bold text-amber-300">
                            {cp.type === 'percent'
                              ? `${cp.value}٪ تخفیف`
                              : `${cp.value.toLocaleString('fa-IR')} تومان`}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cp.description}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(cp.code)}
                        className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 cursor-pointer"
                        title="حذف کد تخفیف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BALE PAYMENT GATEWAY & ADMIN ALERTS */}
            {activeTab === 'bale' && overview && (
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-extrabold text-white">
                        وضعیت اتصال زنده درگاه کیف‌پول بله و ربات اعلان سفارش‌ها
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        تمامی توکن‌ها صرفاً روی سرور از طریق Settings → Secrets خوانده می‌شوند.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestBaleAlert}
                      className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>ارسال پیام تست به بله من</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    {[
                      {
                        label: 'BALE_WALLET_TOKEN',
                        ok: overview.baleState.hasWalletToken,
                        val: overview.baleState.maskedWalletToken || 'تنظیم نشده در Secrets',
                      },
                      {
                        label: 'BALE_BOT_TOKEN',
                        ok: overview.baleState.hasBotToken,
                        val: overview.baleState.hasBotToken ? 'متصل به tapi.bale.ai' : 'تنظیم نشده در Secrets',
                      },
                      {
                        label: 'BALE_ADMIN_CHAT_ID',
                        ok: overview.baleState.hasAdminChatId,
                        val: overview.baleState.hasAdminChatId ? 'اعلان آنی فعال' : 'تنظیم نشده در Secrets',
                      },
                      {
                        label: 'BALE_WEBHOOK_SECRET',
                        ok: overview.baleState.hasWebhookSecret,
                        val: overview.baleState.hasWebhookSecret ? 'وب‌هوک ایمن فعال' : 'تنظیم نشده در Secrets',
                      },
                    ].map((st) => (
                      <div
                        key={st.label}
                        className={`p-3 rounded-xl border ${
                          st.ok
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                        }`}
                      >
                        <div dir="ltr" className="font-mono text-[11px] font-bold">
                          {st.label}
                        </div>
                        <div className="text-[11px] mt-1">{st.val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[11px] text-slate-400 block">
                        آدرس Webhook پرداخت بله (جهت ثبت در setWebhook ربات بله):
                      </span>
                      <code dir="ltr" className="text-xs font-mono text-emerald-300 truncate block">
                        {overview.webhookUrlTemplate}
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(overview.webhookUrlTemplate).catch(() => {});
                        setCopiedWebhook(true);
                        setTimeout(() => setCopiedWebhook(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold cursor-pointer inline-flex items-center gap-1 shrink-0"
                    >
                      {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedWebhook ? 'کپی شد' : 'کپی'}</span>
                    </button>
                  </div>
                </div>

                {/* Admin Password Security Box */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-white">
                    <KeyRound className="w-4 h-4 text-emerald-400" />
                    <span>تنظیمات امنیتی و تغییر رمز عبور مدیریت</span>
                  </div>
                  {authStatus.envConfigured ? (
                    <p className="text-xs text-amber-200 leading-relaxed">
                      رمز عبور این پنل از طریق متغیر <code dir="ltr" className="font-mono text-amber-300">PASHALAN_ADMIN_PASSCODE</code> در <strong>Settings → Secrets</strong> کنترل می‌شود. برای تغییر رمز عبور، مقدار آن را در بخش Secrets ویرایش کنید.
                    </p>
                  ) : (
                    <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={currentPwd}
                        onChange={(e) => setCurrentPwd(e.target.value)}
                        placeholder="رمز عبور فعلی"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                      />
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={newPwd}
                        onChange={(e) => setNewPwd(e.target.value)}
                        placeholder="رمز جدید (حداقل ۸ کاراکتر)"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                      />
                      <input
                        type="password"
                        required
                        dir="ltr"
                        value={confirmNewPwd}
                        onChange={(e) => setConfirmNewPwd(e.target.value)}
                        placeholder="تکرار رمز جدید"
                        className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white"
                      />
                      <button
                        type="submit"
                        disabled={pwdChanging}
                        className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-black text-xs cursor-pointer"
                      >
                        {pwdChanging ? 'در حال ذخیره...' : 'ذخیره رمز جدید'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Real Bale Transactions Table */}
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold text-slate-300">
                    آخرین تراکنش‌های ثبت‌شده در درگاه بله ({overview.baleTransactions.length.toLocaleString('fa-IR')} مورد):
                  </div>
                  {overview.baleTransactions.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                      هنوز تراکنشی از طریق سبد خرید ثبت نشده است.
                    </div>
                  ) : (
                    overview.baleTransactions.map((tx) => (
                      <div
                        key={tx.transactionId}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-emerald-400">
                              {tx.transactionId}
                            </span>
                            <span className="font-bold text-white">{tx.clientName}</span>
                            <span dir="ltr" className="font-mono text-slate-400">
                              {tx.phone}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {tx.orderTitle} · وضعیت:{' '}
                            <strong className="text-amber-300">{tx.status}</strong>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">
                            {tx.amountToman.toLocaleString('fa-IR')} ت
                          </span>
                          <button
                            type="button"
                            onClick={() => handleInquireBaleTx(tx.transactionId)}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer"
                          >
                            استعلام زنده بله
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: CONSULTATION LEADS */}
            {activeTab === 'leads' && overview && (
              <div className="space-y-3">
                {overview.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-amber-300 font-bold">{lead.id}</span>
                        <span className="font-extrabold text-white">{lead.name}</span>
                        <span dir="ltr" className="font-mono text-emerald-400">{lead.phone}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-300">{lead.subject}</div>
                      {lead.message && (
                        <p className="text-[11px] text-slate-400">{lead.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(
                        [
                          { id: 'new', label: 'جدید' },
                          { id: 'contacted', label: 'تماس گرفته شد' },
                          { id: 'converted', label: 'قرارداد شد ✓' },
                        ] as const
                      ).map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => handleLeadStatus(lead.id, st.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                            lead.status === st.id
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: AI CRM LOGS, SIGNED DIGITAL CONTRACTS & REFERRALS */}
            {activeTab === 'ai-crm' && overview && (
              <div className="space-y-6">
                {/* KPI Summary Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">گفتگوها و آنالیزهای AI</div>
                      <div className="text-xl font-mono font-extrabold text-emerald-400 mt-0.5">
                        {(overview.aiLogs?.length || 0).toLocaleString('fa-IR')} مورد
                      </div>
                    </div>
                    <Bot className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">قراردادهای دیجیتال امضاشده</div>
                      <div className="text-xl font-mono font-extrabold text-blue-400 mt-0.5">
                        {(overview.signedContracts?.length || 0).toLocaleString('fa-IR')} قرارداد
                      </div>
                    </div>
                    <FileSignature className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-[11px] text-slate-400">کدهای معرف ۲ میلیونی صادرشده</div>
                      <div className="text-xl font-mono font-extrabold text-amber-300 mt-0.5">
                        {(overview.referrals?.length || 0).toLocaleString('fa-IR')} معرف
                      </div>
                    </div>
                    <Gift className="w-6 h-6 text-amber-400" />
                  </div>
                </div>

                {/* Signed Digital Contracts */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold text-blue-300">
                    قراردادهای رسمی امضاشده آنلاین:
                  </h3>
                  {!overview.signedContracts || overview.signedContracts.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      هنوز قراردادی از بخش امضای دیجیتال ثبت نشده است.
                    </div>
                  ) : (
                    overview.signedContracts.map((c) => (
                      <div
                        key={c.contractNo}
                        className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-blue-300">
                              {c.contractNo}
                            </span>
                            <span className="font-extrabold text-white">{c.clientName}</span>
                            <span dir="ltr" className="font-mono text-emerald-400">
                              {c.phone}
                            </span>
                            <span dir="ltr" className="font-mono text-slate-400">
                              ({c.domainName})
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{c.projectTitle}</div>
                        </div>
                        <span className="font-mono font-extrabold text-amber-300">
                          {c.totalToman > 0
                            ? `${c.totalToman.toLocaleString('fa-IR')} تومان`
                            : 'استعلام فنی'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Referrals */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold text-amber-300">
                    کدهای معرف فعال همکاری در فروش:
                  </h3>
                  {!overview.referrals || overview.referrals.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      هنوز کد معرفی صادر نشده است.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {overview.referrals.map((r) => (
                        <div
                          key={r.code}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-mono font-black text-amber-300 ml-2">
                              {r.code}
                            </span>
                            <span className="font-bold text-white">{r.ownerName}</span>
                            <span dir="ltr" className="font-mono text-slate-400 mr-2">
                              {r.ownerPhone}
                            </span>
                          </div>
                          <span className="text-emerald-400 font-mono font-bold">
                            {r.bonusToman.toLocaleString('fa-IR')} ت
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Chat & X-Ray Logs */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-extrabold text-emerald-300">
                    آخرین مکالمات و گزارش‌های هوش مصنوعی پاشالان:
                  </h3>
                  {!overview.aiLogs || overview.aiLogs.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                      هنوز مکالمه‌ای ثبت نشده است.
                    </div>
                  ) : (
                    overview.aiLogs.slice(0, 20).map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                            {log.mode.toUpperCase()} · {log.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(log.createdAt).toLocaleString('fa-IR')}
                          </span>
                        </div>
                        <div className="font-bold text-white">{log.question}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2">
                          {log.replyPreview}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
