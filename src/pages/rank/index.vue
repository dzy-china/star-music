<template>
  <div class="hs-col- hs-width-00100">
    <div class="hs-width-00100 hs-height-60 hs-row-center-center hs-position-relative">
      <ul class="hs-ini hs-row- hs-child-line-height-30 hs-child-background-color-white hs-child-padding-left-right-15 hs-child-margin-left-5 hs-child-margin-right-5 hs-child-border-radius-10 hs-child-cursor-pointer">
        <li v-for="(rank_title_val,index) in rank_title_msg"
            :key="rank_title_val.title_id"
            class="hs-ini"
            @click="rank_title_on_change(index)"
            :style="{'background-color': cur_rank_title === rank_title_val.title_name?'#FFD100':''}"
        >
            {{rank_title_val.title_name}}
        </li>
      </ul>
      <div class="hs-color-white-05 hs-font-size-09 hs-position-absolute hs-right-15" v-show="update_time!==''">最近更新: {{ update_time }} <span class="hs-color-warning hs-cursor-pointer" @click="on_update_cache">更新</span></div>
    </div>
    <!--歌曲列表-->
    <div class="hs-overflow-auto hs-scrollbar " style="height:calc(100% - 60px);">
      <template v-if="tableData">
        <div class="hs-padding-left-right-15" >
        <table class="hs-width-00100  hs-height-00100 hs-color-white hs-child-text-align-left hs-box-sizing-border-box" style="border-collapse: collapse;">
          <thead>
          <tr class="hs-top-0 hs-position-sticky hs-color-warning hs-line-height-25 " style="background-color: #5E5E5E;">
            <th class="hs-padding-left-10">#</th>
            <th>标题</th>
            <th>时长</th>
            <th>歌手</th>
          </tr>
          </thead>
          <tbody class="hs-child-line-height-30">
          <tr v-for="(table_val, table_index) in tableData" class="hs-hover-background-color-warning-01">
            <td class="hs-padding-left-10">{{table_index + 1}}</td>
            <td @click="on_click_player(table_val, table_index)" class="hs-cursor-pointer" >
              <svg t="1716622574214" class="hs-vertical-align-middle  " viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="20" height="20"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z" fill="currentColor" p-id="2625"></path><path d="M672 441.6l-170.666667-113.066667c-57.6-38.4-106.666667-12.8-106.666666 57.6v256c0 70.4 46.933333 96 106.666666 57.6l170.666667-113.066666c57.6-42.666667 57.6-106.666667 0-145.066667z" fill="currentColor" p-id="2626"></path></svg>
              <span class="hs-vertical-align-middle hs-margin-left-5 " :title="table_val.title">{{common_str_action.hs_substr_format(table_val.title, 10)}}</span></td>
            <td >{{time.timeToCustomFormat(table_val.duration, 'mm:ss')}}</td>
            <td >{{table_val.artists_name}}</td>
          </tr>
          </tbody>
        </table>
        </div>
      </template>
      <template v-else>
            <div class="hs-width-00100  hs-height-00100 hs-row-center-center">
                  {{error_data}}
            </div>
      </template>
    </div>

  </div>

</template>


<script setup>
/*导入值*/
  import format_line_music_rank_to_local from "./format_line_music_rank_to_local";

  const cheerio = require('cheerio');
  import Http from "@/js/Http"
  import time from "@/js/time";
  import common_str_action from "@/js/common_str_action";

  import { useMusicStore } from "@/store/music";

/*定义变量*/
  const cur_rank_title = ref('飙升榜') // 当前选中的标题
  const update_time = ref('') // 更新时间格式：05月30日
  const rank_title_msg = [ // 排行榜标题信息：title_id(采集时的分类id),title_name(标题名),table_name(自定义数据库的表名)
    {title_id:19723756, title_name:'飙升榜', table_name: 'music_rank_wyy_up'},
    {title_id:3779629,title_name:'新歌榜', table_name: 'music_rank_wyy_new'},
    {title_id:2884035,title_name:'原创榜', table_name: 'music_rank_wyy_original'},
    {title_id:3778678, title_name:'热歌榜', table_name: 'music_rank_wyy_hot'}
  ]
  const error_data = ref("")  // 显示错误信息
  const tableData = ref([])  //歌曲列表
  const musicStore = useMusicStore()  // store

