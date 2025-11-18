import uploadConfigData from "@/services/mockData/uploadConfig.json";
import uploadedFilesData from "@/services/mockData/uploadedFiles.json";

// Simulate upload delay and progress updates
const simulateUpload = (file, onProgress) => {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Simulate successful upload with generated URL
        const uploadedUrl = `https://example.com/files/${file.name}`;
        onProgress(progress);
        setTimeout(() => resolve({ success: true, url: uploadedUrl }), 200);
      } else {
        onProgress(Math.floor(progress));
      }
    }, Math.random() * 200 + 100); // Random interval between 100-300ms
  });
};

let uploadedFiles = [...uploadedFilesData];
let uploadConfig = { ...uploadConfigData };

export const uploadService = {
  // Get upload configuration
  getConfig: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return { ...uploadConfig };
  },

  // Get all uploaded files
  getAllUploads: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...uploadedFiles];
  },

  // Get uploaded file by ID
  getUploadById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return uploadedFiles.find(file => file.Id === parseInt(id)) || null;
  },

  // Upload a file with progress callback
  uploadFile: async (file, onProgress = () => {}) => {
    try {
      // Simulate upload process
      const result = await simulateUpload(file, onProgress);
      
      if (result.success) {
        // Add to uploaded files list
        const newFile = {
          Id: Math.max(...uploadedFiles.map(f => f.Id), 0) + 1,
          name: file.name,
          size: file.size,
          type: file.type,
          status: "completed",
          progress: 100,
          uploadedUrl: result.url,
          thumbnail: file.thumbnail || null,
          uploadedAt: Date.now(),
          error: null
        };
        
        uploadedFiles.unshift(newFile); // Add to beginning of array
        
        // Keep only last 50 files
        if (uploadedFiles.length > 50) {
          uploadedFiles = uploadedFiles.slice(0, 50);
        }
        
        return newFile;
      }
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  // Remove uploaded file
  removeUpload: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = uploadedFiles.findIndex(file => file.Id === parseInt(id));
    if (index > -1) {
      const removedFile = uploadedFiles[index];
      uploadedFiles.splice(index, 1);
      return removedFile;
    }
    return null;
  },

  // Clear all uploads
  clearAllUploads: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    uploadedFiles = [];
    return true;
  },

  // Update upload configuration
  updateConfig: async (newConfig) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    uploadConfig = { ...uploadConfig, ...newConfig };
    return { ...uploadConfig };
  }
};