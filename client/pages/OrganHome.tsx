import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrganHome() {
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!boxRef.current) return;
      const top = boxRef.current.getBoundingClientRect().top;
      const val = Math.max(-30, Math.min(30, -top * 0.2));
      setOffset(val);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-8">
        <header className="text-center">
          <div
            className="mx-auto mt-2 overflow-hidden rounded-xl border"
            ref={boxRef}
          >
            <div className="relative h-[66vh]">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F660cd55fee6d453fa0e11714322f1d28%2Fc0de56fbf91148efb3fe4eed8d24ab51"
                alt="Healthcare heart and care theme"
                className="absolute inset-0 h-[140%] w-full object-cover"
                style={{ transform: `translateY(${offset}px)` }}
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 flex h-full flex-col items-center justify-center p-4">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/20">
                  <Heart className="h-6 w-6 text-rose-400" aria-hidden />
                </div>
                <h1 className="text-2xl font-bold">LifeChain</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Pledge to save lives by registering as an organ donor.
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-8 space-y-6">
          <section className="rounded-lg border p-4 space-y-4 -mt-16 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xl">
            <h2 className="text-base font-semibold">Sign up...</h2>
            <Button
              className="w-full h-12 text-base"
              onClick={() => navigate("/organ-donation/signup")}
            >
              Become a Donor
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button
                className="h-12"
                variant="secondary"
                onClick={() => navigate("/recipient/signup")}
              >
                Recipient
              </Button>
              <Button
                className="h-12"
                variant="secondary"
                onClick={() => navigate("/hospital-staff/signup")}
              >
                Hospital Staff
              </Button>
              <Button
                className="h-12"
                variant="secondary"
                onClick={() => navigate("/organizations/signup")}
              >
                NGO/Govt
              </Button>
              <Button
                className="h-12"
                variant="secondary"
                onClick={() => navigate("/login")}
              >
                Existing User
              </Button>
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h2 className="mb-3 text-base font-semibold">How it works</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 text-green-600"
                  aria-hidden
                />
                <div>
                  <p className="font-medium">Your choice, your control</p>
                  <p className="text-muted-foreground">
                    Select which organs you wish to donate and provide consent.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <PhoneCall
                  className="mt-0.5 h-5 w-5 text-blue-600"
                  aria-hidden
                />
                <div>
                  <p className="font-medium">Emergency contact</p>
                  <p className="text-muted-foreground">
                    Add a trusted contact so we can verify your pledge if
                    needed.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="text-center text-xs text-muted-foreground">
            <p>
              By registering, you agree to the data policy and consent to be
              contacted if required.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
