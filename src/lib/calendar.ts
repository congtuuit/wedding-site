import { WeddingEvent } from "@/types/wedding";

/**
 * Format Date object into ICS format string (YYYYMMDDTHHMMSSZ)
 */
function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/**
 * Generates an .ics file download for the wedding event
 */
export function downloadIcsFile(event: WeddingEvent) {
  const startDate = new Date(event.startDateIso);
  const endDate = new Date(event.endDateIso);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding//Tu Van & Huong Nguyen//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:wedding-${event.id}-${Date.now()}@tuvan-huong.wedding`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${startFormatted}`,
    `DTEND:${endFormatted}`,
    `SUMMARY:${event.calendarTitle}`,
    `DESCRIPTION:${event.calendarDescription}`,
    `LOCATION:${event.address || event.venue}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Nhắc nhở: ${event.calendarTitle} vào ngày mai!`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${event.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates a direct Google Calendar web event URL
 */
export function getGoogleCalendarUrl(event: WeddingEvent): string {
  const startDate = new Date(event.startDateIso);
  const endDate = new Date(event.endDateIso);

  const startFormatted = formatIcsDate(startDate);
  const endFormatted = formatIcsDate(endDate);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.calendarTitle,
    dates: `${startFormatted}/${endFormatted}`,
    details: `${event.calendarDescription}\nĐịa điểm: ${event.address}`,
    location: event.address || event.venue,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
