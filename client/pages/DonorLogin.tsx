import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate } from "react-router-dom";

const emailSchema = z.object({ email: z.string().email() });
const otpLen = 6;
const PROFILE_KEY = "lifechain-donor-profile";
const OTP_KEY = "lifechain-otp";

type EmailValues = z.infer<typeof emailSchema>;

export default function DonorLogin() {
  const navigate = useNavigate();
  const emailForm = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const profileEmail = useMemo(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return "";
      const p = JSON.parse(raw) as { email?: string };
      return p.email || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem(OTP_KEY);
    if (saved) setOtpSent(true);
  }, []);

  const sendOtp = () => {
    setError("");
    const { email } = emailForm.getValues();
    if (!emailForm.formState.isValid) return emailForm.trigger();
    if (!profileEmail || profileEmail !== email) {
      setError("No donor profile for this email. Please sign up first.");
      return;
    }
    const code = Array.from({ length: otpLen }, () =>
      Math.floor(Math.random() * 10),
    ).join("");
    const payload = { email, code, exp: Date.now() + 5 * 60 * 1000 };
    try {
      sessionStorage.setItem(OTP_KEY, JSON.stringify(payload));
      setOtpSent(true);
    } catch {}
  };

  const verifyOtp = () => {
    setError("");
    try {
      const raw = sessionStorage.getItem(OTP_KEY);
      if (!raw) return setError("OTP expired. Send again.");
      const { email, code, exp } = JSON.parse(raw) as {
        email: string;
        code: string;
        exp: number;
      };
      const curEmail = emailForm.getValues().email;
      if (Date.now() > exp) return setError("OTP expired. Send again.");
      if (curEmail !== email)
        return setError("Email mismatch. Use the same email.");
      if (otp !== code) return setError("Invalid OTP.");
      sessionStorage.removeItem(OTP_KEY);
      navigate("/donor/home", { replace: true });
    } catch {
      setError("Verification failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md space-y-4">
        <h1 className="text-xl font-semibold">Donor Login</h1>

        <Form {...emailForm}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email used during donor signup</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!otpSent ? (
              <Button className="w-full" onClick={sendOtp}>
                Send OTP
              </Button>
            ) : (
              <div className="space-y-3">
                <div>
                  <FormLabel>Enter OTP</FormLabel>
                  <InputOTP
                    maxLength={otpLen}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="mt-2"
                  >
                    <InputOTPGroup>
                      {Array.from({ length: otpLen }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" onClick={sendOtp}>
                    Resend
                  </Button>
                  <Button onClick={verifyOtp}>Verify</Button>
                </div>
              </div>
            )}

            {error ? (
              <p className="text-sm font-medium text-destructive">{error}</p>
            ) : null}
          </form>
        </Form>

        <Button
          variant="ghost"
          onClick={() => navigate("/organ-donation/signup")}
        >
          Become a Donor
        </Button>
      </div>
    </div>
  );
}
