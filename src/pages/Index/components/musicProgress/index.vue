<template>
  <!--播放进度条面板-->
  <div ref='progresscontainerRef' class="hs-width-00100 hs-height-10 hs-position-absolute hs-top-0 hs-left-0 0 hs-cursor-pointer hs-border-radius-5 hs-background-color-gray"
       @click="setProgressBtn">
    <div ref='progressRef' class="hs-height-00100 hs-width-0 hs-border-radius-5 hs-background-color-warning"    ></div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import { useMusicStore } from "@/store/music";
const musicStore = useMusicStore()

const progresscontainerRef=ref('') //进度条容器对象
const progressRef=ref('') //进度条对象

/**
 * 更新进度条
 */
  const  updateProgress=()=> {
    if(isNaN(musicStore.audioRef.duration )){
      progressRef.value.style.width = 0
    }else{
      progressRef.value.style.width = `${musicStore.audioRef.currentTime / musicStore.audioRef.duration * 100}%`
    }
  }

/**
 * 设置进度条
 * @param event
 */
const setProgressBtn=(event)=> {
    const width =progresscontainerRef.value.clientWidth; // 获取元素宽高(不包括边框包括内边距)
    const clickX = event.offsetX; // 相对于触发事件的元素的内部坐标系统的水平坐标
    musicStore.audioRef.currentTime = (clickX / width) * musicStore.audioRef.duration
  }

  // dom挂载完成事件
  nextTick(() => {
    // 播放中添加时间变化监听
    musicStore.audioRef.addEventListener("timeupdate", () => {
      updateProgress()
    });
  });


/**
 * 监听器( musicStore.songIndexObj 值改变时会触发)
 */
watch(() => musicStore.curPlayMusicObj, function (value, oldvalue) {
  updateProgress() // 更新进度条
})
</script>