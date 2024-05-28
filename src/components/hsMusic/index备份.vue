<template>
  <!--音乐播放器元素，不占dom空间-->
  <audio ref='audioRef'   style="display: none"></audio>

  <!--播放器盒子-->
  <div class="hs-height-100-vh" style="background-color: rgb( 30, 31, 34)">
    <!--歌曲信息显示-->
    <div class='hs-width-00100 hs-row-  ' style="height:calc(100% - 80px);background-color: rgb(  43, 45, 48)">
      <!--菜单-->
      <div class="hs-width-0020 hs-height-00100 ">

      </div>

      <!--歌曲缩略图-->
      <div class="hs-width-0040 hs-height-00100 hs-padding-30 hs-box-sizing-border-box hs-row-center-center hs-box-shadow-inset-0-0-15-black-01" >
        <RotateCube :cube_image="curPlayMusicObj.img"/>
      </div>

      <!--歌词-->
      <div class="hs-width-0040 hs-height-00100 hs-position-relative hs-padding-20  hs-box-sizing-border-box   hs-box-shadow-inset-0-0-15-black-01" >
        <musicLyric :LyricScrollOffsetY="LyricScrollOffsetY"  :curPlayMusicObj="curPlayMusicObj" :audioRef="audioRef" />
      </div>
    </div>

    <!--歌曲控制面板-->
    <div class="hs-height-80 hs-position-relative">
      <!--播放进度条-->
      <musicProgress   :audioRef="audioRef" />

      <!--音乐播放控制-->
      <musicPanel :musicList="musicList"  :songIndexObj="songIndexObj" :audioRef="audioRef" />
    </div>
  </div>

</template>

<script setup>
      import musicPanel from './musicPanel';
      import musicLyric from './musicLyric';
      import musicProgress from './musicProgress';
      import RotateCube from './RotateCube';

      // 定义 props
      const props = defineProps({
        musicList: { // 歌曲列表
          type: Array,
          default: ()=>[]
        },
        curLyricColor: { // 当前正在播放歌词字体颜色
          type: String,
          default: '#ff0000'
        },
        LyricScrollOffsetY: {  // 歌词每次滚动偏移量
          type: Number,
          default: 25
        },
        progressColor: { // 播放进度条颜色
          type: String,
          default: 'green'
        },
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

