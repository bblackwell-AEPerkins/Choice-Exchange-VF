import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, X, Calendar, CheckCircle2, AlertCircle, FileText, DollarSign, Clock, ChevronRight, Pill, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DEMO_MODE, MOCK_MEMBER_EVENTS, simulateDelay } from "@/lib/mockData";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "claim" | "appointment" | "document" | "alert" | "info" | "prescription";
  details: {
    eventType: string;
    provider?: string;
    location?: string;
    amount?: number;
    date: string;
    actionRequired: boolean;
    description: string;
  };
}

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        let events: any[] = [];
        
        if (DEMO_MODE) {
          await simulateDelay(200);
          // Use mock events, sorted by date, limited to 10
          events = [...MOCK_MEMBER_EVENTS]
            .sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime())
            .slice(0, 10);
        }

        if (events.length > 0) {
          const mappedNotifications: Notification[] = events.map((event, index) => {
            const eventDate = new Date(event.event_date);
            const isUpcoming = eventDate > new Date();
            
            let type: Notification["type"] = "info";
            let title = event.title;
            let message = event.description || "";
            let actionRequired = false;

            switch (event.event_type) {
              case "claim":
                type = "claim";
                title = event.status === "completed" ? "Claim Processed" : "Claim Update";
                message = event.member_responsibility 
                  ? `Your responsibility: $${event.member_responsibility.toFixed(2)}`
                  : event.description || "Your claim has been updated";
                break;
              case "appointment":
                type = "appointment";
                title = isUpcoming ? "Upcoming Appointment" : "Appointment Complete";
                message = `${event.appointment_type || "Appointment"} with ${event.provider_name || "your provider"}`;
                actionRequired = isUpcoming;
                break;
              case "prescription":
                type = "prescription";
                title = event.refills_remaining !== null && event.refills_remaining <= 1 
                  ? "Prescription Refill Due" 
                  : "Prescription Update";
                message = `${event.medication_name}${event.dosage ? ` ${event.dosage}` : ""}`;
                actionRequired = event.refills_remaining !== null && event.refills_remaining <= 1;
                break;
              case "visit":
                type = "claim";
                title = "Visit Summary Available";
                message = `${event.provider_name || "Provider"} - ${event.provider_specialty || "Visit"}`;
                break;
              case "lab_result":
                type = "document";
                title = "Lab Results Ready";
                message = event.description || "Your lab results are now available";
                break;
              default:
                type = "info";
                title = event.title;
                message = event.description || "";
            }

            return {
              id: `notif-${event.id}`,
              eventId: event.id,
              title,
              message,
              time: formatDistanceToNow(eventDate, { addSuffix: true }),
              read: index > 2, // Mark first 3 as unread for demo
              type,
              details: {
                eventType: event.event_type.replace("_", " "),
                provider: event.provider_name || undefined,
                location: event.facility_address || event.facility_name || undefined,
                amount: event.member_responsibility || event.billed_amount || undefined,
                date: format(eventDate, "MMM d, yyyy 'at' h:mm a"),
                actionRequired,
                description: event.description || `${event.title} on ${format(eventDate, "MMMM d, yyyy")}`
              }
            };
          });

          setNotifications(mappedNotifications);
        }
      } catch (err) {
        console.error("Error in fetchNotifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "claim":
        return <DollarSign className="h-4 w-4" />;
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "document":
        return <FileText className="h-4 w-4" />;
      case "alert":
        return <AlertCircle className="h-4 w-4" />;
      case "prescription":
        return <Pill className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "claim":
        return "bg-accent/10 text-accent";
      case "appointment":
        return "bg-primary/10 text-primary";
      case "document":
        return "bg-blue-500/10 text-blue-600";
      case "alert":
        return "bg-yellow-500/10 text-yellow-600";
      case "prescription":
        return "bg-green-500/10 text-green-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    setDetailOpen(true);
    setOpen(false);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                {unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-full ${getTypeColor(notification.type)} flex-shrink-0`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t">
            <Button 
              variant="ghost" 
              className="w-full text-sm" 
              size="sm"
              onClick={() => {
                setOpen(false);
                navigate("/dashboard?tab=claims");
              }}
            >
              View All Activity
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Notification Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          {/* Close button */}
          <button
            onClick={() => setDetailOpen(false)}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>

          {selectedNotification && (
            <>
              <DialogHeader className="pr-10">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${getTypeColor(selectedNotification.type)}`}>
                    {getTypeIcon(selectedNotification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-lg font-bold leading-tight mb-1">
                      {selectedNotification.title}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                      {selectedNotification.time}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Message */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">{selectedNotification.message}</p>
                </div>

                {/* Details */}
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Event Type</p>
                      <p className="text-sm font-medium capitalize">{selectedNotification.details.eventType}</p>
                    </div>
                  </div>

                  {selectedNotification.details.provider && (
                    <div className="flex items-center gap-3">
                      <Stethoscope className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Provider</p>
                        <p className="text-sm font-medium">{selectedNotification.details.provider}</p>
                      </div>
                    </div>
                  )}

                  {selectedNotification.details.location && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{selectedNotification.details.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{selectedNotification.details.date}</p>
                    </div>
                  </div>

                  {selectedNotification.details.amount !== undefined && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-medium">${selectedNotification.details.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedNotification.details.description && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-2">Details</p>
                      <p className="text-sm leading-relaxed">{selectedNotification.details.description}</p>
                    </div>
                  </>
                )}

                {selectedNotification.details.actionRequired && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-700 font-medium">Action Required</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDetailOpen(false)}>
                    Dismiss
                  </Button>
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => {
                      setDetailOpen(false);
                      navigate(`/event/${selectedNotification.eventId}`);
                    }}
                  >
                    View Event
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
