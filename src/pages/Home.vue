<template>
    <div class="chat-bot-container">
        <div class="chat-bot-wrap flex h-[80vh] rounded-[0.5rem] overflow-hidden w-full">
            <div class="chat-bot-history w-[336px] bg-[rgb(245,245,245)] px-[16px] py-[16px]">History is here</div>
            <div class="chat-bot-main h-full flex flex-col flex-1 p-[16px]">
                <div class="chat-bot-modal flex-1">聊天窗口</div>
                <div class="chat-bot-input flex-shrink-0 flex items-center">
                    <el-input
                        v-model="queryText"
                        type="textarea"
                        autosize
                        placeholder="请输入对话内容，换行请使用Shift + Enter"
                        class="input-with-select flex-1"
                    >
                        <template #append>
                            <el-button :icon="Search" />
                        </template>
                    </el-input>
                    <el-button :icon="Promotion" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { getPrompt } from "../api";
import { isEmpty, copyContent } from "../utils/index.js";
import { ElMessage } from "element-plus";
import { Promotion } from "@element-plus/icons-vue";

const queryText = ref();
const outPutText = ref();
const loading = ref(false);

const isEmptyOutputText = computed(() => isEmpty(outPutText.value));

const onCopy = (text) => {
    copyContent(text);
    ElMessage({
        message: "复制成功",
        type: "success",
    });
};
const onGenerateClick = async () => {
    if (isEmpty(queryText.value?.trim())) {
        ElMessage({
            message: "问题不能为空",
            type: "error",
        });
        return;
    }
    loading.value = true;
    const res = await getPrompt({ query: queryText.value });
    loading.value = false;
    if (res.status === 200) {
        outPutText.value = res.data;
    }
};
</script>
