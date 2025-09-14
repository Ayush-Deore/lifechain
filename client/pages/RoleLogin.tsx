import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const DONORS_KEY = "lifechain-donors";
const RECIPIENTS_KEY = "lifechain-recipients";

export default function RoleLogin() {
  const navigate = useNavigate();
  const [role, setRole] = useState("donor");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const proceed = () => {
    setError("");
    const n = name.trim().toLowerCase();
    if (!n) return setError("Enter your name");

    if (role === "donor") {
      try {
        const list = JSON.parse(
          localStorage.getItem(DONORS_KEY) || "[]",
        ) as any[];
        const match = list.find(
          (d) => String(d.fullName || "").toLowerCase() === n,
        );
        if (!match) return setError("No donor found with this name");
        localStorage.setItem("lifechain-donor-profile", JSON.stringify(match));
      } catch {}
      navigate("/donor/home", { replace: true });
      return;
    }

    if (role === "recipient") {
      try {
        const list = JSON.parse(
          localStorage.getItem(RECIPIENTS_KEY) || "[]",
        ) as any[];
        const match = list.find(
          (r) => String(r.fullName || "").toLowerCase() === n,
        );
        if (!match) return setError("No recipient found with this name");
        localStorage.setItem(
          "lifechain-recipient-profile",
          JSON.stringify(match),
        );
      } catch {}
      navigate("/recipient/home", { replace: true });
      return;
    }

    try {
      localStorage.setItem("lifechain-admin", JSON.stringify({ name }));
    } catch {}
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-md space-y-4">
        <AppHeader />
        <h1 className="text-xl font-semibold">Existing User Login</h1>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Role</label>
            <Select onValueChange={setRole} defaultValue={role}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="donor">Donor</SelectItem>
                <SelectItem value="recipient">Recipient</SelectItem>
                <SelectItem value="admin">Hospital/NGO/Govt</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Full name</label>
            <Input
              className="mt-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-destructive">{error}</p>
          ) : null}
          <Button className="w-full" onClick={proceed}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
