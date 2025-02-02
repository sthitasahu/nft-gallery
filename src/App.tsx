// src/App.tsx
// Import libraries and components
import { useEffect, useState } from 'react';
import { ethers } from "ethers";
import NFTCard from './components/NFTCard';
import CollectionSearch from './components/CollectionSearch';

const RPC_URL=import.meta.env.VITE_RPC_URL;



interface NFT {
  name: string;
  imageUrl?: string;
  tokenId: string;
  contractAddress: string;
  collectionName:string;
}

interface NFTCollectionResponse {
  tokens: NFT[];
}

function App() {
  // State variables
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<string>('0xaAdBA140Ae5e4c8a9eF0Cc86EA3124b446e3E46A');

  // Function to fetch NFTs by collection
  const fetchCollection = async (): Promise<NFTCollectionResponse> => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    const collection: NFTCollectionResponse = await provider.send("qn_fetchNFTsByCollection", [
      {
        collection: address,
        page: 1,
        perPage: 50,
      }
    ]);
    return collection;
  };

  // useEffect renders every time address is set
  useEffect(() => {
    fetchCollection()
      .then(data => {
        setNFTs(data.tokens);
        setIsLoading(false);
        
      })
      .catch(() => {
        setNFTs([]);
        setIsLoading(false);
      });
  }, [address,fetchCollection]);

  // JSX containing our conditional rendering
  return (
    <div className='container mx-auto'>
      <CollectionSearch searchText={(text: string) => setAddress(text)} />
      {!isLoading && nfts.length === 0 && <h1 className='text-5xl text-center mx-auto mt-32'>No Collection Found</h1>}
      <div className='grid grid-cols-3 gap-4'>
        {nfts.map(token => <NFTCard key={token.tokenId} nft={token} />)}
      </div>
    </div>
  );
}

export default App;
