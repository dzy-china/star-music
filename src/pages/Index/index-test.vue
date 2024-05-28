<template>
  <audio ref="audioPlayer" controls src="/music/花妖.mp3" ></audio>

  <el-button @click="on_play">播放</el-button>
  <el-button @click="on_pause">暂停</el-button>
  <el-button @click="on_stop">停止</el-button>

</template>

<script setup>
const audioPlayer = ref(null)

// 播放音乐
const on_play = ()=>{
  if (audioPlayer.value.paused) {
    audioPlayer.value.play();
  }
}
// 暂停音乐
const on_pause = ()=>{
  if (!audioPlayer.value.paused) {
    audioPlayer.value.pause();
  }
}
const on_stop = ()=>{

}
</script>

<style scoped>

</style>
