import type { Metadata } from 'next';
import { RemittanceComparator } from '@/features/remittance/components/RemittanceComparator';

export const metadata: Metadata = {
  title: 'Comparador de Envío de Dinero | Migrante$',
  description: 'Compara comisiones y tasas estimadas para enviar dinero de EE.UU. a México.',
};

export default function RemesasPage() {
  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Comparador de Envío</h1>
        <p className="text-sm text-muted-foreground">
          Compara cuánto llegaría a tu familia según el proveedor
        </p>
      </div>

      <RemittanceComparator />
    </div>
  );
}
