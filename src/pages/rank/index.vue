<template>
  <div class="hs-col- hs-width-00100">
    <div class="hs-width-00100 hs-padding-top-bottom-15 hs-row-center-start">
      <ul class="hs-ini hs-row- hs-child-line-height-30 hs-child-background-color-white hs-child-padding-left-right-15 hs-child-margin-left-5 hs-child-margin-right-5 hs-child-border-radius-10 hs-child-cursor-pointer">
        <li v-for="rank_title in rank_title_array"
            key="rank_title"
            class="hs-ini"
            @click="rank_title_on_change(rank_title)"
            :style="{'background-color': cur_rank_title === rank_title?'#FFD100':''}"
        >
            {{rank_title}}
        </li>
      </ul>
    </div>
    <!--歌曲列表-->
    <div class="hs-overflow-auto hs-scrollbar" style="height:calc(100% - 60px)">
      <table class="hs-width-00100  hs-height-00100 hs-background-color-white-01 hs-color-white hs-child-text-align-left  hs-padding-left-right-15 hs-box-sizing-border-box">
        <thead>
        <tr class="hs-top-0 hs-position-sticky hs-color-warning hs-line-height-25" style="background-color: #5E5E5E;">
          <th>标题</th>
          <th>时长</th>
          <th>歌手</th>
        </tr>
        </thead>
        <tbody class="hs-child-line-height-30">
        <tr v-for="(table_val, table_index) in tableData" >
          <td class="hs-cursor-pointer hs-hover-color-primary">
            <svg t="1716622574214" class="hs-vertical-align-middle" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="20" height="20"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z" fill="currentColor" p-id="2625"></path><path d="M672 441.6l-170.666667-113.066667c-57.6-38.4-106.666667-12.8-106.666666 57.6v256c0 70.4 46.933333 96 106.666666 57.6l170.666667-113.066666c57.6-42.666667 57.6-106.666667 0-145.066667z" fill="currentColor" p-id="2626"></path></svg><span class="hs-vertical-align-middle hs-margin-left-5">{{table_val.title}}</span></td>
          <td >{{time.milsecToMinSec(table_val.duration)}}</td>
          <td >{{table_val.artists_name}}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>


<script setup>
  import format_line_music_rank_to_local from "page@/rank/format_line_music_rank_to_local";
  const path = require('path');
  const cheerio = require('cheerio');
  import Http from "@/js/Http"
  // import wyy_array from "pub@/js/wyy"
  import time from "@/js/time";
  import ApiSqlite from "@/js/ApiSqlite"
  const db = new ApiSqlite(path.resolve(import.meta.env.DEV?"public/":"resources/", "db/music_data.db"));

  const cur_rank_title = ref('飙升榜')
  const rank_title_array = ['飙升榜', '新歌榜', '原创榜', '热歌榜']
  const tableData = ref([])  //歌曲列表


  // 本地存储
  // localStorage.setItem("wyy_music_rank_up", JSON.stringify(tableData.value))

  /* 排行榜分类切换事件 */
  const rank_title_on_change = (rank_title)=> {
    // 改变当前选中的标题
    cur_rank_title.value = rank_title

    // 根据标题确定sqlite表名和分类id
    let music_rank_table_name = ""
    let music_rank_id = 0
    switch (rank_title) {
      case "飙升榜":
        music_rank_table_name = "music_rank_wyy_up"
        music_rank_id = 19723756
        break;
      case "新歌榜":
        music_rank_table_name = "music_rank_wyy_new"
        music_rank_id = 3779629
        break;
      case "原创榜":
        music_rank_table_name = "music_rank_wyy_original"
        music_rank_id = 2884035
        break;
      case "热歌榜":
        music_rank_table_name = "music_rank_wyy_hot"
        music_rank_id = 3778678
        break;
    }

    // 清空表数据
  /*   db.clear("DELETE FROM my_test").then((result)=>{
      if(result === "ok"){
        console.log("表数据已清空！")
      }
    });*/

    // 发送http请求
    new Http({
      url:`https://music.163.com/discover/toplist?id=${music_rank_id}`, // 域名或 IP 地址。 默认值： 'localhost'。
      method:'get', // 请求方式，默认值： 'get'
    }).go().then(data => {
      const $ = cheerio.load(data);
      const wyy_array = JSON.parse($('textarea#song-list-pre-data').text());
        // 在线采集数据本地格式化
        const format_line_music = format_line_music_rank_to_local(wyy_array)
        tableData.value = format_line_music

      // 插入数据到数据库
      db.add_more(music_rank_table_name, format_line_music).then((result)=>{
        if(result === "ok"){
          console.log(music_rank_table_name + "表数据插入！")
        }
      });
    }).catch(err => {
        console.error('Error:', err);
      })
  }
</script>
