<template>
  <!--音乐控制面板-->
  <div class="hs-position-absolute hs-top-0050 hs-left-0050 hs-transform-translate--0050" >
      <el-button @click="switchSong(false)">上一首</el-button>
      <el-button @click="pauseOrPlaySong()" v-show="!paused">暂停</el-button>
      <el-button @click="pauseOrPlaySong()" v-show="paused">播放</el-button>
      <el-button @click="switchSong(true)" >下一首</el-button>
  </div>
</template>

<script setup>
    import {ref} from "vue";
    import common_api_action from "@/js/common_api_action";
    import { useMusicStore } from "@/store/music";
    import ApiSqlite from "@/js/ApiSqlite";
    const path = require('path');
    const musicStore = useMusicStore()
    const db = new ApiSqlite(path.resolve(import.meta.env.DEV?"public/":"resources/", "db/music_data.db"));

    const paused = ref (true); // 是否暂停
    const isNextData = ref(true)   // 记录上一曲下一曲状态

    /**
     * 换音乐(下一首或上一首)
     * 主要改变当前音乐索引值：songIndex.value
     * @param isNext
     */
    const  switchSong = (isNext)=> {
      if (musicStore.musicList.length>0) {
          // 改变当前播放音乐索引值：songIndex
          isNextData.value = isNext // 记录上一曲下一曲状态
          if(isNext){ // 下一曲
            if(musicStore.songIndexObj.index >= musicStore.musicList.length - 1){ // 判断是否是最后一个
              musicStore.songIndexObj.index = 0
            }else{
              musicStore.songIndexObj.index++
            }
          }else{ // 上一曲
            if(musicStore.songIndexObj.index<=0){ // 判断是否是第一个
              musicStore.songIndexObj.index = musicStore.musicList.length - 1
            }else{
              musicStore.songIndexObj.index--
            }
          }
      }
    }

    /**
     * 播放和暂停
     */
    const  pauseOrPlaySong=()=> {
      musicStore.audioRef.paused? musicStore.audioRef.play():musicStore.audioRef.pause();
      paused.value = musicStore.audioRef.paused
    }

    // dom挂载完成事件
    nextTick(() => {
       // 当前音乐播放完毕监听
      musicStore.audioRef.addEventListener("ended", () => {
       switchSong(true)
     })

    /*监听音频是否能正确播放*/
    musicStore.audioRef.addEventListener('canplaythrough', function() {
      /*如果歌词不存在，获取歌词*/
      if(musicStore.curPlayMusicObj.lyric===""){ //判断歌词是否存在
        console.log("歌词不存在,触发了动态加载歌词！")
        common_api_action.hs_get_wyy_music_lyric(musicStore.curPlayMusicObj.music_id).then((data)=>{ // ajax在线获取歌词
          // 首先给当前播放音乐赋值歌词
          musicStore.curPlayMusicObj.lyric = data.lrc.lyric

          //  将歌词数据保存到本地数据库
          db.update(
              `update my_playing_music_list set lyric=? where music_id=${musicStore.curPlayMusicObj.music_id}`,
              [data.lrc.lyric]
          ).then((result)=>{
            if(result==="ok"){
              console.log("歌词已缓存到本地数据库！")
            }
          })
        }).catch((err)=>{
          console.log(err)
        })
      }
    });

    /*监听播放错误事件*/
    musicStore.audioRef.addEventListener('error', function() {
      if(isNextData.value){ // 下一曲
        switchSong(true)
      }else{ // 上一曲
        switchSong(false)
      }
      ElMessage({
        showClose: true,
        duration:3000,
        message: '音频文件加载失败,已为您自动跳过！',
        type: 'warning',
      })
    });
  });
</script>

<style scoped>

</style>