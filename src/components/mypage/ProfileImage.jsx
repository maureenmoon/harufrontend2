import React, { useState, useRef } from "react";
import {
  getImageUrlFromFilename,
  getThumbnailUrlFromFilename,
} from "../../utils/imageUpload/uploadImageToSupabase";

export default function ProfileImage({
  photo,
  currentImage,
  nickname,
  onImageChange,
  readOnly = false,
  size = "medium",
  useThumbnail = true,
}) {
  const getInitial = (name) => name?.charAt(0).toUpperCase();
  const fileInputRef = useRef(null);

  // Simple approach: photo is always a filename, generate URLs from it
  // TEMPORARY FIX: Use direct URL construction instead of the functions
  const baseUrl = "https://admehgvqowpibiuwugpv.supabase.co";
  const imageUrl = photo
    ? `${baseUrl}/storage/v1/object/public/harukcal/member/${photo}`
    : null;
  const thumbnailUrl =
    photo && useThumbnail
      ? `${baseUrl}/storage/v1/object/public/harukcal/member/thumbnails/${photo.replace(
          /\.(jpg|jpeg|png)$/i,
          "_thumb.$1"
        )}`
      : null;
  const displayUrl = thumbnailUrl || imageUrl;

  // Add this debug logging
  console.log("🔧 DEBUG: ProfileImage - photo value:", photo);
  console.log("🔧 DEBUG: ProfileImage - imageUrl result:", imageUrl);
  console.log("🔧 DEBUG: ProfileImage - thumbnailUrl result:", thumbnailUrl);
  console.log("🔧 DEBUG: ProfileImage - displayUrl result:", displayUrl);

  // console.log(
  //   "🔧 DEBUG: VITE_SUPABASE_URL:",
  //   import.meta.env.VITE_SUPABASE_URL
  // );
  // console.log("🔧 DEBUG: SUPABASE_BUCKET_NAME:", "harukcal");

  // Test manual URL construction with correct URL
  if (photo) {
    const correctBaseUrl = "https://admehgvqowpibiuwugpv.supabase.co";
    const manualUrl = `${correctBaseUrl}/storage/v1/object/public/harukcal/member/${photo}`;
    const manualThumbUrl = `${correctBaseUrl}/storage/v1/object/public/harukcal/member/thumbnails/${photo.replace(
      /\.(jpg|jpeg|png)$/i,
      "_thumb.$1"
    )}`;

    console.log("🔧 DEBUG: Manual URL with correct base:", manualUrl);
    console.log("🔧 DEBUG: Manual thumbnail URL:", manualThumbUrl);

    // Test if this URL works
    fetch(manualUrl, { method: "HEAD" })
      .then((response) => {
        console.log("🔧 DEBUG: Manual URL test - Status:", response.status);
      })
      .catch((error) => {
        console.log("🔧 DEBUG: Manual URL test - Error:", error);
      });
  }

  // Test manual URL construction
  if (photo) {
    const baseUrl =
      import.meta.env.VITE_SUPABASE_URL ||
      "https://admehgvqowpibiuwugpv.supabase.co";
    const manualUrl = `${baseUrl}/storage/v1/object/public/harukcal/member/${photo}`;
    console.log("🔧 DEBUG: Manual URL construction:", manualUrl);
  }

  // Test the functions directly
  if (photo) {
    const testImage = getImageUrlFromFilename(photo);
    const testThumb = getThumbnailUrlFromFilename(photo);
    console.log("🔧 DEBUG: Direct function test - imageUrl:", testImage);
    console.log("🔧 DEBUG: Direct function test - thumbnailUrl:", testThumb);
  }

  // Test if the image URL is accessible
  if (displayUrl) {
    fetch(displayUrl, { method: "HEAD" })
      .then((response) => {
        console.log(
          "🔍 Image URL accessibility test:",
          displayUrl,
          "Status:",
          response.status
        );
      })
      .catch((error) => {
        console.error(
          "❌ Image URL accessibility test failed:",
          displayUrl,
          error
        );
      });
  }

  // Size classes
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24 sm:w-28 sm:h-28",
    large: "w-32 h-32 sm:w-36 sm:h-36",
  };

  // State for image loading
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log("ProfileImage - Image loaded successfully:", displayUrl);
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.error("ProfileImage - Failed to load image:", displayUrl);
    setImageError(true);
    setImageLoaded(false);
    e.target.style.display = "none";
  };

  const handleImageClick = () => {
    if (!readOnly && onImageChange) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
    // Reset the input
    e.target.value = "";
  };

  return (
    <div className="relative text-center">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Clickable image or placeholder */}
      <div
        className={`${sizeClasses[size]} mx-auto rounded-full cursor-pointer transition-transform hover:scale-105`}
        onClick={handleImageClick}
      >
        {displayUrl && !imageError ? (
          <img
            src={displayUrl}
            alt="profile"
            className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full rounded-full bg-green-300 flex items-center justify-center text-white font-bold text-3xl`}
          >
            {getInitial(nickname)}
          </div>
        )}

        {/* Loading indicator */}
        {displayUrl && !imageLoaded && !imageError && (
          <div
            className={`absolute inset-0 rounded-full bg-gray-200 flex items-center justify-center animate-pulse`}
          >
            <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Upload button */}
      {onImageChange && !readOnly && (
        <button
          onClick={handleImageClick}
          className="mt-2 text-sm text-blue-500 hover:underline"
        >
          사진 변경
        </button>
      )}
    </div>
  );
}
