import Head from "next/head";
import React, { useEffect, useState } from "react";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";
// import { truncateEthAddress } from "../utils/truncAddress";
import { useRouter } from "next/router";
import { QRCodeComponent } from "../components";


const mainURL = `https://arweave.net/`;

export default function Square() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/playlist');
  };


  // const getContract = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);

  //   let contract = new ethers.Contract(
  //     process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //     ContractABI.abi,
  //     provider
  //   );
  //   return contract;
  // };
  useEffect(() => {
  const RETRY_INTERVAL = 2000; // 5 seconds
  const MAX_RETRIES = 3;
  const getNfts = async (retryCount = 0) => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_API_URL + `users/likes`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data.data.data.likes);
        const items = await Promise.all(
          response.data.data.data.likes.map(async (i) => {
            const meta = await axios.get(mainURL + i.tokenURI);
            console.log(i.tokenURI);
            // let price = ethers.utils.formatUnits(i.price.toString(), "ether");

            let item = {
              price: i.price,
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: i.name,
              description: i.description,
              tokenURI: i.tokenURI,
            };
            return item;
          })
        );
        // setNfts(items);

        setNfts([...items].reverse());
        setLoading(true);
      } catch (error) {
        console.error(error);

        if (error.code === "CALL_EXCEPTION" && retryCount < MAX_RETRIES) {
          // Retry after a delay
          setTimeout(() => {
            getNfts(retryCount + 1);
          }, RETRY_INTERVAL);
          return;
        }

        toast.error("Something went wrong、更新ボタンを押してください。");
      }

  };

    getNfts();
  }, []);



  // useEffectの内部で画像のスライドショーの動作を設定
  useEffect(() => {
    // loadingがtrueでない場合、またはnftsが空の場合はタイマーを設定しない
    if (!loading || nfts.length === 0) return;

    // 3秒ごとにnextSlide関数を呼び出すタイマーを設定
    const timerId = setInterval(() => {
      nextSlide();
    }, 2000); // 3000ミリ秒 = 3秒

    // useEffectのクリーンアップ関数でタイマーをクリア
    return () => {
      clearInterval(timerId);
    };
  }, [loading, nfts, currentSlideIndex]); // loading, nfts, currentSlideIndex のいずれかが変更されたときに再度設定



  if (!loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center font-body bg-gradient-to-br from-gray-900 to-black">
        <img src="/logo.png" alt="logo" className="h-[160px] animate-pulse" />
        <h2 className="text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-black mt-5">
          Loading...
        </h2>
      </div>
    )





  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % nfts.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length);
  };

  // NFTの詳細ページへのURLを取得
  const nftDetailURL = `https://artvisionary02.vercel.app/nft-details?price=${nfts[currentSlideIndex]?.price}&tokenId=${nfts[currentSlideIndex]?.tokenId}&seller=${nfts[currentSlideIndex]?.seller}&owner=${nfts[currentSlideIndex]?.owner}&image=${encodeURIComponent(nfts[currentSlideIndex]?.image)}&name=${encodeURIComponent(nfts[currentSlideIndex]?.name)}&description=${encodeURIComponent(nfts[currentSlideIndex]?.description)}&tokenURI=${encodeURIComponent(nfts[currentSlideIndex]?.tokenURI)}`;
  const nftDetailURL2 = `https://artvisionary02.vercel.app/dashboard`;

  const truncateSeller = (seller) => seller.slice(-4);
  return (
    <>
      <Head>
        <title>Playlist（square） || Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>
      <div className=" h-[930px] max-w-[1440px] flex items-center justify-center bg-black relative">
        <div className="w-[852px] h-[852px] bg-[#1a1a1a] flex items-center justify-center relative ">
          <img
            src={mainURL + nfts[currentSlideIndex]?.image}
            alt={nfts[currentSlideIndex]?.name}
            className="object-contain h-[676px] w-[676px] mt-[-40px]"
          />
          <div className="flex justify-between px-4 py-2 absolute bottom-2 left-0 right-0 text-[#a3a3a3] w-full">
            <div className="flex items-center">
              <img
                className="w-9 h-9 object-cover mr-1"
                alt="icon"
                src="/images/mask-group@2x.png"
              />
              {/* <span className="underline truncate ml-2">shin tanaka</span>
              <span className="truncate ml-6">title</span> */}
              <span className="underline truncate ml-2">{truncateSeller(nfts[currentSlideIndex]?.seller)}</span>
              <span className="truncate ml-6">{nfts[currentSlideIndex]?.name}</span>

            </div>
            <div className="flex items-center pr-24">
              {" "}
              <img
                className="w-8 h-6 rounded-[9px]"
                alt="MATIC"
                src="/images/polygonlogo-mono.png"
              />
              {/* <span className="ml-2 font-semibold leading-[32px]">
                0.01 MATIC
              </span> */}
              <span className="ml-2 font-semibold leading-[32px]">
                {nfts[currentSlideIndex]?.price} MATIC
              </span>
            </div>
          </div>
          <div className="absolute bottom-[-15px] right-[-15px] mr-4 mb-4">
            <QRCodeComponent
              value={nftDetailURL}
              className="w-[81px] h-[81px]"
            />
          </div>
        </div>
      </div>
    </>
  );
}