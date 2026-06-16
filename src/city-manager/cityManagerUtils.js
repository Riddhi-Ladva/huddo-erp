// src/city-manager/cityManagerUtils.js

export const formatCurrency = (value) => {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
};

export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options).replace(/ /g, ' ');
};

export const formatNumber = (value) => {
  return Number(value || 0).toLocaleString('en-IN');
};
