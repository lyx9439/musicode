var { sendAjax } = require('../public');
const URL = 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token=';

exports.search = function(keywords, callback) {
	sendAjax({
		url: URL,
		param: {
			csrf_token: '',
			hlposttag: '</span>',
			hlpretag: '<span class="s-fc7">',
			limit: '30',
			offset: '0',
			s: keywords,
			total: 'true',
			type: '1'
		},
		callback: (res) => {
			var songs = [];
			if (res && res.result && res.result.songs) {
				songs = res.result.songs.slice(0, 3);
			}
			typeof callback === 'function' && callback(songs);
		}
	});
};
