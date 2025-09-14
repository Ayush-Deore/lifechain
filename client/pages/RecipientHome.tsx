import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import ProfileButton from "@/components/ProfileButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const REC_PROFILE_KEY = "lifechain-recipient-profile";
const DONORS_KEY = "lifechain-donors";

type RecipientProfile = {
  entityId: string;
  fullName: string;
  bloodGroup: string;
  needDetails: string;
};

type Donor = {
  donorId: string;
  fullName: string;
  bloodGroup: string;
  organs: string[];
};

function maskName(name: string) {
  if (!name) return "Hidden";
  const parts = name.split(" ");
  const first = parts[0] || "";
  return `${first.charAt(0)}****`;
}

function maskId(id: string) {
  if (!id) return "****";
  return `${id.slice(0, 2)}****${id.slice(-2)}`;
}

export default function RecipientHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<RecipientProfile | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(REC_PROFILE_KEY);
      if (r) setProfile(JSON.parse(r) as RecipientProfile);
    } catch {}
    try {
      const d = JSON.parse(localStorage.getItem(DONORS_KEY) || "[]") as Donor[];
      setDonors(d);
    } catch {}
  }, []);

  const relevant = useMemo(() => {
    if (!profile) return [] as Donor[];
    return donors.filter((d) => d.bloodGroup === profile.bloodGroup);
  }, [donors, profile]);

  if (!profile) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-md text-center space-y-3">
          <p className="text-lg font-semibold">No recipient profile found</p>
          <Button
            onClick={() => navigate("/recipient/signup")}
            className="w-full"
          >
            Register as Recipient
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <AppHeader
          rightSlot={
            profile ? (
              <ProfileButton
                role="recipient"
                name={profile.fullName}
                onLogout={() => {
                  try {
                    localStorage.removeItem("lifechain-recipient-profile");
                  } catch {}
                  navigate("/", { replace: true });
                }}
              />
            ) : undefined
          }
        />
        <h1 className="text-xl font-semibold">Recipient Home</h1>

        {profile && (
          <div className="rounded-lg border p-4 flex items-center gap-4 bg-card/50">
            <Avatar className="h-14 w-14">
              <AvatarFallback>
                {profile.fullName
                  .split(" ")
                  .map((s) => s[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold leading-tight">
                {profile.fullName}
              </div>
              <div className="text-xs text-muted-foreground">
                Blood Group: {profile.bloodGroup}
              </div>
              <div className="text-xs text-muted-foreground">
                Need: {profile.needDetails}
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{profile.fullName}</CardTitle>
            <CardDescription>Need: {profile.needDetails}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Blood Group</div>
              <div className="font-medium">{profile.bloodGroup}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Potential Donors (masked)</CardTitle>
            <CardDescription>Matched by blood group</CardDescription>
          </CardHeader>
          <CardContent>
            {relevant.length ? (
              <div className="space-y-3">
                {relevant.map((d) => (
                  <div
                    key={d.donorId}
                    className="flex items-center justify-between rounded-md border p-3 text-sm"
                  >
                    <div>
                      <div className="font-medium">{maskName(d.fullName)}</div>
                      <div className="text-xs text-muted-foreground">
                        ID: {maskId(d.donorId)}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[50%] justify-end">
                      {d.organs.map((o) => (
                        <Badge key={o} variant="secondary">
                          {o.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No matches yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
