import { useState, useEffect } from "react";
import { DEMO_MODE, MOCK_MEMBER_EVENTS, simulateDelay, type MockMemberEvent } from "@/lib/mockData";
import type { MemberEvent } from "@/components/EventDetailModal";

interface UseMemberEventsOptions {
  eventType?: string;
  eventCategory?: string;
  status?: string;
  limit?: number;
}

export const useMemberEvents = (options: UseMemberEventsOptions = {}) => {
  const [events, setEvents] = useState<MemberEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        
        if (DEMO_MODE) {
          // Use mock data
          await simulateDelay(300);
          
          let filteredEvents = [...MOCK_MEMBER_EVENTS] as MemberEvent[];
          
          if (options.eventType) {
            filteredEvents = filteredEvents.filter(e => e.event_type === options.eventType);
          }
          if (options.eventCategory) {
            filteredEvents = filteredEvents.filter(e => e.event_category === options.eventCategory);
          }
          if (options.status) {
            filteredEvents = filteredEvents.filter(e => e.status === options.status);
          }
          
          // Sort by date descending
          filteredEvents.sort((a, b) => 
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
          );
          
          if (options.limit) {
            filteredEvents = filteredEvents.slice(0, options.limit);
          }
          
          setEvents(filteredEvents);
        } else {
          // Original Supabase implementation would go here
          // For demo mode, we never reach this
          setEvents([]);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [options.eventType, options.eventCategory, options.status, options.limit]);

  return { events, loading, error };
};

export const useEventsByType = () => {
  const [groupedEvents, setGroupedEvents] = useState<Record<string, MemberEvent[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        setLoading(true);
        
        if (DEMO_MODE) {
          await simulateDelay(300);
          
          // Group events by type
          const grouped: Record<string, MemberEvent[]> = {};
          (MOCK_MEMBER_EVENTS as MemberEvent[]).forEach((event) => {
            if (!grouped[event.event_type]) {
              grouped[event.event_type] = [];
            }
            grouped[event.event_type].push(event);
          });
          
          // Sort each group by date
          Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => 
              new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
            );
          });

          setGroupedEvents(grouped);
        } else {
          setGroupedEvents({});
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, []);

  return { groupedEvents, loading };
};

// Helper to convert legacy history items to event format for display
export const convertHistoryToEvent = (
  historyItem: {
    id: string;
    date: string;
    title: string;
    provider?: string;
    amount?: number;
    status?: string;
    description?: string;
  },
  eventType: string
): Partial<MemberEvent> => {
  return {
    id: historyItem.id,
    event_type: eventType,
    event_category: eventType === "prescription" ? "pharmacy" : "medical",
    title: historyItem.title,
    description: historyItem.description,
    event_date: new Date(historyItem.date).toISOString(),
    provider_name: historyItem.provider,
    member_responsibility: historyItem.amount,
    status: historyItem.status === "paid" ? "completed" : historyItem.status || "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};
