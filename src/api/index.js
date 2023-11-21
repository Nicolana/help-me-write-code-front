import request from '../utils/request';

export function getPrompt(payload) {
    return request.post("/get_prompt", payload)
}

export function getSearch(payload) {
    return request.post('/search', payload)
}

/**
 * 获取答案
 * @param {} payload 
 * @returns 
 */
export function getAnswer(payload) {
    return request.post('/bot/chat', payload)
}


/**
 * 登录
 * @param {*} payload
 * @returns
 * @description
 */
export function login(payload) {
    return request.post('/user/login', payload)
}


export function getUserInfo(payload) {
    return request.get('/user/info', payload)
}
