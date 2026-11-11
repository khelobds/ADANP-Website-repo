// Today's date as 'YYYY-MM-DD' in the browser's time zone (toISOString would give the UTC date).
export const todayISO = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

// 'YYYY-MM-DD' (or a 'YYYY-MM-DD hh:mm:ss' timestamp) -> e.g. 'May 10, 2027'
export const formatDate = (value) => (value
  ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  : '');
