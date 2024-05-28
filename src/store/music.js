import { defineStore } from 'pinia'
import {computed, ref} from "vue";

export const useMusicStore = defineStore('music', () => {
    const musicList = ref([]); ////歌曲列表
    let songIndexObj = ref({index:0}); // 当前音乐的索引,默认从第一首开始
    const audioRef = ref(null); //音乐对象

    //正在播放的音乐数据
    const curPlayMusicObj = computed(() => musicList.value.length>0 ? musicList.value[songIndexObj.value.index]:({}) );

    return {
        musicList,
        songIndexObj,
        audioRef,
        curPlayMusicObj
    }
})