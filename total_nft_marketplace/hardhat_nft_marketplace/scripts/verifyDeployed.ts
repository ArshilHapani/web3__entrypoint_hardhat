import data from "../../graph_nft_marketplace/src/constants/addresses.json";
import verifyContract from "../utils/verify";

(async function () {
    Object.values(data).forEach(async (val, idx) => {
        if (idx != 0) {
            console.log(`Verifying ${val}`);
            await verifyContract(val, []);
        } else{
            console.log(`Skipping ${val}...`)
        }
    })
})();