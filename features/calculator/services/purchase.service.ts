// ============================================================
// features/calculator/services/purchase.service.ts
// Servicio para gestionar listas e items de compra en Supabase
// ============================================================

import { createClient } from '@/lib/supabase/client';
import type { PurchaseList, PurchaseItemCreate } from '@/types/app.types';

export const purchaseService = {
  /**
   * Guarda una lista de compra completa con sus productos e impuestos.
   */
  async savePurchaseList(params: {
    nombre?: string;
    estado_usa: string;
    subtotal: number;
    impuesto: number;
    tasa_imp: number;
    total_usd: number;
    tipo_cambio: number;
    total_mxn: number;
    items: PurchaseItemCreate[];
  }): Promise<PurchaseList> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Debes iniciar sesión para guardar listas de compras');

    // 1. Crear la cabecera de la lista de compra
    const { data: list, error: listError } = await supabase
      .from('migrante_purchase_lists')
      .insert({
        user_id: user.id,
        nombre: params.nombre || `Compra (${params.estado_usa})`,
        estado_usa: params.estado_usa,
        subtotal: params.subtotal,
        impuesto: params.impuesto,
        tasa_imp: params.tasa_imp,
        total_usd: params.total_usd,
        tipo_cambio: params.tipo_cambio,
        total_mxn: params.total_mxn,
        estado: 'guardada',
      })
      .select()
      .single();

    if (listError) throw new Error(`Error al crear la lista: ${listError.message}`);

    // 2. Insertar los items asociados
    const itemsToInsert = params.items.map((item) => ({
      purchase_id: list.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad,
    }));

    const { error: itemsError } = await supabase
      .from('migrante_purchase_items')
      .insert(itemsToInsert);

    if (itemsError) throw new Error(`Error al guardar productos: ${itemsError.message}`);

    return list as PurchaseList;
  },

  /**
   * Consulta las listas de compra guardadas del usuario.
   */
  async getPurchaseLists(): Promise<PurchaseList[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('migrante_purchase_lists')
      .select('*, items:migrante_purchase_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Error al consultar compras: ${error.message}`);
    return (data ?? []) as PurchaseList[];
  },
};
