import request from '../utils/request';

export function getPrompt(payload) {
    return request.post("/get_prompt", payload)
}

