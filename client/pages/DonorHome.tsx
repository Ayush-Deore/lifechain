import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { makeId } from "@/lib/id";
import AppHeader from "@/components/AppHeader";
import ProfileButton from "@/components/ProfileButton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type DonorProfile = {
  donorId: string;
  fullName: string;
  organs: string[];
  bloodGroup: string;
  email?: string;
  phone?: string;
};

const PROFILE_KEY = "lifechain-donor-profile";
const TOKEN_KEY = "lifechain-credit-token";

export default function DonorHome() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [token, setToken] = useState<string>("");
  const organs = useMemo(() => profile?.organs || [], [profile]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw) as DonorProfile);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TOKEN_KEY);
      if (saved) setToken(saved);
      else {
        const t = makeId("CRD");
        localStorage.setItem(TOKEN_KEY, t);
        setToken(t);
      }
    } catch {}
  }, []);

  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      // no toast lib mandated here; keep silent success
    } catch {}
  };

  if (!profile) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-md space-y-4 text-center">
          <p className="text-lg font-semibold">No donor profile found</p>
          <p className="text-sm text-muted-foreground">
            Please register first or load your profile
          </p>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => navigate("/organ-donation/signup")}
            >
              Become a Donor
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
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
                role="donor"
                name={profile.fullName}
                subtitle={profile.email}
                onLogout={() => {
                  try {
                    localStorage.removeItem("lifechain-donor-profile");
                    localStorage.removeItem("lifechain-credit-token");
                  } catch {}
                  navigate("/", { replace: true });
                }}
              />
            ) : undefined
          }
        />
        <h1 className="text-xl font-semibold">Donor Home</h1>

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
                Donor ID: <span className="font-mono">{profile.donorId}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {profile.email || "—"}
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{profile.fullName}</CardTitle>
            <CardDescription>
              Donor ID: <span className="font-mono">{profile.donorId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Blood Group</div>
              <div className="font-medium">{profile.bloodGroup}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Email</div>
              <div className="font-medium break-words">
                {profile.email || "—"}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Phone</div>
              <div className="font-medium">{profile.phone || "—"}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pledged Organs</CardTitle>
          </CardHeader>
          <CardContent>
            {organs.length ? (
              <div className="flex flex-wrap gap-2">
                {organs.map((o) => (
                  <Badge key={o} variant="secondary">
                    {o.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No organs selected
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Credit Token</CardTitle>
            <CardDescription>
              Share this token with the hospital when your family needs organs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="font-mono text-sm">{token}</span>
              <Button size="sm" variant="secondary" onClick={copyToken}>
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/organ-donation/signup")}
          >
            Update Pledge
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              try {
                localStorage.removeItem(PROFILE_KEY);
                localStorage.removeItem(TOKEN_KEY);
              } catch {}
              navigate("/", { replace: true });
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
