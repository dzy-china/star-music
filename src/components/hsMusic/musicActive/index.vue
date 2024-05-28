<template>
  <router-link to="/recommend" >
    <div class="hs-margin-top-20 hs-margin-left-20 hs-row-start-center  hs-float-left">
      <img :src="curPlayMusicObj.img" class="hs-height-40 hs-width-40 hs-border-1-solid-gray">
      <span class="hs-margin-left-5 hs-color-white">{{curPlayMusicObj.title}}</span>
    </div>
  </router-link>
</template>

<script setup>
// 定义 props
const props = defineProps({
  curPlayMusicObj: { // 正在播放音乐信息
    type: Object,
    default: {}
  },
})
</script>