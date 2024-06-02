<template>
  <!--歌词控制面板-->
  <div class="hs-width-00100 hs-height-00100 hs-overflow-hidden">
    <div :style="{...lycStyle}"
         class="hs-width-00100 hs-transition-03   hs-child-line-height-15 hs-child-color-gray">
      <p v-for="(item,index) in lyricList"  :key="index" :style="{color:currentLycIndex===index?curLyricColor:'',}">{{item.lyc}}</p>
    </div>
  </div>
</template>

<script setup>
  import hs_time from '@/js/time'
  import { useMusicStore } from "@/store/music";
  const musicStore = useMusicStore()

  // 定义 props
  const props = defineProps({
    LyricScrollOffsetY: {  // 歌词每次滚动偏移量
      type: Number,
      default: 25
    },
    curLyricColor: { // 当前正在播放歌词字体颜色
      type: String,
      default: '#ffff'
    },
  })
  let currentLycIndex = ref(0); // 当前音乐的歌词索引
  const lyricList = ref ([]); // 当前音乐的歌词数据(时间和歌词内容)
  const lycStyle = ref({}); // 当前音乐的歌词样式

  //根据歌词拆分每句歌词和时间
  const splitLyricAndTime=()=>{
    let result = musicStore.curPlayMusicObj.lyric;
    if(result){
      let lyricData =[];
      result.split(/[\n]/)
          .forEach(item => {
            let temp = item.split(/\[(.+?)\]/)
            lyricData.push(
                {
                  time: temp[1],
                  lyc: temp[2]
                })
          })
      lyricData = lyricData.filter(v => v['lyc'])
      lyricList.value=lyricData;
    }else{
      musicStore.audioRef ? musicStore.audioRef.currentTime = 0 : null;
      currentLycIndex.value=0;
      lycStyle.value={
        transform: `translateY(-0px)`,
      }
      lyricList.value=[]
      lyricList.value.push(
          {
            time: '00:01:00',
            lyc: musicStore.curPlayMusicObj.title
          })
    }

  }
  splitLyricAndTime();

  // 滚动歌词
  const lyricRoll=()=> {
    if(musicStore.curPlayMusicObj.lyric){
      const currentDate=hs_time.secToMinSecMilsec(musicStore.audioRef.currentTime); // musicStore.audioRef.currentTime当前播放时间(3.125031)：后面存在6位小数，单位为秒
      for (let i = 0; i < lyricList.value.length; i++) {
        if (lyricList.value[i + 1] && (currentDate > lyricList.value[i].time && currentDate < lyricList.value[i + 1].time)) { // 如果存在下一句，并且当前播放时间位于上下句之间
          currentLycIndex.value=i;
          lycStyle.value={
            transform: `translateY(-${props.LyricScrollOffsetY * i}px)`,
          }
          break // 匹配到就结束循环
        }else if(currentDate >= lyricList.value[lyricList.value.length - 1].time){ // 最后一句
          currentLycIndex.value=lyricList.value.length - 1;
          lycStyle.value={
            transform: `translateY(-${props.LyricScrollOffsetY * (lyricList.value.length - 1)}px)`,
          }
          break // 匹配到就结束循环
        }
      }
    }
  }

  /**
   * 监听器
   */
  watch(()=> musicStore.curPlayMusicObj, function (value, oldvalue) {
      splitLyricAndTime();
  },{deep:true})


  // dom挂载完成事件
  nextTick(() => {
    // 播放中添加时间变化监听
    musicStore.audioRef.addEventListener("timeupdate", () => {
      lyricRoll()
    });
  });
</script>
