export const formatDate = (fetchedDate) => {
  const date = new Date(fetchedDate);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${year}-${month}-${day}   ${hours}:${minutes}:${seconds}`;
};

export const formatLastSeen = (timestamp) => {
  if (!timestamp) return "last seen recently";

  const last = new Date(timestamp);
  const now = new Date();

  // Today - just show time
  if (last.toDateString() === now.toDateString()) {
    return `last seen at ${last.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true})}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (last.toDateString() === yesterday.toDateString()) {
    return `last seen yesterday at ${last.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true})}`;
  }

  // Same year - show day and month only
  if (last.getFullYear() === now.getFullYear()) {
    return `last seen ${last.toLocaleDateString('en-US', {day: 'numeric', month: 'short'})} at ${last.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true})}`;
  }

  // Different year - show full date
  return `last seen ${last.toLocaleDateString('en-US')} at ${last.toLocaleTimeString('en-US', {hour: 'numeric', minute:'2-digit', hour12: true})}`;
};