/*初始化音乐排行榜数据*/
const wyy_music_cache_log = localStorage.getItem("hs_walked_music_position_log")
/*
wyy_music_cache_log示例:
  {
      activePlatform: 'wyy',
      wyy:{
      activeSort: 'rank', // 激活种类：rank(排行榜)、type(类型)
      rank: {  // 排行榜信息
            category_index: 0,
            category:[
              {title_id:19723756, title_name:'飙升榜', table_name: 'music_rank_wyy_up',cache_time:123456789},
              {title_id:3779629,title_name:'新歌榜', table_name: 'music_rank_wyy_new',cache_time:123456789},
              {title_id:2884035,title_name:'原创榜', table_name: 'music_rank_wyy_original',cache_time:123456789},
              {title_id:3778678, title_name:'热歌榜', table_name: 'music_rank_wyy_hot',cache_time:123456789}
            ]
          }
      }
    }
*/
if(wyy_music_cache_log){ // 如果存在本地缓存，根据缓存记录,获取上次选中的标题信息，从sqlite数据库取数据
  const wyy_music_cache_log_array = JSON.parse(wyy_music_cache_log)
    // 赋值页面标题
   let selected_title_msg = wyy_music_cache_log_array.wyy.rank.category[wyy_music_cache_log_array.wyy.rank.category_index]
    cur_rank_title.value = selected_title_msg.title_name
    // 显示更新时间
    update_time.value = time.hs_time_format(selected_title_msg.cache_time, 'Y/m/d')
    // 赋值页面标题下数据
  musicStore.db.query(`select * from ${selected_title_msg.table_name}`).then((result)=>{
      if(result && result.code === 200 ){
        tableData.value = result.msg
      }
    }).catch((error)=>{
      error_data.value = error;
    })
}else{ // 如果不存在缓存(即首次打开本页面)，在线获取第一个标题值，并缓存到本地
  new Http({  // 发送http请求
    url:`https://music.163.com/discover/toplist?id=${rank_title_msg[0].title_id}`, // 域名或 IP 地址。 默认值： 'localhost'。
    method:'get', // 请求方式，默认值： 'get'
  }).go().then(async data => {
    const $ = cheerio.load(data);
    const wyy_array = JSON.parse($('textarea#song-list-pre-data').text());
    // 在线采集数据本地格式化
    const format_line_music = format_line_music_rank_to_local(wyy_array)

    // 给页面数据赋值
    tableData.value = format_line_music

    // 插入数据到数据库
    await musicStore.db.clear(`DELETE FROM ${rank_title_msg[0].table_name}`) // 新增前先清空表数据
    musicStore.db.add_more(rank_title_msg[0].table_name, format_line_music).then((result) => {
      if (result && result.code === 200 ) {
        const cur_timestamp = Date.now()
        // 本地存储记录缓存日志
        const cacheData = {
          activePlatform: 'wyy',
          wyy: {
            activeSort: 'rank',
            rank: {  // 排行榜信息
              category_index: 0,
              category: rank_title_msg.map((val, index) => {
                if (index === 0) val.cache_time = cur_timestamp
                return val
              })
            }
          }
        }
        localStorage.setItem("hs_walked_music_position_log", JSON.stringify(cacheData))

        // 显示更新时间
        update_time.value = time.hs_time_format(cur_timestamp, 'Y/m/d')
        console.log(rank_title_msg[0].table_name + "表已成功缓存！")
      }
    });
  }).catch(err => {
    console.error('Error:', err);
  })
}


  /* 排行榜分类切换事件 */
  const rank_title_on_change = (index)=> {
    const {title_id, title_name, table_name} = rank_title_msg[index]
    // 改变当前选中的标题
    cur_rank_title.value = title_name
    const wyy_music_cache_log = localStorage.getItem("hs_walked_music_position_log") // 获取最新缓存日志
    const wyy_music_cache_log_array = JSON.parse(wyy_music_cache_log)

    // 本地缓存记录标题索引值
      wyy_music_cache_log_array.wyy.rank.category_index = index
      localStorage.setItem("hs_walked_music_position_log", JSON.stringify(wyy_music_cache_log_array)) //重置某个缓存值


    // 改变页面标题下数据
    if (wyy_music_cache_log_array.wyy.rank.category[index].cache_time) { // 如果存在缓存
      // 赋值页面标题
      const selected_table_name = wyy_music_cache_log_array.wyy.rank.category[wyy_music_cache_log_array.wyy.rank.category_index].table_name
      // 赋值页面标题下数据
      musicStore.db.query(`select * from ${selected_table_name}`).then((result) => {
        if(result && result.code === 200 ){
          tableData.value = result.msg
          // 显示更新时间
          update_time.value = time.hs_time_format(wyy_music_cache_log_array.wyy.rank.category[index].cache_time, 'Y/m/d')
        }
      }).catch((error) => {
        error_data.value = error;
      })
    } else { // 如果不存在缓存
      new Http({  // 发送http请求
        url: `https://music.163.com/discover/toplist?id=${rank_title_msg[index].title_id}`, // 域名或 IP 地址。 默认值： 'localhost'。
        method: 'get', // 请求方式，默认值： 'get'
      }).go().then(async data => {
        const $ = cheerio.load(data);
        const wyy_array = JSON.parse($('textarea#song-list-pre-data').text());
        // 在线采集数据本地格式化
        const format_line_music = format_line_music_rank_to_local(wyy_array)

        // 给页面数据赋值
        tableData.value = format_line_music

        // 插入数据到数据库
        await musicStore.db.clear(`DELETE FROM ${rank_title_msg[index].table_name}`) // 新增前先清空表数据
        musicStore.db.add_more(rank_title_msg[index].table_name, format_line_music).then((result) => {
          if (result && result.code === 200) {
            // 本地存储修改缓存日志
            const cur_timestamp = Date.now()
            wyy_music_cache_log_array.wyy.rank.category[index].cache_time = cur_timestamp
            localStorage.setItem("hs_walked_music_position_log", JSON.stringify(wyy_music_cache_log_array))

            // 显示更新时间
            update_time.value = time.hs_time_format(cur_timestamp, 'Y/m/d')
            console.log(rank_title_msg[index].table_name + "表已成功缓存！")
          }
        });
      }).catch(error => {
        error_data.value = error;
      })
    }
  }


  /*更新排行榜*/
