import { useState, useEffect, useRef } from "react";
import { 
    Dialog, 
    DialogHeader, 
    DialogContent, 
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "contribforge:onboardingSeen";

const STEPS = [
    {
     title: "Welcome to ContribForge",
     description: "A quick tour to help you find and track meaningful open-source contributions.",
   },
   {
    title: "Discover Projects",
    description:
      "Use Search to find projects you can contribute to.",
  },
  {
    title: "Save interesting projects",
    description:
      "Bookmark projects so you can come back later and track what you want to work on.",
  },
  {
    title: "Track your progress",
    description:
      "Sync your contributions to see your progress and build your profile.",
  },
];


export default function Onboarding() {
    const [open, setOpen] = useState(true);
    const [step, setStep] = useState(0);

    const skipRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    // Show onboarding on first visit (if not seen before)
    useEffect(() => {
        try {
            const seen = window.localStorage.getItem(STORAGE_KEY);
            if (!seen) {
                setOpen(true);
            }
        } catch (e) {
            // If localStorage is unavailable, just show the onboarding
            setOpen(true);
        }
    }, []);

    const focusedStep = useRef<number | null>(null);

    // Handle keyboard navigation: Arrow Left/Right for Back/Next, focus buttons on step change
    useEffect(() => {
        if (!open || focusedStep.current === step) return;
        
        const target = step === 0 ? skipRef.current : nextRef.current;
        target?.focus();
        focusedStep.current = step;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handleBack();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, step]);


    const markSeenAndClose = () => {
        try {
            window.localStorage.setItem(STORAGE_KEY, "true");
        } catch (e) {
            // Ignore localStorage errors
        }
        setStep(0);
        setOpen(false);
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1);
        } else {
            // Last step, mark as seen and close
            markSeenAndClose();
        }
    };

    const handleBack = () => setStep((s) => Math.max(0, s - 1))

    const handleSkip = () => markSeenAndClose();

    return (
        <Dialog open={open} onOpenChange={(val) => {
                if (!val) markSeenAndClose();
                setOpen(val)
            }}>
            <DialogContent aria-label="Onboarding tutorial">
                <DialogHeader>
                    <DialogTitle>{STEPS[step].title}</DialogTitle> 
                    <DialogDescription>{STEPS[step].description}</DialogDescription>
                </DialogHeader>

                {/* Screen reader announcement for current step */}
                <div aria-live="polite" aria-atomic="true" className="sr-only">
                    Step {step + 1} of {STEPS.length}: {STEPS[step].title}
                </div>

                {/* Main content for onboarding */}
                <div className="mt-4 text-sm">
                    {step === 0 && (
                        <p>
                            Explore the curated list of projects, or try searching for ‘good first issue’ to get started.
                        </p>
                    )}
                    {step === 1 && (
                        <p>
                            Try filters like language, difficulty, or labels to find issues that match your
                            skill level and interests.
                        </p>
                    )}
                    {step === 2 && (
                        <p>
                            You’ll need to log in to bookmark projects.
                        </p>
                    )}
                    {step === 3 && (
                        <p>
                            Once you contribute, sync GitHub to track progress, your accepted contributions will appear in your public portfolio.
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2">
                    {STEPS.map((_, i) => (
                        <span
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                            i === step ? "bg-primary" : "bg-muted"
                        }`}
                        aria-label={`Step ${i + 1} of ${STEPS.length}`}
                        role="progressbar"
                        aria-valuenow={i + 1}
                        aria-valuemin={1}
                        aria-valuemax={STEPS.length}
                        />
                    ))}
                </div>

                <DialogFooter>
                    {/* Back (hidden on first step) */}
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleSkip} ref={skipRef}>
                          Skip
                        </Button>

                        <div className="flex-1" />

                        {step > 0 && (
                            <Button variant="outline" size="sm" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        
                        <Button onClick={handleNext} size="sm" ref={nextRef}>
                            {step < STEPS.length - 1 ? "Next" : "Get started"}
                        </Button>
                    </div>
                </DialogFooter>

                {/* Close icon in top-right comes from `DialogContent` implementation */}
                <DialogClose asChild>
                {/* Keep this visually hidden unless you want an extra close button inside the footer */}
                <button aria-hidden className="hidden" />
                </DialogClose>
            </DialogContent>
        </Dialog>
    )
}