import {createRouter, createWebHashHistory} from "vue-router";


const router = createRouter({
    // 路由类型： 路由分 history和bash
    history:createWebHashHistory(),
    // 路由表
    routes:[
        {
            path:"/",
            component: () => import("../pages/Index"),
            redirect:"recommend", // 利用重定向设置默认显示的嵌套页面
            children:[
                {
                    path:"recommend",
                    component: () => import("../pages/recommend"),
                },
                {
                    path:"category",
                    component: () => import("../pages/category")
                },
                {
                    path:"rank",
                    component: () => import("../pages/rank")
                },
                {
                    path:"search",
                    component: () => import("../pages/search")
                },
                {
                    path:"my_playing_music",
                    component: () => import("../pages/my_playing_music")
                },
                {
                    path:"test",
                    component: () => import("../pages/Test")
                },
            ]
        },
        // 404
        {
            path: '/:pathMatch(.*)*',
            component: () => import("../pages/NotFound")
        }
    ]
})



export default router