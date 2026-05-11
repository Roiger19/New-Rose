// src/lib/upload.ts

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  // Reemplaza con tus datos de Cloudinary
  formData.append("upload_preset", "tu_preset_aqui"); 

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/tu_cloud_name_aqui/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Error al subir la imagen a Cloudinary");
  }

  const data = await response.json();
  return data.secure_url; // Esta es la URL que guardaremos en Firebase
};