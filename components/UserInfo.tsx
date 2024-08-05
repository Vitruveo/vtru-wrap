import { Button, HStack, Input } from "@chakra-ui/react";
import React from "react";
import { VITRUVEO_CHAIN, WRAP_CONTRACT, WRAP_CONTRACT_ABI } from "../const/details";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState, useEffect } from "react";
import { _0xhashTestnet } from "@thirdweb-dev/chains";

export default function UserInfo({account}:any) {
  const DECIMALS = Math.pow(10,18);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [lastEpoch, setLastEpoch] = useState(0);
  const [nextEpoch, setNextEpoch] = useState(0);
  const vitruveoProvider = new ThirdwebSDK(VITRUVEO_CHAIN);
  async function fetchStats() {
    if (account !== '') {
      if (!loaded) {
      try {
        setLoaded(true);
            const wrapContract = await vitruveoProvider.getContract(WRAP_CONTRACT, JSON.parse(WRAP_CONTRACT_ABI));
            const userInfo = await wrapContract.call('userInfo', [account]);
            setLastEpoch(Number(userInfo[1]));
            setNextEpoch(Number(userInfo[2]));
    } catch(e) {
      console.error(e);
    }
  }
  }
}

  const interval = setInterval(() => {
    fetchStats()
  }, 5000);


  fetchStats();

  return (
    <table className="stats">
      
      <tr>
        <th className="statLabel">Last User Wrap Block</th>
        <td className="statValue">{lastEpoch.toLocaleString()}</td>
        <td className="statInfo">Last block user wrapped.</td>
      </tr>

      <tr>
        <th className="statLabel">Next User Wrap Block</th>
        <td className="statValue">{nextEpoch.toLocaleString()}</td>
        <td className="statInfo">Next block user can wrap</td>
      </tr>

    </table>
  );
}
