import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Button from "./Button";
import ImageCropper from "./ImageCropper";
import { generateAvatar } from "@/utils/avatar";
import { compressImage, isValidImageFile } from "@/utils/image-compression";

interface AvatarUploadProps {
  currentAvatarUrl?: string | null;
  userName?: string;
  onAvatarChange: (file: File | null) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onCropperOpenChange?: (open: boolean) => void;
}

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
  onAvatarChange,
  size = "md",
  disabled = false,
  onCropperOpenChange,
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detect iOS on component mount
  useEffect(() => {
    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      (window as Window & { opera?: string }).opera ||
      "";
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(userAgent) &&
      !(window as Window & { MSStream?: boolean }).MSStream;
    setIsIOS(isIOSDevice);
    console.log("iOS Detection:", { userAgent, isIOSDevice });
  }, []);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsFilePickerOpen(false);
      const file = event.target.files?.[0];
      if (file) {
        // Check if this might be a camera capture (file size, name, etc.)
        const fileName = file.name.toLowerCase();
        const isLikelyCameraCapture =
          fileName.includes("camera") ||
          fileName.includes("img_") ||
          fileName.includes("photo_") ||
          file.size < 10000; // Very small files are often camera captures

        if (isLikelyCameraCapture) {
          alert(
            "Please select a photo from your gallery instead of using the camera. Camera access is not supported."
          );
          event.target.value = "";
          return;
        }

        processSelectedFile(file);
      }
    } catch (error) {
      console.error("File selection error:", error);
      // Handle the case where the app returns from external camera
      alert(
        "There was an issue accessing the photo library. Please try again."
      );
    } finally {
      // Clear the input value to allow selecting the same file again
      event.target.value = "";
    }
  };

  const processSelectedFile = (file: File) => {
    try {
      // Validate the file
      if (!isValidImageFile(file)) {
        alert("Please select a valid image file (JPG, PNG, WebP) under 10MB.");
        return;
      }

      // Create preview URL for cropping
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
      setShowCropper(true);
      if (onCropperOpenChange) onCropperOpenChange(true);
    } catch (error) {
      console.error("Error processing selected file:", error);
      alert("There was an issue processing the image. Please try again.");
    }
  };

  const handleUploadClick = () => {
    if (disabled || isFilePickerOpen) return;

    try {
      setIsFilePickerOpen(true);

      // Try to force gallery access by creating a new input with specific attributes
      const galleryInput = document.createElement("input");
      galleryInput.type = "file";
      galleryInput.accept = "image/png,image/jpeg,image/jpg,image/webp";
      galleryInput.multiple = false;

      // Set attributes that might help force gallery
      galleryInput.setAttribute("data-capture", "none");
      galleryInput.setAttribute("data-accept", "image/*");

      galleryInput.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          // Check if this might be a camera capture
          const fileName = file.name.toLowerCase();
          const isLikelyCameraCapture =
            fileName.includes("camera") ||
            fileName.includes("img_") ||
            fileName.includes("photo_") ||
            file.size < 10000;

          if (isLikelyCameraCapture) {
            alert(
              "Please select a photo from your gallery instead of using the camera. Camera access is not supported."
            );
            setIsFilePickerOpen(false);
            document.body.removeChild(galleryInput);
            return;
          }

          processSelectedFile(file);
        }
        setIsFilePickerOpen(false);
        document.body.removeChild(galleryInput);
      };

      galleryInput.oncancel = () => {
        setIsFilePickerOpen(false);
        if (document.body.contains(galleryInput)) {
          document.body.removeChild(galleryInput);
        }
      };

      // Add to DOM and trigger
      galleryInput.style.display = "none";
      document.body.appendChild(galleryInput);
      galleryInput.click();
    } catch (error) {
      console.error("Error opening file picker:", error);
      setIsFilePickerOpen(false);
      alert("Unable to open file picker. Please try again.");
    }
  };

  // Handle crop completion - process the cropped image
  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      // Convert blob to file for compression
      const croppedFile = new File([croppedBlob], "cropped-avatar.jpg", {
        type: "image/jpeg",
      });

      // Compress the cropped image
      const compressedFile = await compressImage(croppedFile, {
        maxSizeMB: 0.5, // Keep avatars under 500KB
        maxWidthOrHeight: 400, // Reasonable size for avatars
      });

      // Create preview URL for the compressed image
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreviewUrl(previewUrl);

      // Call parent handler with the compressed file
      onAvatarChange(compressedFile);

      // Clean up
      setShowCropper(false);
      if (onCropperOpenChange) onCropperOpenChange(false);
      setSelectedImage(null);
      if (selectedImage) {
        URL.revokeObjectURL(selectedImage);
      }
    } catch (error) {
      console.error("Error processing cropped image:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle crop cancellation
  const handleCropCancel = () => {
    setShowCropper(false);
    if (onCropperOpenChange) onCropperOpenChange(false);
    setSelectedImage(null);
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Call parent with null to indicate removal
    onAvatarChange(null);
  };

  // Clear preview when currentAvatarUrl changes
  useEffect(() => {
    if (!currentAvatarUrl) {
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [currentAvatarUrl]);

  // Add error boundary for WebView context
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("WebView error:", event.error);
      // Don't show alert for every error, just log it
    };

    const handleFocus = () => {
      // Reset file picker state when app regains focus
      setIsFilePickerOpen(false);
    };

    const handleResume = () => {
      // Handle app resume from external apps
      setIsFilePickerOpen(false);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("resume", handleResume);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("resume", handleResume);
    };
  }, []);

  const displayUrl = previewUrl || currentAvatarUrl;
  const avatarData = generateAvatar(userName);

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        {/* Avatar Display */}
        <div className="relative">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt={`${userName || "User"} avatar`}
              width={size === "sm" ? 64 : size === "md" ? 80 : 128}
              height={size === "sm" ? 64 : size === "md" ? 80 : 128}
              className={`${sizeClasses[size]} rounded-full object-cover`}
            />
          ) : (
            <div
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold ${textSizes[size]}`}
              style={{
                backgroundColor: avatarData.bgColor,
              }}
            >
              {avatarData.letter}
            </div>
          )}

          {/* Upload overlay */}
          {!disabled && !isIOS && (
            <div
              className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleUploadClick}
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* iOS disabled overlay */}
          {!disabled && isIOS && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-full flex items-center justify-center opacity-100 cursor-not-allowed">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* File Input - Gallery only on all devices */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          multiple={false}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            disabled={disabled || isUploading || isFilePickerOpen || isIOS}
          >
            {isUploading
              ? "Обработка..."
              : isFilePickerOpen
                ? "Отваряне..."
                : isIOS
                  ? "Недостъпно на iOS"
                  : displayUrl
                    ? "Смяна на снимка"
                    : "Избор от галерия"}
          </Button>

          {displayUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemoveAvatar}
              disabled={disabled || isUploading}
              className="text-red-600 hover:text-red-700"
            >
              Премахване
            </Button>
          )}
        </div>

        {/* Upload Instructions */}
        <p className="text-xs text-gray-500 text-center">
          {isIOS
            ? "Смяната на профилна снимка не е достъпна на iOS устройства."
            : "Изберете &quot;Photo Library&quot; от менюто, не &quot;Camera&quot;. JPG, PNG, или WebP, максимум 10MB."}
        </p>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && selectedImage && (
        <ImageCropper
          image={selectedImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </>
  );
}
