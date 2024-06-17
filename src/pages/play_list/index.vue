<template>
  <div class="hs-col- hs-width-00100 hs-height-00100 ">
    <div class="hs-width-00100 hs-height-60 hs-row-center-center hs-position-relative">
      <ul class="hs-ini hs-row- hs-child-line-height-30 hs-child-background-color-white hs-child-color-warning hs-child-padding-left-right-15 hs-child-margin-left-5 hs-child-margin-right-5 hs-child-border-radius-10 hs-child-cursor-pointer">
        <li v-for="(title_val,index) in title_msg"
            :key="title_val.title_id"
            class="hs-ini"
            @click="title_on_change(index)"
            :style="{'background-color':cur_title === title_val.title_name?'rgb(230,162, 60)':'','color':cur_title === title_val.title_name?'#fff':''}"
        >
          {{title_val.title_name}}
        </li>
      </ul>
      <div @click="on_del_music('','')" class="hs-color-white-05 hs-font-size-09 hs-position-absolute hs-right-20 hs-cursor-pointer" title="删除"><svg t="1718645290762" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1485" width="20" height="20"><path d="M566 332H458c-69.5 0-126-57.7-126-128.6v-30.9C332 101.7 388.5 44 458 44h108c69.5 0 126 57.7 126 128.6v30.9c0 70.8-56.5 128.5-126 128.5z m54-159.4c0-31.2-24.2-56.6-54-56.6H458c-29.8 0-54 25.4-54 56.6v30.9c0 31.2 24.2 56.6 54 56.6h108c29.8 0 54-25.4 54-56.6v-30.9zM728 980H296c-59.6 0-108-48.4-108-108V224h648v648c0 59.6-48.4 108-108 108z m36-684H260v576c0 19.8 16.2 36 36 36h432c19.8 0 36-16.2 36-36V296zM620 836V404h72v432h-72z m-144 0V404h72v432h-72z m-144 0V404h72v432h-72z m504-504H116v-72h36v-36c0-19.8 16.2-36 36-36h648c19.8 0 36 16.2 36 36v36h36v72h-72z" fill="currentColor" p-id="1486"></path></svg></div>
    </div>

    <!--歌曲列表-->
    <div class="hs-overflow-auto hs-scrollbar" style="height:calc(100% - 60px);">
      <template v-if="tableData.length>0">
        <div class="hs-padding-left-right-15">
        <table class="hs-width-00100  hs-height-00100   hs-color-white hs-child-text-align-left hs-box-sizing-border-box    " style="border-collapse: collapse;">
          <thead>
          <tr class="hs-top-0 hs-position-sticky hs-color-warning hs-line-height-25" style="background-color: #5E5E5E;">
            <th class="hs-padding-left-10">#</th>
            <th>标题</th>
            <th>时长</th>
            <th>歌手</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody class="hs-child-line-height-30">
          <tr v-for="(table_val, table_index) in tableData" class="hs-hover-background-color-warning-01 " >
            <td class="hs-padding-left-10">{{table_index + 1}}</td>
            <td @click="on_click_player(table_val, table_index)" :class="{'hs-color-primary': musicStore.curPlayMusicObj.music_id === table_val.music_id}" class="hs-cursor-pointer" >
              <svg t="1716622574214" class="hs-vertical-align-middle  " viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2624" width="20" height="20"><path d="M512 0C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z m0 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z" fill="currentColor" p-id="2625"></path><path d="M672 441.6l-170.666667-113.066667c-57.6-38.4-106.666667-12.8-106.666666 57.6v256c0 70.4 46.933333 96 106.666666 57.6l170.666667-113.066666c57.6-42.666667 57.6-106.666667 0-145.066667z" fill="currentColor" p-id="2626"></path></svg>
              <span class="hs-vertical-align-middle hs-margin-left-5 " :title="table_val.title">{{common_str_action.hs_substr_format(table_val.title, 10)}}</span></td>
            <td >{{time.timeToCustomFormat(table_val.duration, 'mm:ss')}}</td>
            <td :title="table_val.artists_name">{{common_str_action.hs_substr_format(table_val.artists_name,10)}}</td>
            <td @click="on_del_music(table_val, table_index)" class="hs-cursor-pointer">删除</td>
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
const cur_title = ref('全部') // 当前选中的标题
const title_msg = [ // 排行榜标题信息：title_id(采集时的分类id),title_name(标题名),table_name(自定义数据库的表名)
  {title_id:19723756, title_name:'今日', table_name: 'music_rank_wyy_up'},
  {title_id:3779629,title_name:'一周内', table_name: 'music_rank_wyy_new'},
  {title_id:2884035,title_name:'一周前', table_name: 'music_rank_wyy_original'},
  {title_id:2884036,title_name:'全部', table_name: 'music_rank_wyy_original'},
]
  const tableData = ref([])  //歌曲列表
  const musicStore = useMusicStore()  // store

