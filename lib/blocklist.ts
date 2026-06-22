import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Controleert of een IP-adres op de blocklist staat (tabel `blocked_ips`).
 *
 * Fail-open: bij een ontbrekende tabel, ontbrekende env-vars of een
 * query-fout geeft deze functie `false` terug. Het contactformulier mag
 * NOOIT stuk gaan door een mislukte blocklist-check.
 */
export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!ip || ip === 'onbekend') return false;
  if (!supabaseUrl || !supabaseAnonKey) return false;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('blocked_ips')
      .select('ip')
      .eq('ip', ip)
      .maybeSingle();

    if (error) {
      console.error('Blocklist-check fout:', error.message);
      return false;
    }

    return !!data;
  } catch (e) {
    console.error('Blocklist-check exception:', e);
    return false;
  }
}
