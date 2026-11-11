export function generateMediaId(): string {
  return `media_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    // Если это не картинка, возвращаем как есть
    if (!file.type.startsWith('image/')) return resolve(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = Math.min(1, MAX_WIDTH / img.width);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.8);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
