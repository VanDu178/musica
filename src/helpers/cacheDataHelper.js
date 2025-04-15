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
  removeCachedData(key);
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

export const updatePlaylistImageInCache = (playlistId, newImageUrl) => {
  const cacheKey = 'playlistsLeftSideBar';
  const cacheDuration = 2 * 60 * 60 * 1000; // 24 giờ, điều chỉnh nếu cần

  try {
    // Lấy dữ liệu cache hiện tại
    const cachedData = getCachedData(cacheKey, cacheDuration);

    if (!cachedData || !cachedData.playlists) {
      console.warn(`No valid cache or playlists found for key "${cacheKey}" or cache expired.`);
      return;
    }

    // Kiểm tra xem cachedData.playlists có phải là mảng không
    if (!Array.isArray(cachedData.playlists)) {
      console.error(`Cached playlists for key "${cacheKey}" is not an array:`, cachedData.playlists);
      return;
    }

    // Cập nhật image_path cho playlist có playlistId
    const updatedPlaylists = cachedData.playlists.map(playlist =>
      String(playlist.id) === String(playlistId)
        ? { ...playlist, image_path: newImageUrl }
        : playlist
    );

    // Tạo object cache mới để lưu
    const updatedCacheData = {
      ...cachedData,
      playlists: updatedPlaylists
    };

    // Lưu lại dữ liệu cache đã cập nhật
    storeCachedData(cacheKey, updatedCacheData);
  } catch (error) {
    console.error(`Failed to update playlist image in cache for playlistId ${playlistId}`, error);
  }
};
