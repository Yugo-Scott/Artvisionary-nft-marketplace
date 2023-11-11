import Head from "next/head";
import Image from "next/image";
import data from "../constants/mock-nft.json";
import mockartist from "../constants/mock-artist.json";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Footer, Header, Slideshow2 } from "../components";
import Link from 'next/link';

export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const [addr, setAddr] = useState("");

  const router = useRouter();

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
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    const addr = localStorage.getItem("walletAddress");
    if (addr) {
      setIsWalletConnected(true);
      setAddr(addr);
    }
  }, []);


  const playlists = {

    ColorfulAnimal: [
      "/images/colorfulcat1.jpeg",
      "/images/colorfulcat2.jpeg",
      "/images/colorfuldog.jpeg",
      "/images/colorfulelephant.jpeg",
      "/images/pixelart1.jpeg",
      "/images/pixelart2.jpeg",
      "/images/pixelart3.jpeg",
      "/images/pixelart4.jpeg",
      "/images/robot_1.jpeg",
      "/images/robot_2.jpeg",
      "/images/robot_3.jpeg",
      "/images/robot_4.jpeg",
      "/images/cell_1.jpeg",
      "/images/cell_2.jpeg",
      "/images/cell_5.jpeg",
      "/images/cell_6.jpeg",
      "/images/space alien.png",
      "/images/spaceboys.jpeg",
      "/images/spacewomen.png"
    ]
  };

  return (
    <div className="bg-black top-0">
      <Head>
        <title>Treasure Art</title>
        <link rel="shortcut icon" href="logo.png" />
      </Head>

      {/* <div className="bg-[#1242ef] absolute left-[-250px] top-[-210px] h-[352px] w-[652px] blur-[350px] rounded-full "></div> */}

      {isWalletConnected || addr ? <Header /> : null}



      <div className="relative overflow-hidden bg-black">

        <section className="max-w-[1240px]  mb-10 mx-auto grid grid-cols-3 gap-2 font-body h-[930px] overflow-hidden top-7 md:gap-12 medium md:px-1 lg:grid-cols-1 sm:h-full relative">



          <div className="relative flex flex-col items-center justify-center h-full min-h-[56vh] sm:items-center z-10">

            <div className="absolute top-0 left-0 w-full h-[0px] pb-full">
              <img src="/images/heroimage3.jpeg" className="absolute top-0 left-0 w-[581px]  object-cover h-[581px] " alt="Background Image" />
            </div>
            {/* <div className="absolute top-[calc(30%+12.5%)] left-[15px] w-full"> */}
            <div className="absolute  top-[calc(30%+12.5%)] lg:top-[calc(50%+12.5%)] md:top-[calc(80%+12.5%)] sm:top-[calc(115%+12.5%)] left-[15px] w-full">
              {addr ? (
                <button
                  type="button"
                  className="bg-[#1E50FF] text-white outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer transition duration-250 ease-in-out hover:scale-125 hover:drop-shadow-xl hover:shadow-sky-600 w-auto focus:scale-90 z-100"

                  onClick={() => {

                    window.location.href = "/createnft";
                  }}
                >
                  Create an NFT
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-[#1E50FF] text-white  outline-none border-none py-3 px-5 rounded-xl font-body cursor-pointer duration-250 ease-in-out hover:transform-x-1 hover:drop-shadow-xl hover:shadow-sky-600 w-auto transition transform hover:-translate-y-3 motion-reduce:transition-none motion-reduce:hover:transform-none z-100"
                  onClick={connectWallet}
                >
                  Wallet接続
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center relative  left-1/2 -translate-x-1/2 z-30 transition-transform duration-500 w-[110%] lg:w-full">
            <img src="/images/Treasure Art_LOGO_L.png" className="w-[581px] max-w-full h-auto z-10 lg:-mt-96 md:-mt-80 sm:-mt-80" alt="Foreground Image" />
            <p className="text-white text-base md:text-xs text-center z-10 mt-20   md:mb-96">
              「育つ財宝」を探し出すアートマーケットプレイス！<br />
              あなたの目が選んだアートピースがショーケースに並びます。<br />
              ディスプレイして鑑賞するだけでなく、売ることもできる。<br />
              自分だけのコレクションにもできる。<br />
              アートを楽しめば楽しむほど、アーチストの応援になります。<br />
            </p>
          </div>

          {/* <div className="flex flex-col items-center mt-20 lg:mt-[-190px] md:mt-36  ml-[-14rem] w-[581px] md:w-[581px] lg:w-[581px] sm:w-full z-30 transform transition-transform duration-500 lg:translate-y-[-68%] md:translate-y-[-80%] sm:translate-y-[-120%] lg:ml-0 md:ml-0 sm:ml-0">
            <img src="/images/Treasure Art_LOGO_L.png" className="w-full h-auto z-10" alt="Foreground Image" />
            <p className="mt-72 text-white text-lg md:text-xs  text-center z-10 lg:mt-64 md:mt-64 sm:top-60">
              「育つ財宝」を探し出すアートマーケットプレイス！<br />
              あなたの目が選んだアートピースがショーケースに並びます。<br />
              ディスプレイして鑑賞するだけでなく、売ることもできる。<br />
              自分だけのコレクションにもできる。<br />
              アートを楽しめば楽しむほど、アーチストの応援になります。<br />
            </p>

          </div> */}


          <div className="flex justify-center">

            <div className="w-[350px] h-[480px] bg-[#272D37]/60 rounded-2xl flex flex-col p-6 sm:h-max mt-16  sm:mt-[-10rem] sm:mb-4 sm:p-3 md:mx-10">
              <Slideshow2 playlists={playlists} width="300" height="300" />
              <div className="">
                <h1 className="text-[#ADB9C7]">example</h1>
                <div className="h-[56px] flex justify-between">
                  <div className="flex flex-row gap-2">
                    <img
                      src="images/mockcreator.jpg"
                      alt="creator-image"
                      className="h-[36px] w-[36px] rounded-xl"
                    />
                    <div>
                      <p className="my-1 text-base text-[#8F9CA9]">Creator </p>
                      <h4 className="my-0 text-[#ADB9C7]">0x00...</h4>
                    </div>
                  </div>
                  <div>
                    <p className="my-1 text-[#8F9CA9]">Price</p>
                    <h4 className="my-0 text-[#ADB9C7]">1.0 MATIC</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>




        {/* <section className="max-w-[1240px] mt-[-7rem] mb-20 mx-auto  gap-2 font-body top-7 "> */}
        <section className="max-w-[1240px] mt-10 mb-20 mx-auto  gap-2 font-body top-7 ">
          <h1 className="text-center w-full text-[#fff]">Create and sell your NFTs</h1>

          <div className="top-7 grid grid-cols-3 gap-5 sm:grid-cols-1 sm:p-0 md:grid-cols-1 md:mx-10">
            {data.map((item) => (
              <div
                key={item.id}
                className="w-full bg-[#272D3799] flex flex-col justify-center items-center p-3 rounded-xl"
              >
                <div className="w-[80px] h-[80px] flex  justify-center items-center ">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full"
                  />
                </div>
                <h4 className="font-bold text-[24px] text-[#ADB9C7] md:text-[14px]">
                  {item.title}
                </h4>
                <p className="text-center text-[#ADB9C7] text-[14px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-[1240px] my-20 mx-auto  gap-2 font-body top-7 ">
          <h1 className="text-center w-full text-[#fff]">Show case</h1>

          <div className="grid grid-cols-4 gap-3 sm:gap-y-8 md:grid-cols-2 sm:grid-cols-1 sm:p-0 md:mx-10">
            {mockartist.map((data) => (
              <Link href={`/${data.name}`} key={data.id}>
                <a className="w-full bg-[#272D3799] flex flex-col justify-center items-center p-3 rounded-xl">
                  <div className="w-full relative" style={{ paddingBottom: '100%' }}>
                    <img
                      src={data.bgImage}
                      alt={data.name}
                      layout="responsive"
                      className="absolute w-full h-full rounded-2xl object-fit: contain"
                    />
                  </div>
                  <div className="w-full text-center mt-8 font-bold text-[#ADB9C7]">
                    <h3>{data.name}</h3>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </section>



        {/* Community */}
        {/* <section className="max-w-[1240px] bg- my-20 mx-auto bg-[#272D3799] gap-2 font-body top-7 text-center rounded-xl sm:mx-10 md:m-10 border border-solid border-sky-600">
          <div>
            <h1 className="text-2xl sm:text-2xl text-[#ADB9C7]">Create Your Own NFT!</h1>
            <p className="text-[#ADB9C7] px-[120px] sm:p-2 ms:p-1">
              We have a large scale group to support each other in this game,
              Join us to get the news as soon as possible and follow our latest
              announcements!
            </p> }

      </div>
    </section> */}

        < Footer />
      </div >
    </div >
  );
}
