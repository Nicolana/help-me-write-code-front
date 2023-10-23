<template>
    <div>
        <div class="flex items-center">
            <el-input v-model="query" size="large" placeholder="请输入" clearable/>
            <el-button :loading="loading" class="ml-4" type="primary" @click="onSubmit" size="large">搜索</el-button>
        </div>

        <div class="mt-4 rounded-4 p-4 h-[600px] overflow-y-scroll"
             style="box-shadow: 0 0 0 1px var(--el-input-border-color,var(--el-border-color)) inset" ref="codeContainer">
            <!--{{ content }}-->
            <div v-for="(page, index) in content">
                <div v-html="page"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, onMounted, onUpdated} from 'vue'
import {getSearch} from "../api/index.js";
import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
const query = ref('');
const content = ref([]);
const loading = ref(false)
import {useHighlight} from "../hooks/useHighlight.js";

const codeContainer = ref(null);

const { highlight } = useHighlight();

onMounted(() => {
    highlight(codeContainer.value);
});

onUpdated(() => {
    highlight(codeContainer.value);
});


const renderer = new marked.Renderer();
renderer.code = function (code, language) {
    console.log("Language =", language)
//    const validLanguage = hljs.getLanguage(language) ? language : 'tsx';
    const validLanguage = 'tsx';
    return `<pre><code class="hljs ${validLanguage}">${hljs.highlightAuto(code).value}</code></pre>`;
};

marked.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
});

const onSubmit = async () => {
    loading.value = true
    const res = await getSearch({query: query.value})
    content.value = ''
    console.log("Res =", res)
    if (res.status === 200) {
        console.log("res.data =", res.data);
        content.value = res.data?.map(item => marked.parse(item.page_content));
    }
    loading.value = false
}
</script>

<style>
</style>