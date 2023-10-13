import Head from 'next/head';
import { useState } from 'react';

export default function ProfileArtist() {
	const [artistName, setArtistName] = useState('');
	const [profile, setProfile] = useState('');
	const [pr, setPR] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		// データをJSON形式で送信する
		const formData = {
			artistName,
			profile,
			pr
		};

		try {
			const response = await fetch('YOUR_BACKEND_ENDPOINT_HERE', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (!response.ok) {
				throw new Error('Failed to submit data');
			}

			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error('There was an error submitting the form', error);
		}
	};
	return (
    <div className="flex flex-col w-full min-h-screen text-white font-[var(--font-inter)] bg-black">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>ArtVisionary</title>
      </Head>

      <div className="flex flex-row md:flex-col justify-center items-center h-[362px] mx-4 mt-8 md:mt-32">
        <div className="text-2xl flex-grow mb-4 md:mb-0 md:mr-4">
          <p className="md:text-xl leading-relaxed">
            <br />
            <br />
            <br />
            <span style={{ fontSize: "2em", color: "#E57373" }}>
              作品を購入したいメンバーへ
            </span>
            <br />
            好きな作品を♡するだけで
            <br />
            あなた好みのプレイリストをスライド再生できます。インテリアとして、モニターのスリープ機能として
            <br />
            アート作品をお楽しみください。
            <br />
            気に入った作品はリストから購入も可能。
            <br />
            あなた以外が購入した場合は、インセンティブをお支払いします。
            <br />
            <span style={{ fontSize: "2em", color: "#E57373" }}>
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

        <img
          className="w-44 md:w-44 h-44 md:h-44 object-cover mt-4 md:mt-4"
          alt="絵2"
          src="/images/shop1@2x.png"
        />
      </div>

      <div className="flex justify-center items-center mt-12 text-[var(--font-size-13xl)]">
        <img className="w-44 h-0.5" alt="" src="/images/vector-3.svg" />
        <div className="mx-4 font-medium">member登録</div>
        <img className="w-44 h-0.5" alt="" src="/images/vector-4.svg" />
      </div>

      <div className="flex flex-col items-center w-full">
        <div className="flex justify-center items-center w-full max-w-xs h-[153px] md:h-[203px] rounded-full bg-white hover:bg-gray-400 text-black hover:text-gray-700 text-base mt-4 transition duration-300">
          <label className="font-semibold leading-[18px]">
            <input type="file" className="hidden" />
            <p className="m-0">Select image file</p>
            <p className="m-0">or</p>
            <p className="m-0">Drop it here</p>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col items-center mt-4">
          <label className="w-full max-w-xl leading-[150%] font-medium tracking-tight">
            登録名（ショップ名）
            <input
              type="text"
              className="w-full h-[48px] mt-2 bg-gray-200 border border-black rounded-[var(--br-xs)] p-2"
            />
          </label>

          <label className="w-full max-w-xl leading-[150%] font-medium tracking-tight mt-4">
            プロフィール
            <textarea className="w-full h-[140px] mt-2 bg-gray-200 border border-black rounded-[var(--br-xs)] p-2"></textarea>
          </label>

          <label className="w-full max-w-2xl leading-[150%] font-medium tracking-tight mt-4">
            コミュニティーへ自己紹介
            <textarea className="w-full h-[360px] mt-2 bg-gray-200 border border-black rounded-[var(--br-xs)] p-2"></textarea>
          </label>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          <div className="flex flex-col items-center space-y-4 w-full max-w-2xl mt-4">
            <div className="w-full max-w-md leading-[150%] font-medium tracking-tight text-white">
              <p className="m-0">
                利用規約を必ずお読みいただき、同意の上、登録をしてください。
              </p>
              <label className="cursor-pointer mt-2">
                <input type="checkbox" className="mr-2" />
                利用規約に同意する
              </label>
            </div>

            <button
              type="submit"
              className="w-full max-w-xl h-[58px] bg-#444 rounded-[var(--br-xs)] flex items-center justify-center text-lg  mt-2"
            >
              登録/更新する
            </button>
          </div>

          <button className="w-[117px] h-[21px] border border-white rounded-[8px] flex items-center justify-center text-[var(--font-size-3xs)]  mt-4 mb-4">
            削除する
          </button>
        </div>
      </form>
    </div>
  );
}
