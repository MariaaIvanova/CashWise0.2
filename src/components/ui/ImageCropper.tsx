import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Button from "./Button";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: Blob) => void;
  onCancel: () => void;
}

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageCropper({
  image,
  onCropComplete,
  onCancel,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] =
    useState<CroppedAreaPixels | null>(null);

  // Handle crop change - updates crop position and zoom
  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  // Handle zoom change
  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  // Handle crop complete - stores the cropped area coordinates
  const onCropCompleteCallback = useCallback(
    (
      croppedArea: { x: number; y: number; width: number; height: number },
      croppedAreaPixels: CroppedAreaPixels,
    ) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  // Generate cropped image blob from the selected area
  const generateCroppedImage = useCallback(async () => {
    try {
      // Create a canvas element to draw the cropped image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx || !croppedAreaPixels) {
        throw new Error("Failed to get canvas context or cropped area");
      }

      // Create an image element from the source image
      const imageElement = new Image();
      imageElement.src = image;

      // Wait for image to load
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });

      // Set canvas size to the cropped area size
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped portion of the image onto the canvas
      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            onCropComplete(blob);
          } else {
            throw new Error("Failed to generate cropped image");
          }
        },
        "image/jpeg",
        0.9,
      ); // Use JPEG format with 90% quality
    } catch (error) {
      console.error("Error generating cropped image:", error);
      alert("Failed to crop image. Please try again.");
    }
  }, [image, croppedAreaPixels, onCropComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Crop Your Avatar
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Drag to move, scroll to zoom. The image will be cropped to a perfect
            square.
          </p>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-96 bg-gray-100">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1} // Force 1:1 aspect ratio
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteCallback}
            showGrid={true} // Show grid lines for better alignment
            objectFit="contain" // Ensure the entire image is visible
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                backgroundColor: "#f3f4f6",
              },
            }}
          />
        </div>

        {/* Zoom Slider */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={generateCroppedImage}
              className="flex-1"
            >
              Crop & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
