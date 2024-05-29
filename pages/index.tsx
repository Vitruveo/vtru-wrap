import Head from "next/head";
import Navbar from "../components/NavBar";
import SwapInput from "../components/SwapInput";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import {
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { POLYGON_CHAIN, VITRUVEO_CHAIN, VIA_POLYGON_CONTRACT, VIA_VITRUVEO_CONTRACT, USDCPOL_TOKEN_CONTRACT, USDC_TOKEN_CONTRACT, VIA_ABI, USDC_ABI } from "../const/details";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
  useNetworkMismatch,
  useSwitchChain
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";

export default function Home({ chainSwitchHandler }) {

  const toast = useToast();
  const address = useAddress();
  const isMismatched = useNetworkMismatch();
  const switchChain = useSwitchChain();

  const usdcAbi = JSON.parse(USDC_ABI);
  const viaAbi = JSON.parse(VIA_ABI);

  const [usdcBalance, setUsdcBalance] = useState(0);
  const [usdcPolBalance, setUsdcPolBalance] = useState(0);
  const [usdcAllowance, setUsdcAllowance] = useState(0);
  const [usdcPolAllowance, setUsdcPolAllowance] = useState(0);
  
  const [usdcValue, setUsdcValue] = useState<string>("0");

  const [currentFrom, setCurrentFrom] = useState<string>("usdc");
  const [loading, setLoading] = useState<boolean>(false);

  const polygonProvider = new ThirdwebSDK(POLYGON_CHAIN);
  const vitruveoProvider = new ThirdwebSDK(VITRUVEO_CHAIN);

  
  // Need to read from both networks regardless of which is connected so we fall back to SDK
  useEffect(() => {
    async function fetchBalances() {
    
      const polygonUSDC = await polygonProvider.getContract(USDC_TOKEN_CONTRACT);
      const vitruveoUSDC = await vitruveoProvider.getContract(USDCPOL_TOKEN_CONTRACT);
      
      setUsdcBalance(await polygonUSDC.call('balanceOf', [address]));
      setUsdcPolBalance(await vitruveoUSDC.call('balanceOf', [address]));

      setUsdcAllowance(await polygonUSDC.call('allowance', [address, VIA_POLYGON_CONTRACT]));
      setUsdcPolAllowance(await vitruveoUSDC.call('allowance', [address, VIA_VITRUVEO_CONTRACT]));      
    }
      if (!address) {
        setUsdcBalance(0);
        setUsdcPolBalance(0);
      } else {
        fetchBalances();
      }  
  }, [address]);

  useEffect(() => {
    async function switchChain() {
      if (currentFrom === "usdc") {
        chainSwitchHandler(POLYGON_CHAIN);
      } else {
        chainSwitchHandler(VITRUVEO_CHAIN);       
      }
    }
    switchChain();

  }, [currentFrom]);

  const toDisplay = (value:number) => {
    return (value/10**6).toFixed(2);
  }

  // Approve Polygon
  const { contract: usdcContract } = useContract(USDC_TOKEN_CONTRACT, usdcAbi );
  const { mutateAsync: approveUsdcSpending } = useContractWrite(usdcContract, "approve");

  // Bridge Polygon
  const { contract: viaPolygonContract } = useContract(VIA_POLYGON_CONTRACT, viaAbi );
  const { mutateAsync: bridgeUSDCToUSDCPOL } = useContractWrite(viaPolygonContract, "bridge");

  // Approve Vitruveo
  const { contract: usdcPolContract } = useContract(USDCPOL_TOKEN_CONTRACT, usdcAbi);
  const { mutateAsync: approveUsdcPolSpending } = useContractWrite(usdcPolContract, "approve");        

  // Bridge Vitruveo
  const { contract: viaVitruveoContract } = useContract(VIA_VITRUVEO_CONTRACT, viaAbi );
  const { mutateAsync: bridgeUSDCPOLToUSDC } = useContractWrite(viaVitruveoContract, "bridge");      

  const executeBridge = async () => {
    setLoading(true);
    try {
      const amount = Number(usdcValue) * 10**6;
      if (currentFrom === "usdc") {
        if (isMismatched) {
          await switchChain(POLYGON_CHAIN.chainId);
        }
          
        if (Number(usdcAllowance) < amount) {
          await approveUsdcSpending({args: [VIA_POLYGON_CONTRACT, amount] });
        }

        await bridgeUSDCToUSDCPOL({ args: [address, amount] });

        toast({
          status: "success",
          title: "Bridge Successful",
          description: `You have successfully bridged your USDC from Polygon to USDC.pol on Vitruveo`,
        });
      } else {
        if (!isMismatched) {
          await switchChain(VITRUVEO_CHAIN.chainId);
        }
        if (Number(usdcPolAllowance) < amount) {
          await approveUsdcPolSpending({ args: [VIA_VITRUVEO_CONTRACT, amount] });
        }
        await bridgeUSDCPOLToUSDC({ args: [address, amount] });

        toast({
          status: "success",
          title: "Bridge Successful",
          description: `You have successfully bridged your USDC.pol from Vitruveo to USDC on Polygon`,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: "Bridge Failed",
        description:
          "There was an error. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Vitruveo USDC Bridge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Flex
        direction="column"
        gap="5"
        mt="40"
        p="5"
        mx="auto"
        maxW={{ base: "sm", md: "xl" }}
        w="full"
        rounded="2xl"
        borderWidth="1px"
        borderColor="gray.600"
      >
              <h2 style={{fontSize: '24px', fontWeight: 600, margin: 'auto', marginBottom: '20px'}}>Vitruveo USDC Bridge</h2>
        <p style={{marginBottom: 10}}>The Vitruveo USDC Bridge is a fast and easy way to bridge USDC (Polygon) to/from USDC.pol (Vitruveo).</p>
        <Flex
          direction={currentFrom === "usdc" ? "column" : "column-reverse"}
          gap="3"
        >
          <SwapInput
            current={currentFrom}
            type="usdc"
            max={toDisplay(usdcBalance)}
            value={usdcValue}
            setValue={setUsdcValue}
            tokenSymbol="USDC"
            tokenBalance={toDisplay(usdcBalance)}
          />

          <Button
            onClick={() =>
              currentFrom === "usdc"
                ? setCurrentFrom("usdcpol")
                : setCurrentFrom("usdc")
            }
            maxW="5"
            mx="auto"
          >
            ↓
          </Button>

          <SwapInput
            current={currentFrom}
            type="usdcpol"
            max={toDisplay(usdcPolBalance)}
            value={usdcValue}
            setValue={setUsdcValue}
            tokenSymbol="USDC.pol"
            tokenBalance={toDisplay(usdcPolBalance)}
            />
        </Flex>

        {address ? (
          <Button
            onClick={executeBridge}
            py="7"
            fontSize="2xl"
            colorScheme="purple"
            rounded="xl"
            isDisabled={loading}
            style={{ fontWeight: 200, backgroundColor: '#4a2367', color: '#ffffff'}}
          >
            <img src='/images/usdc-logo.png' style={{width: '30px', marginRight: '10px'}} />
            {loading ? <Spinner /> : " Bridge USDC"}
          </Button>
        ) : (
          <ConnectWallet
            style={{ padding: "20px 0px", fontSize: "18px" }}
            theme="dark"
          />
        )}
        <p><sup>*</sup> Each bridge transfer takes 1-2 mins and costs US$0.25 plus gas.</p>
      </Flex>
    </>
  );
}
