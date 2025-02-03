export function getFormattedLocalTime(req) {
  const localTime = new Date();

  const year = localTime.getFullYear();
  const month = String(localTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(localTime.getDate()).padStart(2, "0");

  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  // Format the time without spaces
  const data = `${year}-${month}-${day}-${hours}${minutes}${seconds}-${req.file.fieldname}`;

  return data;
}
