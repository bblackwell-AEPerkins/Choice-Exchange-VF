import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoleStore } from "@/stores/roleStore";

export default function BrokerIntake() {
  const navigate = useNavigate();
  const { setWorkspaceId, setAuthenticated } = useRoleStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    agencyName: "",
    npn: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate workspace creation
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Set workspace ID and mark as authenticated
    setWorkspaceId(`broker-${Date.now()}`);
    setAuthenticated(true);
    
    navigate("/broker/home");
  };

  const isValid = formData.email && formData.firstName && formData.lastName && formData.agencyName;

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
              Create your broker workspace
            </h1>
            <p className="text-muted-foreground">
              Get started in under a minute
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@agency.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="agencyName">Agency name</Label>
              <Input
                id="agencyName"
                name="agencyName"
                placeholder="Smith Benefits Group"
                value={formData.agencyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npn">
                NPN <span className="text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="npn"
                name="npn"
                placeholder="12345678"
                value={formData.npn}
                onChange={handleChange}
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
                  Creating workspace...
                </>
              ) : (
                "Create broker workspace"
              )}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
