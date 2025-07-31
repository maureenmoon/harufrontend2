import imageCompression from "browser-image-compression";
import { supabase } from "../../api/supabaseClient"; // Fixed path

// Configuration
const SUPABASE_BUCKET_NAME = "harukcal"; // Your actual bucket name from Supabase dashboard

// Format date like YYMMDDHHMM (2-digit year, month, day, hour, minute)
const getTimestampPrefix = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // Get last 2 digits
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  return `${year}${month}${day}${hour}${minute}`;
};

// Create thumbnail from original image
const createThumbnail = async (file, maxWidth = 150, maxHeight = 150) => {
  const options = {
    maxSizeMB: 0.01, // 10KB max for thumbnails (very aggressive)
    maxWidthOrHeight: Math.min(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: "image/jpeg", // Convert to JPEG for smaller size
    quality: 0.6, // Lower quality for smaller size
    alwaysKeepResolution: false, // Allow resolution reduction
  };

  return await imageCompression(file, options);
};

// Create optimized main image
const createOptimizedImage = async (file, maxWidth = 800, maxHeight = 800) => {
  const options = {
    maxSizeMB: 0.1, // 100KB max for main images
    maxWidthOrHeight: Math.min(maxWidth, maxHeight),
    useWebWorker: true,
    fileType: "image/jpeg", // Convert to JPEG for smaller size
  };

  return await imageCompression(file, options);
};

// Generate filename with YYMMDDHHMM + original filename
const generateFileName = (originalFileName) => {
  const timestamp = getTimestampPrefix();
  const extension = originalFileName.split(".").pop().toLowerCase();
  const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, "");

  // Clean the original filename (remove special characters, limit length)
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9가-힣]/g, "_") // Replace special chars with underscore
    .substring(0, 20); // Limit to 20 characters

  return `${timestamp}_${cleanName}.${extension}`;
};

