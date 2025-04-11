//Hàm lấy dữ liệu cache
export const getCachedData = (key, duration) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    if (now - timestamp < duration) {
      return data;
    } else {
      localStorage.removeItem(key); // Dữ liệu hết hạn, xoá luôn
    }
  } catch (error) {
    console.warn(`Failed to parse cache for key "${key}"`, error);
    localStorage.removeItem(key); // Nếu parse lỗi cũng nên xoá
  }

  return null;
};

//Hàm lưu trữ dữ liệu cache
export const storeCachedData = (key, data) => {
  const dataToCache = {
    data,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(key, JSON.stringify(dataToCache));
  } catch (error) {
    console.error(`Failed to store cache for key "${key}"`, error);
  }
};

// Hàm xoá cache data
export const removeCachedData = (...keys) => {
  keys.flat().forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove cache for key "${key}"`, error);
    }
  });
};
