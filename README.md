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

## design patern
