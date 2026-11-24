import React, { useState, useMemo } from 'react';
import {
  Check,
  Calculator,
  FileText,
  ArrowUpLeft,
  Printer,
  ShoppingCart,
} from 'lucide-react';
import { CALCULATOR_FEATURES, CalculatorFeature } from '../data/spatialCatalog';
import { downloadOfficialProforma } from '../utils/documentExport';

interface CostCalculatorSectionProps {
  onAddAllToCart?: (features: CalculatorFeature[]) => void;
  onSubmitEstimate: (payload: {
    clientName: string;
    phone: string;
    businessName: string;
    selectedFeatures: CalculatorFeature[];
    totalPriceToman: number;
    totalDays: number;
    paymentPlan: 'cash' | 'installment';
  }) => void;
}

export const CostCalculatorSection: React.FC<CostCalculatorSectionProps> = ({
  onAddAllToCart,
  onSubmitEstimate,
}) => {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string>('plat-ready-kit');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([
    'mod-installment-pay',
    'infra-arvan-edge',
  ]);
  const [paymentPlan, setPaymentPlan] = useState<'cash' | 'installment'>('cash');
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [invoiceSuccess, setInvoiceSuccess] = useState<{
    code: string;
    total: number;
    days: number;
  } | null>(null);

  const platformOptions = useMemo(
    () => CALCULATOR_FEATURES.filter((f) => f.category === 'platform'),
    []
  );
  const addonOptions = useMemo(
    () => CALCULATOR_FEATURES.filter((f) => f.category !== 'platform'),
    []
  );

  const toggleAddon = (id: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedFeatures = useMemo(() => {
    const plat = CALCULATOR_FEATURES.find((f) => f.id === selectedPlatformId);
    const addons = CALCULATOR_FEATURES.filter((f) => selectedAddonIds.includes(f.id));
    return plat ? [plat, ...addons] : addons;
  }, [selectedPlatformId, selectedAddonIds]);

  const rawTotalToman = useMemo(
    () => selectedFeatures.reduce((acc, item) => acc + item.priceToman, 0),
    [selectedFeatures]
  );

  const finalTotalToman = useMemo(
    () => (paymentPlan === 'cash' ? Math.round(rawTotalToman * 0.92) : rawTotalToman),
    [rawTotalToman, paymentPlan]
  );

  const totalDays = useMemo(
    () => selectedFeatures.reduce((acc, item) => acc + item.days, 0),
    [selectedFeatures]
  );

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || clientName.trim().length < 2) {
      setFormError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      return;
    }
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!/^09\d{9}$/.test(cleanPhone) && cleanPhone.length < 10) {
      setFormError('لطفاً شماره موبایل معتبر (مثال: 09123456789) وارد نمایید.');
      return;
    }

    setFormError(null);
    const generatedCode = `PSH-${Math.floor(4100 + Math.random() * 899)}`;
    setInvoiceSuccess({
      code: generatedCode,
      total: finalTotalToman,
      days: totalDays,
    });

    onSubmitEstimate({
      clientName: clientName.trim(),
      phone: cleanPhone,
      businessName: businessName.trim() || 'پروژه جدید پاشالان',
      selectedFeatures,
      totalPriceToman: finalTotalToman,
      totalDays,
      paymentPlan,
    });
  };

  return (
    <section id="calculator" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs text-blue-600 font-bold mb-2">
            محاسبه‌گر هوشمند هزینه طراحی سایت و اپلیکیشن
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            برآورد آنلاین قیمت پروژه و دریافت پیش‌فاکتور فوری
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            بدون نیاز به انتظار برای استعلام تلفنی، نوع پروژه و امکانات مورد نظر خود را تیک بزنید تا هزینه دقیق، زمان تحویل و شرایط «پرداخت امن مرحله‌ای» در لحظه برایتان محاسبه شود.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feature Selection */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                ۱. نوع طراحی سایت یا اپلیکیشن خود را انتخاب کنید:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {platformOptions.map((plat) => {
                  const isSelected = selectedPlatformId === plat.id;
                  return (
                    <button
                      key={plat.id}
                      type="button"
                      onClick={() => setSelectedPlatformId(plat.id)}
                      className={`w-full text-right p-4 sm:p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 shrink-0 ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-sm sm:text-base font-bold text-slate-900">
                            {plat.title}
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{plat.description}</p>
                        </div>
                      </div>
                      <div className="text-left shrink-0">
                        <div className="text-sm font-mono font-extrabold text-blue-600 tabular-nums">
                          {plat.priceToman.toLocaleString('fa-IR')} ت
                        </div>
                        <div className="text-[11px] text-slate-500 tabular-nums mt-0.5">
                          تحویل: {plat.days} روز کاری
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">
                ۲. ماژول‌ها و امکانات تکمیلی مورد نیاز (اختیاری):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addonOptions.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`text-right p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50/60 border-blue-600 shadow-sm'
                          : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {addon.title}
                        </span>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                            isChecked
                              ? 'bg-blue-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {addon.description}
                      </p>
                      <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                        <span className="text-slate-500 tabular-nums">+{addon.days} روز کاری</span>
                        <span className="font-mono font-bold text-blue-600 tabular-nums">
                          +{addon.priceToman.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Proforma Summary */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  پیش‌فاکتور آنلاین و شرایط پرداخت امن
                </h3>
              </div>
              <span className="text-xs text-slate-500 tabular-nums">
                {selectedFeatures.length} مورد انتخابی
              </span>
            </div>

            <div>
              <span className="text-xs text-slate-600 font-medium block mb-2">
                شیوه پرداخت قرارداد:
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPaymentPlan('cash')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    paymentPlan === 'cash'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  نقدی (۸٪ تخفیف ویژه)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPlan('installment')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    paymentPlan === 'installment'
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  پرداخت امن ۳ مرحله‌ای
                </button>
              </div>
            </div>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {selectedFeatures.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-200/70"
                >
                  <span className="text-slate-700 font-medium truncate pl-2">
                    {item.title}
                  </span>
                  <span className="font-mono text-slate-900 font-semibold tabular-nums shrink-0">
                    {item.priceToman.toLocaleString('fa-IR')} ت
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>زمان قطعی تحویل پروژه:</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {totalDays} روز کاری (تضمین در قرارداد)
                </span>
              </div>

              {paymentPlan === 'installment' ? (
                <div className="flex items-center justify-between text-xs text-blue-700 font-medium">
                  <span>مبلغ هر مرحله (پرداخت پس از تایید شما):</span>
                  <span className="font-mono font-bold tabular-nums">
                    {Math.round(finalTotalToman / 3).toLocaleString('fa-IR')} تومان
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-emerald-700 font-medium">
                  <span>تخفیف پرداخت نقدی + ۵٪ پاداش کیف پول:</span>
                  <span className="font-mono font-bold tabular-nums">
                    {(rawTotalToman - finalTotalToman).toLocaleString('fa-IR')} تومان تخفیف
                  </span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
                <span className="text-sm font-bold text-slate-900">مبلغ نهایی پروژه:</span>
                <div className="text-left">
                  <span className="text-2xl font-mono font-extrabold text-blue-600 tabular-nums">
                    {finalTotalToman.toLocaleString('fa-IR')}
                  </span>
                  <span className="text-xs text-slate-600 mr-1">تومان</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  نام و نام خانوادگی کارفرما *
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="مثال: علی محمدی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    شماره موبایل *
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="09123456789"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    عنوان کسب‌وکار شما
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="مثال: فروشگاه نوین"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {onAddAllToCart && (
                  <button
                    type="button"
                    onClick={() => onAddAllToCart(selectedFeatures)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>افزودن کل لیست به سبد خرید</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    downloadOfficialProforma({
                      clientName,
                      phone,
                      domainName: businessName,
                      items: selectedFeatures.map((f) => ({
                        title: f.title,
                        category: f.category === 'platform' ? 'طرح پایه' : 'ماژول انتخابی',
                        priceToman: f.priceToman,
                        note: f.description,
                        isInquiry: f.priceToman === 0,
                      })),
                      subtotalToman: rawTotalToman,
                      discountToman: rawTotalToman - finalTotalToman,
                      finalTotalToman,
                      deliveryText: `${totalDays} روز کاری`,
                    });
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>دانلود پیش‌فاکتور رسمی PDF</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4" />
                <span>ثبت رایگان سفارش و دریافت کد پیگیری</span>
                <ArrowUpLeft className="w-4 h-4" />
              </button>
            </form>

            {invoiceSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-xs">
                <div className="font-bold text-emerald-800">
                  پیش‌فاکتور رسمی شما با موفقیت صادر و ثبت شد!
                </div>
                <div className="text-slate-700">
                  کد پیگیری اختصاصی شما:{' '}
                  <strong className="font-mono text-blue-700 tabular-nums">
                    {invoiceSuccess.code}
                  </strong>
                </div>
                <div className="text-slate-600">
                  هم‌اکنون در بخش «پیگیری آنلاین پروژه» در پایین همین صفحه می‌توانید وضعیت پروژه خود را رصد کنید.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
