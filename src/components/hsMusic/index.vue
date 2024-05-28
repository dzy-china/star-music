<template>


</template>

<script setup>
      import musicLyric from './musicLyric';
      import RotateCube from './RotateCube';

      // 定义 props
      const props = defineProps({
        musicList: { // 歌曲列表
          type: Array,
          default: ()=>[]
        },
        LyricScrollOffsetY: {  // 歌词每次滚动偏移量
          type: Number,
          default: 25
        }
      })


      const audioRef = ref(null); //音乐对象
      let songIndexObj = ref({index:0}); // 当前音乐的索引,默认从第一首开始
      const curPlayMusicObj = computed(() => { //正在播放的音乐数据
        return props.musicList.length>0 ? props.musicList[songIndexObj.value.index]:{}
      });


      /**
       * 监听器
       */
      watch(curPlayMusicObj, function (value, oldvalue) {
          audioRef.value.src=value.src;
          audioRef.value.play();
      })

      // dom挂载完成事件
      onMounted(()=>{
        audioRef.value.src=curPlayMusicObj.value?.src;

        audioRef.value.addEventListener('error', function() {
          console.warn('音频文件加载失败');
        });
      })
</script>