/*初始化播放音乐列表*/
musicStore.db.query(`select * from music_play_list`).then((result)=>{
  if(result && result.code === 200){
    tableData.value = result.msg
  }
}).catch((error)=>{
  console.error(error)
})

//点击歌曲名，播放音乐
const on_click_player = (table_val, table_index)=>{
  musicStore.musicList = tableData.value
  musicStore.songIndexObj.index = table_index
}


/* 标题切换事件 */
const title_on_change = async (index) => {
  cur_title.value = title_msg[index].title_name
  let result = {}
  if (cur_title.value === '全部') {
    result =  await musicStore.db.query(`select * from music_play_list`)
  } else if (cur_title.value === '一周内') {
    result =  await musicStore.db.query(`select * from music_play_list where create_time between ${time.getOneDayStartTimestampInSeconds(-6)} and ${time.getTodayEndTimestampInSeconds()}`)
  } else if (cur_title.value === '一周前') {
   result =  await musicStore.db.query(`select * from music_play_list where create_time < ${time.getOneDayStartTimestampInSeconds(-6)} `)
  } else if (cur_title.value === '今日') {
    result =  await musicStore.db.query(`select * from music_play_list where create_time between ${time.getTodayStartTimestampInSeconds()} and ${time.getTodayEndTimestampInSeconds()}`)
  }else{
    result =  await musicStore.db.query(`select * from music_play_list`)
  }
  tableData.value =  result.msg
}

/*删除音乐*/
const on_del_music =async (table_val, table_index) => {
  if (table_val !== '' && table_index !== '') { // 仅仅删除一条
    await musicStore.db.delete(`DELETE FROM music_play_list WHERE id=?`, [table_val.id])
    tableData.value.splice(table_index, 1); //从索引值index处删除1个元素
    musicStore.musicList = tableData.value
    if (!musicStore.musicList[musicStore.songIndexObj.index]) {
      musicStore.songIndexObj.index = 0
    }
  } else { // 删除多条：选项的全部
    if(musicStore.musicList.length<=0) return
    ElMessageBox.confirm(
        '你确定要删除当前选项下的全部音乐吗?',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
    ).then(async () => {
        let sql_str = ""
        if (cur_title.value === '全部') {
          sql_str = `delete FROM music_play_list`

        } else if (cur_title.value === '一周内') {
          sql_str = `delete from music_play_list where create_time between ${time.getOneDayStartTimestampInSeconds(-6)} and ${time.getTodayEndTimestampInSeconds()}`
        } else if (cur_title.value === '一周前') {
          sql_str = `delete from music_play_list where create_time < ${time.getOneDayStartTimestampInSeconds(-6)} `
        } else if (cur_title.value === '今日') {
          sql_str = `delete from music_play_list where create_time between ${time.getTodayStartTimestampInSeconds()} and ${time.getTodayEndTimestampInSeconds()}`
        } else {
          sql_str = `delete FROM music_play_list`
        }
        await musicStore.db.delete(sql_str)
        tableData.value = []
        musicStore.musicList = tableData.value
        musicStore.songIndexObj.index = 0

        // 删除成功提示
        ElMessage({
          showClose: true,
          type: 'success',
          message: '删除成功',
        })
    })

  }

}


</script>
