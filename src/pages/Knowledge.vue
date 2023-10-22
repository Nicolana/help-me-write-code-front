<template>
    <div>
        <div class="flex items-center">
            <el-input v-model="query" size="large" placeholder="请输入" clearable/>
            <el-button :loading="loading" class="ml-4" type="primary" @click="onSubmit" size="large">搜索</el-button>
        </div>

        <div class="mt-4 h-[800px] rounded-4 p-4 max-h-1000px"
             style="box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset">
            {{ content }}
        </div>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {getSearch} from "../api/index.js";
import { marked } from 'marked';

const query = ref('');
const content = ref('');
const loading = ref(false)

const onSubmit = async () => {
    loading.value = true
    const res = await getSearch({query: query.value})
    content.value = ''
    console.log("Res =", res)
    if (res.status === 200) {
        console.log("res.data =", res.data);
        content.value = res.data;
    }
    loading.value = false
}
</script>