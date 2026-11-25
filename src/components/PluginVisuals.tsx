import React from 'react';
import {
  CreditCard,
  Smartphone,
  Search,
  Truck,
  ShoppingBag,
  Percent,
  RotateCcw,
  Gauge,
  ShieldCheck,
  MessageSquare,
  Crown,
  Sparkles,
  Lock,
  Database,
} from 'lucide-react';
import { PluginCategoryId, ProPluginItem } from '../data/pluginsCatalog';

const coverPayment = '/images/plugin_cat_payment_1795285927334.jpg';
const coverSales = '/images/plugin_cat_sales_1795286096782.jpg';
const coverSeoSpeed = '/images/plugin_cat_seo_speed_1795285925292.jpg';
const coverAutomation = '/images/plugin_cat_automation_1795286096784.jpg';
const coverSecurity = '/images/plugin_cat_security_1795285926700.jpg';
const coverCommunication = '/images/plugin_cat_communication_1795285926358.jpg';

const CATEGORY_COVERS: Record<Exclude<PluginCategoryId, 'all'>, string> = {
  payment: coverPayment,
  sales: coverSales,
  'seo-speed': coverSeoSpeed,
  automation: coverAutomation,
  security: coverSecurity,
  communication: coverCommunication,
};

export function getPluginCategoryCover(
  categoryId: Exclude<PluginCategoryId, 'all'>
): string {
  return CATEGORY_COVERS[categoryId] || coverPayment;
}

const PLUGIN_ICON_MAP: Record<string, React.ElementType> = {
  'tool-bale-shaparak-free': CreditCard,
  'tool-sms-otp-pro': Smartphone,
  'tool-seo-schema-pro': Search,
  'tool-shipping-post-tipax': Truck,
  'tool-torob-emalls-sync': ShoppingBag,
  'tool-bnpl-snapppay-tara': Percent,
  'tool-abandoned-cart-recovery': RotateCcw,
  'tool-speed-cwv-turbo': Gauge,
  'tool-security-waf-backup': ShieldCheck,
  'tool-bale-livechat-crm': MessageSquare,
  'tool-loyalty-wallet-club': Crown,
  'tool-ai-product-assistant': Sparkles,
  'tool-drm-course-shield': Lock,
  'tool-accounting-holoo-sepidar': Database,
};

interface PluginLogoEmblemProps {
  plugin: Pick<ProPluginItem, 'id' | 'logoCode' | 'brandAccent' | 'tier'>;
  size?: 'sm' | 'md' | 'lg';
}

export const PluginLogoEmblem: React.FC<PluginLogoEmblemProps> = ({
  plugin,
  size = 'md',
}) => {
  const IconComp = PLUGIN_ICON_MAP[plugin.id] || Sparkles;

  const boxDims =
    size === 'sm'
      ? 'w-11 h-11 rounded-xl'
      : size === 'lg'
      ? 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl'
      : 'w-14 h-14 rounded-2xl';

  const iconDims =
    size === 'sm'
      ? 'w-5 h-5'
      : size === 'lg'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-6 h-6';

  const codeDims =
    size === 'sm'
      ? 'text-[8px] px-1'
      : size === 'lg'
      ? 'text-[10px] px-1.5 py-0.5'
      : 'text-[9px] px-1.5';

  return (
    <div
      className={`relative shrink-0 ${boxDims} bg-gradient-to-br ${plugin.brandAccent} text-white shadow-md flex items-center justify-center border border-white/25 overflow-hidden select-none`}
    >
      {/* Subtle geometric sheen */}
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
      >
        <circle cx="52" cy="12" r="22" fill="white" />
        <path d="M0 54 L64 26 L64 64 L0 64 Z" fill="black" fillOpacity="0.2" />
      </svg>

      <IconComp className={`${iconDims} relative z-10 drop-shadow-xs`} />

      <span
        dir="ltr"
        className={`absolute bottom-1 right-1 z-10 font-mono font-black tracking-tight rounded bg-slate-950/65 text-white leading-tight ${codeDims}`}
      >
        {plugin.logoCode}
      </span>

      {plugin.tier === 'vip' && (
        <span className="absolute top-1 left-1 z-10 w-2 h-2 rounded-full bg-amber-300 ring-2 ring-amber-300/40" />
      )}
    </div>
  );
};
