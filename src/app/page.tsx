"use client";

import { useState } from "react";
import contractData from "../../utils/contract.json";
import { generatePinataKey, uploadFile, uploadJson } from "../../utils/upload";
import { useAppKitAccount } from "@reown/appkit/react";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import { getWalletClient } from "wagmi/actions";
import { useChainId } from "wagmi";
import { CONTRACT_ADDRESSES } from "@/constants/contracts";
import { toast } from "sonner";
import { config } from "@/config";
import { useTranslation } from "react-i18next";
import "@/i18n";

export default function Home() {
  const { t } = useTranslation();
  const [creationDateInput, setCreationDateInput] = useState("");
  const [name, setName] = useState("");
  const [creator, setCreator] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [file, setFile] = useState<File | undefined>();

  const { address, isConnected } = useAppKitAccount();

  const chainId = useChainId();

  async function mintNft() {
    const contractAddress = CONTRACT_ADDRESSES[chainId];

    if (!contractAddress) {
      toast.error("Unsupported network");
      return;
    }

    console.log("Using contract address:", contractAddress);

    if (!address || !file) {
      toast.error("Missing wallet or file.");
      return;
    }
    const timestamp = Math.floor(new Date(creationDateInput).getTime() / 1000);

    try {
      const keyData = await generatePinataKey();
      const fileCID = await uploadFile(file, keyData.JWT);

      const metadata = {
        name,
        description,
        image: fileCID,
        external_url: externalUrl,
        attributes: [
          { trait_type: "Creator", value: creator },
          {
            display_type: "date",
            trait_type: "creation",
            value: Math.floor(new Date(creationDateInput).getTime() / 1000),
          },
        ],
      };

      const uriCID = await uploadJson(metadata, keyData.JWT);

      const txHash = await writeContract(config, {
        abi: contractData.abi,
        address: contractAddress as `0x${string}`,
        functionName: "safeMint",
        args: [address, `ipfs://${uriCID}`],
      });

      await waitForTransactionReceipt(config, { hash: txHash });

      toast.success("NFT Minted!");
      alert(`Tx: ${txHash} ` + ` To: ${address}`);
    } catch (e) {
      console.error(e);
      toast.error("Mint failed.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-xl bg-gray-200 rounded-xl shadow-sm p-8 border border-gray-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <LanguageSwitcher />
        </div>

        {isConnected ? (
          <div className="space-y-6">
            <div className="flex gap-2 ">
              <div className="bg-cyan-600 rounded-3xl hover:bg-cyan-700">
                <w3m-account-button />
              </div>
              <div className="bg-cyan-600 rounded-3xl hover:bg-cyan-700">
                <w3m-network-button />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("name")}
                </label>
                <input
                  className="input w-full bg-gray-100 border-gray-400 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={t("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("creator")}
                </label>
                <input
                  className="input w-full bg-gray-100 border-gray-400 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={t("creator")}
                  value={creator}
                  onChange={(e) => setCreator(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("description")}
                </label>
                <input
                  className="input w-full bg-gray-100 border-gray-400 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={t("description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("externalUrl")}
                </label>
                <input
                  className="input w-full bg-gray-100 border-gray-400 text-gray-900 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  placeholder={t("externalUrl")}
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("creationDate")}
                </label>
                <input
                  type="datetime-local"
                  className="text-gray-500 input w-full bg-gray-100 border-gray-400 focus:bg-gray-700 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  value={creationDateInput}
                  onChange={(e) => setCreationDateInput(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("nftImage")}
                </label>
                <input
                  type="file"
                  className="text-gray-500 file-input w-full bg-gray-100 border-gray-400 focus:bg-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                  onChange={(e) => setFile(e.target.files?.[0])}
                />
              </div>
            </div>

            <button
              className="btn w-full bg-cyan-600 hover:bg-cyan-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
              onClick={mintNft}
            >
              {t("mint")}
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-medium text-gray-700 mb-4">
              Connect your wallet to mint NFTs
            </h2>
            <button className="btn btn-outline border-cyan-500 text-cyan-600 hover:bg-cyan-50">
              <w3m-connect-button />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      className="select select-sm bg-gray-100 border-gray-300 text-gray-700 focus:border-cyan-500 focus:ring-cyan-500"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
