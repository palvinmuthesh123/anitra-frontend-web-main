import moment from "moment";

export const getDateMonthYear = (dateObj) => {
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0"); // pad month with leading zero if necessary
  const day = dateObj.getDate().toString().padStart(2, "0"); // pad day with leading zero if necessary
  const year = dateObj.getFullYear();
  return `${year}-${month}-${day}`;
};


export const getDateTimeArrayIn24Format = () => {
  const timeArray = [];

  for (let hour = 0; hour <= 23; hour++) {
    for (let minute = 0; minute <= 30; minute += 30) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      const timeString = `${hourStr}:${minuteStr}`;
      timeArray.push(timeString);
    }
  }
  return timeArray;
};

export function formatDate(individualOffer) {
  if (individualOffer) {
    const formattedDate = new Date(individualOffer)
      .toLocaleDateString("en-GB", {
        timeZone: "UTC",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .split("/")
      .join("-");

    return formattedDate;
  } else {
    return "NA";
  }
}

export const capitalizeFirstLetter = (str) => {
  return str?.length ? str?.charAt(0)?.toUpperCase() + str.slice(1) : "";
};

export const FormatTime = (timeFormat) => {
  const timestamp = timeFormat;
  const datetimeObject = new Date(timestamp);
  const hours = datetimeObject.getUTCHours();
  const minutes = datetimeObject.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const time = `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
    return time
};

export function EpochFormatDate(timestamp) {
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const formattedDateTime = `${day}/${month}/${year} - ${hours}:${minutes}`;
  return formattedDateTime;
}

export function ConvertMonthsToYearsMonthsDays(months) {
  if (months <= 0) {
    return "0 years 0 months 0 days";
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  // You can further break down the months into days if needed
  // For simplicity, I'm assuming each month has 30 days here
  const days = remainingMonths * 30;

  return `${years} years ${remainingMonths} months`;
}


export const dobToEpoch = (dobStr) => {
  const dobDate = new Date(dobStr);
  const epochTime = parseInt(dobDate.getTime() / 1000);  // Convert milliseconds to seconds and parse to an integer
  return epochTime;
}

export function ConvertToEpoch(dateString) {
  const epochTime = new Date(dateString).getTime();
  return epochTime;
}

export function UTCformatOnlyDate(dateTimeString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(new Date(dateTimeString))
    .replace(" ", "");
}

export function UTCformatDate(dateTimeString) {
  const formattedDate = moment(dateTimeString).format('MMM DD, YYYY HH:mm');
  return formattedDate;
}

export function ConvertToEpochAndAddOneDay(dateString) {
  const epochTime = new Date(dateString).getTime() + 24 * 60 * 60 * 1000; // Adding one day (24 hours in milliseconds)
  return epochTime;
}

export const FormatDatePickerSelect = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};