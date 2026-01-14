import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, ArrowLeft, ArrowRight, Info } from "lucide-react";
import { z } from "zod";

const zipCodeSchema = z.string()
  .trim()
  .length(5, { message: "Please enter a valid 5-digit ZIP code" })
  .regex(/^\d{5}$/, { message: "ZIP code must contain only numbers" });

interface ICHRAZipCodeEntryProps {
  onSubmit: (zipCode: string) => void;
  onBack: () => void;
}

export function ICHRAZipCodeEntry({ onSubmit, onBack }: ICHRAZipCodeEntryProps) {
  const [zipCode, setZipCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = zipCodeSchema.safeParse(zipCode);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    onSubmit(result.data);
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(value);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Where do you live?</CardTitle>
          <CardDescription className="text-base">
            Health insurance plans and rates vary by location. Enter your ZIP code to see plans available in your area.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="max-w-xs mx-auto space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                inputMode="numeric"
                placeholder="12345"
                value={zipCode}
                onChange={handleZipChange}
                className={`h-14 text-center text-2xl font-mono tracking-widest ${
                  error ? "border-destructive" : ""
                }`}
                autoFocus
              />
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Why we need your ZIP code</p>
                <p>
                  Healthcare coverage requirements and available plans are determined by state 
                  and county regulations. This ensures we show you plans you're actually 
                  eligible for based on where you live.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onBack}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={zipCode.length !== 5}
              >
                Find Plans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
