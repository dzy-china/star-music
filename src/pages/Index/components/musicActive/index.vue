<template>
  <router-link to="/recommend" >
    <div class="hs-margin-top-20 hs-margin-left-20 hs-row-start-center  hs-float-left">
      <img :src="musicStore.curPlayMusicObj.img" class="hs-height-40 hs-width-40 hs-border-1-solid-gray">
      <span class="hs-margin-left-5 hs-color-white">{{musicStore.curPlayMusicObj.title}}</span>
    </div>
  </router-link>
</template>

<script setup>
import { useMusicStore } from "@/store/music";
const musicStore = useMusicStore()

</script>