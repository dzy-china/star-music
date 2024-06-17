<template>
  <div v-if="musicStore.musicList.length>0" class="hs-height-00100 hs-row- ">
    <!--歌曲缩略图-->
    <div class="hs-width-0050 hs-height-00100 hs-padding-30 hs-box-sizing-border-box hs-row-center-center " >
      <RotateCube />
    </div>

    <!--歌词-->
    <div class="hs-width-0050 hs-height-00100 hs-position-relative hs-padding-20  hs-box-sizing-border-box " >
      <musicLyric    />
    </div>
  </div>
  <div v-else class="hs-height-00100 hs-col-center-center hs-color-white">
      <span class="hs-font-size-2 ">您好 · 我有一个帽衫</span>
  </div>
</template>

<script setup>
import musicLyric from './components/musicLyric';
import RotateCube from './components/RotateCube';

import { useMusicStore } from "@/store/music";
const musicStore = useMusicStore()

</script>
