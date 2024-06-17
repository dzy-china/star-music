
/**
 * 采集线上搜索音乐数据 本地格式化
 * @param line_music_data
 * @returns {*[]}
 */
export default (line_music_data)=> {
    const wyy_music_search_data = {
        totalCount:0,
        data: []
    }

    const code = line_music_data.code
    if(code === 200 && line_music_data?.result?.songCount>0){
        wyy_music_search_data.totalCount = line_music_data.result.songCount // 总音乐条数
        const line_music_array = line_music_data.result.songs // 音乐数据
        for (const music_array_val of line_music_array) {
            let music_id = music_array_val.id
            let title = music_array_val.name
            let img = music_array_val.album.artist.img1v1Url
            let src = `https://music.163.com/song/media/outer/url?id=${music_array_val.id}.mp3`
            let lyric = ""
            let duration = music_array_val.duration
            const artists_name = ((artists) => { // 歌手名称
                let artists_name_array = []
                for (const artists_val of artists) {
                    artists_name_array.push(artists_val.name)
                }
                return artists_name_array.join("/")
            })(music_array_val.artists)
            wyy_music_search_data.data.push({music_id, title, img, src, lyric, duration, artists_name})
        }
    }

    return wyy_music_search_data
}