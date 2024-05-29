import { Button, HStack, Input } from "@chakra-ui/react";
import React from "react";

type Props = {
  type: "usdc" | "usdcpol";
  tokenSymbol?: string;
  tokenBalance: string
  current: string;
  setValue: (value: string) => void;
  max?: string;
  value: string;
};

export default function SwapInput({
  type,
  tokenSymbol,
  tokenBalance,
  setValue,
  value,
  current,
  max,
}: Props) {
  return (
    <HStack w="full" bgColor="gray.700" rounded="2xl" px="5">
      <Input
        type="number"
        placeholder="0.0"
        fontSize="3xl"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        outline="none"
        py="10"
        isDisabled={current !== type}
        border="none"
        fontFamily="monospace"
        style={{width: '300px'}}
        _focus={{ boxShadow: "none" }}
      />
      {current === type && (
        <Button onClick={() => setValue(max || "0")}>Max</Button>
      )}
      <div style={{ marginLeft: '20px', width: current === type ? '250px' : '200px'}}>
        <p>{tokenSymbol} Balance:</p>
        <p>{tokenBalance}</p>
      </div>
    </HStack>
  );
}
