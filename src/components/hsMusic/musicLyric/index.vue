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

  // 定义 props
  const props = defineProps({
    LyricScrollOffsetY: {  // 歌词每次滚动偏移量
      type: Number,
      default: 25
    },
    audioRef: { // 音乐元素对象
      type: Object,
      default: ()=>({})
    },
    curPlayMusicObj: { //正在播放的音乐数据
      type: Object,
      default: ()=>({})
    },
    curLyricColor: { // 当前正在播放歌词字体颜色
      type: String,
      default: '#ffff'
    },
  })
  let currentLycIndex = ref(0); // 当前音乐的歌词索引
  const lyricList = ref ([]); // 当前音乐的歌词数据(时间和歌词内容)
  const lycStyle = ref({}); // 当前音乐的歌词样式

  //获取歌词
  const getLyric=()=>{
    let result = props.curPlayMusicObj.lyric;
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
      audioRef.value ? audioRef.value.currentTime = 0 : null;
      currentLycIndex.value=0;
      lycStyle.value={
        transform: `translateY(-0px)`,
      }
      lyricList.value=[]
      lyricList.value.push(
          {
            time: '00:01:00',
            lyc: props.curPlayMusicObj.title
          })
    }

  }
  getLyric();

  // 滚动歌词
  const lyricRoll=()=> {
    if(props.curPlayMusicObj.lyric){
      const currentDate=hs_time.secToMinSecMilsec(props.audioRef.currentTime); // props.audioRef.currentTime当前播放时间(3.125031)：后面存在6位小数，单位为秒
      for (let i = 0; i < lyricList.value.length; i++) {
        if (lyricList.value[i + 1] && (currentDate > lyricList.value[i].time && currentDate < lyricList.value[i + 1].time)) {
          currentLycIndex.value=i;
          lycStyle.value={
            transform: `translateY(-${props.LyricScrollOffsetY * i}px)`,
          }
          break // 匹配到就结束循环
        }else if(currentDate >= lyricList.value[lyricList.value.length - 1].time){
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
  watch(()=> props.curPlayMusicObj, function (value, oldvalue) {
      getLyric();
  })


  // dom挂载完成事件
  nextTick(() => {
    // 播放中添加时间变化监听
    props.audioRef.addEventListener("timeupdate", () => {
      lyricRoll()
    });
  });
</script>
