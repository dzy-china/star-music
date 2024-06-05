<template>
  <div class="hs-width-00100">
    <!--歌曲列表-->
    <div class="hs-overflow-auto hs-scrollbar hs-height-00100">
      <template v-if="tableData">
        <div class="hs-padding-left-right-15 hs-background-color-white-01">
        <table class="hs-width-00100  hs-height-00100   hs-color-white hs-child-text-align-left hs-box-sizing-border-box    " style="border-collapse: collapse;">
          <thead>
          <tr class="hs-top-0 hs-position-sticky hs-color-warning hs-line-height-25" style="background-color: #5E5E5E;">
            <th>#</th>
            <th>标题</th>
            <th>时长</th>
            <th>歌手</th>
          </tr>
          </thead>
          <tbody class="hs-child-line-height-30">
          <tr v-for="(table_val, table_index) in tableData" class="hs-hover-background-color-warning-01 " >
            <td >{{table_index + 1}}</td>
            <td @click="on_click_player(table_val, table_index)" :class="{'hs-color-primary': musicStore.songIndexObj.index === table_index}" class="hs-cursor-pointer" >
              <svg t="1716622574214" class="hs-vertical-align-middle  " viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="20" height="20"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z" fill="currentColor" p-id="2625"></path><path d="M672 441.6l-170.666667-113.066667c-57.6-38.4-106.666667-12.8-106.666666 57.6v256c0 70.4 46.933333 96 106.666666 57.6l170.666667-113.066666c57.6-42.666667 57.6-106.666667 0-145.066667z" fill="currentColor" p-id="2626"></path></svg>
              <span class="hs-vertical-align-middle hs-margin-left-5 ">{{common_str_action.hs_substr_format(table_val.title, 15)}}</span></td>
            <td >{{time.milsecToMinSec(table_val.duration)}}</td>
            <td >{{table_val.artists_name}}</td>
          </tr>
          </tbody>
        </table>
        </div>
      </template>
      <template v-else>
            <div class="hs-width-00100  hs-height-00100 hs-row-center-center">
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

  const tableData = ref([])  //歌曲列表
  const musicStore = useMusicStore()  // store

/*初始化播放音乐列表*/
musicStore.db.query(`select * from my_playing_music_list`).then((result)=>{
  if(result && result.code === 200){
    tableData.value = result.msg
  }
}).catch((error)=>{
  console.error(error)
})

//点击歌曲名，播放音乐
const on_click_player = (table_val, table_index)=>{
  musicStore.songIndexObj.index = table_index
}

</script>
