import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Shield, User, Building2, Calendar, Phone } from "lucide-react";

interface MemberIDCardProps {
  memberData: {
    name: string;
    memberId: string;
    plan: string;
    employer: string;
  };
}

export function MemberIDCard({ memberData }: MemberIDCardProps) {
  const cardData = {
    groupNumber: "GRP-TC-2024-001",
    effectiveDate: "01/01/2024",
    rxBin: "610014",
    rxPcn: "CTYRX",
    copays: {
      primaryCare: "$25",
      specialist: "$50",
      urgentCare: "$75",
      emergency: "$250",
    },
    customerService: "1-800-555-0123",
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          View ID Card
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Member ID Card</DialogTitle>
        </DialogHeader>
        
        {/* Front of Card */}
        <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="h-8 w-8" />
                <div>
                  <p className="font-bold text-lg tracking-tight">Acressa</p>
                  <p className="text-xs opacity-80">Health Benefits</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Plan Type</p>
                <p className="font-semibold">{memberData.plan}</p>
              </div>
            </div>

            {/* Member Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Member Name</p>
                  <p className="font-bold text-xl">{memberData.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="h-5 w-5 mt-0.5 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Member ID</p>
                    <p className="font-semibold">{memberData.memberId}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 mt-0.5 opacity-80" />
                  <div>
                    <p className="text-xs opacity-80">Group Number</p>
                    <p className="font-semibold">{cardData.groupNumber}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 opacity-80" />
                <div>
                  <p className="text-xs opacity-80">Effective Date</p>
                  <p className="font-semibold">{cardData.effectiveDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of Card - Coverage Details */}
        <div className="p-6 bg-card">
          <div className="grid grid-cols-2 gap-6">
            {/* Copays */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Copays</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary Care</span>
                  <span className="font-medium">{cardData.copays.primaryCare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialist</span>
                  <span className="font-medium">{cardData.copays.specialist}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Urgent Care</span>
                  <span className="font-medium">{cardData.copays.urgentCare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Emergency</span>
                  <span className="font-medium">{cardData.copays.emergency}</span>
                </div>
              </div>
            </div>

            {/* Rx Info */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Prescription Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RxBIN</span>
                  <span className="font-medium">{cardData.rxBin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">RxPCN</span>
                  <span className="font-medium">{cardData.rxPcn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employer</span>
                  <span className="font-medium text-right">{memberData.employer}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Service */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Customer Service:</span>
                <span className="font-semibold text-foreground">{cardData.customerService}</span>
              </div>
              <Button variant="outline" size="sm">
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
