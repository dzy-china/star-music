const puppeteer = require('puppeteer');
import Http from "@/js/Http"

export default{

	/**
	 *  利用 官方api 获取歌词(优选方案)
	 * @param music_id
	 * @returns {Promise<unknown>}
	 */
	hs_get_music_lyric(music_id){
		return new Promise( async (resolve, reject)=>{
			new Http({
				url:`https://music.163.com/api/song/lyric?os=pc&id=${music_id}&lv=-1&kv=-1&tv=-1`, //自定义参数：请求网址
				method:'get', // 请求方式，不区分大小写，默认值： 'GET'
			}).go().then(data => {
				let dataJson = JSON.parse(data)
				if(dataJson?.lrc?.lyric && dataJson?.lrc?.lyric!==''){
					resolve(dataJson.lrc.lyric);
				}else{
					reject(dataJson);
				}
			}).catch(err => {
				reject(err);
			});
		})
	},

	/**
	 *  利用 puppeteer 模拟浏览器请求获取歌词(备选方案)
	 * @param music_id
	 * @returns {Promise<unknown>}
	 */
	 hs_get_wyy_music_lyric(music_id){
		return new Promise( async (resolve, reject)=>{
			// 启动浏览器
			const browser = await puppeteer.launch();
			try {
				// 创建一个新页面
				const page = await browser.newPage();

				// 监听页面的网络响应
				page.on('response', async response => {
					// 获取响应的URL
					const url = response.url();
					// 获取响应对应的请求对象
					const request = response.request();

					// 检查是否为特定的POST请求
					if (url.startsWith('https://music.163.com/weapi/song/lyric?csrf_token=') && request.method() === 'POST') {
						try {
							// 尝试将响应内容解析为JSON格式
							const responseData = await response.json();
							resolve(responseData)
						} catch (error) {
							// 如果解析失败，打印错误信息
							reject(error)
						}
					}
				});

				// 导航到指定的URL，触发AJAX请求
				await page.goto(`https://music.163.com/song?id=${music_id}`);
			} catch (error) {
				// 如果过程中有任何错误，打印错误信息
				reject(error)
			} finally {
				// 最后关闭浏览器
				await browser.close();
			}
		})
	}
}
