import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Footer, Header } from "../components";
// import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import axios from "axios";
import { ethers } from "ethers";
import { truncateEthAddress } from "../utils/truncAddress";
import { useRouter } from "next/router";
// import { useCheckWalletConnection } from "../hooks/useCheckWalletConnection";

const mainURL = `https://arweave.net/`;

const Dashboard = () => {
  // useCheckWalletConnection();
  const [nfts, setNts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [likeCount, setLikeCount] = useState({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const router = useRouter();

  const handleLikeClick = (i) => {
    setLikeCount((prevCount) => ({
      ...prevCount,
      [i]: (prevCount[i] || 0) + 1,
    }));
  };

  const handleLike = async (nft, i) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.patch(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + `nfts/updateLike`,
        {
          tokenURI: nft.tokenURI,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        handleLikeClick(i);
      }
      console.log(response.data.message);
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error liking the NFT:", error.response.data.message);
      } else {
        console.error("Error liking the NFT:", error.message);
      }
    }
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
  // const getContract = async () => {
  //   try {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);

  //     let contract = new ethers.Contract(
  //       process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
  //       ContractABI.abi,
  //       provider
  //     );
  //     return contract;
  //   } catch (error) {
  //     console.error("Failed to create contract instance:", error);
  //     toast.error("Something went wrong with the contract");
  //     setShowModal(true);
  //   }
  // };

  useEffect(() => {
    const maxRetryCount = 3;
    const retryInterval = 2000; // 2 seconds

    const getNfts = async (retryCount = 0) => {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.get(
          process.env.NEXT_PUBLIC_BACKEND_API_URL + `nfts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log(response.data.data.data);
        const items = await Promise.all(
          response.data.data.data.map(async (i) => {
            const meta = await axios.get(mainURL + i.tokenURI);

            // await sleep(1000);
            console.log(i.tokenURI);

            let item = {
              price: i.price,
              tokenId: i.tokenId,
              seller: i.seller,
              owner: i.owner,
              likes: i.likes,
              image: meta.data.image,
              name: i.name,
              description: i.description,
              tokenURI: i.tokenURI,
            };
            return item;
          })
        );
        setNts([...items].reverse());
        setLoading(true);
        //   } catch (error) {
        //     console.error(error);
        //     toast.error("Something went wrong");
        //     setShowModal(true);
        //   }
        // };
      } catch (error) {
        console.error(error);
        if (retryCount < maxRetryCount) {
          setTimeout(() => getNfts(retryCount + 1), retryInterval);
          return;
        }
        toast.error(
          "Something went wrong,少し待った後、更新ボタンを押してください。"
        );
        setShowModal(true);
      }
    };

    getNfts();
  }, []); 





  // if (!loading)
  //   return (
  //     <div className="w-full h-screen flex flex-col items-center justify-center font-body bg-black">
  // <img src="/logo.png" alt="logo" className="h-[160px] animate" />
  //       <h2 className="text-7xl font-semibold ">Loading...</h2>
  //     </div>
  //   );


  if (!loading)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center font-body bg-gradient-to-br from-gray-900 to-black">
        <img src="/logo.png" alt="logo" className="h-[160px] animate-pulse" />
        <h2 className="text-7xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-black mt-5">
          Loading...
        </h2>
      </div>
    )

  if (showModal) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-70">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2>エラーが発生しました</h2>
          <p>ウォレットを接続してください。</p>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            // onClick={connectWallet}
          >
            コネクトウォレット
          </button>
        </div>
      </div>
    );
  }





  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % nfts.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + nfts.length) % nfts.length);
  };



  return (
    <div className="relative bg-black">
      {" "}
      <Head>
        <title>Dashboard || Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>
      <Header />
      <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div>
      {!nfts.length ? (
        <div className="w-full h-50 flex flex-col items-center justify-center font-body">
          <h2 className="text-7xl font-semibold">No NFTs in Marketplace</h2>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          <h1 className="text-center text-[#fff]">Gem stones</h1>
          {/* <button onClick={() => setIsModalOpen(true)}>Open Slideshow</button>
          {isModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-70">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-full max-h-full relative">
                <img src={mainURL + nfts[currentSlideIndex]?.image} alt={nfts[currentSlideIndex]?.name} className="max-w-full max-h-[80vh] mx-auto" />
                <div className="flex justify-between p-4 absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white">
                  <button onClick={prevSlide}>Previous</button>
                  <button onClick={() => setIsModalOpen(false)}>Close</button>
                  <button onClick={nextSlide}>Next</button>
                </div>
              </div>
            </div>
          )} */}

          <section className="bg-black max-w-[1200px] my-20 mx-auto grid grid-cols-3 md:grid-cols-2 gap-4 font-body  overflow-hidden top-7 md:gap-5 medium md:px-5 sm:grid-cols-1 sm:h-full relative justify-center items-center ">
            {nfts?.map((nft, i) => (
              <div key={i} className="w-full h-[536px] sm:h-full ssm:h-max">
                <div
                  className="w-full h-full ssm:h-max bg-[#272D37]/60 rounded-2xl flex flex-col p-6 sm:h-max cursor-pointer"
                  onClick={() => {
                    router.push({
                      pathname: "/nft-details",
                      query: nft,
                    });
                  }}
                >
                  <div className="relative transition duration-150 ease-in-out delay-150">
                    <img
                      src={mainURL + nft?.image}
                      alt={nft.name}
                      className="w-full h-[352px] ssm:h-max rounded-2xl "
                    />
                    <div className="absolute top-0 left-0  bg-white/40  backdrop-blur-xl w-full h-full z-[20] rounded-2xl opacity-0 hover:opacity-100">
                      <div className="flex items-center justify-center h-full ">
                        <button
                          className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer transition duration-250 ease-in-out hover:scale-125 hover:drop-shadow-xl hover:shadow-sky-600 w-auto "
                          onClick={() => {
                            router.push({
                              pathname: "/nft-details",
                              query: nft,
                            });
                          }}
                        >
                          NFT詳細
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <h1 className="max-h-[36px] text-[#fff]">{nft.name}</h1>
                    <div className="h-[56px] flex justify-between">
                      <div className="flex flex-row gap-2">
                        <div>
                          <p className="my-1 text-base text-[#8F9CA9]">
                            Creator{" "}
                          </p>
                          <h4 className="my-0 ssm:text-sm text-transparent font-bold bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
                            {truncateEthAddress(nft.seller)}
                          </h4>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <button
                          onClick={() => handleLike(nft, i)}
                          className="text-3xl focus:outline-none bg-transparent border-none px-6"
                        >
                          ❤️
                        </button>
                        <h4 className="my-0 text-[#fff]">{nft.likes.length}</h4>
                      </div>
                      <div>
                        <p className="my-1 text-[#8F9CA9]">価格</p>
                        <h4 className="my-0 text-[#fff]">{nft.price} Matic</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
          <Footer />
        </div>
      )}
    </div>
  );
};

// function downloadJSON(data, filename = "data.json") {
//   // JSON データを文字列に変換
//   const jsonString = JSON.stringify(data, null, 2);

//   // Blob を作成
//   const blob = new Blob([jsonString], { type: "application/json" });
//   const url = URL.createObjectURL(blob);

//   // ダウンロードリンクを作成
//   const downloadLink = document.createElement("a");
//   downloadLink.href = url;
//   downloadLink.download = filename;

//   // リンクをクリックしてダウンロードを開始
//   document.body.appendChild(downloadLink);
//   downloadLink.click();
//   document.body.removeChild(downloadLink);
// }

export default Dashboard;
