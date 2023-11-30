import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Knowledge from '../pages/Knowledge/index.vue'
import Config from '../pages/Knowledge/Config/index.vue'
import Login from '../pages/User/Login.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/knowledge', component: Knowledge },
    { path: '/knowledge/config', name: 'KnowledgeConfig', component: Config },
    {
        path: '/login', component: Login
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next()
    } else {
        const token = localStorage.getItem('token')
        if (token) {
            next()
        } else {
            next('/login')
        }
    }
})

export default router
