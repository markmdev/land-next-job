"use client";

import { useUser } from "@stackframe/stack";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InsufficientCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InsufficientCreditsDialog({
  open,
  onOpenChange,
}: InsufficientCreditsDialogProps) {
  const user = useUser({ or: "return-null" });

  const handlePurchaseCredits = async () => {
    if (!user) return;

    try {
      const checkoutUrl = await user.createCheckoutUrl({ offerId: "offer-2" });
      window.open(checkoutUrl, "_blank");
      onOpenChange(false); // Close dialog after opening checkout
    } catch (error) {
      console.error("Failed to create checkout URL:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-white/10 bg-slate-950 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-white">Insufficient Credits</DialogTitle>
          <DialogDescription className="text-slate-400">
            You don&apos;t have enough credits to run the tailoring process. Each run requires 1 credit.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 pt-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white mb-2">Need more runs?</p>
            <p className="text-slate-400">
              Purchase a credit bundle to unlock unlimited job experiments and continue tailoring your resume.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePurchaseCredits}
              className="flex-1 bg-cyan-400/80 text-slate-950 hover:bg-cyan-300"
            >
              Purchase credits
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
