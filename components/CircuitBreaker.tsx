import { Button, HStack, Input } from "@chakra-ui/react";
import React from "react";
import { VITRUVEO_CHAIN, WRAP_CONTRACT, WRAP_CONTRACT_ABI } from "../const/details";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState, useEffect } from "react";
import { _0xhashTestnet } from "@thirdweb-dev/chains";

export default function CircuitBreaker() {
  const DECIMALS = Math.pow(10,18);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [price, setPrice] = useState(0);
  const [totalEpochWrapLimit, setTotalEpochWrapLimit] = useState(0);
  const [userPeriodWrapLimit, setUserPeriodWrapLimit] = useState(0);
  const [epochPeriod, setEpochPeriod] = useState(0);
  const [totalWrapped, setTotalWrapped] = useState(0);
  const [totalEpochWrapped, setTotalEpochWrapped] = useState(0);
  const [nextEpoch, setNextEpoch] = useState(0);
  const vitruveoProvider = new ThirdwebSDK(VITRUVEO_CHAIN);

  async function fetchStats() {

    if (!loaded) {
      try {
        setLoaded(true);

      const wrapContract = await vitruveoProvider.getContract(WRAP_CONTRACT, JSON.parse(WRAP_CONTRACT_ABI));
      const cbInfo = await wrapContract.call('circuitBreakerInfo');
      setNextEpoch(Number(await wrapContract.call('epochNextBlock')));
      setPrice(Number(cbInfo[0])/100);
      setTotalEpochWrapLimit(Number(cbInfo[1]));
      setTotalEpochWrapped(Number(cbInfo[5]));
      setTotalWrapped(Number(cbInfo[4]));
      setUserPeriodWrapLimit(Number(cbInfo[2]));
      setEpochPeriod(Number((Number(cbInfo[3])*5)/3600));

    } catch(e) {
      console.error(e);
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
        <th className="statLabel">$wVTRU Price</th>
        <td className="statValue">${price.toFixed(2)}</td>
        <td className="statInfo">Current price of VTRU rounded to $0.10</td>
      </tr>

      <tr>
        <th className="statLabel">Total Wrapped</th>
        <td className="statValue">{Math.round(totalWrapped).toLocaleString()}</td>
        <td className="statInfo">Total VTRU wrapped in contract</td>
      </tr>

      <tr>
        <th className="statLabel">Epoch Total Limit</th>
        <td className="statValue">{totalEpochWrapLimit.toLocaleString()}</td>
        <td className="statInfo">Combined VTRU wrap limit for all users in 24 hours</td>
      </tr>

      <tr>
        <th className="statLabel">Epoch Total Wrapped</th>
        <td className="statValue">{Math.round(totalEpochWrapped).toLocaleString()}</td>
        <td className="statInfo">Actual VTRU wrapped in 24 hours</td>
      </tr>

      <tr>
        <th className="statLabel">Next Epoch Start Block</th>
        <td className="statValue">{nextEpoch.toLocaleString()}</td>
        <td className="statInfo">Next epoch starts when block number is evenly divisible by 17280</td>
      </tr>


      <tr>
        <th className="statLabel">Current User Period</th>
        <td className="statValue">{parseInt(String(epochPeriod))}</td>
        <td className="statInfo">User cooldown period — hours to wait until wrap is allowed</td>
      </tr>

      <tr>
        <th className="statLabel">Current User Limit</th>
        <td className="statValue">{userPeriodWrapLimit.toLocaleString()}</td>
        <td className="statInfo">VTRU wrap limit for each user within the User Period</td>
      </tr>

    </table>
  );
}