const on_update_cache = ()=>{
  const wyy_music_cache_log = localStorage.getItem("hs_walked_music_position_log") // 获取最新缓存日志
  const wyy_music_cache_log_array = JSON.parse(wyy_music_cache_log)
  const cur_title_msg = wyy_music_cache_log_array.wyy.rank.category[wyy_music_cache_log_array.wyy.rank.category_index]

  // 判断是否需要更新(避免不必要的频繁无效更新)
  if(Date.now() > time.getNextDayZeroTimestamp(cur_title_msg.cache_time)){  // 可以缓存(如果当前时间戳大于缓存次日起始时间戳)
        new Http({  // 发送http请求
          url: `https://music.163.com/discover/toplist?id=${cur_title_msg.title_id}`, // 域名或 IP 地址。 默认值： 'localhost'。
          method: 'get', // 请求方式，默认值： 'get'
        }).go().then(data => {
          const $ = cheerio.load(data);
          const wyy_array = JSON.parse($('textarea#song-list-pre-data').text());
          // 在线采集数据本地格式化
          const format_line_music = format_line_music_rank_to_local(wyy_array)

          // 给页面数据赋值
          tableData.value = format_line_music

          // 清空表数据
          musicStore.db.clear(`DELETE FROM ${cur_title_msg.table_name}`).then((result)=>{
            if(result && result.code === 200){
              console.log("表数据已清空！")

              // 插入数据到数据库
              musicStore.db.add_more(cur_title_msg.table_name, format_line_music).then((result) => {
                if (result && result.code === 200) {
                  // 本地存储修改缓存日志
                  const cur_timestamp = Date.now()
                  wyy_music_cache_log_array.wyy.rank.category[wyy_music_cache_log_array.wyy.rank.category_index].cache_time = cur_timestamp
                  localStorage.setItem("hs_walked_music_position_log", JSON.stringify(wyy_music_cache_log_array))

                  // 显示更新时间
                  update_time.value = time.hs_time_format(cur_timestamp, 'Y/m/d')
                  console.log(cur_title_msg.table_name + "表已成功持久化到本地数据库！")
                  ElMessage({
                    showClose: true,
                    duration:2000,
                    message: cur_title_msg.title_name + '更新成功！',
                    type: 'success',
                  })
                }
              });

            }
          });

        }).catch(error => {
          error_data.value = error;
        })
  }else{
      ElMessage({
        showClose: true,
        duration:2000,
        message: '已是最新，明日再更新吧！',
        type: 'warning',
      })
  }
}

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
      `INSERT INTO my_playing_music_list(music_id, title, img, src, lyric, duration, artists_name) VALUES (?,?,?,?,?,?,?)`,
      [
        table_val.music_id,
        table_val.title,
        table_val.img,
        table_val.src,
        table_val.lyric,
        table_val.duration,
        table_val.artists_name
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
