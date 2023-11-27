<template>
    <div class="chat-bot-container">
        <el-dialog v-model="editDialogVisible" width="570px" title="修改">
            <el-form :model="editChatFormData" label-position="top">
                <el-form-item label="Chat name">
                    <el-input v-model="editChatFormData.name" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取消</el-button>
                    <el-button type="primary" :loading="updateLoading" @click="onUpdateClick"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
        <div class="chat-bot-wrap flex h-[calc(100vh-60px-24px-24px)] rounded-[0.5rem] overflow-hidden w-full">
            <div class="chat-bot-history w-[336px] bg-[rgb(245,245,245)] px-[16px] py-[16px] rounded-lg flex flex-col">
                <div class="flex flex-col overflow-y-auto gap-1 flex-1" v-loading="chatDeleteLoading">
                    <div
                        class="chat-bot-history-row h-[44px] w-full flex items-center rounded-md px-2 hover:bg-gray-200 cursor-pointer"
                        v-for="item in chatList"
                        :class="[item.id === userStore.chatId ? 'bg-gray-200' : '']"
                        :key="item.id"
                        @click="userStore.setChat(item.id)"
                    >
                        <div class="flex-1 text-gray-500 chat-bot-history-row-text">
                            {{ item.name }}
                        </div>
                        <div class="chat-bot-history-actions">
                            <div class="chat-bot-history-row-edit" @click="editChatRow(item.id)">
                                <el-icon><EditPen /></el-icon>
                            </div>
                            <div class="chat-bot-history-row-delete" @click="deleteChatForMe(item.id)">
                                <el-icon>
                                    <Delete />
                                </el-icon>
                            </div>
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
                    <div
                        class="absolute top-0 left-0 w-full h-full overflow-y-scroll"
                        ref="talkModal"
                        v-loading="messageLoading"
                    >
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
                                <div class="flex-1 text-[14px] w-[100px]">
                                    <div class="break-words" v-html="message.content"></div>
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
import { Promotion, Plus, Delete, EditPen } from "@element-plus/icons-vue";
import UserImage from "../assets/imgs/user.png";
import { getChatList, createChat, getMessages, deleteChat, updateChat } from "@/api";
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
    User: "user",
    // 系统
    System: "system",
    // 机器人助手
    Assistant: "assistant",
};
const talkModal = ref(null);

const getMessageTypeByRole = (role) => {
    switch (role) {
        case "user":
            return MessageType.User;
        case "assistant":
            return MessageType.Assistant;
        default:
            return MessageType.System;
    }
};

const state = reactive({
    messages: [
        // {
        //     type: MessageType.System,
        //     content: `Hello! How can I assist you today?`,
        //     status: "FINISH",
        // },
    ],
});
const messageLoading = ref(false);

const getHistoryMessages = async (chat_id) => {
    messageLoading.value = true;
    const res = await getMessages(chat_id);
    messageLoading.value = false;
    if (res.data) {
        state.messages = res.data.map((item) => {
            return {
                type: getMessageTypeByRole(item.role),
                content: markdown.parse(item.content),
                id: item.id,
                status: "FINISH",
            };
        });
        scrollToModalBottom();
    }
};

const scrollToModalBottom = () => {
    setTimeout(() => {
        talkModal.value.scrollTo(0, talkModal.value.scrollHeight);
    }, 0);
};

watch(
    () => userStore.chatId,
    (newChatId) => {
        if (newChatId) {
            getHistoryMessages(newChatId);
        }
    },
    { immediate: true }
);

/**
 * 删除一个聊天记录
 */

const chatDeleteLoading = ref(false);
const deleteChatForMe = async (id) => {
    if (chatDeleteLoading.value) return;
    chatDeleteLoading.value = true;
    const res = await deleteChat(id);
    chatDeleteLoading.value = false;
    if (res.data) {
        ElMessage({
            message: "删除成功",
            type: "success",
        });
        if (id === userStore.chatId) {
            userStore.setChat(null);
        }
        getList();
    }
};

/**
 * 编辑聊天名字
 * @param {*} param0
 */
const editDialogVisible = ref(false);
const updateLoading = ref(false);
const editChatFormData = ref({
    name: "",
    id: null,
});
const editChatRow = async (id) => {
    const currentChat = chatList.value.find((item) => item.id === id);
    editChatFormData.value = { ...currentChat };
    editDialogVisible.value = true;
};

const onUpdateClick = async () => {
    updateLoading.value = true;
    const res = await updateChat(editChatFormData.value);
    updateLoading.value = false;
    if (res.data) {
        ElMessage({
            message: "修改成功",
            type: "success",
        });
        editChatFormData.value = {};
        editDialogVisible.value = false;
        getList();
    }
};

const pushMessage = ({ message, id }) => {
    const item = state.messages.find((item) => item.id === id);
    if (!item) {
        state.messages.push({
            ...message,
            id,
        });
        scrollToModalBottom();
        return;
    }

    item.content = markdown.parse(message.content);
    item.status = message.status;
    scrollToModalBottom();
};

const queryText = ref();
const loading = computed(() => state.messages?.some((item) => item.status !== "FINISH"));
const generateId = () => {
    if (state.messages.length === 0) {
        return Date.now();
    }
    return (state.messages[state.messages.length - 1]?.id ?? Date.now()) + 1;
};

async function sendMessage(message) {
    const id = generateId();
    const messageItem = {
        type: MessageType.System,
        content: "正在生成中...",
        status: "LOADING",
    };
    pushMessage({ message: messageItem, id });
    const response = await fetch("/api/bot/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ query: message, chat_id: userStore.chatId }),
    });
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    const reader = response.body.getReader();
    let chunks = [];

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
            content: markdown.parse(queryText.value),
            status: "FINISH",
        },
        id: generateId(),
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

.chat-bot-history {
    .chat-bot-history-row {
        /* .chat-bot-history-row-text {
        } */
        .chat-bot-history-actions {
            display: none;
            .chat-bot-history-row-edit,
            .chat-bot-history-row-delete {
                &:hover {
                    color: rgba(0, 0, 0, 0.8);
                }
            }
        }
        &:hover {
            .chat-bot-history-actions {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: rgba(0, 0, 0, 0.4);
                cursor: pointer;
            }
        }
    }
}
</style>
