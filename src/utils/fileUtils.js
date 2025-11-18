export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileIcon = (type) => {
  if (type.startsWith("image/")) return "Image";
  if (type.startsWith("video/")) return "Video";
  if (type.startsWith("audio/")) return "Music";
  if (type.includes("pdf")) return "FileText";
  if (type.includes("document") || type.includes("word")) return "FileText";
  if (type.includes("spreadsheet") || type.includes("excel")) return "Sheet";
  if (type.includes("presentation") || type.includes("powerpoint")) return "Presentation";
  if (type.includes("zip") || type.includes("rar") || type.includes("7z")) return "Archive";
  return "File";
};

export const isImageFile = (type) => {
  return type.startsWith("image/");
};

export const generateThumbnail = (file) => {
  return new Promise((resolve) => {
    if (!isImageFile(file.type)) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const maxSize = 64;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL());
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const validateFile = (file, config) => {
  const errors = [];
  
  if (file.size > config.maxFileSize) {
    errors.push(`File size exceeds ${formatFileSize(config.maxFileSize)} limit`);
  }
  
  if (config.allowedTypes.length > 0 && !config.allowedTypes.some(type => 
    file.type.includes(type) || file.name.toLowerCase().endsWith(type.toLowerCase())
  )) {
    errors.push(`File type ${file.type || "unknown"} is not supported`);
  }
  
  return errors;
};