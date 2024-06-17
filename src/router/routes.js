import {createRouter, createWebHashHistory} from "vue-router";


const router = createRouter({
    // 路由类型： 路由分 history和bash
    history:createWebHashHistory(),
    // 路由表
    routes:[
        {
            path:"/",
            component: () => import("../pages/Index"),
            redirect:"player_screen", // 利用重定向设置默认显示的嵌套页面
            children:[
                {
                    path:"player_screen",
                    component: () => import("../pages/player_screen"),
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
                    path:"play_list",
                    component: () => import("../pages/play_list")
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