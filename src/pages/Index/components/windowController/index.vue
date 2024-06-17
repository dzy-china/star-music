<template>
  <div class="hs-position-fixed hs-right-5 hs-row-end-center " style="-webkit-app-region: no-drag;">

    <!--输入框-->
    <el-input
        v-model="model_form_input"
        placeholder="歌曲或歌手"
        class="hs-margin-right-5 hs-width-200"
        @keyup.enter="on_form_input_enter"
    >
    <template #prefix>
      <el-icon class=""><search /></el-icon>
    </template>
    </el-input>

    <!--关闭放大 控制图标-->
    <div class="hs-row-center-center hs-child-width-35 hs-child-height-25 hs-child-row-center-center hs-child-hover-background-color-gray-03 hs-child-cursor-pointer hs-child-color-white">
      <!--  置顶  -->
    <span @click="on_top" title="置顶" :class="{'hs-color-success hs-background-color-gray-03':is_top}">
        <svg t="1689535073043" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3182"  width="14" height="14"><path d="M706.081047 78.192364c2.699736 0 4.899522 0 9.399082 4.39957 3.999609 4.0996 4.39957 6.399375 4.39957 9.399083 0 3.099697-0.299971 5.299482-4.49956 9.599062-0.999902 1.099893-1.999805 1.899814-2.999707 2.499756-43.995704 30.197051-70.193145 79.592227-70.193146 132.187091v2.099795c0 123.787911 42.795821 244.576116 120.488234 340.166781 0.399961 0.499951 0.699932 0.899912 1.099893 1.399863 17.09833 21.497901 27.597305 44.395664 31.696904 69.393223h-566.944634c4.0996-24.997559 14.598574-47.895323 31.596914-69.293233 0.19998-0.299971 0.399961-0.599941 0.699932-0.799922 77.992384-96.290597 120.988185-217.278781 120.988185-340.766722v-2.299775c0-52.594864-26.297432-101.99004-70.293136-132.187091-0.999902-0.699932-2.099795-1.599844-3.199687-2.699737-3.999609-3.999609-4.29958-6.299385-4.29958-9.299091 0-3.099697 0.299971-5.299482 4.39957-9.499073 3.999609-3.999609 6.299385-4.29958 9.299092-4.29958h388.362074m0-63.993751H317.718973c-21.09794 0-39.396153 7.799238-54.694659 23.097745-15.298506 15.498486-22.997754 33.596719-22.997754 54.694659s7.799238 39.396153 23.097744 54.694658c3.899619 3.799629 7.899229 7.199297 12.098819 10.099014 26.297432 18.098233 42.49585 47.495362 42.49585 79.492237v2.299775C317.718973 347.966019 279.922664 453.955668 211.029392 538.947368c-0.299971 0.399961-0.599941 0.799922-0.999903 1.199883-31.796895 39.896104-47.595352 84.691729-47.595352 134.386877 0 10.498975 3.799629 19.598086 11.498877 27.297334 7.599258 7.699248 16.79836 11.498877 27.297335 11.498877h245.076066l46.095499 294.371253c1.999805 10.898936 8.49917 16.298408 19.398106 16.298408h0.599941c4.799531 0 8.999121-1.599844 12.398789-4.999512 3.499658-3.299678 5.699443-7.599258 6.399375-12.398789l31.096963-293.17137h260.374573c10.498975 0 19.598086-3.799629 27.297334-11.498877 7.699248-7.599258 11.498877-16.79836 11.498877-27.297334 0-49.895127-15.898447-94.690753-47.695342-134.586857-0.499951-0.599941-0.999902-1.299873-1.499853-1.899814-68.893272-84.691729-106.18963-190.681379-106.18963-299.770726v-2.099795c0-31.896885 16.098428-61.394004 42.39586-79.392247 4.29958-2.899717 8.29919-6.299385 12.198808-10.298994 15.398496-15.498486 23.097744-33.596719 23.097745-54.694659s-7.799238-39.296162-23.097745-54.694658c-15.398496-15.298506-33.496729-22.997754-54.594668-22.997755z" fill="currentColor" p-id="3183"></path></svg>
    </span>

