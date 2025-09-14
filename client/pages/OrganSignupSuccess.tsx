import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";

interface SuccessState {
  donorId: string;
  fullName: string;
  organs: string[];
  bloodGroup: string;
}

export default function OrganSignupSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as Partial<SuccessState>;

  const goHome = () => navigate("/", { replace: true });
  const goSignup = () => navigate("/organ-donation/signup", { replace: true });

  if (!state.donorId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center space-y-4">
          <p className="text-lg font-semibold">No registration data found</p>
          <p className="text-sm text-muted-foreground">
            Start a new registration
          </p>
          <Button onClick={goSignup} className="w-full">
            Go to Sign Up
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
          <h1 className="mt-3 text-2xl font-semibold">
            Registration Successful
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thank you for pledging to donate
          </p>
        </div>

        <div className="mt-6 space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Donor ID</span>
            <span className="font-mono text-sm font-semibold">
              {state.donorId}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Name</span>
            <span className="text-sm font-medium">{state.fullName}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-sm text-muted-foreground">Organs</span>
            <div className="flex max-w-[60%] flex-wrap justify-end gap-1">
              {(state.organs || []).map((o) => (
                <Badge key={o} variant="secondary">
                  {o.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Blood Group</span>
            <span className="text-sm font-medium">{state.bloodGroup}</span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button className="w-full" onClick={() => navigate("/donor/home")}>
            Go to Donor Home
          </Button>
          <Button className="w-full" variant="secondary" onClick={goSignup}>
            Register Another Donor
          </Button>
          <Button className="w-full" variant="ghost" onClick={goHome}>
            Back to Landing
          </Button>
        </div>
      </div>
    </div>
  );
}
