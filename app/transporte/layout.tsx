import type { Metadata } from 'next';
import './transporte.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Saldo Transporte',
    default: 'Saldo Transporte — Estima el saldo de tu tarjeta',
  },
  description:
    'Estima el saldo de tu tarjeta de transporte público a partir de recargas, viajes programados y ajustes manuales.',
  robots: { index: false, follow: false },
};

export default function TransporteLayout({ children }: { children: React.ReactNode }) {
  return <div className="tp-scope min-h-screen">{children}</div>;
}
