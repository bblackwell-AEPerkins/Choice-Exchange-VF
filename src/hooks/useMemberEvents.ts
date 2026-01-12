import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
        
        let query = supabase
          .from("member_events")
          .select("*")
          .order("event_date", { ascending: false });

        if (options.eventType) {
          query = query.eq("event_type", options.eventType);
        }
        if (options.eventCategory) {
          query = query.eq("event_category", options.eventCategory);
        }
        if (options.status) {
          query = query.eq("status", options.status);
        }
        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;
        
        setEvents(data as MemberEvent[]);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching member events:", err);
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
        
        const { data, error } = await supabase
          .from("member_events")
          .select("*")
          .order("event_date", { ascending: false });

        if (error) throw error;

        // Group events by type
        const grouped: Record<string, MemberEvent[]> = {};
        (data as MemberEvent[]).forEach((event) => {
          if (!grouped[event.event_type]) {
            grouped[event.event_type] = [];
          }
          grouped[event.event_type].push(event);
        });

        setGroupedEvents(grouped);
      } catch (err) {
        console.error("Error fetching events:", err);
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
