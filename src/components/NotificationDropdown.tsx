import { useState } from "react";
import { Bell, X, Calendar, CheckCircle2, AlertCircle, FileText, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "claim" | "appointment" | "document" | "alert" | "info";
  details?: {
    eventType?: string;
    provider?: string;
    location?: string;
    amount?: number;
    date?: string;
    actionRequired?: boolean;
    description?: string;
  };
}

const notifications: Notification[] = [
  { 
    id: "n1", 
    title: "Claim Approved", 
    message: "Your claim for $150 has been approved", 
    time: "2 hours ago", 
    read: false,
    type: "claim",
    details: {
      eventType: "Primary Care Visit",
      provider: "Dr. Sarah Chen",
      location: "1234 Medical Center Dr, Miami, FL",
      amount: 150,
      date: "Dec 15, 2024",
      actionRequired: false,
      description: "Your claim for the primary care visit on December 15th has been processed and approved. The approved amount of $150.00 has been applied to your benefits. No further action is required."
    }
  },
  { 
    id: "n2", 
    title: "Appointment Reminder", 
    message: "Cardiology follow-up in 6 days", 
    time: "1 day ago", 
    read: false,
    type: "appointment",
    details: {
      eventType: "Cardiology Follow-up",
      provider: "Dr. Michael Roberts",
      location: "5678 Heart Health Blvd, Miami, FL",
      date: "Dec 28, 2024 at 10:00 AM",
      actionRequired: true,
      description: "You have an upcoming cardiology follow-up appointment. Please arrive 15 minutes early to complete any necessary paperwork. Bring your insurance card and a list of current medications."
    }
  },
  { 
    id: "n3", 
    title: "Document Ready", 
    message: "Your EOB is ready to download", 
    time: "3 days ago", 
    read: true,
    type: "document",
    details: {
      eventType: "Explanation of Benefits",
      date: "Dec 12, 2024",
      actionRequired: false,
      description: "Your Explanation of Benefits (EOB) for services rendered in November 2024 is now available. This document shows what was billed, what your plan covered, and any amount you may owe. You can download it from your documents section."
    }
  },
  { 
    id: "n4", 
    title: "Prescription Refill Due", 
    message: "Lisinopril 10mg refill available", 
    time: "5 days ago", 
    read: true,
    type: "alert",
    details: {
      eventType: "Prescription Refill",
      provider: "Dr. Sarah Chen",
      location: "CVS Pharmacy, 123 Main St, Miami, FL",
      date: "Dec 20, 2024",
      actionRequired: true,
      description: "Your prescription for Lisinopril 10mg is due for a refill. You have 2 refills remaining. Contact your pharmacy or use the CVS app to request your refill."
    }
  },
];

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

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
            {notifications.length === 0 ? (
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
            <Button variant="ghost" className="w-full text-sm" size="sm">
              View All Notifications
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
                    <p className="text-sm text-muted-foreground">
                      {selectedNotification.time}
                    </p>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Message */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm">{selectedNotification.message}</p>
                </div>

                {/* Details */}
                {selectedNotification.details && (
                  <>
                    <Separator />
                    
                    <div className="space-y-3">
                      {selectedNotification.details.eventType && (
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Event Type</p>
                            <p className="text-sm font-medium">{selectedNotification.details.eventType}</p>
                          </div>
                        </div>
                      )}

                      {selectedNotification.details.provider && (
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
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

                      {selectedNotification.details.date && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Date</p>
                            <p className="text-sm font-medium">{selectedNotification.details.date}</p>
                          </div>
                        </div>
                      )}

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
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setDetailOpen(false)}>
                    Dismiss
                  </Button>
                  <Button className="flex-1">
                    View Related Event
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
