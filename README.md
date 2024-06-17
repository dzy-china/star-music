# 产品描述
电脑端音乐播放器

# 核心技术栈
- electron
- vue3
- pinia
- vue-router
- element-plus
- sql.js

# 开发注意
1. 在渲染进程(vue页面)中导入nodejs或第三方模块必须使用require
2. 在渲染进程(vue页面)中导入`element-plus`弹框(`ElMessage, ElMessageBox`)组件不必手动导入
