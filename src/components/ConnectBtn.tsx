import Button from "@mui/material/Button";

export default function ConnectBtn({
  btnVariant,
  onConnect,
  color,
}: {
  btnVariant?: "contained" | undefined;
  onConnect: (connected: boolean) => void;
  color?: "inherit" | undefined;
}) {
  return (
    <Button variant={btnVariant} onClick={() => onConnect(true)} color={color}>
      Connect
    </Button>
  );
}
