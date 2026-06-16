// src/state-manager/utils.js

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return "₹" + Number(amount).toLocaleString('en-IN');
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  // Accept string format or Date object
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr; // Fallback to raw string if parsing fails
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(num)) return "0";
  return Number(num).toLocaleString('en-IN');
}
