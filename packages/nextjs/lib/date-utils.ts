export const toMinsAgo = (timestamp: string): string => {
  // Step 1: Parse the timestamp into a Date object
  const timestampDate = new Date(timestamp).getTime();

  // Step 2: Get the current date and time
  const currentDate = Date.now();

  // Step 3: Calculate the difference in milliseconds
  const differenceInMilliseconds = currentDate - timestampDate;

  // Step 4: Convert the difference from milliseconds to minutes
  const differenceInMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));

  return `${differenceInMinutes} mins ago`;
};
