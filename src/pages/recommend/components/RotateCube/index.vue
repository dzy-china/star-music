
<template>

  <div class="cube-container">
    <div class="cube">
      <div class="face front" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
      <div class="face back" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
      <div class="face right" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
      <div class="face left" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
      <div class="face top" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
      <div class="face bottom" :style="{'background-image':`url(${musicStore.curPlayMusicObj.img})`}"></div>
    </div>
  </div>
</template>
<script setup>

import { useMusicStore } from "@/store/music";
const musicStore = useMusicStore()

</script>
<style scoped>
.cube-container {
  --cube-size: 100px; /* 这里设置为容器宽高 */
  width: calc(var(--cube-size));
  height: calc(var(--cube-size));
  position: relative;
  perspective: 1000px;
}

.cube {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  animation: rotate 10s infinite linear;
}

.face {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}

.front  {  transform: translateZ(calc(var(--cube-size) / 2)); }
.back   { transform: rotateY(180deg) translateZ(calc(var(--cube-size) / 2)); }
.left   {  transform: rotateY(-90deg) translateZ(calc(var(--cube-size) / 2)); }
.right  { transform: rotateY(90deg) translateZ(calc(var(--cube-size) / 2)); }
.top    { transform: rotateX(90deg) translateZ(calc(var(--cube-size) / 2)); }
.bottom { transform: rotateX(-90deg) translateZ(calc(var(--cube-size) / 2)); }

@keyframes rotate {
  from { transform: rotateX(0deg) rotateY(0deg); }
  to { transform: rotateX(360deg) rotateY(360deg); }
}
</style>