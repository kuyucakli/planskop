import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// List of images to upload
const images = [
  {
    name: "thom-yorke",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWp38_jR9-_WsksYnBy6lPsu_zJcVczDsks4oo5wcy5m8OUBZy-eUT0HP5vjkIbnjvpNepBmFrwWu1SKI70duKsg",
  },
  {
    name: "albert-camus",
    url: "https://images.mubicdn.net/images/cast_member/46768/cache-5049-1478101707/image-w856.jpg",
  },
  {
    name: "orhan-pamuk",
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDx0Zmgu5iYfEh0ZlF1ZHXucyJFD6Q7MNCSA&s",
  },
  {
    name: "david-hockney",
    url: "https://ichef.bbci.co.uk/images/ic/640x360/p0l2zhpl.jpg",
  },
];

// Function to upload images
async function uploadImages() {
  for (const image of images) {
    try {
      const result = await cloudinary.uploader.upload(image.url, {
        folder: "famous_people",
        public_id: image.name,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      });
      console.log(`Uploaded ${image.name}: ${result.secure_url}`);
    } catch (error) {
      console.error(`Error uploading ${image.name}:`, error);
    }
  }
}

uploadImages();
