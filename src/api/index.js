import { post, get } from '../utils/request';

export function getPrompt(payload) {
    return post("/get_prompt", payload)
}

export function getSearch(payload) {
    return post('/search', payload)
}

/**
 * 获取答案
 * @param {} payload 
 * @returns 
 */
export function getAnswer(payload) {
    return post('/bot/chat', payload)
}


/**
 * 登录
 * @param {*} payload
 * @returns
 * @description
 */
export function login(payload) {
    return post('/user/login', payload)
}


export function getUserInfo(payload) {
    return get('/user/info', payload)
}

export * from './chat';
export * from './knowledge';