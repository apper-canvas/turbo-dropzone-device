import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ImagePreviewModal = ({ isOpen, onClose, file }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
      setImageLoaded(false);
    }
  }, [isOpen, file]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFitToScreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev * 1.2, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleFitToScreen = useCallback(() => {
    setZoom(0.9);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [zoom, position]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || zoom <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e) => {
    if (zoom <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  }, [zoom, position]);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || zoom <= 1 || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart, zoom]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.max(0.1, Math.min(5, zoom + delta));
    setZoom(newZoom);
    
    if (newZoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  if (!file || !isOpen) return null;

  const imageUrl = file.uploadedUrl || file.thumbnail;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Modal Content */}
          <motion.div
            className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4 flex items-center justify-between">
              <div className="text-white">
                <h3 className="font-semibold text-lg truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h3>
                <p className="text-sm text-white/80">
                  {Math.round(zoom * 100)}% zoom
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            {/* Image Container */}
            <div 
              className="relative w-full h-full min-h-[400px] sm:min-h-[500px] max-h-[70vh] overflow-hidden bg-gray-100 flex items-center justify-center"
              onWheel={handleWheel}
            >
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                </div>
              )}
              
              <motion.img
                src={imageUrl}
                alt={file.name}
                className={`max-w-none select-none ${
                  zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                } ${isDragging ? 'cursor-grabbing' : ''}`}
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transformOrigin: 'center center'
                }}
                onLoad={() => setImageLoaded(true)}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                drag={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.1}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                  title="Zoom Out (-)"
                >
                  <ApperIcon name="ZoomOut" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetZoom}
                  className="text-white hover:bg-white/20 rounded-full px-3 py-2 text-sm"
                  title="Reset Zoom (0)"
                >
                  {Math.round(zoom * 100)}%
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 5}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                  title="Zoom In (+)"
                >
                  <ApperIcon name="ZoomIn" size={16} />
                </Button>
                
                <div className="w-px h-6 bg-white/30 mx-2"></div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFitToScreen}
                  className="text-white hover:bg-white/20 rounded-full p-2"
                  title="Fit to Screen (F)"
                >
                  <ApperIcon name="Maximize2" size={16} />
                </Button>
              </div>
              
              <div className="text-center mt-2 text-xs text-white/70">
                ESC to close • +/- to zoom • F to fit • Drag to pan when zoomed
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImagePreviewModal;