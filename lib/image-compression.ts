export async function compressImageToUnder(file: File, maxSizeKb: number = 100): Promise<File> {
  // Hanya proses file gambar (png, jpg, jpeg)
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const maxSizeByte = maxSizeKb * 1024;
  
  // Jika ukuran file sudah sangat kecil (misal < 50KB), kembalikan langsung
  if (file.size < 50 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Membatasi dimensi maksimal agar mempercepat penurunan size
        const maxDimension = 1024;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(file);

        // Jika gambar PNG transparan, beri background putih agar jadi JPEG yang valid
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let compressedFile = file;

        const compress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) return resolve(file);
              
              // Ubah nama file menjadi .jpg jika asalnya .png untuk konsistensi mime type
              const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
              
              compressedFile = new File([blob], newFileName, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              // Jika masih lebih besar dari target dan kualitas masih bisa diturunkan
              if (compressedFile.size > maxSizeByte && quality > 0.1) {
                quality -= 0.15; // Kurangi 15% setiap iterasi
                
                // Jika quality sudah rendah tapi size masih besar, kecilkan resolusi
                if (quality <= 0.4 && compressedFile.size > maxSizeByte * 1.5) {
                  width = Math.round(width * 0.8);
                  height = Math.round(height * 0.8);
                  canvas.width = width;
                  canvas.height = height;
                  ctx.fillStyle = "#ffffff";
                  ctx.fillRect(0, 0, width, height);
                  ctx.drawImage(img, 0, 0, width, height);
                }
                
                compress(); 
              } else {
                resolve(compressedFile);
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        compress();
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}
