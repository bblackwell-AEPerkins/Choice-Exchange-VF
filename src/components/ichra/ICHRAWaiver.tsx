import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, XCircle, AlertTriangle } from "lucide-react";

interface ICHRAWaiverProps {
  onSubmit: (reason: string) => void;
  onBack: () => void;
}

const waiverReasons = [
  { value: "spouse_coverage", label: "I have coverage through my spouse's employer" },
  { value: "parent_coverage", label: "I have coverage through a parent's plan" },
  { value: "medicare", label: "I have Medicare coverage" },
  { value: "medicaid", label: "I have Medicaid coverage" },
  { value: "tricare", label: "I have TRICARE or military coverage" },
  { value: "other_employer", label: "I have coverage through another employer" },
  { value: "marketplace", label: "I prefer to use marketplace coverage without ICHRA" },
  { value: "other", label: "Other reason" },
];

export function ICHRAWaiver({ onSubmit, onBack }: ICHRAWaiverProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const getReason = () => {
    if (selectedReason === "other") {
      return otherReason.trim() || "Other - no details provided";
    }
    return waiverReasons.find(r => r.value === selectedReason)?.label || selectedReason;
  };

  const canSubmit = selectedReason && 
    (selectedReason !== "other" || otherReason.trim()) && 
    confirmed;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(getReason());
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Waive ICHRA Coverage</CardTitle>
          <CardDescription className="text-base">
            You are choosing to decline your employer's ICHRA benefit. Please provide a reason 
            for your waiver.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Reason Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Why are you waiving ICHRA coverage?</Label>
            <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
              {waiverReasons.map((reason) => (
                <div key={reason.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={reason.value} id={reason.value} />
                  <Label htmlFor={reason.value} className="cursor-pointer">
                    {reason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedReason === "other" && (
              <div className="pl-6 space-y-2">
                <Label htmlFor="otherReason">Please specify</Label>
                <Textarea
                  id="otherReason"
                  placeholder="Enter your reason for waiving coverage..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-600">Important Considerations</p>
              <ul className="text-muted-foreground mt-2 space-y-1">
                <li>• You will not receive your employer's monthly ICHRA allowance</li>
                <li>• You may not be able to enroll until the next open enrollment period</li>
                <li>• If you waive ICHRA, you may be eligible for marketplace premium subsidies</li>
                <li>• This decision will be recorded and reported to your employer</li>
              </ul>
            </div>
          </div>

          {/* Confirmation */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
            />
            <Label htmlFor="confirm" className="text-sm leading-relaxed cursor-pointer">
              I understand that by waiving ICHRA coverage, I am declining my employer's 
              health benefit and will not receive reimbursement for health insurance premiums. 
              I understand this is a binding decision until the next open enrollment period 
              or a qualifying life event.
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button 
              variant="destructive"
              className="flex-1"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Confirm Waiver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
