import Head from "next/head";
import Navbar from "../components/NavBar";
import SwapInput from "../components/SwapInput";
import CircuitBreaker from "../components/CircuitBreaker";
import UserInfo from "../components/UserInfo";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

import {
  Button,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { VITRUVEO_CHAIN, WRAP_CONTRACT, WRAP_CONTRACT_ABI } from "../const/details";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useState, useEffect } from "react";
import { _0xhashTestnet } from "@thirdweb-dev/chains";
import { ethers } from "ethers";

interface Props {
  chainSwitchHandler: Function
}

export default function Home(props:Props) {

  const toast = useToast();
  const address = useAddress();

  const [wrappedBalance, setWrappedBalance] = useState(0);
  const [unwrappedBalance, setUnwrappedBalance] = useState(0);

  const [swapValue, setSwapValue] = useState<string>("0");

  const [currentFrom, setCurrentFrom] = useState<string>("wrapped");
  const [loading, setLoading] = useState<boolean>(false);

  const vitruveoProvider = new ThirdwebSDK(VITRUVEO_CHAIN);
  const { contract: wrapContract } = useContract(WRAP_CONTRACT, JSON.parse(WRAP_CONTRACT_ABI));

  const { mutateAsync: wrap } = useContractWrite(wrapContract, "wrap"); 
  const { mutateAsync: unwrap } = useContractWrite(wrapContract, "unwrap"); 

  // Need to read from both networks regardless of which is connected so we fall back to SDK
  useEffect(() => {
    async function fetchBalances() {
      if (!address) {
        setWrappedBalance(0);
        setUnwrappedBalance(0);
        return;
      }

      try {
        const wrappedBalance = await wrapContract.call('balanceOf', [address]);
        setWrappedBalance(parseFloat(ethers.utils.formatEther(wrappedBalance)));

        const balance = await vitruveoProvider.getBalance(address);
        setUnwrappedBalance(Number(balance.displayValue));  
      } catch(e) {
        console.error(e);
      }
    }

    const interval = setInterval(() => {
      fetchBalances()
    }, loading ? 5000 : 15000);

    fetchBalances();

    return () => clearInterval(interval);
  
  }, [wrapContract, address, loading]);

  useEffect(() => {
    async function activateChain() {
      props.chainSwitchHandler(VITRUVEO_CHAIN);
    }
    activateChain();

  }, [currentFrom]);

  const inputInvalid = () => {
    let tooBig = true;
    if (currentFrom === 'wrapped') {
      tooBig = Number(swapValue) > wrappedBalance;
    } else {
      tooBig = Number(swapValue) > unwrappedBalance;
    }
    return Number(swapValue) <= 0 || tooBig;
  }


  const executeBridge = async () => {
    setLoading(true);
    try {
      const amount = Number(swapValue);
      if (currentFrom === "unwrapped") {
          
        await wrap({
          args: [],
          overrides: {
            value: ethers.utils.parseUnits(amount.toString(), 18)
          }
        });

        toast({
          status: "success",
          title: "Wrap Successful",
          description: `You have successfully wrapped your VTRU.`,
        });

      } else {
        await unwrap({ args: [ethers.utils.parseUnits(amount.toString(), 18)] });

        toast({
          status: "success",
          title: "Unwrap Successful",
          description: `You have successfully unwrapped your wVTRU.`,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast({
        status: "error",
        title: currentFrom === 'unwrapped' ? "Wrap Failed" : "Unwrap Failed",
        description:
          "The wrap failed due to circuit breaker constraints.",
      });
      setLoading(false);
    }
  };

  const headlineStyle={ fontSize: '24px', fontWeight: 600, margin: 'auto', marginBottom: '20px', color: 'white' }
  return (
    <div style={{
      backgroundImage: "url('/images/bg_vitruveo1.jpg')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      margin: 0,
      padding: 0,
      overflow: 'auto'
    }}>
      <Head>
        <title>Wrap/Unwrap VTRU</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <Flex
        direction="column"
        gap="5"
        mx="auto"
        w="90%"
      >
        <Flex
          direction="column"
          gap="5"
          mt="10"
          p="5"
          mx="auto"
          maxW={{ base: "sm", md: "xl" }}
          w="full"
          rounded="2xl"
          borderWidth="1px"
          borderColor="gray.600"
          bg="gray.800"
        >
          <h2 style={headlineStyle}>Wrap/Unwrap VTRU</h2>
          {/* <h3>NOTE: Wrapping VTRU will work only if amount is greater than 99, and individual/aggregate epoch Circuit Breaker limits have not been reached.</h3> */}
          <Flex
            direction={currentFrom === "wrapped" ? "column" : "column-reverse"}
            gap="3"
          >

            <SwapInput
              current={currentFrom}
              type="wrapped"
              max={wrappedBalance.toFixed(2)}
              value={String(Math.floor(Number(swapValue)).toFixed(0))}
              setValue={setSwapValue}
              tokenSymbol="wVTRU"
              tokenBalance={wrappedBalance.toFixed(2)}
              network="vitruveo"
            />

            <Button
              onClick={() => {
                currentFrom === "wrapped"
                  ? setCurrentFrom("unwrapped")
                  : setCurrentFrom("wrapped")
              }}
              maxW="5"
              mx="auto"
            >
              ↓
            </Button>

            <SwapInput
              current={currentFrom}
              type="unwrapped"
              max={unwrappedBalance.toFixed(2)}
              value={String(Math.floor(Number(swapValue)).toFixed(0))}
              setValue={setSwapValue}
              tokenSymbol="VTRU"
              tokenBalance={unwrappedBalance.toFixed(2)}
              network="vitruveo"
            />
          </Flex>


          {address ? (
            <Button
              onClick={executeBridge}
              py="7"
              fontSize="2xl"
              colorScheme="purple"
              rounded="xl"
              isDisabled={loading || inputInvalid()}
              style={{ fontWeight: 400, background: 'linear-gradient(106.4deg, rgb(255, 104, 192) 11.1%, rgb(104, 84, 249) 81.3%)', color: '#ffffff'}}
            >
              {loading ? <Spinner /> : currentFrom === "wrapped" ? "Unwrap" : "Wrap"}
            </Button>
          ) : (
            <ConnectWallet
              style={{ padding: "20px 0px", fontSize: "18px" }}
              theme="dark"
            />
          )}
        </Flex>
        {/* {
          typeof address != 'undefined' ?
              <Flex
                  direction="column"
                  gap="5"
                  p="5"
                  mx="auto"
                  maxW={{ base: "sm", md: "xl" }}
                  w="full"
                  rounded="2xl"
                  borderWidth="1px"
                  borderColor="gray.600"
                  bg="gray.800"
                >
                  <h2 style={headlineStyle}>User Constraints</h2>
                  <Flex
                    gap="3"
                    direction="column"
                  >
                      <UserInfo account={typeof address == 'undefined' ? '' : address} />
                  </Flex>

                </Flex>
                :
                <></>
        } */}
{/* 
          <Flex
            direction="column"
            gap="5"
            p="5"
            mx="auto"
            maxW={{ base: "sm", md: "xl" }}
            w="full"
            rounded="2xl"
            borderWidth="1px"
            borderColor="gray.600"
            bg="gray.800"
          >
            <h2 style={headlineStyle}>Circuit Breaker Analytics</h2>
            <Flex
              gap="3"
              direction="column"
            >
              <CircuitBreaker />
            </Flex>

          </Flex>
*/}
      </Flex>
      {/* <h2 style={{textAlign: 'center', padding: '5px', fontSize: '20px', fontWeight: 'bold', color: 'white'}}><a href="https://docs.google.com/spreadsheets/d/1JG5EuuEy5T4vxSiTR4ufN2NVEYw2hmpMeDwwcaa3qg8/edit?usp=sharing" target="_new">Circuit Breaker Constraints</a></h2> */}

      <div style={{textAlign: 'center', fontSize: '14px', marginTop: '5px'}}>Built with 💜 by <a href="https://www.vitruveo.xyz" target="_new">Vitruveo</a> and <a href="https://www.neoncircus.xyz/" target="_new">Neon Circus</a>.</div>
    </ div>
  );
}
