<template>
    <!--歌曲缩略图-->
    <div class="hs-width-0050 hs-height-00100 hs-padding-30 hs-box-sizing-border-box hs-row-center-center hs-box-shadow-inset-0-0-15-black-01" >
      <RotateCube :cube_image="musicStore.curPlayMusicObj.img"/>
    </div>

    <!--歌词-->
    <div class="hs-width-0050 hs-height-00100 hs-position-relative hs-padding-20  hs-box-sizing-border-box   hs-box-shadow-inset-0-0-15-black-01" >
      <musicLyric  :curPlayMusicObj="musicStore.curPlayMusicObj" :audioRef="musicStore.audioRef" />
    </div>
</template>

<script setup>
import musicLyric from 'com@/hsMusic/musicLyric';
import RotateCube from 'com@/hsMusic/RotateCube';

import { useMusicStore } from "@/store/music";
const musicStore = useMusicStore()

</script>
