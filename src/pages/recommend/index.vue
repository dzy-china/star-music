<template>
    <!--歌曲缩略图-->
    <div class="hs-width-0050 hs-height-00100 hs-padding-30 hs-box-sizing-border-box hs-row-center-center " >
      <RotateCube />
    </div>

    <!--歌词-->
    <div class="hs-width-0050 hs-height-00100 hs-position-relative hs-padding-20  hs-box-sizing-border-box " >
      <musicLyric    />
    </div>
</template>

<script setup>
import musicLyric from './components/musicLyric';
import RotateCube from './components/RotateCube';

</script>
