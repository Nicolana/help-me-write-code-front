import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Knowledge from '../pages/Knowledge.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/knowledge', component: Knowledge },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router