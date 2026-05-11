// src/lib/cloudinary.ts

/**
 * EDUCACIÓN: Promise.all permite que las 3 fotos se suban al mismo tiempo.
 * Esto hace que el proceso sea mucho más rápido para el usuario.
 */
export const uploadMultipleToCloudinary = async (files: File[]): Promise<string[]> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset!);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Error en la subida a Cloudinary");
    const data = await response.json();
    return data.secure_url;
  });

  return Promise.all(uploadPromises);
};