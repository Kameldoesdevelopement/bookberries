import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, Pencil, X, Save, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

type Accessory = Tables<"accessories">;

const inputClass = "w-full rounded-lg border border-input bg-background px-4 py-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const ManageAccessories = () => {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Accessory>>({});
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const fetchAccessories = async () => {
    setLoading(true);
    const { data } = await supabase.from("accessories").select("*").order("created_at", { ascending: false });
    setAccessories(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAccessories(); }, []);

  const deleteAccessory = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await supabase.from("accessories").delete().eq("id", id);
    setAccessories(accessories.filter((a) => a.id !== id));
    queryClient.invalidateQueries({ queryKey: ["accessories"] });
    toast.success(`"${name}" deleted`);
  };

  const startEdit = (acc: Accessory) => {
    setEditingId(acc.id);
    setEditData({ ...acc });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const { error } = await supabase.from("accessories").update({
      name: editData.name,
      description: editData.description,
      price: editData.price,
      category: editData.category,
      image_url: editData.image_url,
    }).eq("id", editingId);
    if (error) { toast.error("Failed to update"); return; }
    setAccessories(accessories.map((a) => a.id === editingId ? { ...a, ...editData } : a));
    queryClient.invalidateQueries({ queryKey: ["accessories"] });
    toast.success("Accessory updated");
    cancelEdit();
  };

  const filtered = accessories.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-muted-foreground py-8 text-center">Loading accessories...</p>;

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input className={`${inputClass} pl-10`} placeholder="Search accessories..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} accessor{filtered.length !== 1 ? "ies" : "y"}</p>

      {filtered.map((acc) => (
        <div key={acc.id} className="rounded-lg border border-border bg-card p-4">
          {editingId === acc.id ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Name</label>
                  <input className={inputClass} value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Category</label>
                  <input className={inputClass} value={editData.category || ""} onChange={(e) => setEditData({ ...editData, category: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Price (DZD)</label>
                  <input type="number" className={inputClass} value={editData.price || ""} onChange={(e) => setEditData({ ...editData, price: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Image URL</label>
                  <input className={inputClass} value={editData.image_url || ""} onChange={(e) => setEditData({ ...editData, image_url: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block font-sans text-xs font-medium text-muted-foreground">Description</label>
                <textarea className={`${inputClass} min-h-[80px] resize-none`} value={editData.description || ""} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="warm" onClick={saveEdit}><Save className="h-3 w-3 mr-1" />Save</Button>
                <Button size="sm" variant="ghost" onClick={cancelEdit}><X className="h-3 w-3 mr-1" />Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded overflow-hidden border border-border flex-shrink-0 bg-muted">
                {acc.image_url ? (
                  <img src={acc.image_url} alt={acc.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-sans text-sm font-semibold text-foreground truncate">{acc.name}</h3>
                <p className="font-sans text-xs text-muted-foreground">{acc.category} · {acc.price} DZD</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <Button size="sm" variant="ghost" onClick={() => startEdit(acc)}><Pencil className="h-3 w-3" /></Button>
                <Button size="sm" variant="ghost" onClick={() => deleteAccessory(acc.id, acc.name)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageAccessories;
