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

/**
 * 获取数据集列表
 */
export function getKnowledgeItemList(params) {
    return get('/knowledge_item/query_page', params)
}

/**
 * 获取知识库详情
 */
export function getKnowledgeBaseInfo(id) {
    return get('/knowledge_base/info', { knowledge_id: id })
}

export function deleteKnowledgeItem(ids = []) {
    return del('/knowledge_item/delete', [...ids])
}

/**
 * 同步知识库数据到向量数据库
 */
export function syncKnowledgeItem(ids=[]) {
    return post('/knowledge_item/sync', [...ids])
}

/**
 * 搜索向量数据库
 */
export function searchKnowledgeItem(payload) {
    return post('/knowledge_item/search', payload)
}

