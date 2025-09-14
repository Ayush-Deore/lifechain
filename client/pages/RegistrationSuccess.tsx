import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";

interface ExtraField {
  label: string;
  value: string;
}
interface SuccessState {
  heading: string;
  entityId: string;
  name: string;
  nameLabel?: string;
  badgesLabel?: string;
  badges?: string[];
  fields?: ExtraField[];
  backPath?: string;
}

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as Partial<SuccessState>;

  const goHome = () => navigate(state.backPath || "/", { replace: true });
  const goProfile = () => navigate(state.homePath || "/", { replace: true });
  const goBack = () => navigate(state.backPath || "/", { replace: true });

  if (!state.entityId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <p className="text-lg font-semibold">No registration data found</p>
          <p className="text-sm text-muted-foreground">
            Start a new registration
          </p>
          <Button onClick={goHome} className="w-full">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="mb-4">
          <AppHeader />
        </div>
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-600" aria-hidden />
          <h1 className="mt-3 text-2xl font-semibold">{state.heading}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for registering
          </p>
        </div>

        <div className="mt-6 space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">ID</span>
            <span className="font-mono text-sm font-semibold">
              {state.entityId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {state.nameLabel || "Name"}
            </span>
            <span className="text-sm font-medium">{state.name}</span>
          </div>
          {state.badges && state.badges.length > 0 && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">
                {state.badgesLabel || "Details"}
              </span>
              <div className="flex max-w-[60%] flex-wrap justify-end gap-1">
                {state.badges.map((b) => (
                  <Badge key={b} variant="secondary">
                    {String(b)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {(state.fields || []).map((f) => (
            <div key={f.label} className="flex items-start justify-between">
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <span className="text-right text-sm font-medium max-w-[60%]">
                {f.value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {state.homePath ? (
            <Button className="w-full" onClick={goProfile}>
              Go to Home
            </Button>
          ) : null}
          <Button className="w-full" variant="secondary" onClick={goBack}>
            Register Another
          </Button>
        </div>
      </div>
    </div>
  );
}
