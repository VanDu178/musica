/**
 * Định dạng thời gian (phút:giây)
 * @param {number} seconds - Thời gian tính bằng giây
 * @returns {string} - Thời gian đã định dạng dưới dạng "phút:giây"
 */
export const formatTime = (seconds) => {
    const sec = Math.floor(seconds % 60);  // Lấy phần giây
    const min = Math.floor(seconds / 60);  // Lấy phần phút
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;  // Trả về theo định dạng "phút:giây"
};
