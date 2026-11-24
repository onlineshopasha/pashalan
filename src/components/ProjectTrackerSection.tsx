import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, ShieldCheck, Globe } from 'lucide-react';
import { TrackedProject } from '../data/spatialCatalog';

interface ProjectTrackerSectionProps {
  projects: TrackedProject[];
}

export const ProjectTrackerSection: React.FC<ProjectTrackerSectionProps> = ({
  projects,
}) => {
  const [searchCode, setSearchCode] = useState<string>(projects[0]?.code || 'PSH-4051');
  const [activeProject, setActiveProject] = useState<TrackedProject | null>(
    projects[0] || null
  );
  const [notFoundError, setNotFoundError] = useState<boolean>(false);

  const fetchLiveServerOrder = async (normalized: string): Promise<TrackedProject | null> => {
    try {
      const resp = await fetch(`/api/orders/track/${encodeURIComponent(normalized)}`);
      if (!resp.ok) return null;
      const data = await resp.json();
      if (!data.ok || !data.order) return null;
      const ord = data.order;
      const pct = Number(ord.progressPercent) || 25;
      return {
        code: ord.code,
        clientName: ord.clientName,
        projectTitle: ord.projectTitle,
        packageType: ord.packageType,
        startDate: ord.startDate || '۱۴۰۵/۰۸/۰۸',
        deliveryDate: ord.deliveryDate || '۲ تا ۵ روز کاری',
        progressPercent: pct,
        currentStage: ord.currentStage,
        domain: ord.domain,
        arvanCdnStatus: pct >= 75 ? 'فعال و متصل (Edge SSL)' : 'در حال تنظیم DNS',
        milestones: [
          {
            title: 'ثبت سفارش، دامنه رایگان و آماده‌سازی هاست',
            status: pct >= 25 ? 'completed' : 'in-progress',
            date: ord.startDate || 'انجام شد',
          },
          {
            title: 'طراحی رابط کاربری، چیدمان صفحات و بارگذاری برند',
            status: pct >= 50 ? 'completed' : pct >= 25 ? 'in-progress' : 'upcoming',
            date: pct >= 50 ? 'تکمیل شد' : 'در حال اجرا',
          },
          {
            title: 'اتصال درگاه بله، شاپرک، ترب و بهینه‌سازی سرعت ۹۵+',
            status: pct >= 75 ? 'completed' : pct >= 50 ? 'in-progress' : 'upcoming',
            date: pct >= 75 ? 'تکمیل شد' : 'مرحله بعد',
          },
          {
            title: 'تایید نهایی کارفرما و تحویل قطعی با ۱ سال گارانتی',
            status: pct >= 100 ? 'completed' : pct >= 75 ? 'in-progress' : 'upcoming',
            date: pct >= 100 ? 'تحویل قطعی شد' : ord.deliveryDate || 'به‌زودی',
          },
        ],
      };
    } catch {
      return null;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = searchCode.trim().toUpperCase();
    const serverMatch = await fetchLiveServerOrder(normalized);
    if (serverMatch) {
      setActiveProject(serverMatch);
      setNotFoundError(false);
      return;
    }
    const found = projects.find((p) => p.code.toUpperCase() === normalized);
    if (found) {
      setActiveProject(found);
      setNotFoundError(false);
    } else {
      setNotFoundError(true);
    }
  };

  const handleSelectQuickCode = async (code: string) => {
    setSearchCode(code);
    const serverMatch = await fetchLiveServerOrder(code.toUpperCase());
    if (serverMatch) {
      setActiveProject(serverMatch);
      setNotFoundError(false);
      return;
    }
    const found = projects.find((p) => p.code === code);
    if (found) {
      setActiveProject(found);
      setNotFoundError(false);
    }
  };

  return (
    <section id="tracker" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Search & Quick Sample Codes */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs text-blue-600 font-bold mb-2">
                سیستم پرداخت امن و پیگیری لحظه‌ای کارفرمایان
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                پیگیری آنلاین مراحل طراحی سایت و آزادسازی مرحله‌ای وجه
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                در پاشالان، هزینه پروژه پیش از تایید نهایی شما آزاد نمی‌شود. کارفرمایان با کد رهگیری اختصاصی می‌توانند پیشرفت هر مرحله و وضعیت اتصال دامنه در کلود آروان را به صورت زنده مشاهده کنند.
              </p>
            </div>

            <form onSubmit={handleSearch} className="space-y-3">
              <label className="block text-xs font-medium text-slate-700">
                کد رهگیری قرارداد یا پیش‌فاکتور خود را وارد کنید:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="PSH-4051"
                  className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>بررسی وضعیت</span>
                </button>
              </div>
            </form>

            {notFoundError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                پروژه‌ای با این کد یافت نشد. لطفاً یکی از کدهای فعال زیر را انتخاب کنید.
              </div>
            )}

            <div className="space-y-2">
              <span className="text-xs text-slate-500 font-medium block">
                نمونه پرونده‌های فعال کارفرمایان (کلیک کنید):
              </span>
              <div className="flex flex-wrap gap-2">
                {projects.map((proj) => (
                  <button
                    key={proj.code}
                    type="button"
                    onClick={() => handleSelectQuickCode(proj.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      activeProject?.code === proj.code
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {proj.code} ({proj.clientName})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Active Project Status Card */}
          <div className="lg:col-span-7">
            {activeProject && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-bold text-blue-600">
                        {activeProject.code}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-slate-700">
                        {activeProject.clientName}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      {activeProject.projectTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{activeProject.packageType}</p>
                  </div>

                  <div className="text-left bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl shrink-0">
                    <span className="text-[11px] text-emerald-800 block">
                      پیشرفت کل پروژه:
                    </span>
                    <span className="text-xl font-mono font-extrabold text-emerald-700 tabular-nums">
                      {activeProject.progressPercent}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">
                      مرحله فعلی:{' '}
                      <strong className="text-slate-900">{activeProject.currentStage}</strong>
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      زمان تحویل: {activeProject.deliveryDate}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      style={{ width: `${activeProject.progressPercent}%` }}
                      className="h-full bg-gradient-to-l from-emerald-500 to-blue-600 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Milestones List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProject.milestones.map((ms, index) => (
                    <div
                      key={ms.title}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3"
                    >
                      {ms.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900">
                          ۰{index + 1}. {ms.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                          {ms.status === 'completed' ? 'تکمیل و تایید شده در ' : 'زمان‌بندی: '}
                          {ms.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>دامنه متصل کارفرما:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {activeProject.domain}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>وضعیت پرداخت امن و کلود:</span>
                    <span className="text-emerald-700 font-bold">
                      {activeProject.arvanCdnStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
