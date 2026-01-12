import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Calendar, User, DollarSign, FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { EventDetailModal, MemberEvent } from "./EventDetailModal";
import { convertHistoryToEvent } from "@/hooks/useMemberEvents";

interface HistoryItem {
  id: string;
  date: string;
  title: string;
  provider?: string;
  amount?: number;
  status?: "paid" | "pending" | "covered";
  description?: string;
}

interface ExpandableMetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  status: "good" | "great" | "warning";
  history: HistoryItem[];
  emptyMessage?: string;
  eventType?: string; // 'visit', 'prescription', 'appointment', etc.
}

export const ExpandableMetricCard = ({
  label,
  value,
  icon: Icon,
  status,
  history,
  emptyMessage = "No history available",
  eventType = "visit",
}: ExpandableMetricCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<MemberEvent | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleItemClick = (item: HistoryItem) => {
    // Convert history item to event format for the modal
    const eventData = convertHistoryToEvent(item, eventType) as MemberEvent;
    // Merge with the original item to preserve all data
    const fullEvent: MemberEvent = {
      ...eventData,
      individual_id: "mock-individual-id",
      billed_amount: item.amount ? item.amount * 1.5 : undefined,
      allowed_amount: item.amount ? item.amount * 1.2 : undefined,
      plan_paid: item.amount ? item.amount * 0.8 : undefined,
      notes: item.description,
    };
    setSelectedEvent(fullEvent);
    setModalOpen(true);
  };

  const getStatusBadge = (itemStatus?: string) => {
    switch (itemStatus) {
      case "paid":
        return <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">Paid</Badge>;
      case "covered":
        return <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Covered</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 text-xs">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-all cursor-pointer",
        isExpanded && "ring-2 ring-primary/20"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardContent className="p-4 md:p-6">
        {/* Header - Always visible */}
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground">{label}</p>
            <p className="text-xl md:text-2xl font-bold text-foreground mt-1 truncate">{value}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`p-2 md:p-3 rounded-full ${
              status === "great" 
                ? "bg-accent/10 text-accent" 
                : status === "warning"
                ? "bg-yellow-500/10 text-yellow-600"
                : "bg-primary/10 text-primary"
            }`}>
              <Icon className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div className="p-1.5 rounded-full hover:bg-muted transition-colors">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        {/* Tap hint */}
        {!isExpanded && history.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Tap to view history ({history.length} items)
          </p>
        )}

        {/* Expanded History */}
        {isExpanded && (
          <div 
            className="mt-4 pt-4 border-t space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{emptyMessage}</p>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer active:scale-[0.99] group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.date}
                        </span>
                        {item.provider && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {item.provider}
                          </span>
                        )}
                        {item.amount !== undefined && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            ${item.amount.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <ChevronDown className="h-4 w-4 text-muted-foreground rotate-[-90deg] flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {history.length > 0 && (
              <button className="w-full text-center text-xs text-primary font-medium py-2 hover:underline">
                View All History →
              </button>
            )}
          </div>
        )}

        {/* Event Detail Modal */}
        <EventDetailModal
          event={selectedEvent}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </CardContent>
    </Card>
  );
};
