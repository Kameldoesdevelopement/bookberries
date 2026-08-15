import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WilayaPricing {
  home: number;
  desk: number;
}

const WILAYA_PRICING: Record<string, WilayaPricing> = {
  "Adrar": { home: 1400, desk: 970 },
  "Chlef": { home: 800, desk: 570 },
  "Laghouat": { home: 950, desk: 670 },
  "Oum El Bouaghi": { home: 800, desk: 570 },
  "Batna": { home: 800, desk: 570 },
  "Béjaïa": { home: 800, desk: 570 },
  "Biskra": { home: 950, desk: 670 },
  "Béchar": { home: 1100, desk: 720 },
  "Blida": { home: 750, desk: 570 },
  "Bouira": { home: 800, desk: 570 },
  "Tamanrasset": { home: 1600, desk: 1120 },
  "Tébessa": { home: 900, desk: 570 },
  "Tlemcen": { home: 400, desk: 250 },
  "Tiaret": { home: 750, desk: 570 },
  "Tizi Ouzou": { home: 800, desk: 570 },
  "Alger": { home: 650, desk: 470 },
  "Djelfa": { home: 950, desk: 670 },
  "Jijel": { home: 800, desk: 570 },
  "Sétif": { home: 800, desk: 570 },
  "Saïda": { home: 750, desk: 570 },
  "Skikda": { home: 800, desk: 570 },
  "Sidi Bel Abbès": { home: 700, desk: 570 },
  "Annaba": { home: 850, desk: 570 },
  "Guelma": { home: 850, desk: 570 },
  "Constantine": { home: 800, desk: 570 },
  "Médéa": { home: 750, desk: 570 },
  "Mostaganem": { home: 700, desk: 570 },
  "M'Sila": { home: 900, desk: 670 },
  "Mascara": { home: 700, desk: 570 },
  "Ouargla": { home: 1000, desk: 720 },
  "Oran": { home: 700, desk: 570 },
  "El Bayadh": { home: 1000, desk: 670 },
  "Illizi": { home: 1600, desk: 1120 },
  "Bordj Bou Arréridj": { home: 800, desk: 570 },
  "Boumerdès": { home: 800, desk: 570 },
  "El Tarf": { home: 850, desk: 570 },
  "Tindouf": { home: 1400, desk: 970 },
  "Tissemsilt": { home: 750, desk: 570 },
  "El Oued": { home: 1000, desk: 720 },
  "Khenchela": { home: 800, desk: 570 },
  "Souk Ahras": { home: 800, desk: 570 },
  "Tipaza": { home: 800, desk: 570 },
  "Mila": { home: 800, desk: 570 },
  "Aïn Defla": { home: 750, desk: 570 },
  "Naâma": { home: 1000, desk: 670 },
  "Aïn Témouchent": { home: 650, desk: 570 },
  "Ghardaïa": { home: 1000, desk: 670 },
  "Relizane": { home: 750, desk: 570 },
  "Timimoun": { home: 1400, desk: 970 },
  "Bordj Badji Mokhtar": { home: 1600, desk: 1120 },
  "Ouled Djellal": { home: 950, desk: 670 },
  "Béni Abbès": { home: 1200, desk: 970 },
  "In Salah": { home: 1600, desk: 1120 },
  "In Guezzam": { home: 1600, desk: 0 },
  "Touggourt": { home: 1000, desk: 720 },
  "Djanet": { home: 1600, desk: 1120 },
  "El M'Ghair": { home: 1000, desk: 0 },
  "El Meniaa": { home: 1000, desk: 720 },
};

interface OrderItemInput {
  book_id: string;
  quantity: number;
}

interface OrderRequest {
  request_id?: string;
  customer_name: string;
  phone: string;
  wilaya: string;
  delivery_type: string; // free-form description e.g. "home - <address>" or "pickup - <desk>"
  delivery_mode: "home" | "pickup";
  items: OrderItemInput[];
  customer_notes?: string;
}

