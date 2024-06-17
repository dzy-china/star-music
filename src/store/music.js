import { defineStore } from 'pinia'
import {computed, ref} from "vue";
import ApiSqlite from "@/js/ApiSqlite";
const path = require("path");

export const useMusicStore = defineStore('music', () => {
    const musicList = ref([]); ////歌曲列表
    let songIndexObj = ref({index:0}); // 当前音乐的索引,默认从第一首开始
    const audioRef = ref(null); //音乐对象
    const isPaused = ref(true); // 音乐是否处于暂停状态(主要记录最近的能正常播放音乐的最后播放状态)
    const db = new ApiSqlite(path.resolve(import.meta.env.DEV?"public/":"resources/", "db/music_data.db"));

    // 搜索的音乐数据
    const search_music_data = ref({
        startOffset:0, // 起始索引
        pageSize:10, // 每页条数
        totalCount:0, // 总条数
        data: []  // 数据
    });

    //正在播放的音乐数据
    const curPlayMusicObj = computed(() => musicList.value.length>0 ? musicList.value[songIndexObj.value.index]:({}) );

    return {
        musicList,
        songIndexObj,
        audioRef,
        isPaused,
        curPlayMusicObj,
        db,
        search_music_data
    }
})