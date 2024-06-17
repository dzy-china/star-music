<template>
  <div class="hs-width-00100 hs-height-00100">
    <!--歌曲列表-->
    <div class="hs-overflow-auto hs-scrollbar hs-height-00100">
      <template v-if="musicStore.search_music_data.data.length>0">
        <div class="hs-padding-left-right-15 ">
        <table class="hs-width-00100  hs-height-00100   hs-color-white hs-child-text-align-left hs-box-sizing-border-box    " style="border-collapse: collapse;">
          <thead>
          <tr class="hs-top-0 hs-position-sticky hs-color-warning hs-line-height-25" style="background-color: #5E5E5E;">
            <th class="hs-padding-left-10">#</th>
            <th>标题</th>
            <th>时长</th>
            <th>歌手</th>
          </tr>
          </thead>
          <tbody class="hs-child-line-height-30">
          <tr v-for="(table_val, table_index) in musicStore.search_music_data.data" class="hs-hover-background-color-warning-01 " >
            <td class="hs-padding-left-10">{{table_index + 1}}</td>
            <td @click="on_click_player(table_val, table_index)"  class="hs-cursor-pointer" >
              <svg t="1716622574214" class="hs-vertical-align-middle  " viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="20" height="20"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z" fill="currentColor" p-id="2625"></path><path d="M672 441.6l-170.666667-113.066667c-57.6-38.4-106.666667-12.8-106.666666 57.6v256c0 70.4 46.933333 96 106.666666 57.6l170.666667-113.066666c57.6-42.666667 57.6-106.666667 0-145.066667z" fill="currentColor" p-id="2626"></path></svg>
              <span class="hs-vertical-align-middle hs-margin-left-5 " :title="table_val.title">{{common_str_action.hs_substr_format(table_val.title, 10)}}</span></td>
            <td >{{time.timeToCustomFormat(table_val.duration, 'mm:ss')}}</td>
            <td :title="table_val.artists_name">{{common_str_action.hs_substr_format(table_val.artists_name,10)}}</td>
          </tr>
          </tbody>
        </table>
        </div>
      </template>
      <template v-else>
            <div class="hs-width-00100  hs-height-00100 hs-row-center-center hs-color-white">
                  音乐为空！
            </div>
      </template>
    </div>
 </div>

</template>


<script setup>
/*导入值*/
  import time from "@/js/time";
  import common_str_action from "@/js/common_str_action";

  import { useMusicStore } from "@/store/music";

/*定义变量*/
  const musicStore = useMusicStore()  // store

//点击歌曲名，播放音乐
const on_click_player = (table_val, table_index)=>{
  // 避免重复添加相同音乐到我的播放列表
  for (const musicListIndex in musicStore.musicList) {
    if(musicStore.musicList[musicListIndex].music_id === table_val.music_id){
      ElMessage({
        showClose: true,
        duration:2000,
        message: '历史播放已存在，不必重复添加！',
        type: 'warning',
      })
      return
    }
  }

  //新增到 数据库我的音乐列表
  musicStore.db.add(
      `INSERT INTO music_play_list(music_id, title, img, src, lyric, duration, artists_name, create_time) VALUES (?,?,?,?,?,?,?,?)`,
      [
        table_val.music_id,
        table_val.title,
        table_val.img,
        table_val.src,
        table_val.lyric,
        table_val.duration,
        table_val.artists_name,
        Math.floor(Date.now() / 1000)
      ]
  ).then(async (result) => {
    if (result && result.code === 200) {
      console.log("音乐已加入到本地数据库")

      // 当前排行榜音乐赋值到播放列表
      musicStore.musicList.push(table_val)
      musicStore.songIndexObj.index = musicStore.musicList.length - 1

    } else {
      console.log(result)
    }
  }).catch((error)=>{
    console.log(error)
  })
}

</script>