function badRequest(msg: string) {
  return new Response(JSON.stringify({ error: msg }), {
    status: 400,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as OrderRequest;

    // Basic validation
    if (
      !body ||
      typeof body.customer_name !== "string" ||
      typeof body.phone !== "string" ||
      typeof body.wilaya !== "string" ||
      typeof body.delivery_type !== "string" ||
      (body.delivery_mode !== "home" && body.delivery_mode !== "pickup") ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return badRequest("Invalid payload");
    }

    const name = body.customer_name.trim();
    const phone = body.phone.trim();
    const wilaya = body.wilaya.trim();
    const deliveryDesc = body.delivery_type.trim().slice(0, 250);
    const customerNotes = typeof body.customer_notes === "string"
      ? body.customer_notes.trim().slice(0, 1000) || null
      : null;

    if (body.request_id !== undefined && !UUID_PATTERN.test(body.request_id)) {
      return badRequest("Invalid request ID");
    }

    if (name.length < 2 || name.length > 120) return badRequest("Invalid name");
    if (phone.length < 6 || phone.length > 30) return badRequest("Invalid phone");
    const pricing = WILAYA_PRICING[wilaya];
    if (!pricing) return badRequest("Invalid wilaya");

    if (body.delivery_mode === "pickup" && pricing.desk === 0) {
      return badRequest("Desk pickup is not available for this wilaya");
    }

    if (body.items.length > 50) return badRequest("Too many items");
    for (const it of body.items) {
      if (
        !it ||
        typeof it.book_id !== "string" ||
        !Number.isInteger(it.quantity) ||
        it.quantity < 1 ||
        it.quantity > 99
      ) {
        return badRequest("Invalid item");
      }
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const bookIds = [...new Set(body.items.map((i) => i.book_id))];
    const { data: books, error: booksErr } = await supabase
      .from("books")
      .select("id, title, price, is_promotion, promo_price")
      .in("id", bookIds);

    if (booksErr) {
      console.error("books fetch error", booksErr);
      return new Response(JSON.stringify({ error: "Server error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const effectivePrice = (b: { price: number; is_promotion: boolean | null; promo_price: number | null }) =>
      b.is_promotion && typeof b.promo_price === "number" && b.promo_price > 0 && b.promo_price < b.price
        ? b.promo_price
        : b.price;

    const bookMap = new Map(books?.map((b) => [b.id, b]) ?? []);
    for (const it of body.items) {
      if (!bookMap.has(it.book_id)) return badRequest("Unknown book in cart");
    }

    const deliveryFee =
      body.delivery_mode === "home" ? pricing.home : pricing.desk;
    const itemsTotal = body.items.reduce((sum, it) => {
      const book = bookMap.get(it.book_id);
      return book ? sum + effectivePrice(book) * it.quantity : sum;
    }, 0);
    const totalPrice = itemsTotal + deliveryFee;

    const orderId = body.request_id ?? crypto.randomUUID();
    const { error: orderErr } = await supabase.from("orders").insert({
      id: orderId,
      customer_name: name,
      phone,
      wilaya,
      delivery_type: deliveryDesc,
      total_price: totalPrice,
      status: "pending",
      customer_notes: customerNotes,
    });
    if (orderErr) {
      // A retry can arrive after the first request committed but its response was lost.
      // Treat the existing order as success instead of creating a duplicate or failing.
      if (orderErr.code === "23505" && body.request_id) {
        const { data: existingOrder } = await supabase
          .from("orders")
          .select("id, total_price")
          .eq("id", orderId)
          .maybeSingle();
        if (existingOrder) {
          return new Response(JSON.stringify({
            order_id: existingOrder.id,
            total_price: existingOrder.total_price,
          }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      console.error("order insert error", orderErr);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const itemRows = body.items.map((it) => {
      const book = bookMap.get(it.book_id);
      if (!book) return null;
      return {
        order_id: orderId,
        book_id: it.book_id,
        title: book.title,
        quantity: it.quantity,
        price: effectivePrice(book),
      };
    }).filter((row): row is NonNullable<typeof row> => row !== null);
    const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
    if (itemsErr) {
      console.error("order items insert error", itemsErr);
      // best-effort cleanup
      await supabase.from("orders").delete().eq("id", orderId);
      return new Response(JSON.stringify({ error: "Failed to create order" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ order_id: orderId, total_price: totalPrice }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    console.error("create-order error", e);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
