"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type ProfileFormProps = {
  initialName: string;
};

export function ProfileForm({ initialName }: ProfileFormProps) {
  const { t } = useLanguage();
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateProfile(name);
      if (res.success) {
        toast.success(t("profile.profileUpdated"));
      } else {
        toast.error(res.message || "Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("profile.nameLabel")}</Label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading || name === initialName} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t("profile.saveChanges")}
      </Button>
    </form>
  );
}
