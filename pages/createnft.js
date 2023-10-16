import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Footer, FundWallet, Header } from "../components";
import { useBundler } from "../context/bundlrContext";
import ContractABI from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import axios from "axios";

const mainURL = `https://arweave.net/`;

const Create = () => {
  const { initialiseBundlr, bundlrInstance, balance, uploadFile, uploadURI } =
    useBundler();

  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  const [file, setFile] = useState("");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const dataRef = useRef();

  function triggerOnChange() {
    dataRef.current.click();
  }

  async function handleFileChange(e) {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;
    setNftDetails({ ...nftDetails, image: uploadedFile });
    let reader = new FileReader();
    reader.onload = function () {
      if (reader.result) {
        setFile(Buffer.from(reader.result));
      }
    };
    reader.readAsArrayBuffer(uploadedFile);
  }

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

  const handleUpload = async () => {
    const { name, description, price, image } = nftDetails;
    if (name === "") {
      toast.error("Please provide name for NFT");
    } else if (description === "") {
      toast.error("Please provide description for NFT");
    } else if (price === "") {
      toast.error("Please provide Price");
    } else if (image === "") {
      toast.error("Please Select Image");
    } else {
      setLoading(true);
      const url = await uploadFile(file);
      uploadToArweave(url.data.id);
    }
  };

  const uploadToArweave = async (url) => {
    const { name, description } = nftDetails;

    const data = JSON.stringify({
      name,
      description,
      image: url,
    });

    const tokenURI = await uploadURI(data);

    mintNFT(tokenURI.data.id, url);
  };

  const mintNFT = async (tokenURI, url) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = await getContract();

      const price = ethers.utils.parseUnits(nftDetails.price, "ether");

      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();

      let transaction = await contract.createToken(tokenURI, price, {
        value: listingPrice,
      });
      await transaction.wait();

      const receipt = await provider.getTransactionReceipt(transaction.hash);
      const eventTopic = contract.interface.getEventTopic("MarketItemCreated");
      const logs = receipt.logs.filter((log) =>
        log.topics.includes(eventTopic)
      );
      const event = contract.interface.parseLog(logs[0]);
      const newTokenId = event.args.tokenId.toNumber(); // イベントからtokenIdを取得
      console.log(newTokenId);
      console.log(nftDetails.image);
      console.log(url);

      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API_URL + `nfts`,
        {
          name: nftDetails.name,
          description: nftDetails.description,
          price: nftDetails.price,
          image: url,
          tokenURI: tokenURI,
          tokenId: newTokenId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);

      // toast a error if response is not 200 or 201
      if (response.status !== 200 && response.status !== 201) {
        toast.error("Something went wrong");
        setLoading(false);
        return;
      }

      setLoading(false);

      setNftDetails({
        name: "",
        description: "",
        price: "",
        image: "",
      });

      setFile("");

      toast.success("Minted Successfully");

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", error);
      setLoading(false);
    }
  };

  if (!bundlrInstance) {
    return (
      <div className="bg-black justify-center items-center h-screen flex font-body flex-col">
        <h3 className="text-4xl font-bold sm:text-xl text-[#fff]">
          Let&apos;s Create now 💱
        </h3>
        {/* Let&apos;s initialise Bundlr now 💱 */}
        <button
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 
            dark:focus:ring-blue-800 font-medium rounded-full text-sm px-8 py-5 text-center mr-2 mb-2 transition-all ease-in-out delay-150 duration-150
            hover:translate-y-1 text-1xl hover:shadow-lg hover:shadow-blue-500/80 mt-2 cursor-pointer outline-none border-none"
          onClick={initialiseBundlr}
        >
          Create 💸
        </button>
        {/* Initialise Bundlr 💸 */}
      </div>
    );
  }

  if (
    !balance ||
    (Number(balance) <= 0 && !balance) ||
    Number(balance) <= 0.05
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <h3 className="text-4xl font-body text-center">
          NFT作成用トークンを手に入れよう🪙
        </h3>
        {/* Before Publishing NFT Please Add Some Funds.🪙 */}
        <FundWallet />
      </div>
    );
  }

  return (
    <div className="font-body bg-black">
      <Head>
        <title>Create NFT || Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>

      <Header />

      <h1 className="text-center text-white">Treasure Art Create NFT</h1>

      <div className="relative overflow-hidden">
        <section className="max-w-[1024px] my-20 mx-auto grid grid-cols-2  gap-10 font-body  overflow-hidden top-7 md:gap-10 medium md:px-5 sm:grid-cols-1 sm:h-full relative ">
          <div
            className="w-full bg-[#272D37]/60 rounded-3xl sm:h-[350px] border border-solid border-sky-700 cursor-pointer"
            onClick={triggerOnChange}
          >
            <input
              id="selectImage"
              style={{ display: "none" }}
              type="file"
              onChange={handleFileChange}
              ref={dataRef}
            />
            {nftDetails.image ? (
              <div className="w-full h-full flex justify-center items-center">
                <img
                  src={window.URL.createObjectURL(nftDetails.image)}
                  alt="image"
                  className="w-full h-full  sm:h-[350px] rounded-3xl p-2"
                />
              </div>
            ) : (
              <div className="h-full flex justify-center items-center ">
                <h2 className="text-center text-white ">
                  画像を選択してください。
                </h2>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col font-body gap-5">
            <div className="flex flex-col">
              <label className="text-2xl my-1 font-semibold text-white">
                タイトル
              </label>
              <input
                placeholder="title"
                className="px-5 py-3 rounded-xl text-white
               placeholder:text-slate-400 outline-none border-none  bg-[#272D37]/60 placeholder:font-body font-body"
                value={nftDetails.name}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, name: e.target.value })
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-2xl my-1 font-semibold text-white">
                説明文
              </label>
              <textarea
                placeholder="explanation"
                className="px-5 py-3 rounded-lg text-white placeholder:text-slate-400 bg-[#272D37]/60 border-none outline-none placeholder:font-body tx font-body"
                value={nftDetails.description}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, description: e.target.value })
                }
                rows="10"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-2xl my-1 font-semibold text-white">
                価格
              </label>
              <input
                type="number"
                placeholder="0.01"
                className="px-5 py-3 rounded-xl text-white
               placeholder:text-slate-400 outline-none border-none  bg-[#272D37]/60 placeholder:font-body font-body"
                value={nftDetails.price}
                onChange={(e) =>
                  setNftDetails({ ...nftDetails, price: e.target.value })
                }
              />
            </div>
            <button
              type="button"
              className="bg-[#1E50FF] outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer transition duration-250 ease-in-out  hover:drop-shadow-xl hover:shadow-sky-600 w-auto focus:scale-90"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? "Please Wait..." : "Create"}
            </button>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Create;
