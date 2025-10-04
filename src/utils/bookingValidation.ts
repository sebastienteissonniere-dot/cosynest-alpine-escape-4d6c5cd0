import { SchoolHoliday, BookingSettings } from "@/hooks/useSchoolHolidays";

export interface ValidationResult {
  ok: boolean;
  reason?: string;
}

export function validateBooking(
  arrival: Date | undefined,
  departure: Date | undefined,
  holidays: SchoolHoliday[],
  settings: BookingSettings
): ValidationResult {
  if (!arrival || !departure) {
    return { ok: true };
  }

  // Calculate number of nights
  const nights = Math.round((departure.getTime() - arrival.getTime()) / (1000 * 60 * 60 * 24));

  // Filter holidays by zone
  const zoneHolidays = holidays.filter(h => h.zone === settings.school_zone || h.zone === 'Toutes');

  for (const vacation of zoneHolidays) {
    const vStart = new Date(vacation.start_date);
    const vEnd = new Date(vacation.end_date);
    
    // Check if arrival is within vacation period
    const arrivalInVacation = arrival >= vStart && arrival < vEnd;
    
    // Check if booking overlaps with vacation
    const overlap = arrival < vEnd && vStart < departure;

    // Apply rules if arrival is in vacation or (overlap and setting is enabled)
    if (arrivalInVacation || (settings.apply_on_overlap && overlap)) {
      // Skip summer holidays (été)
      if (vacation.holiday_type === 'ete') {
        continue;
      }

      // Check if arrival is on Saturday (day 6)
      const arrivalIsSaturday = arrival.getDay() === 6;
      
      if (!arrivalIsSaturday) {
        return {
          ok: false,
          reason: 'Pendant les vacances scolaires (hors été), l\'arrivée doit être le samedi.',
        };
      }

      // Check minimum 7 nights
      if (nights < 7) {
        return {
          ok: false,
          reason: 'Pendant les vacances scolaires (hors été), les séjours doivent être de minimum 7 nuits.',
        };
      }

      // Check if departure is also on Saturday
      const departureIsSaturday = departure.getDay() === 6;
      if (!departureIsSaturday) {
        return {
          ok: false,
          reason: 'Pendant les vacances scolaires (hors été), le départ doit être le samedi.',
        };
      }
    }
  }

  return { ok: true };
}

export function getDisabledDates(
  holidays: SchoolHoliday[],
  settings: BookingSettings
): Date[] {
  const disabledDates: Date[] = [];
  const zoneHolidays = holidays.filter(
    h => h.zone === settings.school_zone || h.zone === 'Toutes'
  );

  for (const vacation of zoneHolidays) {
    // Skip summer holidays
    if (vacation.holiday_type === 'ete') {
      continue;
    }

    const vStart = new Date(vacation.start_date);
    const vEnd = new Date(vacation.end_date);

    // Disable all days that are not Saturday within vacation period
    let currentDate = new Date(vStart);
    while (currentDate <= vEnd) {
      if (currentDate.getDay() !== 6) {
        disabledDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return disabledDates;
}