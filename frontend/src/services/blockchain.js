import { ethers } from "ethers";
import abi from "./HashStorageABI.json";
//编译后abi文件在src/services里，移出来放services里

const RPC_URL     = import.meta.env.VITE_RPC_URL;
const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY;
const ADDRESS     = import.meta.env.VITE_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet   = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(ADDRESS, abi, wallet);


export async function storeHashAuto(plainText) {
  const hashValue = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(plainText)
  );
  console.log("Computed hash:", hashValue);

  //调用smart contracts
  const tx = await contract.storeHash(hashValue, { gasLimit: 100_000 });
  const receipt = await tx.wait();
  console.log("Stored on chain, txHash:", receipt.transactionHash);
  return receipt.transactionHash;
}
