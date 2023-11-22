<template>
    <div class="chat-bot-container">
        <div class="chat-bot-wrap flex h-[calc(100vh-60px-24px-24px)] rounded-[0.5rem] overflow-hidden w-full">
            <div class="chat-bot-history w-[336px] bg-[rgb(245,245,245)] px-[16px] py-[16px] rounded-lg flex flex-col">
                <div class="flex flex-col overflow-y-auto gap-1 flex-1">
                    <div
                        class="h-[44px] w-full flex items-center rounded-md px-2 hover:bg-gray-200 cursor-pointer"
                        v-for="item in chatList"
                        :class="[item.id === userStore.chatId ? 'bg-gray-200' : '']"
                        :key="item.id"
                        @click="userStore.setChat(item.id)"
                    >
                        <div class="flex-1 text-gray-500">
                            {{ item.name }}
                        </div>
                    </div>
                </div>
                <div class="flex-shrink-0">
                    <el-button
                        :loading="newChatRequestLoading"
                        class="w-full"
                        :icon="Plus"
                        color="#626aef"
                        :dark="isDark"
                        size="large"
                        @click="createNewChat"
                        >新的聊天</el-button
                    >
                </div>
            </div>
            <div class="chat-bot-main h-full flex flex-col flex-1 px-[16px] pt-4 pb-0 text-base">
                <div class="chat-bot-modal flex-1 relative">
                    <div class="absolute top-0 left-0 w-full h-full overflow-y-scroll" v-loading="messageLoading">
                        <div>
                            <div
                                v-for="(message, index) in state.messages"
                                :key="index"
                                class="flex items-start rounded-lg"
                                :class="{
                                    'mt-4': index != 0,
                                    'bg-[rgba(240,242,246,0.5)] p-4': message.type === MessageType.User,
                                    'pl-4': [MessageType.System, MessageType.Assistant].includes(message.type),
                                }"
                            >
                                <div
                                    class="mr-4 w-8 h-8 bg-[rgb(255,108,108)] text-white rounded-[0.5rem] flex-shrink-0 flex items-center justify-center"
                                    v-if="message.type === MessageType.User"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                        focusable="false"
                                        fill="currentColor"
                                        xmlns="http://www.w3.org/2000/svg"
                                        color="inherit"
                                        class="eyeqlp51 st-emotion-cache-fblp2m ex0cdmw0"
                                    >
                                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                                        <path
                                            d="M10.25 13a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM15 11.75a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zm7 .25c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2s10 4.48 10 10zM10.66 4.12C12.06 6.44 14.6 8 17.5 8c.46 0 .91-.05 1.34-.12C17.44 5.56 14.9 4 12 4c-.46 0-.91.05-1.34.12zM4.42 9.47a8.046 8.046 0 003.66-4.44 8.046 8.046 0 00-3.66 4.44zM20 12c0-.78-.12-1.53-.33-2.24-.7.15-1.42.24-2.17.24a10 10 0 01-7.76-3.69A10.016 10.016 0 014 11.86c.01.04 0 .09 0 .14 0 4.41 3.59 8 8 8s8-3.59 8-8z"
                                        ></path>
                                    </svg>
                                </div>
                                <div
                                    class="mr-4 w-8 h-8 text-white rounded-[0.5rem] flex-shrink-0 flex items-center justify-center overflow-hidden"
                                    v-else
                                >
                                    <img :src="UserImage" alt="user icon" />
                                </div>
                                <div class="flex-1">
                                    <div v-html="message.content"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-bot-input flex-shrink-0 bg-white pt-[16px]">
                    <div class="chat-bot-input-wrap">
                        <el-input
                            v-model="queryText"
                            type="textarea"
                            @keydown="handleKeyCode($event)"
                            :autosize="{ minRows: 1, maxRows: 4 }"
                            placeholder="请输入对话内容，换行请使用Shift + Enter"
                            class="input-with-select flex-1"
                        >
                        </el-input>
                        <el-button :icon="Promotion" :loading="loading" @click="onGenerateClick" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from "vue";
