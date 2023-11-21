import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Knowledge from '../pages/Knowledge.vue'
import Upload from '../pages/Upload.vue'
import Login from '../pages/User/Login.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/knowledge', component: Knowledge },
    { path: '/upload', component: Upload },
    {
        path: '/login', component: Login
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
