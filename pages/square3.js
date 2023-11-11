import Head from "next/head";
import React, { useEffect, useState } from "react";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";
import Link from 'next/link';
import { useRouter } from "next/router";
import { QRCodeComponent } from "../components";


const mainURL = `https://arweave.net/`;

export default function Square() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
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

  const getContract = () => {
    // RPC URLを使用してプロバイダを初期化
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    // コントラクトを初期化
    let contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      ContractABI.abi,
      provider
    );
    return contract;
  };

  const RETRY_INTERVAL = 5000; // 5 seconds
  const MAX_RETRIES = 3;
  const getNfts = async (retryCount = 0) => {
    try {
      const contract = await getContract();

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data?.map(async (i) => {
          const tokenURI = await contract.tokenURI(i.tokenId);
          const meta = await axios.get(mainURL + tokenURI);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");

          let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            description: meta.data.description,
            tokenURI,
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

      toast.error("ウォレット接続エラー（polygon Mumbaiで接続）");
    }

  };



  useEffect(() => {
    getNfts();
  }, []);
  useEffect(() => {
    // コンポーネントがマウントされた後に透明度を更新
    setOpacity(1);
  }, []);



  // useEffectの内部で画像のスライドショーの動作を設定
  useEffect(() => {
    // loadingがtrueでない場合、またはnftsが空の場合はタイマーを設定しない
    if (!loading || nfts.length === 0) return;

    // 3秒ごとにnextSlide関数を呼び出すタイマーを設定
    const timerId = setInterval(() => {
      nextSlide();
    }, 10000); // 3000ミリ秒 = 3秒

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
    // 透明度を0に設定してフェードアウト
    setOpacity(0);
    // 次のスライドに切り替える前にアニメーションを待機
    setTimeout(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % nfts.length);
      // 透明度を1に設定してフェードイン
      setOpacity(1);
    }, 500);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length);
  };

  // NFTの詳細ページへのURLを取得
  const nftDetailURL = `https://artvisionary-nft-marketplace-pi.vercel.app/nft-details?price=${nfts[currentSlideIndex]?.price}&tokenId=${nfts[currentSlideIndex]?.tokenId}&seller=${nfts[currentSlideIndex]?.seller}&owner=${nfts[currentSlideIndex]?.owner}&image=${encodeURIComponent(nfts[currentSlideIndex]?.image)}&name=${encodeURIComponent(nfts[currentSlideIndex]?.name)}&description=${encodeURIComponent(nfts[currentSlideIndex]?.description)}&tokenURI=${encodeURIComponent(nfts[currentSlideIndex]?.tokenURI)}`;
  const nftDetailURL2 = `https://artvisionary-nft-marketplace-pi.vercel.app/dashboard`;

  const truncateSeller = (seller) => seller.slice(-4);
  return (
    <>
      <Head>
        <title>Playlist（square） || Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>
      <div className="flex items-center justify-center bg-black relative h-screen w-screen">
        <div className="flex items-center justify-center relative bg-[#1a1a1a] max-h-[852px] max-w-[852px] h-full w-full">
          <img
            src={mainURL + nfts[currentSlideIndex]?.image}
            alt={nfts[currentSlideIndex]?.name}
            className={`object-contain max-h-[676px] max-w-[676px] h-full w-full p-4 transition-opacity duration-500 ${opacity ? 'opacity-100' : 'opacity-0'}`}
            // スライドが変わる度にアニメーションを実行
            style={{ opacity: opacity }}
          />


          <div className="flex justify-between absolute bottom-0 left-0 right-0 px-4 py-2 text-[#a3a3a3] w-full">
            <div className="flex items-center w-1/2"> {/* w-1/2を追加して幅を親要素に合わせます */}
              <img
                className="w-9 h-9 object-cover mr-1"
                alt="icon"
                src="/images/mask-group@2x.png"
              />
              <span className="underline truncate">{truncateSeller(nfts[currentSlideIndex]?.seller)}</span>
            </div>
            <div className="flex items-center w-1/2"> {/* w-1/2を追加して幅を親要素に合わせます */}
              <span className="truncate">{nfts[currentSlideIndex]?.name}</span>
            </div>
            <div className="flex items-center">
              <img
                className="w-8 h-6 rounded-[9px]"
                alt="MATIC"
                src="/images/polygonlogo-mono.png"
              />
              <span className="ml-2 font-semibold leading-[32px]">
                {nfts[currentSlideIndex]?.price} MATIC
              </span>
            </div>
          </div>


          {/* <div className="absolute bottom-0 -mb-28 left-1/2 transform -translate-x-1/2">
            <QRCodeComponent
              value={nftDetailURL}
              className="w-[81px] h-[81px]"
            />
          </div> */}
          <div className="absolute bottom-0 -mb-32 left-1/2 transform -translate-x-1/2">
            <Link href={nftDetailURL} passHref>
              <a target="_blank" rel="noopener noreferrer">
                <QRCodeComponent
                  value={nftDetailURL}
                  className="w-[81px] h-[81px]"
                />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );



}