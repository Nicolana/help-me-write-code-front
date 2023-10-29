<template>
    <div class="chat-bot-container">
        <div class="chat-bot-wrap flex h-[80vh] rounded-[0.5rem] overflow-hidden w-full">
            <div class="chat-bot-history w-[336px] bg-[rgb(245,245,245)] px-[16px] py-[16px]">History is here</div>
            <div class="chat-bot-main h-full flex flex-col flex-1 p-[16px]">
                <div class="chat-bot-modal flex-1 relative">
                    <div class="absolute top-0 left-0 w-full h-full overflow-y-scroll">
                        <div>Real Content is here</div>
                    </div>
                </div>
                <div class="chat-bot-input flex-shrink-0 bg-white pt-[16px]">
                    <div class="chat-bot-input-wrap">
                        <el-input
                            v-model="queryText"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 4 }"
                            placeholder="请输入对话内容，换行请使用Shift + Enter"
                            class="input-with-select flex-1"
                        >
                        </el-input>
                        <el-button :icon="Promotion" />
                    </div>
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

<style lang="scss">
.chat-bot-input {
    .chat-bot-input-wrap {
        background-color: rgb(245, 245, 245);
        display: flex;
        align-items: flex-end;
        border-radius: 0.5rem;
        .el-textarea__inner {
            padding: 16px;
            height: 100%;
            background: transparent;
            box-shadow: none;
            resize: none;
        }
        .el-button {
            background: none;
            height: 53px;
            font-size: 20px;
            border: none;
        }
    }    
}
</style>
