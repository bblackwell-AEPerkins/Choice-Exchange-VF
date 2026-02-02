import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleStore } from "@/stores/roleStore";

export default function IndividualIntake() {
  const navigate = useNavigate();
  const { setWorkspaceId, setAuthenticated } = useRoleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    inviteCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate joining workspace
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Set workspace ID and mark as authenticated
    setWorkspaceId(`individual-${Date.now()}`);
    setAuthenticated(true);
    
    navigate("/individual/home");
  };

  const isValid = formData.email && formData.inviteCode;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">Choice Exchange</span>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 -ml-2"
            onClick={() => navigate("/select-role")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Join your employer's plan
            </h1>
            <p className="text-muted-foreground">
              Enter the code from your employer to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite code</Label>
              <Input
                id="inviteCode"
                name="inviteCode"
                placeholder="ABC-123-XYZ"
                value={formData.inviteCode}
                onChange={handleChange}
                required
                className="uppercase tracking-wider"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join"
              )}
            </Button>

            <div className="text-center pt-2">
              <Link
                to="/request-access"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                I don't have a code
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
