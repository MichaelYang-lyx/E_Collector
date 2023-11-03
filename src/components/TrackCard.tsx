import { CardActions } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export interface TrackCardProps {
  imageSrc: string;
  name: string;
  qty: number;
  status: string;
}

export default function TrackCard({
  imageSrc,
  name,
  qty,
  status,
}: TrackCardProps) {
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
          {qty} {status}
        </Typography>
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
