import { Heart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AppHeader({
  backTo,
  rightSlot,
}: {
  backTo?: string | number;
  rightSlot?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const onBack = () => {
    if (typeof backTo === "string") navigate(backTo);
    else navigate(-1);
  };
  return (
    <div className="mb-4 flex items-center justify-between">
      <button
        type="button"
        aria-label="Back"
        onClick={onBack}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-accent text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-400/20">
          <Heart className="h-4 w-4 text-rose-400" />
        </div>
        <span className="text-base font-semibold">LifeChain</span>
      </div>
      <div className="flex h-9 items-center">
        {rightSlot || <div className="w-9" />}
      </div>
    </div>
  );
}
