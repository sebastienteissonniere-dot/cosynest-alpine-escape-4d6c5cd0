import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SchoolHoliday {
  id: string;
  zone: string;
  start_date: string;
  end_date: string;
  description: string;
  holiday_type: string;
  academic_year: string;
}

export interface BookingSettings {
  id: string;
  school_zone: string;
  auto_detect_zone: boolean;
  data_source: string;
  apply_on_overlap: boolean;
  allow_with_surcharge: boolean;
  surcharge_percentage: number;
}

export const useSchoolHolidays = () => {
  return useQuery({
    queryKey: ["school-holidays"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_holidays")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) throw error;
      return data as SchoolHoliday[];
    },
  });
};

export const useBookingSettings = () => {
  return useQuery({
    queryKey: ["booking-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_settings")
        .select("*")
        .limit(1)
        .single();

      if (error) throw error;
      return data as BookingSettings;
    },
  });
};