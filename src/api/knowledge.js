import { get, post, put, del } from '../utils/request';


/**
 * 创建知识库
 * @param {*} payload
 * @returns Promise<any>
 * @description 创建知识库
*/
export function createKnowledge(payload) {
    return post('/knowledge_base/create', payload)
}


/**
 * 删除知识库
 * @returns Promise<any>
 * @description 删除知识库
 * @param {*} id
 */
export function deleteKnowledge(id) {
    return del(`/knowledge_base/delete/${id}`)
}


/**
 * 分页获取知识库列表
 * @returns Promise<any>
 * @description 分页获取知识库列表
 * @param {*} params
 */
export function getKnowledgeList(params) {
    return get('/knowledge_base/query_page', params)
}

/**
 * 更新知识库信息
 * @returns Promise<any>
 * @description 更新知识库信息
 * @param {*} payload
 */
export function updateKnowledge(payload) {
    return put('/knowledge_base/update', payload)
}



/**
 * 选择 Knowledge Base
 */
export function selectKnowledgeBase(knowledge_base_code) {
    return get(`/knowledge_base/select/${knowledge_base_code}`)
}

