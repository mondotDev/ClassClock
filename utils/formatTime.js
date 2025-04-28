// utils/formatTime.js

export function formatTime(hour, minute, ampm, is24Hour) {
    if (is24Hour) {
      let hr = parseInt(hour, 10);
      if (ampm === "PM" && hr !== 12) hr += 12;
      if (ampm === "AM" && hr === 12) hr = 0;
      return `${hr.toString().padStart(2, "0")}:${minute}`;
    } else {
      return `${hour}:${minute} ${ampm}`;
    }
  }
  