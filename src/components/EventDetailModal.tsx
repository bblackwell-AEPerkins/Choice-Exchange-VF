import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  DollarSign, 
  FileText, 
  Pill, 
  Building, 
  Phone,
  Download,
  ChevronRight,
  Stethoscope,
  Activity,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";

export interface MemberEvent {
  id: string;
  individual_id: string;
  event_type: string;
  event_category: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  provider_name?: string;
  provider_specialty?: string;
  facility_name?: string;
  facility_address?: string;
  billed_amount?: number;
  allowed_amount?: number;
  member_responsibility?: number;
  plan_paid?: number;
  status: string;
  medication_name?: string;
  dosage?: string;
  quantity?: number;
  refills_remaining?: number;
  pharmacy_name?: string;
  appointment_type?: string;
  confirmation_number?: string;
  notes?: string;
  attachments?: any[];
  is_recurring?: boolean;
  recurrence_pattern?: string;
  parent_event_id?: string;
  created_at: string;
  updated_at: string;
}

interface EventDetailModalProps {
  event: MemberEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EventDetailModal = ({ event, open, onOpenChange }: EventDetailModalProps) => {
  if (!event) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Completed</Badge>;
      case "scheduled":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Scheduled</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getEventIcon = () => {
    switch (event.event_type) {
      case "visit":
        return <Stethoscope className="h-6 w-6" />;
      case "prescription":
        return <Pill className="h-6 w-6" />;
      case "appointment":
        return <Calendar className="h-6 w-6" />;
      case "lab_result":
        return <Activity className="h-6 w-6" />;
      case "claim":
        return <DollarSign className="h-6 w-6" />;
      case "note":
        return <ClipboardList className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  const getCategoryColor = () => {
    switch (event.event_category) {
      case "medical":
        return "bg-primary/10 text-primary";
      case "pharmacy":
        return "bg-accent/10 text-accent";
      case "administrative":
        return "bg-muted text-muted-foreground";
      case "wellness":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), "MMMM d, yyyy");
  };

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), "h:mm a");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${getCategoryColor()}`}>
              {getEventIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold leading-tight mb-2">
                {event.title}
              </DialogTitle>
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(event.status)}
                <Badge variant="outline" className="capitalize">
                  {event.event_type.replace("_", " ")}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {event.event_category}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Date & Time */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.event_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatTime(event.event_date)}</span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm leading-relaxed">{event.description}</p>
            </div>
          )}

          <Separator />

          {/* Provider Information */}
          {(event.provider_name || event.facility_name) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Provider Details
              </h4>
              {event.provider_name && (
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.provider_name}</p>
                    {event.provider_specialty && (
                      <p className="text-sm text-muted-foreground">{event.provider_specialty}</p>
                    )}
                  </div>
                </div>
              )}
              {event.facility_name && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.facility_name}</p>
                    {event.facility_address && (
                      <p className="text-sm text-muted-foreground">{event.facility_address}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prescription Details */}
          {event.event_type === "prescription" && event.medication_name && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Prescription Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Medication</p>
                    <p className="font-medium">{event.medication_name}</p>
                  </div>
                  {event.dosage && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Dosage</p>
                      <p className="font-medium">{event.dosage}</p>
                    </div>
                  )}
                  {event.quantity && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Quantity</p>
                      <p className="font-medium">{event.quantity}</p>
                    </div>
                  )}
                  {event.refills_remaining !== undefined && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Refills Left</p>
                      <p className="font-medium">{event.refills_remaining}</p>
                    </div>
                  )}
                </div>
                {event.pharmacy_name && (
                  <div className="flex items-center gap-3 mt-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{event.pharmacy_name}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Appointment Details */}
          {event.event_type === "appointment" && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Appointment Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {event.appointment_type && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium capitalize">{event.appointment_type}</p>
                    </div>
                  )}
                  {event.confirmation_number && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Confirmation #</p>
                      <p className="font-medium font-mono">{event.confirmation_number}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Financial Details */}
          {(event.billed_amount || event.member_responsibility || event.plan_paid) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Financial Summary
                </h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                  {event.billed_amount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Billed Amount</span>
                      <span className="font-medium">{formatCurrency(event.billed_amount)}</span>
                    </div>
                  )}
                  {event.allowed_amount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Allowed Amount</span>
                      <span className="font-medium">{formatCurrency(event.allowed_amount)}</span>
                    </div>
                  )}
                  {event.plan_paid !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Plan Paid</span>
                      <span className="font-medium text-accent">{formatCurrency(event.plan_paid)}</span>
                    </div>
                  )}
                  {event.member_responsibility !== undefined && (
                    <>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-medium">Your Responsibility</span>
                        <span className="font-bold text-lg">{formatCurrency(event.member_responsibility)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {event.notes && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Notes
                </h4>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{event.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Recurring Info */}
          {event.is_recurring && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <Activity className="h-4 w-4" />
              <span>Recurring {event.recurrence_pattern}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download Details
            </Button>
            <Button className="flex-1 gap-2">
              View Full Record
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Event Metadata */}
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Event ID: {event.id.slice(0, 8)}... • Created {formatDate(event.created_at)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
