export const formatCurrencyVND = (amount) => {
  if (isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
