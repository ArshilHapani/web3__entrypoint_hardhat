// @ts-ignore
import { ethers } from "./ethers-5.1.esm.min.js";

export function make_toast(title: string, description: string = "") {
  setTimeout(() => {
    document.querySelector(".toast")!.classList.remove("show");
  }, 3000);
  document.querySelector(".toast_div")!.innerHTML = `
    <div class="toast show position-fixed bottom-3 end-3 p-3" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="mr-auto">${title}</strong>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          ${description}
        </div>
      </div>
    `;
}

export function getEthFromWei(wei: string) {
  return ethers.utils.formatEther(wei);
}
