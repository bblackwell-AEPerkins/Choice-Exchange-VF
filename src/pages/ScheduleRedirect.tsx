import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Calendar, ArrowRight } from "lucide-react";

const ScheduleRedirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  
  const providerName = searchParams.get("provider") || "your provider";
  const returnUrl = searchParams.get("return") || "/plans";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // In a real scenario, this would redirect to an external provider portal
          // For demo, we navigate to the providers page
          navigate(returnUrl);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, returnUrl]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-10 px-8">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            
            {/* Title */}
            <h1 className="text-2xl font-bold mb-3">
              Redirecting to Provider Portal
            </h1>
            
            {/* Description */}
            <p className="text-muted-foreground mb-6">
              You're being redirected to {providerName}'s scheduling system to complete your booking.
            </p>
            
            {/* Loading animation */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sm text-muted-foreground">
                Redirecting in {countdown}...
              </span>
            </div>
            
            {/* External link indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg py-3 px-4">
              <ExternalLink className="h-4 w-4" />
              <span>You'll be taken to an external scheduling portal</span>
            </div>
            
            {/* Manual redirect link */}
            <button
              onClick={() => navigate(returnUrl)}
              className="mt-6 inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
            >
              Continue now
              <ArrowRight className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default ScheduleRedirect;
