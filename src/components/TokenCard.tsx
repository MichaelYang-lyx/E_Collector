import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
export interface TokenCardProps {
  imageSrc: string;
  name: string;
  qtyLeft: number;
  onClickRedeem: () => void;
}

export default function TokenCard({
  imageSrc,
  name,
  qtyLeft,
  onClickRedeem,
}: TokenCardProps) {
  //database part








  return (
    <Card sx={{ display: "flex", width: "100%", maxWidth: 345 }}>
      <CardMedia
        component="img"
        sx={{ width: 80 }}
        image={imageSrc}
        title="green iguana"
      />
      <CardContent sx={{ py: 1, flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {qtyLeft} left
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={onClickRedeem}>
          Redeem
        </Button>
      </CardActions>
    </Card>
  );
}
