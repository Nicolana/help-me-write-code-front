import { defineStore } from 'pinia'
import { login, getUserInfo } from '../api'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token'),
        userInfo: {}
    }),
    getters: {
        getToken() {
            return this.token
        }
    },
    actions: {
        setToken(token) {
            this.token = token
        },
        async getUserInfo() {
            const userInfo = await getUserInfo()
            this.userInfo = userInfo.data
        },
        async login(payload) {
            const res = await login(payload)
            this.token = res.data.access_token;
            localStorage.setItem('token', res.data.access_token);
            const userInfo = await getUserInfo()
            this.userInfo = userInfo.data
            return res
        },
        logout() {
            this.token = '';
            this.userInfo = {};
            localStorage.removeItem('token');
        }
    }
})
