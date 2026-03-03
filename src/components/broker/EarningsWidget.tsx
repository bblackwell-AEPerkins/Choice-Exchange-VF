import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Percent } from "lucide-react";
import {
  MOCK_BROKER_EARNINGS,
  VOLUNTARY_BENEFITS_ENABLED,
} from "@/lib/brokerMockData";

export function EarningsWidget() {
  const earnings = MOCK_BROKER_EARNINGS;
  
  return (
    <Card className="surface-primary">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Earnings Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Primary Number */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-1">Total Earnings This Month</p>
          <p className="text-3xl font-bold text-gradient-primary font-display">
            ${earnings.totalThisMonth.toLocaleString()}
          </p>
        </div>
        
        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Lives Enrolled</p>
              <p className="text-lg font-semibold text-foreground">{earnings.livesEnrolled}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Per Life</p>
              <p className="text-lg font-semibold text-foreground">${earnings.averagePerLife.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        {/* Voluntary Attach Rate - only show if feature enabled */}
        {VOLUNTARY_BENEFITS_ENABLED && (
          <>
            <div className="border-t border-border/50 my-4" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center">
                  <Percent className="h-4 w-4 text-violet" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Voluntary Attach Rate</p>
                  <p className="text-lg font-semibold text-foreground">{earnings.voluntaryAttachRate}%</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-muted-foreground">
                  Base: ${earnings.baseEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Vol: ${earnings.voluntaryEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
