import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function TransporteHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? '/transporte/dashboard' : '/transporte/login');
}
