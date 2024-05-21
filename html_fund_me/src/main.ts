// import detectEthereumProvider from "@metamask/detect-provider";

//@ts-ignore
import { ethers, BigNumber } from "./ethers-5.1.esm.min.js";

import { getEthFromWei, make_toast } from "./util";
import { ABI, CONTRACT_ADDRESS } from "./constants.js";

// DOM elements
const ethereumButton = document.querySelector<HTMLButtonElement>(
  ".enableEthereumButton"
)!;
const showAccount = document.querySelector<HTMLSpanElement>(".showAccount")!;
const ethInput = document.getElementsByTagName("input")[0]!;
const fundButton = document.querySelector<HTMLButtonElement>("#fundBtn")!;
const form = document.querySelector<HTMLFormElement>("form")!;
const getDonatorsButton =
  document.querySelector<HTMLButtonElement>("#donators_btn")!;
const donatorAddressDiv =
  document.querySelector<HTMLDivElement>("#donators_address")!;
const getBalanceButton =
  document.querySelector<HTMLButtonElement>("#get_balance")!;
const showBalanceDiv = document.querySelector<HTMLDivElement>("#balance_view")!;
const withDrawButton =
  document.querySelector<HTMLButtonElement>("#withdraw_btn")!;

// listeners
getDonatorsButton.addEventListener("click", getDonators);
ethereumButton?.addEventListener("click", async function () {
  await connect();
});
getBalanceButton.addEventListener("click", getBalance);
form.addEventListener("submit", handleSubmit);
withDrawButton.addEventListener("click", handleWithdraw);

// functions
async function connect() {
  if (typeof (window as any).ethereum !== "undefined") {
    console.log("MetaMask is installed!");
    await (window as any).ethereum
      .request({ method: "eth_requestAccounts" })
      .then((acc: string[]) => {
        make_toast("Connected to MetaMask!");
        showAccount.innerHTML = `Account ${acc[0]}`;
        ethereumButton.innerHTML = "Connected";
        ethereumButton.disabled = true;
        ethInput.disabled = false;
        fundButton.disabled = false;
        getDonatorsButton.disabled = false;
        getBalanceButton.disabled = false;
        withDrawButton.disabled = false;
      })
      .catch((err: any) => {
        if (err.code === 4001) {
          showAccount.innerHTML = "Please connect to MetaMask.";
        } else {
          console.error(err);
        }
      });
  } else {
    showAccount.innerHTML = "Please install MetaMask!";
  }
}

function handleSubmit(e: Event) {
  e.preventDefault();
  const ethAmount = parseFloat(ethInput.value);
  fund(ethAmount);
}

async function fund(ethAmount: number) {
  if (typeof (window as any).ethereum === "undefined") {
    make_toast("Please connect to MetaMask!");
    return;
  }

  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  try {
    const transactionResponse = await contract.donate({
      value: ethers.utils.parseEther(ethAmount.toString()),
    });
    console.log(transactionResponse);
    if (transactionResponse) {
      await listenForTransactionMined(transactionResponse, provider);
      make_toast(`Transaction successful of ${ethAmount} ETH!`);
    }
  } catch (error: any) {
    if (error.code === 4001) {
      make_toast("Transaction cancelled!");
    } else {
      make_toast("Transaction failed!");
    }
  }
}

async function getDonators() {
  if (typeof (window as any).ethereum === "undefined") {
    make_toast("Please connect to MetaMask!");
    return;
  }
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  const donatorTOAmount = await contract.getDonators();
  const donatorToAmountMapping = await Promise.all(
    donatorTOAmount.map(async (donator: string) => {
      return {
        donator,
        amount: getEthFromWei(
          BigNumber.from(
            await (
              await contract.s_donatorsToAmount(donator)
            )._hex
          )
            .toBigInt()
            .toString()
        ),
      };
    })
  );
  console.log(donatorToAmountMapping);
  donatorAddressDiv.innerHTML = `
    <h3 class='text-3xl mt-4 mb-2 font-bold'>Donators</h3>
    <ul>
      ${donatorToAmountMapping
        .map(
          (donator: { donator: string; amount: string }) =>
            `<li>${donator.donator} - amount ${donator.amount} ETH</li>`
        )
        .join("")}
    </ul>
  `;
}

function listenForTransactionMined(transactionResponse: any, provider: any) {
  make_toast(`Mining transaction ${transactionResponse.hash}...`);
  return new Promise((resolve) => {
    provider.once(transactionResponse.hash, (transactionReceipt: any) => {
      make_toast(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
    });
    resolve(true);
  });
}

async function getBalance() {
  let balance: string;
  if (typeof (window as any).ethereum === "undefined") {
    make_toast("Please connect to MetaMask!");
    return;
  }
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  let b = await provider.getBalance(CONTRACT_ADDRESS);
  balance = getEthFromWei(b);
  showBalanceDiv.innerHTML = `Balance: ${balance} ETH`;
}

async function handleWithdraw() {
  if (typeof (window as any).ethereum === "undefined") {
    make_toast("Please connect to MetaMask!");
    return;
  }
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
  try {
    const transactionResponse = await contract.withDraw();
    await listenForTransactionMined(transactionResponse, provider);
    make_toast("Withdraw successful!");
  } catch (error: any) {
    if (error.code === 4001) {
      make_toast("Transaction cancelled!");
    } else {
      make_toast("Transaction failed!");
    }
  }
}
