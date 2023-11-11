import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from "next/router";
import Link from 'next/link';
import { QRCodeComponent } from "../components";

export default function Sampleplay() {
	const playlists = {

		ColorfulAnimal: [
			"/images/colorfulcat1.jpeg",
			"/images/colorfulcat2.jpeg",
			"/images/colorfuldog.jpeg",
			"/images/colorfulelephant.jpeg"
		],
		PixcelArt: [
			"/images/pixelart1.jpeg",
			"/images/pixelart2.jpeg",
			"/images/pixelart3.jpeg",
			"/images/pixelart4.jpeg"
		],
		Robot: [
			"/images/robot_1.jpeg",
			"/images/robot_2.jpeg",
			"/images/robot_3.jpeg",
			"/images/robot_4.jpeg"
		],
		Microscope: [
			"/images/cell_1.jpeg",
			"/images/cell_2.jpeg",
			"/images/cell_5.jpeg",
			"/images/cell_6.jpeg"
		],
		SF: [
			"/images/space alien.png",
			"/images/spaceboys.jpeg",
			"/images/spacewomen.png"
		]
	};
	const router = useRouter();

	const handleGoBack = () => {
		router.push('/');
	};


	const [currentPlaylist, setCurrentPlaylist] = useState('ColorfulAnimal');
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

	const nextSlide = () => {
		setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % playlists[currentPlaylist].length);
	};

	const prevSlide = () => {
		setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length);
	};

	const changePlaylist = (genre) => {
		setCurrentPlaylist(genre);
		setCurrentSlideIndex(0); // プレイリストを切り替えるときにスライドのインデックスをリセット
	};

	const qrCodeURL = "https://www.tresureart.com/";

	// 画像の自動切り替え
	useEffect(() => {
		const intervalId = setInterval(() => {
			nextSlide();
		}, 4000); // 4秒おきに次の画像に切り替え

		// コンポーネントがアンマウントされた場合に、intervalをクリアする
		return () => {
			clearInterval(intervalId);
		};
	}, [currentSlideIndex, currentPlaylist]);

	return (
		<>
			<Head>
				<title>Playlist（sample） || Treasure Art</title>
				<link rel="shortcut icon" href="logo.png" />
			</Head>


			<div className="flex items-center justify-center w-full h-screen bg-black">
				<div className="flex flex-col relative bg-[#1a1a1a] rounded-lg w-full max-w-lg max-h-[80%] h-auto mx-4 md:mx-0">
					<img
						src={playlists[currentPlaylist][currentSlideIndex]}
						alt={`Image from ${currentPlaylist} ${currentSlideIndex + 1}`}
						className="object-cover w-full h-full rounded-t-lg p-6"
					/>
					{/* <div className="flex justify-between items-center p-1 text-white w-full">
						<div className="flex flex-col md:flex-row md:items-center">
							<h2 className="text-lg font-bold mr-4">{currentPlaylist}</h2>
							
							<div className="flex items-center">
								<img
									className="w-8 h-6 rounded-[9px]"
									alt="MATIC"
									src="/images/polygonlogo-mono.png"
								/>
								<span className="ml-2 font-semibold leading-[32px]">
									0.01 MATIC 
								</span>
							</div>
						</div>
						<div className="flex justify-end items-center w-full py-2">
							<Link href={qrCodeURL} passHref>
								<a target="_blank" rel="noopener noreferrer">
									<QRCodeComponent
										value={qrCodeURL}
										className="w-1/4 max-w-[81px] h-1/4 max-h-[81px]"
									/>
								</a>
							</Link>
						</div>
					</div> */}

					<div className="flex justify-between items-center p-1 text-white w-full">
						<div className="flex justify-between items-center w-full">
							<h2 className="text-lg font-bold p-4">{currentPlaylist}</h2>
							<div className="flex items-center">
								<img
									className="w-8 h-6 rounded-[9px]"
									alt="MATIC"
									src="/images/polygonlogo-mono.png"
								/>
								<span className="ml-2 font-semibold leading-[32px] p-3">
									0.01 MATIC {/* 固定価格を表示 */}
								</span>
							</div>
						</div>
						<div className="flex justify-end items-center">
							<Link href={qrCodeURL} passHref>
								<a target="_blank" rel="noopener noreferrer">
									<QRCodeComponent
										value={qrCodeURL}
										className="w-1/4 max-w-[81px] h-1/4 max-h-[81px]"
									/>
								</a>
							</Link>
						</div>
					</div>


				</div>
				<button onClick={handleGoBack} className="absolute bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-slate-500 text-white">戻る</button>
			</div>



		</>
	);


}
