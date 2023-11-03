import { Stack } from "@mui/material";
import TokenCard, { TokenCardProps } from "./TokenCard";
import * as React from "react";
import RedeemDialog from "./RedeemDialog";

interface TokenListItemProps {
  imageSrc: string;
  name: string;
  qtyLeft: number;
  id: string;
}

export default function TokenList({
  tokens,
}: {
  tokens: TokenListItemProps[];
}) {
  const [open, setOpen] = React.useState(false);
  const [productToRedeem, setProductToRedeem] =
    React.useState<null | TokenListItemProps>(null);

  const handleClickRedeem = (productToRedeem: TokenListItemProps) => {
    setOpen(true);
    setProductToRedeem(productToRedeem);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Stack spacing={2} sx={{ width: "100%", maxWidth: 345 }}>
        {tokens.map((token) => (
          <TokenCard
            key={token.id}
            imageSrc={token.imageSrc}
            name={token.name}
            qtyLeft={token.qtyLeft}
            onClickRedeem={() => handleClickRedeem(token)}
          />
        ))}
      </Stack>
      <RedeemDialog
        open={open}
        onClose={handleClose}
        productId={productToRedeem?.id}
        productName={productToRedeem?.name}
      />
    </>
  );
}
