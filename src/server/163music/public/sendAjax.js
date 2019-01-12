var querystring = require('querystring');
var https = require('https');
import { asrsea } from '../public/base.js';
import axios from 'axios';

export function sendAjax({ url, param, callback }) {
	var bMi1x = asrsea(
		JSON.stringify(param),
		'010001',
		'00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7',
		'0CoJUm6Qyw8W8jud'
	);

	const postData = querystring.stringify({
		params: bMi1x.encText,
		encSecKey: bMi1x.encSecKey
	});

	// const options = {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded',
	// 		'Content-Length': Buffer.byteLength(postData)
	// 	},
	// 	url: url
	// };

	// const req = https.request(options, (res) => {
	// 	if (res.statusCode === 200) {
	// 		res.setEncoding('utf8');
	// 		let str = '';
	// 		res.on('data', (data) => {
	// 			str += data;
	// 		});
	// 		res.on('end', () => {
	// 			str = JSON.parse(str);
	// 			typeof callback === 'function' && callback(str);
	// 		});
	// 	}
	// });

	// req.on('error', (e) => {
	// 	console.error(`请求遇到问题: ${e.message}`);
	// });

	// // 将数据写入到请求主体。
	// req.write(postData);
	// req.end();

	axios.post(url, postData).then((res) => {
		console.log(res);
	});
}
