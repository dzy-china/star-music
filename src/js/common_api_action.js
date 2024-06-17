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
				// 导航到指定的URL，触发AJAX请求
				await page.goto(`https://music.163.com/song?id=${music_id}`);

				// 监听页面的网络响应
				page.on('response', async response => {
					// 获取响应的URL(请求被处理的具体地址)
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
			} catch (error) {
				// 如果过程中有任何错误，打印错误信息
				reject(error)
			} finally {
				// 最后关闭浏览器
				await browser.close();
			}
		})
	},

	// 获取音乐url和歌词(备选方案)
	hs_get_wyy_music_and_lyric  (music_id) {
		return new Promise( async (resolve, reject)=>{
			// 启动浏览器
			const browser = await puppeteer.launch();
			try {
				// 创建一个新页面
				const page = await browser.newPage();

				// 导航到目标网页
				await page.goto(`https://music.163.com/#/song?id=${music_id}`);

				// 等待iframe加载完成
				await page.waitForSelector('#g_iframe');

				// 获取iframe
				const iframeElement = await page.$('#g_iframe');

				// 获取iframe上下文
				const frame = await iframeElement.contentFrame();

				// 等待元素加载完成
				await frame.waitForSelector("#content-operation");

				// 读取特定元素的内容
				const text = await frame.$eval("#content-operation > [data-res-action=play]", el => el.textContent);
				if(text==="播放"){
					// 在iframe中对找到的元素模拟点击事件
					await frame.click("#content-operation > [data-res-action=play]");

					// 监听页面的网络响应
					const music_msg = {
						lyric:'',
						src:'',
					}
					page.on('response', async response => {

						// 获取响应的URL(请求被处理的具体地址)
						const url = response.url();

						// 获取响应对应的请求对象
						const request = response.request();

						// 歌曲：https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=
						if (url.startsWith('https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=') && request.method() === 'POST') {
							// 解析出歌曲
							const responseData = await response.json(); // 尝试将响应内容解析为JSON格式
							if(responseData.code === 200 ){
								music_msg.src = responseData.data[0].url
								if(music_msg.lyric!==''){
									resolve(music_msg)
									await browser.close();  // 最后关闭浏览器
								}
							}else{
								reject(responseData)
							}
							// 歌词：https://music.163.com/weapi/song/lyric?csrf_token=
						} else if (url.startsWith('https://music.163.com/weapi/song/lyric?csrf_token=') && request.method() === 'POST') {
							// 解析出歌词
							const responseData = await response.json(); // 尝试将响应内容解析为JSON格式

							if(responseData.code === 200 ){
								music_msg.lyric = responseData.lrc.lyric
								if(music_msg.src!==''){
									resolve(music_msg)
									await browser.close();  // 最后关闭浏览器
								}

							}else{
								reject(responseData)
							}
						}
					});
				}else{
					reject("vip")
					browser.close();  // 最后关闭浏览器
				}



			} catch (error) {
				// 如果过程中有任何错误，打印错误信息
				reject(error)
			}
		})
	}
}
