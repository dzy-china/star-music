<template>
  <!--音乐控制面板-->
  <div class="hs-position-absolute hs-top-0050 hs-left-0050 hs-transform-translate--0050" >
      <el-button @click="switchSong(false)">上一首</el-button>
      <el-button @click="playSong()" v-show="!paused">暂停</el-button>
      <el-button @click="playSong()" v-show="paused">播放</el-button>
      <el-button @click="switchSong(true)" >下一首</el-button>
  </div>
</template>

<script setup>
    import {ref} from "vue";

    // 定义 props
    const props = defineProps({
      musicList: { // 歌曲列表
        type: Array,
        default: ()=>[]
      },
      songIndexObj: { // 歌曲索引
        type: Object,
        default: ()=>({index:0})
      },
      audioRef: { // 音乐元素对象
        type: Object,
        default: ()=>({})
      }
    })

    const paused = ref (true); // 是否暂停

    /**
     * 换音乐(下一首或上一首)
     * 主要改变当前音乐索引值：songIndex.value
     * @param isNext
     */
    const  switchSong = (isNext)=> {
      // 改变当前播放音乐索引值：songIndex
      if (props.musicList.length>0) {
        props.songIndexObj.index === props.musicList.length - 1 ? props.songIndexObj.index = 0 : isNext ? props.songIndexObj.index++ : props.songIndexObj.index === 0 ? props.songIndexObj.index = props.musicList.length - 1 : props.songIndexObj.index--;
      }
    }

    /**
     * 播放和暂停
     */
    const  playSong=()=> {
      props.audioRef.paused? props.audioRef.play():props.audioRef.pause();
      paused.value = props.audioRef.paused
    }

    // dom挂载完成事件
    nextTick(() => {
       // 当前音乐播放完毕监听
      props.audioRef.addEventListener("ended", () => {
       switchSong(true)
     })

    });
</script>

<style scoped>

</style>