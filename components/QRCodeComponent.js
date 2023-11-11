// components/QRCodeComponent.js

import QRCode from 'qrcode.react';

function QRCodeComponent({ value, size = 81 }) {
	return (
		<div className="w-[89px] h-[89px] bg-white p-1 z-10 ">
			<QRCode value={value} fgColor="#000000" size={size} className="top-0 w-[81px] h-[81px]" />
		</div>
	);
}

export default QRCodeComponent;