<!--  最小化  -->
    <span @click="on_min" title="最小化">
        <svg t="1689535481822" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4024" width="14" height="14"><path d="M512 1255.489906" p-id="4025"></path><path d="M498.081951 943.76654" p-id="4026"></path><path d="M772.963422 533.491105l-528.06716 0c-12.38297 0-22.514491-10.131521-22.514491-22.514491l0 0c0-12.38297 10.131521-22.514491 22.514491-22.514491l528.06716 0c12.38297 0 22.514491 10.131521 22.514491 22.514491l0 0C795.477913 523.359584 785.346392 533.491105 772.963422 533.491105z" fill="currentColor" p-id="4027"></path></svg>
    </span>

    <!--  最大化  -->
      <span @click="on_max"  title="最大化">
    <svg t="1689535891717" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4958" width="14" height="14"><path d="M812.3 959.4H213.7c-81.6 0-148-66.4-148-148V212.9c0-81.6 66.4-148 148-148h598.5c81.6 0 148 66.4 148 148v598.5C960.3 893 893.9 959.4 812.3 959.4zM213.7 120.9c-50.7 0-92 41.3-92 92v598.5c0 50.7 41.3 92 92 92h598.5c50.7 0 92-41.3 92-92V212.9c0-50.7-41.3-92-92-92H213.7z" fill="currentColor"  p-id="4959"></path></svg>
    </span>

    <!--  关闭  -->
    <span @click="on_close"  title="关闭">
   <svg t="1689536198765" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6344" width="14" height="14"><path d="M846.841 799.024L562.002 514.185l284.839-284.96c13.714-13.714 13.714-36.045 0-49.759s-36.045-13.714-49.759 0L512.243 464.305l-284.96-284.839c-13.714-13.714-36.045-13.714-49.759 0s-13.714 36.045 0 49.759l284.96 284.96-284.96 284.839c-13.714 13.714-13.714 36.045 0 49.759s36.045 13.714 49.759 0l284.96-284.96 284.96 284.96c13.714 13.714 36.045 13.714 49.759 0 13.593-13.714 13.593-36.045-0.122-49.759z" fill="currentColor" p-id="6345"></path></svg>
          </span>
    </div>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'
import Http from "@/js/Http"
import format_line_music_search_to_local from "./format_line_music_search_to_local"
import { useMusicStore } from "@/store/music";
import { useRouter } from 'vue-router'
const router = useRouter()

/*定义变量*/
const musicStore = useMusicStore()  // store

/* 导入 主进程api */
const {
  ipcRenderer
} = require("electron");

const model_form_input = ref('')
const is_top = ref(false)


// 消息传递给主进程
const on_top = ()=>{
  is_top.value=!is_top.value
  ipcRenderer.send('top')
}
const on_min = ()=>{
  ipcRenderer.send('min')
}
const on_max = ()=>{
  ipcRenderer.send('max')
}
const on_close = ()=>{
  ipcRenderer.send('close')
}

const on_form_input_enter = ()=>{
    const offset = 0
    const pageSize = 25

    // 搜索时弹框提示
    const ElMessageInstance = ElMessage({
      showClose: true,
      duration:0,
      type: 'warning',
      message: '正在搜索，请稍等。。。',
    })

    new Http({
      //自定义参数：请求网址
      url:`https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${model_form_input.value}&type=1&offset=${offset}&limit=${pageSize}&total=true`,
      method:'get', // 请求方式，不区分大小写，默认值： 'GET'
    }).go().then(data => {
      const search_line_music_data = JSON.parse(data)
      const search_music_data = format_line_music_search_to_local(search_line_music_data)
      musicStore.search_music_data.startOffset = offset
      musicStore.search_music_data.pageSize = pageSize
      musicStore.search_music_data.totalCount = search_music_data.totalCount
      musicStore.search_music_data.data = search_music_data.data
      // 手动关闭弹框
      ElMessageInstance.close()
      // 页面跳转
      router.push('/search')
    }).catch(err => {
      console.error('Error:', err);
    });
}
</script>