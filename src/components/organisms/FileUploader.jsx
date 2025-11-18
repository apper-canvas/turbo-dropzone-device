import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import DropZone from "@/components/molecules/DropZone";
import FileCard from "@/components/molecules/FileCard";
import UploadProgress from "@/components/molecules/UploadProgress";
import ImagePreviewModal from "@/components/molecules/ImagePreviewModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { uploadService } from "@/services/api/uploadService";
import { generateThumbnail, validateFile, isImageFile } from "@/utils/fileUtils";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";

const FileUploader = () => {
  const [config, setConfig] = useState(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [activeUploads, setActiveUploads] = useState([]);
  const [completedUploads, setCompletedUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, file: null });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setLoading(true);
        
        const [configData, uploadsData] = await Promise.all([
          uploadService.getConfig(),
          uploadService.getAllUploads()
        ]);
        
        setConfig(configData);
        setCompletedUploads(uploadsData);
      } catch (err) {
        setError(err.message || "Failed to load upload data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle file selection
  const handleFilesSelected = useCallback(async (files) => {
    if (!config) return;

    const processedFiles = [];

    for (const file of files) {
      const errors = validateFile(file, config);
      
      if (errors.length > 0) {
        toast.error(`${file.name}: ${errors[0]}`);
        continue;
      }

      const thumbnail = await generateThumbnail(file);
      
      const uploadFile = {
        id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
        progress: 0,
        uploadedUrl: null,
        thumbnail,
        uploadedAt: null,
        error: null,
        file // Keep reference to original file
      };

      processedFiles.push(uploadFile);
    }

    if (processedFiles.length > 0) {
      setUploadQueue(prev => [...prev, ...processedFiles]);
      toast.success(`${processedFiles.length} file(s) added to queue`);
    }
  }, [config]);

  // Start upload process
  const startUploads = useCallback(async () => {
    if (uploadQueue.length === 0) return;

    const filesToUpload = uploadQueue.slice(0, config?.maxConcurrentUploads || 3);
    
    // Move files to active uploads
    setActiveUploads(prev => [...prev, ...filesToUpload]);
    setUploadQueue(prev => prev.slice(filesToUpload.length));

    // Process each upload
    for (const uploadFile of filesToUpload) {
      try {
        // Update status to uploading
        setActiveUploads(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: "uploading" } : f
        ));

        const result = await uploadService.uploadFile(
          uploadFile.file,
          (progress) => {
            setActiveUploads(prev => prev.map(f => 
              f.id === uploadFile.id ? { ...f, progress } : f
            ));
          }
        );

        // Move to completed uploads
        setActiveUploads(prev => prev.filter(f => f.id !== uploadFile.id));
        setCompletedUploads(prev => [result, ...prev]);
        
        toast.success(`${uploadFile.name} uploaded successfully!`);

      } catch (err) {
        // Update with error
        setActiveUploads(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: "error", 
            error: err.message 
          } : f
        ));
        
        toast.error(`Failed to upload ${uploadFile.name}`);
      }
    }
  }, [uploadQueue, config]);

  // Remove file from queue
  const removeFromQueue = useCallback((file) => {
    setUploadQueue(prev => prev.filter(f => f.id !== file.id));
    toast.info(`${file.name} removed from queue`);
  }, []);

  // Remove active upload
  const removeActiveUpload = useCallback((file) => {
    setActiveUploads(prev => prev.filter(f => f.id !== file.id));
    toast.info(`Upload cancelled for ${file.name}`);
  }, []);

  // Copy URL to clipboard
  const copyToClipboard = useCallback(async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("URL copied to clipboard!");
    }
}, []);

  // Handle image preview
  const handleImagePreview = (file) => {
    if (isImageFile(file.type)) {
      setPreviewModal({ isOpen: true, file });
    }
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, file: null });
  };

  // Retry loading
  const retryLoad = () => {
    setError(null);
    setLoading(true);
    // Trigger useEffect
    const event = new Event('retry');
    window.dispatchEvent(event);
  };

  if (loading) {
    return <Loading message="Loading DropZone..." className="min-h-screen" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <ErrorView 
          error={error} 
          onRetry={retryLoad}
          className="min-h-screen"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="Upload" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">DropZone</h1>
          </div>
          <p className="text-slate-600 max-w-lg mx-auto">
            Upload your files quickly and securely. Drag and drop or click to browse.
          </p>
        </div>

        {/* Upload Zone */}
        <DropZone
          onFilesSelected={handleFilesSelected}
          disabled={loading}
          className="w-full max-w-2xl mx-auto"
        />

        {/* Upload Queue */}
        <AnimatePresence>
          {uploadQueue.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                  <ApperIcon name="Clock" className="w-5 h-5" />
                  <span>Upload Queue ({uploadQueue.length})</span>
                </h2>
                <Button onClick={startUploads} size="sm">
                  <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                  Start Uploads
                </Button>
              </div>
              
              <div className="space-y-3">
                {uploadQueue.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onRemove={removeFromQueue}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active Uploads */}
        <AnimatePresence>
          {activeUploads.length > 0 && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
                <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                <span>Uploading ({activeUploads.length})</span>
              </h2>
              
              <div className="space-y-4">
                {activeUploads.map((file) => (
                  <UploadProgress
                    key={file.id}
                    fileName={file.name}
                    progress={file.progress}
                    status={file.status}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completed Uploads */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center space-x-2">
            <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
            <span>Completed Uploads ({completedUploads.length})</span>
          </h2>
          
          {completedUploads.length === 0 ? (
            <Empty
              title="No completed uploads yet"
              message="Once you upload files, they'll appear here with shareable URLs"
              showAction={false}
              className="bg-white rounded-xl border border-slate-200"
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
{completedUploads.map((file) => (
                  <FileCard
                    key={file.Id}
                    file={file}
                    onCopyUrl={copyToClipboard}
                    onImagePreview={handleImagePreview}
                    showUrl={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Stats */}
        {completedUploads.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{completedUploads.length}</p>
                <p className="text-sm text-slate-600">Files Uploaded</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">
                  {Math.round(completedUploads.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024))}MB
                </p>
                <p className="text-sm text-slate-600">Total Size</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{activeUploads.length + uploadQueue.length}</p>
                <p className="text-sm text-slate-600">In Queue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-info">100%</p>
                <p className="text-sm text-slate-600">Success Rate</p>
              </div>
            </div>
          </div>
        )}
      </div>
{/* Image Preview Modal */}
      <ImagePreviewModal
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        file={previewModal.file}
      />
    </div>
  );
};

export default FileUploader;