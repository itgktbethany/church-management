"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/components/profile/profile-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

interface ProfileContentProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: string;
    points: number;
    image: string | null;
  };
}

export function ProfileContent({ currentUser }: ProfileContentProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("common.profile")}</h1>
        <p className="text-muted-foreground">
          {t("profile.subtitle")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <Card className="rounded-3xl border-0 bg-muted/50 shadow-sm h-fit">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
              <AvatarImage src={currentUser.image || ""} alt={currentUser.name} />
              <AvatarFallback className="text-2xl font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-semibold text-lg">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">{currentUser.email}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="rounded-full capitalize">
                {currentUser.role}
              </Badge>
              <Badge variant="default" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary flex items-center gap-1">
                <Star className="w-3 h-3" />
                {currentUser.points} Pts
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl shadow-sm">
          <CardHeader>
            <CardTitle>{t("profile.title")}</CardTitle>
            <CardDescription>
              {t("profile.subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProfileForm initialName={currentUser.name} />
            
            <div className="space-y-2">
              <Label>{t("profile.emailLabel")}</Label>
              <Input 
                value={currentUser.email} 
                disabled 
                className="bg-muted/50 text-muted-foreground"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
