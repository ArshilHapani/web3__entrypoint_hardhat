import os
import re
import subprocess
import sys


def deploy_contracts():
    try:
        args = sys.argv
        if args.__len__() != 3:
            print("Please provide network using '--network <network_name>' flag")
            return
        elif args[1] != "--network":
            print("Please provide network using '--network <network_name>' flag")
            return
        print("Deploying modules...")
        files = os.listdir('./ignition/modules')

        print(f"Network: {args[2]}")
        for file in files:
            if file.endswith(".ts"):
                print(f"Working on {file}")
                command = ["yarn", "hardhat", "ignition",
                           "deploy", f"./ignition/modules/{file}", args[1], args[2]]

                p = subprocess.Popen(command, shell=True).wait()

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    deploy_contracts()
