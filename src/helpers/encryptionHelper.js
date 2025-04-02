import bcrypt from "bcryptjs";
import Cookies from "js-cookie";
export const hash = async (data) => {
  try {
    data = data + ""; // Chuyển số thành chuỗi nếu data là số
    // Tạo salt với 10 rounds
    const salt = await bcrypt.genSalt(10);
    // Mã hóa dữ liệu
    const hashedData = await bcrypt.hash(data, salt); // Đảm bảo bạn chờ đợi (await) kết quả từ bcrypt.hash
    return hashedData;
  } catch (error) {
    throw error;
  }
};

// Hàm kiểm tra mật khẩu đã mã hóa với mật khẩu đầu vào
export const checkData = async (inputData) => {
  try {
    const hashedData = Cookies.get("secrect_key");
    inputData = inputData + "";
    const isMatch = await bcrypt.compare(inputData, hashedData);
    return isMatch;
  } catch (error) {
    console.error("Error comparing password: ", error);
    throw error;
  }
};

// const hashed = Cookies.get("secrect_key");
// const test = await checkData(response.data.role, hashed);
// alert(test);