export async function compressAndUploadImage(
  file,
  folder = "meal",
  createThumbnailFlag = true
) {
  if (!file || !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    throw new Error("Only PNG or JPG files are supported.");
  }

  try {
    console.log("🖼️ Starting image optimization...");
    console.log("📁 Original file size:", (file.size / 1024).toFixed(2), "KB");

    // Generate optimized filename
    const optimizedFileName = generateFileName(file.name);
    console.log("📝 Generated filename:", optimizedFileName);

    // Create optimized main image
    const optimizedImage = await createOptimizedImage(file);
    console.log(
      "📦 Optimized image size:",
      (optimizedImage.size / 1024).toFixed(2),
      "KB"
    );

    // Upload main image to meal folder
    const mainImagePath = `${folder}/${optimizedFileName}`;
    const { data: mainData, error: mainError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(mainImagePath, optimizedImage, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (mainError) throw mainError;

    // Manually construct the main image URL to avoid corruption
    // Use environment variable directly if client URL is corrupted
    const baseUrl =
      import.meta.env.VITE_SUPABASE_URL ||
      "https://admehgvqowpibiuwugpv.supabase.co";
    const mainImageURL = `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${mainImagePath}`;

    let thumbnailURL = null;

    // Create and upload thumbnail if requested
    if (createThumbnailFlag) {
      console.log("🖼️ Creating thumbnail...");
      // Use original file with very aggressive compression for maximum size reduction
      const thumbnail = await createThumbnail(file);
      console.log(
        "📦 Thumbnail size:",
        (thumbnail.size / 1024).toFixed(2),
        "KB"
      );

      // Create thumbnail filename with "_thumb" suffix
      const thumbnailFileName = optimizedFileName.replace(
        /\.(jpg|jpeg|png)$/i,
        "_thumb.$1"
      );
      const thumbnailPath = `${folder}/thumbnails/${thumbnailFileName}`;
      const { data: thumbData, error: thumbError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(thumbnailPath, thumbnail, {
          cacheControl: "3600",
          upsert: true,
          contentType: "image/jpeg",
        });

      if (thumbError) throw thumbError;

      // Manually construct the thumbnail URL to avoid corruption
      thumbnailURL = `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${thumbnailPath}`;
    }

    console.log("✅ Image upload completed successfully");
    console.log(
      "📊 Compression ratio:",
      ((1 - optimizedImage.size / file.size) * 100).toFixed(1) + "%"
    );

    return {
      mainImageUrl: mainImageURL,
      thumbnailUrl: thumbnailURL,
      fileName: optimizedFileName,
      originalSize: file.size,
      optimizedSize: optimizedImage.size,
    };
  } catch (err) {
    console.error("❌ Image upload failed:", err);
    throw err;
  }
}

// Upload profile image with specific optimizations
export async function uploadProfileImage(file) {
  if (!file || !["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    throw new Error("Only PNG or JPG files are supported.");
  }

  try {
    console.log("👤 Starting profile image optimization...");
    console.log("📁 Original file size:", (file.size / 1024).toFixed(2), "KB");

    // Generate optimized filename
    const optimizedFileName = generateFileName(file.name);
    console.log("📝 Generated filename:", optimizedFileName);

    // Create optimized profile image (smaller for profile pics)
    const optimizedImage = await createOptimizedImage(file, 400, 400);
    console.log(
      "📦 Optimized profile image size:",
      (optimizedImage.size / 1024).toFixed(2),
      "KB"
    );

    // Upload profile image to member folder
    const profileImagePath = `member/${optimizedFileName}`;
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(profileImagePath, optimizedImage, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (error) throw error;

    // Debug: Check what URL is being used
    console.log("🔧 DEBUG: Supabase URL from client:", supabase.supabaseUrl);
    console.log(
      "🔧 DEBUG: Supabase URL from env:",
      import.meta.env.VITE_SUPABASE_URL
    );

    // Manually construct the public URL to avoid corruption
    // Use environment variable directly if client URL is corrupted
    const baseUrl =
      import.meta.env.VITE_SUPABASE_URL ||
      "https://admehgvqowpibiuwugpv.supabase.co";
    const publicURL = `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${profileImagePath}`;

    // Create and upload thumbnail
    console.log("🖼️ Creating profile thumbnail...");
    // Use original file with very aggressive compression for maximum size reduction
    const thumbnail = await createThumbnail(file, 150, 150);
    console.log("📦 Thumbnail size:", (thumbnail.size / 1024).toFixed(2), "KB");

    // Create thumbnail filename with "_thumb" suffix
    const thumbnailFileName = optimizedFileName.replace(
      /\.(jpg|jpeg|png)$/i,
      "_thumb.$1"
    );
    const thumbnailPath = `member/thumbnails/${thumbnailFileName}`;
    const { data: thumbData, error: thumbError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .upload(thumbnailPath, thumbnail, {
        cacheControl: "3600",
        upsert: true,
        contentType: "image/jpeg",
      });

    if (thumbError) {
      console.warn(
        "⚠️ Thumbnail upload failed, but main image was uploaded:",
        thumbError
      );
    } else {
      console.log("✅ Thumbnail uploaded successfully");
    }

    // Manually construct the thumbnail URL
    const thumbnailURL = `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${thumbnailPath}`;

    console.log("✅ Profile image upload completed successfully");
    console.log("🔗 Generated public URL:", publicURL);
    console.log("🔗 Generated thumbnail URL:", thumbnailURL);
    console.log(
      "📊 Compression ratio:",
      ((1 - optimizedImage.size / file.size) * 100).toFixed(1) + "%"
    );

    const result = {
      fileUrl: publicURL,
      thumbnailUrl: thumbnailURL,
      fileName: optimizedFileName,
      originalSize: file.size,
      optimizedSize: optimizedImage.size,
    };

    console.log("🔧 DEBUG: Result object before return:", result);
    console.log("🔧 DEBUG: Result fileUrl before return:", result.fileUrl);

    return result;
  } catch (err) {
    console.error("❌ Profile image upload failed:", err);
    throw err;
  }
}

// Utility function to get thumbnail URL from main image URL
export const getThumbnailUrl = (mainImageUrl) => {
  if (!mainImageUrl) return null;

  console.log("🔧 getThumbnailUrl - Input URL:", mainImageUrl);

  // For meal images: replace 'meal' with 'meal/thumbnails'
  if (mainImageUrl.includes("/meal/")) {
    const result = mainImageUrl.replace("/meal/", "/meal/thumbnails/");
    console.log("🔧 getThumbnailUrl - Meal image result:", result);
    return result;
  }

  // For member images: replace 'member' with 'member/thumbnails' and add "_thumb" suffix
  if (mainImageUrl.includes("/member/")) {
    // Extract the filename from the URL
    const urlParts = mainImageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];
    console.log("🔧 getThumbnailUrl - Extracted filename:", filename);

    // Create thumbnail filename with "_thumb" suffix
    const thumbnailFilename = filename.replace(
      /\.(jpg|jpeg|png)$/i,
      "_thumb.$1"
    );
    console.log("🔧 getThumbnailUrl - Thumbnail filename:", thumbnailFilename);

    // Replace the filename in the URL
    urlParts[urlParts.length - 1] = thumbnailFilename;

    // Insert "thumbnails" after "member" in the path
    const memberIndex = urlParts.findIndex((part) => part === "member");
    if (memberIndex !== -1) {
      urlParts.splice(memberIndex + 1, 0, "thumbnails");
    }

    const result = urlParts.join("/");
    console.log("🔧 getThumbnailUrl - Member image result:", result);
    return result;
  }

  console.log(
    "🔧 getThumbnailUrl - No pattern matched, returning original:",
    mainImageUrl
  );
  return mainImageUrl;
};

// Utility function to get main image URL from thumbnail URL
export const getMainImageUrl = (thumbnailUrl) => {
  if (!thumbnailUrl) return null;

  // For meal thumbnails: replace 'meal/thumbnails' with 'meal'
  if (thumbnailUrl.includes("/meal/thumbnails/")) {
    return thumbnailUrl.replace("/meal/thumbnails/", "/meal/");
  }

  // For member thumbnails: replace 'member/thumbnails' with 'member'
  if (thumbnailUrl.includes("/member/thumbnails/")) {
    return thumbnailUrl.replace("/member/thumbnails/", "/member/");
  }

  return thumbnailUrl;
};

// Delete image from Supabase storage
export const deleteImage = async (imageUrl) => {
  if (!imageUrl) {
    console.log("⚠️ No image URL provided for deletion");
    return;
  }

  try {
    console.log("🗑️ Attempting to delete image:", imageUrl);

    // Extract file path from URL
    const urlParts = imageUrl.split("/");
    const bucketIndex = urlParts.findIndex(
      (part) => part === SUPABASE_BUCKET_NAME
    );

    if (bucketIndex === -1) {
      console.log("⚠️ Could not extract file path from URL");
      return;
    }

    // Get the file path after the bucket name
    const filePath = urlParts.slice(bucketIndex + 1).join("/");
    console.log("📁 Extracted file path:", filePath);

    // Delete the main image
    const { error: mainError } = await supabase.storage
      .from(SUPABASE_BUCKET_NAME)
      .remove([filePath]);

    if (mainError) {
      console.error("❌ Error deleting main image:", mainError);
    } else {
      console.log("✅ Main image deleted successfully");
    }

    // Also try to delete thumbnail if it exists
    const thumbnailPath = getThumbnailUrl(imageUrl);
    if (thumbnailPath && thumbnailPath !== imageUrl) {
      const thumbnailUrlParts = thumbnailPath.split("/");
      const thumbnailFilePath = thumbnailUrlParts
        .slice(
          thumbnailUrlParts.findIndex((part) => part === SUPABASE_BUCKET_NAME) +
            1
        )
        .join("/");

      console.log("🗑️ Attempting to delete thumbnail:", thumbnailFilePath);
      const { error: thumbnailError } = await supabase.storage
        .from(SUPABASE_BUCKET_NAME)
        .remove([thumbnailFilePath]);

      if (thumbnailError) {
        console.log(
          "⚠️ Thumbnail not found or already deleted:",
          thumbnailError.message
        );
      } else {
        console.log("✅ Thumbnail deleted successfully");
      }
    }
  } catch (error) {
    console.error("❌ Error deleting image:", error);
    // Don't throw error - we don't want image deletion to break the upload process
  }
};

// Upload profile image with automatic cleanup of old image
export async function uploadProfileImageWithCleanup(file, oldImageUrl = null) {
  try {
    // Upload new image first
    const uploadResult = await uploadProfileImage(file);

    console.log(
      "🔧 DEBUG: Upload result from uploadProfileImage:",
      uploadResult
    );
    console.log("🔧 DEBUG: Upload result fileUrl:", uploadResult.fileUrl);

    // If upload successful and we have an old image, delete it
    if (uploadResult.fileUrl && oldImageUrl) {
      console.log("🧹 Cleaning up old profile image...");
      await deleteImage(oldImageUrl);
    }

    console.log("🔧 DEBUG: Final result before return:", uploadResult);
    console.log("🔧 DEBUG: Final result fileUrl:", uploadResult.fileUrl);

    return uploadResult;
  } catch (error) {
    console.error("❌ Profile image upload with cleanup failed:", error);
    throw error;
  }
}

// Generate main image URL from filename stored in profile_image_url
export const getImageUrlFromFilename = (filename, folder = "member") => {
  if (!filename) return null;
  const baseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://admehgvqowpibiuwugpv.supabase.co";
  return `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${folder}/${filename}`;
};

// Generate thumbnail filename from main filename
export const getThumbnailFilename = (mainFilename) => {
  if (!mainFilename) return null;
  return mainFilename.replace(/\.(jpg|jpeg|png)$/i, "_thumb.$1");
};

// Generate thumbnail URL from main filename
export const getThumbnailUrlFromFilename = (
  mainFilename,
  folder = "member"
) => {
  if (!mainFilename) return null;
  const thumbnailFilename = getThumbnailFilename(mainFilename);
  const baseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    "https://admehgvqowpibiuwugpv.supabase.co";
  return `${baseUrl}/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/${folder}/thumbnails/${thumbnailFilename}`;
};
