import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEnrollmentConfig } from "@/stores/enrollmentConfigStore";
import { Shield, ArrowRight, Phone, QrCode, Link2, CheckCircle2 } from "lucide-react";

const CHANNEL_INFO = {
  call_center: {
    icon: Phone,
    title: "Assisted Enrollment",
    description: "Your enrollment specialist is guiding you through this process.",
    badge: "Call Center Assisted",
  },
  barcode: {
    icon: QrCode,
    title: "Welcome to Choice Exchange",
    description: "You've scanned your enrollment code. Let's get you set up with coverage.",
    badge: "Self-Directed Entry",
  },
  hyperlink: {
    icon: Link2,
    title: "Welcome to Choice Exchange",
    description: "You've been invited to enroll. Let's find the right coverage for you.",
    badge: "Direct Link",
  },
  univision: {
    icon: Shield,
    title: "Welcome, Univision Team Member",
    description: "Your employer has partnered with Choice Exchange to bring you wellness programs and voluntary benefits.",
    badge: "Univision Benefits",
  },
};

export default function EnrollEntry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setEntryChannel, setEmployerCode, entryChannel } = useEnrollmentConfig();

  // Detect entry channel from URL params
  useEffect(() => {
    const source = searchParams.get("source") || searchParams.get("channel");
    if (source === "univision") {
      setEntryChannel("univision");
      setEmployerCode("univision");
    } else if (source === "barcode" || source === "qr") {
      setEntryChannel("barcode");
    } else if (source === "call" || source === "callcenter" || source === "call_center") {
      setEntryChannel("call_center");
    } else {
      setEntryChannel("hyperlink");
    }
  }, [searchParams, setEntryChannel, setEmployerCode]);

  const channel = entryChannel || "hyperlink";
  const info = CHANNEL_INFO[channel];
  const Icon = info.icon;

  const handleContinue = () => {
    navigate("/enroll/intent");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">Choice Exchange</span>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {info.badge}
          </Badge>
        </div>
      </header>

      {/* Main welcome content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full space-y-8 text-center">
          {/* Hero icon */}
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className="h-10 w-10 text-primary" />
          </div>

          {/* Title & description */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {info.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {info.description}
            </p>
          </div>

          {/* What to expect */}
          <Card className="text-left">
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-foreground mb-4">What to expect:</p>
              <div className="space-y-3">
                {[
                  "Provide your basic information",
                  "Review your personalized offering",
                  "Select any additional coverage",
                  "Complete secure payment",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Your information is encrypted and secure</span>
          </div>

          {/* CTA */}
          <Button size="lg" className="w-full max-w-xs mx-auto" onClick={handleContinue}>
            Begin Enrollment
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Choice Exchange. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
