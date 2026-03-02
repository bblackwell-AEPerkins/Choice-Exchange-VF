import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEnrollmentConfig } from "@/stores/enrollmentConfigStore";
import { Settings2, ArrowLeft, Lock, ToggleLeft } from "lucide-react";

export default function EnrollConfig() {
  const { steps, toggleStep, getEnabledSteps } = useEnrollmentConfig();
  const enabledSteps = getEnabledSteps();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold">Enrollment Configuration</h1>
            </div>
          </div>
          <Badge variant="outline">
            {enabledSteps.length} steps active
          </Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Description */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Flow Configuration</h2>
          <p className="text-muted-foreground">
            Toggle enrollment steps on or off to customize the client experience.
            Required steps cannot be disabled.
          </p>
        </div>

        {/* Flow preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <ToggleLeft className="h-4 w-4" />
              Active Flow Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {enabledSteps.map((step, index) => (
                <div key={step.id} className="flex items-center gap-2">
                  <Badge
                    variant={step.required ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {index + 1}. {step.label}
                  </Badge>
                  {index < enabledSteps.length - 1 && (
                    <span className="text-muted-foreground text-xs">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Step toggles */}
        <div className="space-y-3">
          {steps.map((step) => (
            <Card
              key={step.id}
              className={`transition-all ${
                step.enabled ? "border-border" : "border-border/50 opacity-60"
              }`}
            >
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      step.enabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {step.order + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{step.label}</p>
                        {step.required && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={step.enabled}
                    onCheckedChange={() => toggleStep(step.id)}
                    disabled={step.required}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button asChild className="flex-1">
            <Link to="/enroll/entry">
              Preview Enrollment Flow
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              Back to Home
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
