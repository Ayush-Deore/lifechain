import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export type ProfileRole = "admin" | "donor" | "recipient";

export default function ProfileButton({
  role,
  name,
  subtitle,
  onLogout,
}: {
  role: ProfileRole;
  name: string;
  subtitle?: string;
  onLogout?: () => void;
}) {
  const initials = (name || role || "U")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-accent"
          aria-label="Profile menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="text-sm hidden sm:inline">{name || role}</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 space-y-3" align="end">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium leading-tight">{name || "User"}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {role}
            </div>
            {subtitle ? (
              <div className="text-xs text-muted-foreground">{subtitle}</div>
            ) : null}
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
