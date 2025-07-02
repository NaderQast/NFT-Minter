[!IMPORTANT]
1 - This Site is Wiorking for now on Both Scroll-Sepolia and Sepolia TestNet Networks
2 - The Mint Process may take a little more than usuall (around 12 sec) so please be patient !

## about the project

This project let the user to verify anyhing he wants but mainly we are focusing on the handmade collectable ,treasury, Companies and trademarks
this lets the user to verify his product to a NFT Collection Called PhoeNFT

## Folder Structure

in the blockchain directory we have the smart contracts in the src folder

- we have also the smart contracts test in the test folder

in the client-website directory we have the client website that includes :

- the locales language that we are using in the public directory
- in the utils directory we have the contract ABI in contract.json file and we have the upload procedure that let us upload our
  jsonURI to Pinata IPFS cloud
- in the src directory we have :
  -- i18n.ts : the i18n configuration to switch languages
  --context and config folders : for the Wagmi Config from @Reown (WalletConnect)
  --components folder :(for now its just held the Switch language component )
  --app folder : (the main pages of the website and the smartcontract pages)
  it alos hold the api that let us upload the jsonURI to Pinata IPFS cloud

## Design Decisions

i have use Ownable (AccessControl Role Based) to pause or unpause the contract ( i have take this Tip from open-zeppelin wizard)

## important links & addresses

NEXT_PUBLIC_CONTRACT_ADDRESS_Scroll=0x0Ae91Ff4206207AFD977ecad8C0de569d252ddE1
NEXT_PUBLIC_CONTRACT_ADDRESS_Sepolia=0x66A1CC3cdbC7121C2b1f1B9590f8C9fbA3c4c21E

## how to run test

forge test : for noraml test
forge test -vv : for more detailed test

## how to run

npm run dev

## how to mint

1 - login with your wallet (tested with metamask)
2 - select the network (Sepolia or Scroll-Sepolia)
3 - makesure you hane enough balance in your account
4 - fill the form and click on the mint button
5 - wait for the transaction to be mined and the NFT will be minted to your account

## environment variables Setup

NEXT_PUBLIC_CONTRACT_ADDRESS_Scroll
NEXT_PUBLIC_CONTRACT_ADDRESS_Sepolia
PINATA_JWT
NEXT_PUBLIC_PROJECT_ID

## Project Link

https://nft-minter-mu-six.vercel.app/
