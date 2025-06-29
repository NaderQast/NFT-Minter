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
    <div className="p-6 max-w-xl mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <LanguageSwitcher />
      </div>

      {isConnected ? (
        <>
          <w3m-account-button />
          <w3m-network-button />
          <input
            className="input input-bordered w-full"
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder={t("creator")}
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder={t("description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="input input-bordered w-full"
            placeholder={t("externalUrl")}
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
          />

          <input
            type="datetime-local"
            className="input input-bordered w-full"
            value={creationDateInput}
            onChange={(e) => setCreationDateInput(e.target.value)}
          />

          <input
            type="file"
            className="file-input file-input-bordered w-full"
            onChange={(e) => setFile(e.target.files?.[0])}
          />
          <button className="btn btn-primary" onClick={mintNft}>
            {t("mint")}
          </button>
        </>
      ) : (
        <button className="btn btn-outline">
          <w3m-connect-button />
        </button>
      )}
      <div className="red-test">sss</div>
    </div>
  );
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <select
      className="select select-sm select-bordered"
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      <option value="en">English</option>
      <option value="ar">العربية</option>
    </select>
  );
}
