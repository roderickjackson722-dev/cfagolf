import { useEffect, useState } from "react";
import { Copy, Plus, Trash2, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface TokenRow {
  id: string;
  token: string;
  label: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

const generateToken = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
};

export const AdminPresentationTokens = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<TokenRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  const [expiresInDays, setExpiresInDays] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("presentation_tokens")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setTokens((data as TokenRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const token = generateToken();
    const expires_at =
      expiresInDays && Number(expiresInDays) > 0
        ? new Date(Date.now() + Number(expiresInDays) * 86400000).toISOString()
        : null;
    const { error } = await supabase.from("presentation_tokens").insert({
      token,
      label: label || null,
      expires_at,
      created_by: user?.id ?? null,
    });
    if (error) {
      toast({ title: "Failed to create", description: error.message, variant: "destructive" });
      return;
    }
    setLabel("");
    setExpiresInDays("");
    toast({ title: "Link generated" });
    load();
  };

  const revoke = async (id: string) => {
    const { error } = await supabase.from("presentation_tokens").update({ is_active: false }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const remove = async (id: string) => {
    if (!confirm("Permanently delete this link?")) return;
    const { error } = await supabase.from("presentation_tokens").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const reactivate = async (id: string) => {
    const { error } = await supabase.from("presentation_tokens").update({ is_active: true }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else load();
  };

  const urlFor = (t: string) => `${window.location.origin}/presentation/${t}`;

  const copy = (t: string) => {
    navigator.clipboard.writeText(urlFor(t));
    toast({ title: "Copied to clipboard" });
  };

  const isExpired = (row: TokenRow) =>
    row.expires_at ? new Date(row.expires_at) < new Date() : false;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-semibold mb-3">Generate new presentation link</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="label">Label (optional)</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Smith family demo"
            />
          </div>
          <div>
            <Label htmlFor="exp">Expires in (days)</Label>
            <Input
              id="exp"
              type="number"
              min={1}
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(e.target.value)}
              placeholder="Blank = never"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={create} className="w-full">
              <Plus className="w-4 h-4 mr-1" /> Generate Link
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold">All links</div>
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : tokens.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No links yet.</div>
        ) : (
          <div className="divide-y">
            {tokens.map((row) => {
              const expired = isExpired(row);
              const active = row.is_active && !expired;
              return (
                <div key={row.id} className="p-4 flex flex-wrap items-center gap-3">
                  <div className="flex-1 min-w-[260px]">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{row.label || "Untitled link"}</span>
                      {active ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          {expired ? "Expired" : "Revoked"}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 break-all">
                      {urlFor(row.token)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Created {new Date(row.created_at).toLocaleDateString()}
                      {row.expires_at &&
                        ` · Expires ${new Date(row.expires_at).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => copy(row.token)}>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(urlFor(row.token), "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> Open
                    </Button>
                    {row.is_active ? (
                      <Button size="sm" variant="outline" onClick={() => revoke(row.id)}>
                        Revoke
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => reactivate(row.id)}>
                        Reactivate
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => remove(row.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
