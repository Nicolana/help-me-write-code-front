import { defineStore } from 'pinia'
import { login } from '../api'

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
        async login(payload) {
            const res = await login(payload)
            this.token = res.data.access_token;
            localStorage.setItem('token', res.data.access_token);
            return res
        }
    }
})
