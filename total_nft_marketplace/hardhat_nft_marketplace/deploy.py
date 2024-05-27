import os
import re
import json
import subprocess


def deploy_contracts():
    try:
        print("Deploying modules...")
        files = os.listdir('./ignition/modules')
        contracts = {}

        for file in files:
            if file.endswith(".ts"):
                print(f"Working on {file}")
                command = ["npx", "hardhat", "ignition",
                           "deploy", f"./ignition/modules/{file}"]

                result = subprocess.run(
                    command, capture_output=True, text=True)

                if result.returncode != 0:
                    print(f"Error deploying {file}: {result.stderr}")
                    continue

                output = result.stdout
                print(f"Output for {file}:\n{output}")

                pattern = re.compile(r"(\w+)#(\w+) - (0x[a-fA-F0-9]{40})")
                matches = pattern.findall(output)

                for match in matches:
                    _, contract_name, address = match
                    contracts[contract_name] = address

        with open("../graph_nft_marketplace/src/constants/addresses.json", "w") as f:
            json.dump(contracts, f, indent=4)

        print("Deployment addresses have been written to addresses.json")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    deploy_contracts()
