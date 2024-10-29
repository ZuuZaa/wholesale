import dayjs from "dayjs";

export const dateNormalizer = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const generateDateOptions = (days) => {
    const options = [];
    const today = dayjs();

    // Start with ASAP option
    options.push({ value: "ASAP", label: "ASAP" });

    // Add options for the next 'days' days
    for (let i = 1; i <= days; i++) {
      const date = today.add(i, "day");
      options.push({
        value: date.format("YYYY-MM-DD"),
        label: date.format("DD/ MM/ YYYY"),
      });
    }
    return options;
  };
