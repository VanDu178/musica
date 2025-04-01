// Helper để xử lý khi bắt đầu kéo
export const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text/plain', index);
};

// Helper để xử lý khi thả
export const handleDrop = (e, destinationIndex, items, setItems) => {
    e.preventDefault();
    const sourceIndex = Number(e.dataTransfer.getData('text/plain'));
    if (sourceIndex === destinationIndex) return; // Không làm gì nếu thả vào cùng vị trí

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(sourceIndex, 1); // Xóa phần tử từ vị trí cũ
    newItems.splice(destinationIndex, 0, movedItem); // Chèn vào vị trí mới

    setItems(newItems); // Cập nhật state
};

// Helper để cho phép thả lên danh sách
export const handleDragOver = (e) => {
    e.preventDefault();
};