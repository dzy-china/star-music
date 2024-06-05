import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import ApiSqlite from "@/js/ApiSqlite";
const path = require("path");

export const useMusicStore = defineStore('music', () => {
    const musicList = ref([]); ////歌曲列表
    let songIndexObj = ref({index:0}); // 当前音乐的索引,默认从第一首开始
    const audioRef = ref(null); //音乐对象
    const db = new ApiSqlite(path.resolve(import.meta.env.DEV?"public/":"resources/", "db/music_data.db"));

    //正在播放的音乐数据
    const curPlayMusicObj = computed(() => musicList.value.length>0 ? musicList.value[songIndexObj.value.index]:({}) );

    return {
        musicList,
        songIndexObj,
        audioRef,
        curPlayMusicObj,
        db
    }
})