import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
import { truncateEthAddress } from "../utils/truncAddress";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";


const mainURL = `https://arweave.net/`;

const NFTDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const router = useRouter();

  const [addr, setAddr] = useState("");

  const [nft, setNft] = useState({
    price: "",
    tokenId: "",
    seller: "",
    owner: "",
    image: "",
    description: "",
    tokenURI: "",
  });

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please Install MetaMask");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setIsWalletConnected(true);
      localStorage.setItem("walletAddress", accounts[0]);
      router.push("/nft-details?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;

    setNft(router?.query);

    setIsLoading(false);
  }, [router.isReady]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") { // Ethereumプロバイダーの存在確認
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          setIsWalletConnected(false);
        } else {
          setIsWalletConnected(true);
        }
      } else {
        setIsWalletConnected(false);  // Ethereumプロバイダーが存在しない場合
      }
    };
    checkWalletConnection();
  }, [router]);

  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    setAddr(addr);
  }, []);

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractABI.abi,
      signer
    );
    return contract;
  };

  const buyNft = async (n) => {
    try {
      const contract = await getContract();
      const price = ethers.utils.parseUnits(n.price.toString(), "ether");
      let tx = await contract.createMarketSale(n.tokenId, { value: price });
      await tx.wait();
      toast.success(`Bought NFT🎉`);
      await router.push("/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(`You Can't Buy This Look At the Price 😂 ${error}`);
    }
  };

  const reSellNFT = async (nft) => {
    router.push(`sellnft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  };

  return (
    <div className=" bg-black">
      <Head>
        <title>{nft.name} || Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>

      <Header />
      <div className="bg-[#1242ef]  absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div>
      <div className="relative overflow-hidden">
        <section className="grid grid-cols-2 max-w-[1240px] mx-auto my-2 gap-4 font-body sm:grid-cols-1 p-5">
          <div className="p-3 sm:p-0">
            <div className="w-full h-[508px] border border-solid border-sky-500   rounded-xl ">
              <img
                src={mainURL + nft.image}
                alt={nft.name}
                className="w-full h-full rounded-xl "
              />
            </div>
          </div>
          <div className="text-[#ADB9C7]">
            <h1>
              #{nft.tokenId} {nft.name}
            </h1>
            <p className="text-[#ADB9C7]"> description: {nft.description}</p>
            <div>
              <p>Price</p>
              <h2>{nft.price} MATIC</h2>
            </div>
            <div>
              <p>Owner </p>
              <h2 className="my-0 ssm:text-sm text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                {truncateEthAddress(nft.owner)}
              </h2>
            </div>

            {nft.seller.startsWith('0x0') ? null : (
              <div>
                <p>Seller </p>
                <h2 className="my-0 ssm:text-sm text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                  {truncateEthAddress(nft.seller)}
                </h2>
              </div>
            )}

            <div>
              <p>Blockchain</p>
              <h2>Polygon(Mumbai)</h2>
            </div>

            <button
              className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer  duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl hover:shadow-sky-600 w-auto mt-8 transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none "
              onClick={() => {
                if (!isWalletConnected) {
                  connectWallet();
                } else if (addr === nft.owner.toLocaleLowerCase()) {
                  reSellNFT(nft);
                } else {
                  buyNft(nft);
                }
              }}
            >
              {!isWalletConnected
                ? 'Connect Wallet'
                : addr === nft.owner.toLocaleLowerCase()
                ? 'Sell NFT'
                : 'Buy NFT'}
            </button>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default NFTDetails;
