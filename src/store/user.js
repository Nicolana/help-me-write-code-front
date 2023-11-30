import { defineStore } from 'pinia'
import { login, getUserInfo } from '../api'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token'),
        userInfo: {},
        chatId: null,
    }),
    getters: {
        getToken() {
            return this.token
        }
    },
    actions: {
        setUserInfoField({ key, value }) {
            this.userInfo[key] = value
        },
        setToken(token) {
            this.token = token
        },
        async getUserInfo() {
            const userInfo = await getUserInfo()
            this.userInfo = userInfo.data
        },
        async login(payload) {
            const res = await login(payload)
            if (!res.data) {
                throw res;
            }
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
        },
        setChat(id) {
            this.chatId = id
        }
    }
})
