import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
// import data from "../deployments/chain-31337/deployed_addresses.json";

import {
  MIN_DELAY,
  QUORUM_PERCENTAGE,
  VOTING_DELAY,
  VOTING_PERIOD,
} from "../../helper-constants";

const Deployer = buildModule("DAOs", (m) => {
  const governorToken = m.contract("GovernanceToken", []);
  const timeLock = m.contract("TimeLock", [
    m.getParameter("minDelay", MIN_DELAY),
    m.getParameter("proposers", []),
    m.getParameter("executors", []),
  ]);

  // const governorContract = m.contract("GovernorContract", [
  //   m.getParameter("_token", data["DAOs#GovernanceToken"]),
  //   m.getParameter("_timelock", data["DAOs#TimeLock"]),
  //   m.getParameter("_quorumPercentage", QUORUM_PERCENTAGE),
  //   m.getParameter("_votingPeriod", VOTING_PERIOD),
  //   m.getParameter("_votingDelay", VOTING_DELAY),
  // ]);

  return { governorToken, timeLock };
});

export default Deployer;
