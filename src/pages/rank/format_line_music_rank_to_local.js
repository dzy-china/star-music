
/**
 * 集数据本地格式化
 * @param line_music_array
 * @returns {*[]}
 */
const format_line_music_rank_to_local = (line_music_array)=>{
    const wyy_array_list = []
    for (const music_array_val of line_music_array) {
        let music_id = music_array_val.id
        let title = music_array_val.name
        let img = music_array_val.album.picUrl
        let src = `https://music.163.com/song/media/outer/url?id=${music_array_val.id}.mp3`
        let lyric = ""
        let duration = music_array_val.duration
        const artists_name = ((artists)=>{ // 歌手名称
            let artists_name_array = []
            for (const artists_val of artists) {
                artists_name_array.push(artists_val.name)
            }
            return artists_name_array.join("/")
        })(music_array_val.artists)
        wyy_array_list.push({music_id, title, img, src, lyric, duration, artists_name})
    }
    return wyy_array_list
}
export default format_line_music_rank_to_local