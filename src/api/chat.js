import { get, post, put, del } from '../utils/request';


/**
 * 创建聊天
 * @param {*} payload
 * @returns Promise<any>
 * @description 创建聊天
 */
export function createChat(payload) {
    return post('/chat/create', payload)
}

/**
 * 删除聊天
 * @param {*} id
 * @returns Promise<any>
 * @description 删除聊天
 */
export function deleteChat(id) {
    return del(`/chat/delete/${id}`)
}

/**
 * 获取聊天列表
 * @returns Promise<any>
 * @description 获取聊天列表
 */
export function getChatList() {
    return get('/chat/list')
}


/**
 * 更新聊天信息
 * @returns Promise<any>
 * @description 更新聊天信息
 */
export function updateChat(payload) {
    return put('/chat/update', payload)
}

/**
 * 获取聊天消息列表
 * @returns Promise<any>
 * @description 获取聊天消息列表
 */
export function getMessages(id) {
    return get('/chat/messages', { chat_id: id })
}


