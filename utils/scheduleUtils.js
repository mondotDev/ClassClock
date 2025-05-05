// utils/scheduleUtils.js

export function generateDefaultPeriods(totalPeriods, hasZeroPeriod) {
    const base = new Date();
    base.setHours(8, 30, 0, 0);
  
    return Array.from({ length: totalPeriods }, (_, i) => {
      const start = new Date(base.getTime() + i * 50 * 60000);
      const end = new Date(start.getTime() + 50 * 60000);
  
      return {
        label:
          hasZeroPeriod && i === 0
            ? "Zero Period"
            : `Period ${hasZeroPeriod ? i : i + 1}`,
        startTime: start,
        endTime: end,
      };
    });
  }
  
  export function parseTime(timeString) {
    try {
      const [time, ampm] = timeString.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (ampm === "PM" && hours < 12) hours += 12;
      if (ampm === "AM" && hours === 12) hours = 0;
      const now = new Date();
      now.setHours(hours, minutes, 0, 0);
      return now;
    } catch {
      return new Date();
    }
  }
  