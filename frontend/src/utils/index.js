import moment from "moment";

export const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

export const convertPrice = (price) => {
  price = Math.abs(price);

  price = price.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return price;
};

const getDaysDifference = (fromTime) => {
  // Given a start time, this function returns the number of days ago that time was
  const start = moment(fromTime);
  const now = moment(Date.now());
  return now.diff(start, "days");
};

export const convertDate = (time, compareTime) => {
  // Determine how long ago this time was, then choose the appropriate values in the string to show (minutes, hours, days, months, years)
  const days = getDaysDifference(compareTime); // compare against the earliest time in the chart to determine what to display

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

export const getDateDiffString = (time) => {
  // Given a starting time period,
  // returns Today, Past Week, Past Month, Past 3 Months, Past Year, or Since mm/dd/yyyy for max chart
  // for use in chart to show string formatted as: +$xxx.xx Past Month or +$xxx.xx Past Year, etc
  const days = getDaysDifference(time);

  // adding 1 extra day as a buffer in case time period is off +/- 1 day due to something
  if (days <= 2) {
    return "Today";
  }
  if (days <= 8) {
    return "Past Week";
  }
  if (days <= 31) {
    return "Past Month";
  }
  if (days <= 91) {
    return "Past 3 Months";
  }
  if (days <= 181) {
    return "Past 6 Months";
  }
  if (days <= 366) {
    return "Past Year";
  }
  // For charts for more than a year, just show "since mm/dd/yyyy"
  return `since ${new Date(time).toLocaleDateString()}`;
};

export const calcPercent = (oldPrice, newPrice, precision) => {
  // Returns percent change from oldprice to newprice to a given precision
  const change = newPrice - oldPrice;
  const percentChange = (change / oldPrice) * 100;
  return percentChange.toFixed(precision);
};

export const generatePercentString = (oldPrice, newPrice) => {
  // Returns a string with percent change with "+" or "-" in front and "%" after, surrounded by ()
  // ex: (+1.22%), (-2.01%)
  let percentChange = Number(calcPercent(oldPrice, newPrice, 2)); // find percent change to 2 decimal points
  const sign = percentChange > 0 ? "+" : ""; // if num is greater than 0 give it a + sign,
  // if it is negative, the sign will already be included with the conversion from -x to a string

  percentChange = percentChange.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `(${sign}${percentChange}%)`;
};