import { isEmpty } from "../utils/index.js";
import { ElMessage } from "element-plus";
import { Promotion, Plus } from "@element-plus/icons-vue";
import UserImage from "../assets/imgs/user.png";
import { getChatList, createChat, getMessages } from "@/api";
import { useUserStore } from "@/store/user";
import { markdown } from "@/utils/markdown";

/**
 * 获取Chat List
 */
const userStore = useUserStore();
const chatList = ref([]);
const getList = async () => {
    const res = await getChatList();
    chatList.value = res.data;
    if (!userStore.chatId) {
        userStore.setChat(res?.data?.[0]?.id);
    }
};

getList();

/**
 * 创建一个新的聊天
 */
const newChatRequestLoading = ref(false);
const createNewChat = async () => {
    newChatRequestLoading.value = true;
    const payload = {
        name: "新的聊天",
    };
    const res = await createChat(payload);
    newChatRequestLoading.value = false;
    if (res.data) {
        ElMessage({
            message: "创建成功",
            type: "success",
        });
        userStore.setChat(res.data?.id);
        getList();
    }
};

/**
 * 获取当前chat的消息历史记录
 */

const MessageType = {
    // 用户
    User: 'user',
    // 系统
    System: 'system',
    // 机器人助手
    Assistant: 'assistant'
};

const getMessageTypeByRole = (role) => {
    switch (role) {
        case 'user':
            return MessageType.User;
        case 'assistant':
            return MessageType.Assistant;
        default:
            return MessageType.System;
    }
}

const state = reactive({
    messages: [
        {
            type: MessageType.System,
            content: `Hello! How can I assist you today?`,
            status: "FINISH",
        },
    ],
});
const messageLoading = ref(false);

const getHistoryMessages = async (chat_id) => {
    messageLoading.value = true;
    const res = await getMessages(chat_id);
    messageLoading.value = false;
    console.log("Messages =", res);
    if (res.data) {
        state.messages = res.data.map((item) => {
            return {
                type: getMessageTypeByRole(item.role),
                content: markdown.parse(item.content),
                status: "FINISH",
            };
        });
    }
}

watch(() => userStore.chatId, (newChatId) => {
    console.log("chatId update =", newChatId);
    if (newChatId) {
        getHistoryMessages(newChatId);
    }
}, { immediate: true })

const pushMessage = ({ message, id }) => {
    const item = state.messages.find((item) => item.id === id);
    if (!item) {
        state.messages.push({
            ...message,
            id,
        });
        return;
    }
    item.content = message.content;
    item.status = message.status;
};

const queryText = ref();
const loading = computed(() => state.messages?.some((item) => item.status !== "FINISH"));

async function sendMessage(message) {
    const response = await fetch("/api/bot/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: message, chat_id: userStore.chatId }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const reader = response.body.getReader();
    let chunks = [];
    const id = Date.now();

    const messageItem = {
        type: MessageType.System,
        content: "正在生成中...",
        status: "LOADING",
    };
    pushMessage({ message: messageItem, id });

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            const result = new TextDecoder("utf-8").decode(
                new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...Array.from(chunk)], []))
            );
            pushMessage({ message: { type: MessageType.System, content: result, status: "FINISH" }, id });
            break;
        }
        const result = new TextDecoder("utf-8").decode(
            new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...Array.from(chunk)], []))
        );
        pushMessage({ message: { type: MessageType.System, content: result }, id });
        chunks.push(value);
    }
}

const onGenerateClick = async () => {
    if (loading.value) {
        return;
    }
    if (isEmpty(queryText.value?.trim())) {
        ElMessage({
            message: "问题不能为空",
            type: "error",
        });
        return;
    }
    pushMessage({
        message: {
            type: MessageType.User,
            content: queryText.value,
            status: "FINISH",
        },
        id: Date.now(),
    });
    sendMessage(queryText.value);
    queryText.value = "";
};

function handleKeyCode(event) {
    const keyCode = event.which || event.keyCode;

    if (keyCode === 13 && !event.shiftKey) {
        if (!event.metaKey) {
            event.preventDefault();
            onGenerateClick();
        } else {
            queryText.value = queryText.value + "\n";
        }
    }
}
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
