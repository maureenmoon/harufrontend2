import imageCompression from "browser-image-compression";
import { supabase } from "../api/supabaseClient"; // adjust path as needed

// Format date like YYYYMMDDHHMM
const getTimestampPrefix = () => {
  const now = new Date();
  return now.toISOString().replace(/[-:]/g, "").slice(0, 12);
};

export async function compressAndUploadImage(file, folder = "meal") {
  if (!file || !["image/png", "image/jpeg"].includes(file.type)) {
    throw new Error("Only PNG or JPG files are supported.");
  }

  const options = {
    maxSizeMB: 0.2, // compress to under 200KB
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    const extension = file.name.split(".").pop().toLowerCase();
    const timestampedName = `${getTimestampPrefix()}-${file.name}`;
    const path = `${folder}/${timestampedName}`;

    const { data, error } = await supabase.storage
      .from("your-bucket-name") // replace with your Supabase bucket name
      .upload(path, compressedFile, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    const { data: publicURL } = supabase.storage
      .from("your-bucket-name")
      .getPublicUrl(path);

    return publicURL.publicUrl;
  } catch (err) {
    console.error("Image upload failed:", err);
    throw err;
  }
}
