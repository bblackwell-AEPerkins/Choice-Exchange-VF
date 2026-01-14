import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  DollarSign, 
  FileText, 
  Pill, 
  Building, 
  Download,
  ChevronRight,
  Stethoscope,
  Activity,
  ClipboardList,
  ExternalLink,
  Printer,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { MemberEvent } from "@/components/EventDetailModal";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<MemberEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<MemberEvent[]>([]);
  const [parentEvent, setParentEvent] = useState<MemberEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        // Fetch the main event
        const { data: eventData, error } = await supabase
          .from("member_events")
          .select("*")
          .eq("id", eventId)
          .maybeSingle();

        if (error) throw error;

        if (eventData) {
          setEvent(eventData as MemberEvent);

          // Fetch parent event if exists
          if (eventData.parent_event_id) {
            const { data: parentData } = await supabase
              .from("member_events")
              .select("*")
              .eq("id", eventData.parent_event_id)
              .maybeSingle();

            if (parentData) {
              setParentEvent(parentData as MemberEvent);
            }
          }

          // Fetch related/child events
          const { data: childEvents } = await supabase
            .from("member_events")
            .select("*")
            .eq("parent_event_id", eventId)
            .order("event_date", { ascending: false })
            .limit(10);

          if (childEvents) {
            setRelatedEvents(childEvents as MemberEvent[]);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Completed</Badge>;
      case "active":
        return <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>;
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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "visit":
        return <Stethoscope className="h-8 w-8" />;
      case "prescription":
        return <Pill className="h-8 w-8" />;
      case "appointment":
        return <Calendar className="h-8 w-8" />;
      case "lab_result":
        return <Activity className="h-8 w-8" />;
      case "claim":
        return <DollarSign className="h-8 w-8" />;
      case "subscription":
        return <Activity className="h-8 w-8" />;
      case "note":
        return <ClipboardList className="h-8 w-8" />;
      default:
        return <FileText className="h-8 w-8" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-lg mx-auto text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl ${getCategoryColor(event.event_category)}`}>
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-2xl font-bold mb-2">
                          {event.title}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(event.status)}
                          <Badge variant="outline" className="capitalize">
                            {event.event_type.replace("_", " ")}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {event.event_category}
                          </Badge>
                          {event.is_recurring && (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                              Recurring
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Date & Time */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{formatDate(event.event_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{formatTime(event.event_date)}</span>
                  </div>
                  {event.is_recurring && event.recurrence_pattern && (
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span className="capitalize">{event.recurrence_pattern}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <div className="bg-muted/50 rounded-xl p-5">
                    <p className="text-sm leading-relaxed">{event.description}</p>
                  </div>
                )}

                <Separator />

                {/* Provider Information */}
                {(event.provider_name || event.facility_name) && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Provider Details
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {event.provider_name && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                          <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-semibold">{event.provider_name}</p>
                            {event.provider_specialty && (
                              <p className="text-sm text-muted-foreground">{event.provider_specialty}</p>
                            )}
                          </div>
                        </div>
                      )}
                      {event.facility_name && (
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                          <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="font-semibold">{event.facility_name}</p>
                            {event.facility_address && (
                              <p className="text-sm text-muted-foreground">{event.facility_address}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Prescription Details */}
                {event.medication_name && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Prescription Details
                      </h4>
                      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground mb-1">Medication</p>
                          <p className="font-semibold">{event.medication_name}</p>
                        </div>
                        {event.dosage && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                            <p className="font-semibold">{event.dosage}</p>
                          </div>
                        )}
                        {event.quantity && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                            <p className="font-semibold">{event.quantity}</p>
                          </div>
                        )}
                        {event.refills_remaining !== undefined && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">Refills Remaining</p>
                            <p className="font-semibold">{event.refills_remaining}</p>
                          </div>
                        )}
                      </div>
                      {event.pharmacy_name && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{event.pharmacy_name}</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Appointment Details */}
                {event.event_type === "appointment" && (event.appointment_type || event.confirmation_number) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Appointment Details
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {event.appointment_type && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">Appointment Type</p>
                            <p className="font-semibold capitalize">{event.appointment_type}</p>
                          </div>
                        )}
                        {event.confirmation_number && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-xs text-muted-foreground mb-1">Confirmation Number</p>
                            <p className="font-semibold font-mono">{event.confirmation_number}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                {event.notes && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Notes
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{event.notes}</p>
                      </div>
                    </div>
                  </>
                )}

                {/* Event Metadata */}
                <div className="text-xs text-muted-foreground pt-4 border-t">
                  Event ID: {event.id} • Created {formatDate(event.created_at)} • Last updated {formatDate(event.updated_at)}
                </div>
              </CardContent>
            </Card>

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Related Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedEvents.map((relEvent) => (
                      <Link
                        key={relEvent.id}
                        to={`/event/${relEvent.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(relEvent.event_category)}`}>
                            {getEventIcon(relEvent.event_type)}
                          </div>
                          <div>
                            <p className="font-medium">{relEvent.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(relEvent.event_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {relEvent.member_responsibility && (
                            <span className="font-medium">{formatCurrency(relEvent.member_responsibility)}</span>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            {(event.billed_amount || event.member_responsibility || event.plan_paid) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {event.billed_amount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billed Amount</span>
                      <span className="font-medium">{formatCurrency(event.billed_amount)}</span>
                    </div>
                  )}
                  {event.allowed_amount !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowed Amount</span>
                      <span className="font-medium">{formatCurrency(event.allowed_amount)}</span>
                    </div>
                  )}
                  {event.plan_paid !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Paid</span>
                      <span className="font-medium text-accent">{formatCurrency(event.plan_paid)}</span>
                    </div>
                  )}
                  {event.member_responsibility !== undefined && (
                    <>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Your Responsibility</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(event.member_responsibility)}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Parent Subscription */}
            {parentEvent && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Parent Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={`/event/${parentEvent.id}`}
                    className="block p-4 rounded-lg bg-background border hover:border-primary/50 transition-colors"
                  >
                    <p className="font-semibold mb-1">{parentEvent.title}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {parentEvent.provider_name}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="capitalize">
                        {parentEvent.recurrence_pattern || "Monthly"}
                      </Badge>
                      <span className="font-medium text-primary">
                        {formatCurrency(parentEvent.billed_amount || 0)}/mo
                      </span>
                    </div>
                  </Link>
                  <p className="text-xs text-muted-foreground mt-3">
                    This event is part of a subscription plan. Click above to view all related payments.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Subscription Details */}
            {event.event_type === "subscription" && (
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="font-medium capitalize">{event.recurrence_pattern || 'Monthly'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Amount</span>
                    <span className="font-bold text-primary">{formatCurrency(event.billed_amount || 0)}</span>
                  </div>
                  <Separator />
                  <p className="text-xs text-muted-foreground">
                    All monthly payments for this subscription appear in your Claims history.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Request Records
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2" asChild>
                  <Link to="/support">
                    <FileText className="h-4 w-4" />
                    Contact Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
