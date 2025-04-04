// Hàm kiểm tra email hợp lệ
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Hàm kiểm tra mật khẩu hợp lệ
export const isValidPassword = (password) => {
  return {
    hasLetter: /[a-zA-Z]/.test(password), // Có ít nhất một chữ cái
    hasNumberOrSpecial: /[\d\W]/.test(password), // Có ít nhất một số hoặc ký tự đặc biệt
    hasMinLength: password.length >= 10, // Độ dài tối thiểu 10 ký tự
  };
};

// Hàm kiểm tra số điện thoại hợp lệ (tùy chỉnh theo quốc gia)
export const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^[0-9]{10,11}$/; // Giả định số điện thoại có 10 hoặc 11 số
  return phoneRegex.test(phoneNumber);
};

// Kiểm tra tệp có phải ảnh không
export const isValidFileImage = (file) => {
  if (!file) return false;
  const validExtensions = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  return validExtensions.includes(file.type);
};
