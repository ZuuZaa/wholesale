export const dateNormalizer = (date) => {
  const initialDate = new Date(date);
  let day = initialDate.getDay();
  day = day < 10 ? `0${day}` : day;
  let month = initialDate.getMonth();
  month = month < 10 ? `0${month}` : month;
  const year = initialDate.getFullYear();
  return `${day}/${month}/${year}`;
};