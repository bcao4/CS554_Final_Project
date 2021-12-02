export const removeHtmlTags = (htmlString) => {
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "");
};

export const timeToHoursAndMinutes = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const timeToDaysAndHours = (time) => {
  const date = new Date(time);
  return date.toLocaleTimeString(navigator.language, {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
  });
};
