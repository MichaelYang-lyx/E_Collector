import React, { useState } from "react";
import { Button, Card, CardMedia, Typography } from "@mui/material";

export default function ImageUploader() {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImage(reader.result as string);
      };
    }
  };

  return (
    <Card
      sx={{
        height: 200,
        width: "100%",
      }}
    >
      <label htmlFor="image-upload">
        <CardMedia
          component="img"
          image={image ? image : "images/placeholder.webp"}
          alt="uploaded image"
          sx={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="image-upload"
      />
    </Card>
  );
}
