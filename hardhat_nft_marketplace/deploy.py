import os
import subprocess

def deployContracts():
    print("Deploying modules...")
    # read files inside ./ignition/modules folder and run subprocess script 'npx {filename} deploy' 
    files = os.listdir('./ignition/modules')
    for file in files:
        if file.endswith(".ts"):
            subprocess.run(["npx","hardhat","ignition","deploy",f"./ignition/modules/{file}"])
    

if __name__ == "__main__":
    deployContracts()