import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink, PartyPopper } from 'lucide-react';

interface OnboardingBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CALENDLY_LINK = "https://calendly.com/contact-cfa/30min";

export const OnboardingBookingDialog = ({ open, onOpenChange }: OnboardingBookingDialogProps) => {
  const handleScheduleClick = () => {
    window.open(CALENDLY_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
            <PartyPopper className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-display">
            Welcome to CFA Golf!
          </DialogTitle>
          <DialogDescription className="text-base">
            You're officially a member! Let's get you started on the right foot.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-semibold">Schedule Your Onboarding Meeting</h4>
                <p className="text-sm text-muted-foreground">
                  Get a personalized walkthrough of all CFA Golf tools and strategic recruiting guidance.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleScheduleClick}
              className="w-full gap-2"
              size="lg"
            >
              <Calendar className="w-4 h-4" />
              Schedule Your Onboarding Call
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground"
              onClick={() => onOpenChange(false)}
            >
              I'll schedule later
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            We've also sent you a welcome email with the booking link.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
