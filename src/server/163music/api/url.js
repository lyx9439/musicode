var sendAjax = require('../public/sendAjax').sendAjax;
const URL = 'https://music.163.com/weapi/song/enhance/player/url?csrf_token=';

export function url(id, callback) {
	sendAjax({
		url: URL,
		param: {
			br: 128000,
			csrf_token: '',
			ids: JSON.stringify(typeof id === 'string' ? [ id ] : id)
		},
		callback: (res) => {
			var urls = [];
			if (res && res.data && Array.isArray(res.data)) {
				urls = res.data.map((e) => e.url);
			}
			typeof callback === 'function' && callback(urls);
		}
	});
}
