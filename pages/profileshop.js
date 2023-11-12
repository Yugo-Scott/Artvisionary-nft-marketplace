import Head from 'next/head';
import { useState, useCallback } from 'react';
import Image from "next/image";
import axios from 'axios';
import { authenticate } from './index'; 
import { ethers } from 'ethers'; 
import { useRouter } from 'next/router';

export default function ProfileArtist() {
	const [name, setName] = useState('');
	const [bio , setBio] = useState('');
	const [content, setContent] = useState('');
	const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [accessToken, setAccessToken] = useState('');


	// const [addr, setAddr] = useState("");
	// const [account, setAccount] = useState("");
	// const [isWalletConnected, setIsWalletConnected] = useState(false);
    const router = useRouter();

      const authenticate = useCallback(
        async (account) => {
          const response = await axios.post(
            process.env.NEXT_PUBLIC_BACKEND_API_URL + `auth/nonce`,
            { address: account }
          );

          const { temptoken, message } = response.data;

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const signature = await signer.signMessage(message);

          console.log(signature);
          console.log(account);
          console.log(message);
          console.log(temptoken);

          const authResponse = await axios.post(
            process.env.NEXT_PUBLIC_BACKEND_API_URL + `auth/verify`,
            {
              address: account,
              signature: signature,
              message: message,
              temptoken: temptoken,
            }
          );
          const { token } = authResponse.data;
          localStorage.setItem('accessToken', token);
          setAccessToken(token);
          try {
            localStorage.setItem('accessToken', token);
            console.log('Stored token:', localStorage.getItem('accessToken'));
          } catch (error) {
            console.error('Error storing token:', error);
          }

          return token;
        },
        []
      );
		// ファイルが選択された時の処理
  	const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // 画像のプレビュー
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
  };

	//   const connectWallet = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       alert("Please Install MetaMask");
  //       return;
  //     }
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     setIsWalletConnected(true);
  //     localStorage.setItem("walletAddress", accounts[0]);
  //     // use authenticate();
  //     setAccount(accounts[0]);
  //     setAddr(accounts[0]);
  //     console.log(accounts[0]);
	// 	} catch (error) {
	// 		console.error('There was an error connecting wallet', error);
	// 	}
	// };


	const handleSubmit = async (e) => {
		e.preventDefault();
		const addr = localStorage.getItem("walletAddress");
		// if (!isWalletConnected) {
		// 	connectWallet();
		// } else {
		
		// データをJSON形式で送信する
		const formData = {
      name,
      bio,
      content,
      user_id: addr,
      profile_image: image
    };

		try {
			const response = await axios.post(
				process.env.NEXT_PUBLIC_BACKEND_API_URL + `users/register`,
				formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

			console.log(response);
      if (response.status === 201) {
        await authenticate(addr); // Authenticate the user
        router.push('/dashboard'); // Redirect to the dashboard
      }
		} catch (error) {
			console.error('There was an error submitting the form', error);
		}
	// }
	}



	return (
    <div className="flex flex-col w-full min-h-screen text-white font-[var(--font-inter)] bg-black">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>ArtVisionary</title>
      </Head>

      <div className="flex flex-row justify-between items-start gap-20 mx-4 md:mt-32">
        <div className="text-2xl w-1/2">
          <p className="md:text-xl leading-relaxed text-gray-300">
            <span style={{ fontSize: '1.5em', color: '#FAD52A' }}>
              作品を購入したいメンバーへ
            </span>
            <br />
            好きな作品を♡するだけで
            <br />
            あなた好みのプレイリストをスライド再生できます。
            <br />
            インテリアとして、モニターのスリープ機能として
            <br />
            アート作品をお楽しみください。
            <br />
            気に入った作品はリストから購入も可能。
            <br />
            あなた以外が購入した場合は、
             <br />
            インセンティブをお支払いします。
          </p>
        </div>
        <div className="text-2xl w-1/2">
          <p className="md:text-xl leading-relaxed text-gray-300">
            <span style={{ fontSize: '1.5em', color: '#FAD52A' }}>
              作品を販売したいメンバーへ
            </span>
            <br />
            あなたも作品を登録してください。
            <br />
            スライドショーでご覧いただけるようになります。
            <br />
            オンラインギャラリーとして
            <br />
            アーチスト活動にお役立てください。
            <br />
            付与されたQRコードで販売することが可能です。
            <br />
          </p>
        </div>

        {/* <img
          className="w-44 md:w-44 h-44 md:h-44 object-cover mt-4 md:mt-4"
          alt="絵2"
          src="/images/shop1@2x.png"
        /> */}
      </div>

      <div className="flex justify-center items-center mt-12 text-[var(--font-size-13xl)]">
        <img className="w-44 h-0.5" alt="" src="/images/vector-3.svg" />
        <div className="mx-4 font-medium text-gray-300">member登録</div>
        <img className="w-44 h-0.5" alt="" src="/images/vector-4.svg" />
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center w-full max-w-xs h-58 rounded-full  bg-gray-300 text-black text-base mt-4 transition duration-300">
          <label className="flex justify-center items-center h-full w-full cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              name="profile_image"
              onChange={handleImageChange}
            />
            {previewImage ? (
              // 画像がある場合は、プレビューを表示
              <img
                src={previewImage}
                alt="Preview"
                className="rounded-full w-full h-full object-cover"
              />
            ) : (
              // 画像がない場合は、テキストを表示
              <div className="flex flex-col items-center ">
                <p className="m-0">Select image file</p>
                <p className="m-0">or</p>
                <p className="m-0">Drop it here</p>
              </div>
            )}
          </label>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mt-4 text-gray-300">
          <label className="w-full max-w-2xl leading-[150%] font-medium tracking-tight">
            登録名（メンバー名）
            <input
              type="text"
              className="w-full h-[48px] mt-2 bg-gray-300 border border-black p-2 rounded-xl"
              value={name}
              placeholder="メンバー名"
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="w-full max-w-2xl leading-[150%] font-medium tracking-tight mt-4">
            プロフィール
            <textarea
              className="w-full h-36 mt-2  bg-gray-300 border border-black rounded-xl p-2"
              value={bio}
              placeholder="プロフィール"
              name="bio"
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </label>

          <label className="w-full max-w-2xl leading-[150%] font-medium tracking-tight text-gray-300">
            コミュニティーへ自己紹介
            <textarea
              className="w-full h-[360px] mt-2 bg-gray-300 border border-black rounded-xl p-2"
              value={content}
              placeholder="コミュニティーへ自己紹介"
              name="content"
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </label>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4 w-full max-w-lg mt-4">
            {/* <div className="w-full max-w-md leading-[150%] font-medium tracking-tight text-white">
              <p className="m-0">
                利用規約を必ずお読みいただき、同意の上、登録をしてください。
              </p>
              <label className="cursor-pointer mt-2">
                <input type="checkbox" className="mr-2" />
                利用規約に同意する
              </label>
            </div> */}

            <button
              type="submit"
              className="max-w-xs h-[58px] bg-gray-300 rounded-xl flex items-center justify-center text-lg px-8 mt-2"
            >
              登録
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
