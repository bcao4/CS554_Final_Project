import moment from "moment";

export const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

export const convertPrice = (price, options) => {
  const abs = options?.abs;

  if (abs) {
    price = Math.abs(price);
  }

  price = price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return price;
};

export const convertDate = (time, compareTime) => {
  // Determine how long ago this time was, then choose the appropriate values in the string to show (minutes, hours, days, months, years)

  const start = moment(compareTime); // compare against the earliest time in the chart to determine what to display
  const now = moment(Date.now());

  const days = now.diff(start, "days");

  if (days <= 10) {
    // 1d, 7d
    return moment(time).format("M/D h:mm a");
  }
  if (days <= 185) {
    // 30d, 90d, 180d
    return moment(time).format("M/D");
  }
  // show month and year for any longer time periods
  return moment(time).format("M/Y");
};
