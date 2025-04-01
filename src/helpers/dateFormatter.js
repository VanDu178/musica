export const formatDate = (dateInput, formatType = "default") => {
    if (!dateInput) return "";

    const dateObj = new Date(dateInput);

    if (isNaN(dateObj)) return "Invalid Date"; // Kiểm tra lỗi

    const options = {
        default: { year: "numeric", month: "2-digit", day: "2-digit" }, // 2025-03-31
        short: { day: "2-digit", month: "2-digit", year: "numeric" }, // 31/03/2025
        long: { year: "numeric", month: "long", day: "2-digit" }, // March 31, 2025
        custom: { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }, // 31-03-2025 15:30:00
    };

    return new Intl.DateTimeFormat("en-GB", options[formatType] || options.default).format(dateObj);
};
