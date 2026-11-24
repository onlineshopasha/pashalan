export interface ProformaLineItem {
  title: string;
  category: string;
  priceToman: number;
  note?: string;
  isInquiry?: boolean;
}

/**
 * Escapes HTML special characters to prevent markup/script injection
 * inside downloaded proforma invoice HTML documents.
 */
export function escapeHtml(input: string | number | undefined | null): string {
  const str = String(input ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function triggerHtmlDownload(filename: string, htmlContent: string) {
  const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '-');
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function downloadOfficialProforma(params: {
  clientName: string;
  phone: string;
  domainName?: string;
  items: ProformaLineItem[];
  subtotalToman: number;
  discountToman: number;
  finalTotalToman: number;
  deliveryText?: string;
}) {
  const invNo = `PSH-${Math.floor(140500 + Math.random() * 89999)}`;
  const todayFa = escapeHtml(new Date().toLocaleDateString('fa-IR'));
  const safeClientName = escapeHtml(params.clientName || 'کارفرمای گرامی پاشالان');
  const safePhone = escapeHtml(params.phone || 'ثبت نشده');
  const safeDomain = escapeHtml(params.domainName || 'تعیین در مرحله ثبت');
  const safeDelivery = params.deliveryText ? escapeHtml(params.deliveryText) : '';

  const rowsHtml = params.items
    .map(
      (it, idx) => `
      <tr>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;">${idx + 1}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;">
          <strong>${escapeHtml(it.title)}</strong>
          ${
            it.note
              ? `<div style="font-size:11px;color:#047857;margin-top:3px;">${escapeHtml(it.note)}</div>`
              : ''
          }
        </td>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:center;">${escapeHtml(it.category)}</td>
        <td style="border:1px solid #cbd5e1;padding:10px;text-align:left;font-weight:bold;">
          ${
            it.isInquiry
              ? 'استعلام قیمت طبق خواسته‌ها'
              : it.priceToman === 0
              ? 'رایگان (۰ تومان)'
              : `${escapeHtml(it.priceToman.toLocaleString('fa-IR'))} تومان`
          }
        </td>
      </tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>پیش‌فاکتور رسمی پاشالان - ${escapeHtml(invNo)}</title>
  <style>
    body { font-family: Tahoma, Vazirmatn, sans-serif; color: #0f172a; margin: 28px; line-height: 1.8; max-width: 920px; margin-inline: auto; }
    .header { display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #1e40af; padding-bottom:14px; margin-bottom:20px; }
    table { width:100%; border-collapse:collapse; margin:16px 0; font-size:13px; }
    th { background:#f1f5f9; border:1px solid #cbd5e1; padding:10px; }
    .box { background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:14px; margin-top:14px; font-size:12.5px; }
    .stamp { margin-top:30px; display:flex; justify-content:space-between; align-items:center; }
    .seal { border:2px solid #1d4ed8; color:#1d4ed8; border-radius:12px; padding:10px 18px; font-weight:bold; text-align:center; }
    .print-btn { margin-bottom:16px; padding:10px 18px; background:#1d4ed8; color:#fff; border:none; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:bold; }
    @media print { .print-btn { display:none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">چاپ / ذخیره به صورت PDF</button>
  <div class="header">
    <div>
      <h2 style="margin:0;color:#1d4ed8;">پیش‌فاکتور رسمی پلتفرم مهندسی پاشالان (Pashalan.ir)</h2>
      <div style="font-size:12px;color:#475569;">تهران، بلوار میرداماد · تلفن مشاوره و قرارداد مستقیم: 09197254078</div>
    </div>
    <div style="text-align:left;font-size:12px;">
      <div><strong>شماره پیش‌فاکتور:</strong> ${escapeHtml(invNo)}</div>
      <div><strong>تاریخ صدور:</strong> ${todayFa}</div>
      <div><strong>مدت اعتبار:</strong> ۷ روز کاری</div>
    </div>
  </div>
  <div class="box">
    <strong>مشخصات کارفرما:</strong> ${safeClientName} &nbsp;|&nbsp;
    <strong>شماره تماس:</strong> ${safePhone} &nbsp;|&nbsp;
    <strong>دامنه پیشنهادی:</strong> ${safeDomain}
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:45px;">ردیف</th>
        <th>شرح طرح / خدمات انتخابی</th>
        <th style="width:140px;">دسته‌بندی</th>
        <th style="width:170px;">مبلغ (تومان)</th>
      </tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <div class="box">
    ${safeDelivery ? `<div><strong>زمان تحویل:</strong> ${safeDelivery}</div>` : ''}
    <div><strong>جمع اقلام قیمت‌دار:</strong> ${escapeHtml(params.subtotalToman.toLocaleString('fa-IR'))} تومان</div>
    <div><strong>مجموع تخفیف و هدیه:</strong> ${escapeHtml(params.discountToman.toLocaleString('fa-IR'))} تومان</div>
    <div style="font-size:15px;color:#1d4ed8;margin-top:6px;"><strong>مبلغ قابل پرداخت نهایی: ${
      params.finalTotalToman > 0
        ? `${escapeHtml(params.finalTotalToman.toLocaleString('fa-IR'))} تومان`
        : 'برآورد دقیق پس از بررسی خواسته‌ها'
    }</strong></div>
    <div style="margin-top:8px;color:#047857;"><strong>آپشن‌های رایگان همراه سفارش:</strong> ۶ ماه هاست ابری رایگان + دامنه .ir رایگان ۱ ساله (یا دامنه .com رایگان و هاست رایگان در پکیج ۲۰ میلیونی) + اتصال رایگان اینماد، درگاه بله/شاپرک/زرین‌پال، اقساط اسنپ‌پی، ترب، گواهی SSL و آموزش ویدیویی.</div>
  </div>
  <div class="stamp">
    <div style="font-size:12px;color:#475569;">امضا و تایید کارفرما:<br/><br/>........................................</div>
    <div class="seal">مهر و تاییدیه رسمی<br/>پلتفرم پاشالان (Pashalan.ir)<br/>تضمین پرداخت امن مرحله‌ای</div>
  </div>
</body>
</html>`;

  triggerHtmlDownload(`pashalan-proforma-${invNo}.html`, html);
  return invNo;
}

export function downloadOfficialSampleContract() {
  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>نمونه قرارداد رسمی طراحی سایت پاشالان</title>
  <style>
    body { font-family: Tahoma, Vazirmatn, sans-serif; line-height: 1.9; color: #0f172a; margin: 32px; font-size: 13px; max-width: 900px; margin-inline: auto; }
    h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; font-size: 18px; }
    h2 { font-size: 14px; color: #0f172a; margin-top: 18px; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; margin-top: 16px; }
    .print-btn { margin-bottom:16px; padding:10px 18px; background:#1d4ed8; color:#fff; border:none; border-radius:8px; cursor:pointer; font-family:inherit; font-weight:bold; }
    @media print { .print-btn { display:none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">چاپ / ذخیره قرارداد PDF</button>
  <h1>نمونه قرارداد رسمی طراحی، پیاده‌سازی و تحویل وب‌سایت — پلتفرم پاشالان (Pashalan.ir)</h1>
  <p>این قرارداد فی‌مابین پلتفرم مهندسی پاشالان به‌عنوان «مجری» و سفارش‌دهنده به‌عنوان «کارفرما» با تعهدات شفاف زیر تنظیم می‌گردد:</p>
  <h2>ماده ۱ — موضوع قرارداد و آپشن‌های رایگان</h2>
  <p>طراحی و پیاده‌سازی وب‌سایت مطابق طرح انتخابی (طرح آماده ۱ تا ۱۰ صفحه‌ای با ۶ ماه هاست و دامنه .ir رایگان، یا پکیج ویژه ۲۰ میلیونی دامنه .com رایگان و هاست رایگان، یا طراحی اختصاصی طبق پیوست فنی) همراه با اتصال رایگان درگاه بله، شاپرک/زرین‌پال، اقساط اسنپ‌پی، اینماد، ترب، گواهی SSL و آموزش ویدیویی.</p>
  <h2>ماده ۲ — مالکیت ۱۰۰٪ دامنه، هاست و سورس‌کد</h2>
  <p>کلیه حقوق مادی، معنوی، مالکیت دامنه (.ir یا .com)، پنل هاست و سورس‌کد از روز اول ۱۰۰٪ به نام کارفرما ثبت و تحویل می‌گردد.</p>
  <h2>ماده ۳ — پرداخت امن مرحله‌ای (Escrow) و ضمانت بازگشت وجه</h2>
  <p>۵۰٪ مبلغ در زمان شروع و ثبت دامنه، و ۵۰٪ نهایی صرفاً پس از بارگذاری کامل سایت روی دامنه اصلی و تایید کتبی رضایت کارفرما آزاد می‌شود. در صورت عدم تطابق فنی با تعهدات، کل مبلغ مسترد می‌گردد.</p>
  <h2>ماده ۴ — تضمین سرعت و ۱ سال گارانتی فنی رایگان</h2>
  <p>مجری متعهد است سایت را با سرعت بارگذاری زیر ۱ ثانیه، نمایش استاندارد موبایل و ۱ سال گارانتی رایگان رفع خطاهای فنی تحویل نماید.</p>
  <div class="box"><strong>تاییدیه رسمی:</strong> پاشالان (Pashalan.ir) · تهران، بلوار میرداماد · 09197254078</div>
</body>
</html>`;
  triggerHtmlDownload('pashalan-official-contract-sample.html', html);
}

export interface AiProposalPayload {
  proposalTitle: string;
  executiveSummary: string;
  recommendedPackageTitle: string;
  estimatedPriceToman: number;
  architectureHighlights: string[];
  timelineSteps: string[];
  expectedRoiNote: string;
  recommendedIds?: string[];
}

export function downloadAiCustomProposal(params: {
  brandName: string;
  industry: string;
  budget: string;
  proposal: AiProposalPayload;
}) {
  const todayFa = escapeHtml(new Date().toLocaleDateString('fa-IR'));
  const propNo = `PRP-${Math.floor(140500 + Math.random() * 89999)}`;
  const highlightsHtml = (params.proposal.architectureHighlights || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');
  const timelineHtml = (params.proposal.timelineSteps || [])
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join('');

  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>پروپوزال رسمی طراحی سایت - ${escapeHtml(params.brandName)}</title>
  <style>
    body { font-family: Tahoma, Vazirmatn, sans-serif; color: #0f172a; margin: 28px; line-height: 1.9; max-width: 900px; margin-inline: auto; font-size: 13px; }
    .hero { background: #0f172a; color: #fff; padding: 24px; border-radius: 16px; margin-bottom: 20px; }
    .hero h1 { margin: 0 0 8px 0; font-size: 20px; color: #34d399; }
    .meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12px; color: #cbd5e1; }
    .card { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 14px; }
    h2 { font-size: 14px; color: #1d4ed8; margin: 0 0 8px 0; }
    ul { margin: 0; padding-right: 18px; }
    .price-box { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 16px; margin: 16px 0; }
    .print-btn { margin-bottom: 16px; padding: 10px 18px; background: #1d4ed8; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">چاپ / ذخیره پروپوزال رسمی به صورت PDF</button>
  <div class="hero">
    <h1>${escapeHtml(params.proposal.proposalTitle)}</h1>
    <div class="meta">
      <span><strong>برند کارفرما:</strong> ${escapeHtml(params.brandName)}</span>
      <span><strong>حوزه فعالیت:</strong> ${escapeHtml(params.industry)}</span>
      <span><strong>شماره سند:</strong> ${escapeHtml(propNo)}</span>
      <span><strong>تاریخ صدور:</strong> ${todayFa}</span>
    </div>
  </div>
  <div class="card">
    <h2>۱. خلاصه مدیریتی و چشم‌انداز پروژه</h2>
    <p>${escapeHtml(params.proposal.executiveSummary)}</p>
  </div>
  <div class="price-box">
    <div><strong>پکیج پیشنهادی پاشالان:</strong> ${escapeHtml(params.proposal.recommendedPackageTitle)}</div>
    <div style="font-size:16px;font-weight:bold;color:#047857;margin-top:6px;">
      برآورد سرمایه‌گذاری: ${
        params.proposal.estimatedPriceToman > 0
          ? `${escapeHtml(params.proposal.estimatedPriceToman.toLocaleString('fa-IR'))} تومان`
          : 'برآورد دقیق پس از جلسه فنی'
      }
    </div>
    <div style="font-size:12px;margin-top:6px;">شامل آپشن‌های رایگان: دامنه و هاست رایگان، اتصال اینماد، درگاه بله/شاپرک، اقساط اسنپ‌پی، ترب، گواهی SSL و ۱ سال گارانتی فنی.</div>
  </div>
  <div class="card">
    <h2>۲. معماری فنی، سرعت و امکانات کلیدی</h2>
    <ul>${highlightsHtml}</ul>
  </div>
  <div class="card">
    <h2>۳. زمان‌بندی گام‌به‌گام اجرا و تحویل</h2>
    <ul>${timelineHtml}</ul>
  </div>
  <div class="card">
    <h2>۴. پیش‌بینی بازگشت سرمایه (ROI)</h2>
    <p>${escapeHtml(params.proposal.expectedRoiNote)}</p>
  </div>
  <div class="card" style="text-align:center;">
    <strong>پلتفرم مهندسی طراحی وب پاشالان (Pashalan.ir)</strong> · تهران، بلوار میرداماد · مشاوره مستقیم و واتساپ: <strong>09197254078</strong>
  </div>
</body>
</html>`;

  triggerHtmlDownload(`pashalan-proposal-${propNo}.html`, html);
  return propNo;
}

export function downloadSignedDigitalContract(contract: {
  contractNo: string;
  clientName: string;
  nationalId: string;
  phone: string;
  domainName: string;
  projectTitle: string;
  totalToman: number;
  signedAt: string;
}) {
  const signedDateFa = escapeHtml(
    new Date(contract.signedAt).toLocaleString('fa-IR')
  );
  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8" />
  <title>قرارداد دیجیتال رسمی پاشالان - ${escapeHtml(contract.contractNo)}</title>
  <style>
    body { font-family: Tahoma, Vazirmatn, sans-serif; color: #0f172a; margin: 28px; line-height: 1.9; max-width: 900px; margin-inline: auto; font-size: 13px; }
    h1 { color: #1e3a8a; border-bottom: 2px solid #1e3a8a; padding-bottom: 10px; font-size: 18px; }
    h2 { font-size: 14px; color: #0f172a; margin-top: 16px; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; margin: 14px 0; }
    .verified { background: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; padding: 14px; margin-top: 18px; color: #065f46; }
    .print-btn { margin-bottom: 16px; padding: 10px 18px; background: #1d4ed8; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-family: inherit; font-weight: bold; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">چاپ / ذخیره قرارداد امضاشده PDF</button>
  <h1>قرارداد رسمی و امضاشده طراحی وب‌سایت — پلتفرم پاشالان (Pashalan.ir)</h1>
  <div class="box">
    <div><strong>شماره ثبت قرارداد:</strong> ${escapeHtml(contract.contractNo)}</div>
    <div><strong>تاریخ و زمان امضای دیجیتال:</strong> ${signedDateFa}</div>
    <div><strong>مشخصات کارفرما:</strong> ${escapeHtml(contract.clientName)} | <strong>کد ملی:</strong> ${escapeHtml(contract.nationalId)} | <strong>موبایل:</strong> ${escapeHtml(contract.phone)}</div>
    <div><strong>دامنه ثبتی به نام کارفرما:</strong> ${escapeHtml(contract.domainName)}</div>
    <div><strong>موضوع پروژه:</strong> ${escapeHtml(contract.projectTitle)}</div>
    <div><strong>مبلغ کل قرارداد:</strong> ${
      contract.totalToman > 0
        ? `${escapeHtml(contract.totalToman.toLocaleString('fa-IR'))} تومان`
        : 'مطابق پیوست فنی استعلام'
    }</div>
  </div>
  <h2>ماده ۱ — مالکیت ۱۰۰٪ دامنه، هاست و سورس‌کد</h2>
  <p>کلیه حقوق مادی و معنوی دامنه ${escapeHtml(contract.domainName)}، پنل هاست ابری و سورس‌کد وب‌سایت از لحظه شروع پروژه به نام کارفرما ثبت و تحویل داده می‌شود.</p>
  <h2>ماده ۲ — پرداخت امن مرحله‌ای (Escrow) و ضمانت بازگشت وجه</h2>
  <p>۵۰٪ مبلغ در زمان شروع کار و ۵۰٪ نهایی صرفاً پس از بارگذاری کامل سایت روی دامنه اصلی و تایید رضایت کارفرما پرداخت می‌گردد.</p>
  <h2>ماده ۳ — ۱ سال گارانتی فنی و آپشن‌های رایگان</h2>
  <p>اتصال رایگان اینماد، درگاه پرداخت کیف‌پول بله/شاپرک، فروش اقساطی اسنپ‌پی، اتصال ترب، گواهی SSL و ۱ سال گارانتی فنی رایگان جزء لاینفک این قرارداد است.</p>
  <div class="verified">
    <strong>تاییدیه امضای دیجیتال معتبر:</strong> این سند با شناسه یکتای ${escapeHtml(contract.contractNo)} توسط ${escapeHtml(contract.clientName)} (کد ملی ${escapeHtml(contract.nationalId)}) به صورت آنلاین تایید و در سامانه رسمی پاشالان (09197254078) ثبت شده است.
  </div>
</body>
</html>`;

  triggerHtmlDownload(`pashalan-contract-${contract.contractNo}.html`, html);
}

