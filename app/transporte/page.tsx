import { redirect } from 'next/navigation';

export default function TransporteHomePage() {
  // proxy.ts ya garantiza que solo se llega aquí con sesión activa
  // (Saldo Transporte no tiene login propio, usa el de Migrante$).
  redirect('/transporte/dashboard');
}
