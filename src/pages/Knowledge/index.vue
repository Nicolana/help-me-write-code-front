<template>
    <div class="knowledge-base-table-page">
        <!-- <div class="page-title mb-4">知识库列表页面</div> -->
        <div class="page-content">
            <div class="flex items-center justify-between mb-4 px-4">
                <div class="">知识库列表</div>
                <div class="table-action-right">
                    <el-button type="primary" @click="createKnowledgeBase">新建知识库</el-button>
                </div>
            </div>
            <el-card class="box-card" v-loading="loading">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column fixed="left" prop="id" label="ID" width="80" />
                    <el-table-column prop="name" label="知识库名称" width="220" />
                    <el-table-column prop="code" label="向量数据库名称" width="200" />
                    <el-table-column prop="size" label="Size" width="120" />
                    <el-table-column prop="distance" label="距离计算方法" width="120" />
                    <el-table-column prop="description" label="描述" width="220" />
                    <el-table-column fixed="right" label="操作" width="200">
                        <template #default="{ row }">
                            <el-button link type="primary" size="small" @click="viewKnowledge(row)">查看</el-button>
                            <el-button link type="primary" size="small" @click="editKnowledge(row)">编辑</el-button>
                            <el-popconfirm title="确定要删除该知识库?" @confirm="deleteKnowledgeBase(row)">
                                <template #reference>
                                    <el-button link type="primary" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                            <el-button
                                v-if="userStore.userInfo.knowledge_base_code !== row.code"
                                link
                                type="primary"
                                size="small"
                                @click="useKnowledgeBase(row.code)"
                                >使用</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
        <el-dialog
            v-model="dialogVisible"
            :title="editable ? '编辑知识库' : '新增知识库'"
            width="570px"
            destroy-on-close
        >
            <el-form :model="formData" class="demo-form-inline" label-position="top">
                <el-form-item
                    label="知识库名称"
                    prop="name"
                    :rules="[
                        {
                            required: true,
                            message: '请输入知识库名称',
                        },
                    ]"
                >
                    <el-input v-model="formData.name" placeholder="请输入知识库名称" clearable />
                </el-form-item>
                <el-form-item
                    label="向量数据库名称"
                    prop="code"
                    v-if="!editable"
                    :rules="[
                        {
                            required: true,
                            message: '请输入向量数据库名称',
                        },
                        {
                            validator: (rule, value, callback) => {
                                // 写一个校验数字、英文、下划线的正则
                                const reg = /^[0-9a-zA-Z_]+$/;
                                if (!reg.test(value)) {
                                    callback(new Error('只能输入数字、英文、下划线'));
                                } else {
                                    callback();
                                }
                            },
                        },
                    ]"
                >
                    <el-input v-model="formData.code" placeholder="请输入向量数据库名称" clearable />
                </el-form-item>
                <el-form-item
                    label="Size"
                    prop="size"
                    v-if="!editable"
                    :rules="[
                        { required: true, message: '请输入Size' },
                        {
                            validator: (rule, value, callback) => {
                                const reg = /^[0-9]+$/;
                                if (!reg.test(value)) {
                                    callback(new Error('只能输入数字'));
                                } else {
                                    callback();
                                }
                            },
                        },
                    ]"
                >
                    <el-input v-model="formData.size" placeholder="请输入Size, OpenAI Embeddings 1536" clearable />
                </el-form-item>
                <el-form-item
                    label="距离计算方法"
                    prop="distance"
                    v-if="!editable"
                    :rules="[
                        {
                            required: true,
                            message: '请选择距离计算方法',
                        },
                    ]"
                >
                    <el-select v-model="formData.distance" placeholder="请选择距离计算方法">
                        <el-option label="Cosine" value="Cosine" />
                        <el-option label="Euclid" value="Euclid" />
                        <el-option label="Dot" value="Dot" />
                    </el-select>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="formData.description" type="textarea" placeholder="请输入描述" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="addKnowledge" :loading="addLoading"> 确定 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref } from "vue";
import {
    getKnowledgeList,
    createKnowledge,
    updateKnowledge,
    deleteKnowledge,
    selectKnowledgeBase,
} from "@/api/knowledge";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handleClick = () => {
    console.log("click");
};

/**
 * 获取列表数据
 */
const tableData = ref([]);
const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
});
const loading = ref(false);
const tableDataRequest = async () => {
    const payload = {
        page: pagination.page,
        limit: pagination.limit,
    };
    loading.value = true;
    const { code, data: res } = await getKnowledgeList(payload);
    loading.value = false;
    if (code === 200) {
        tableData.value = res.data;
        pagination.total = res.total;
    }
};

tableDataRequest();

/**
 * 新增知识库
 */
const formData = ref({});
const dialogVisible = ref(false);
const addLoading = ref(false);
const editable = ref(false);

const createKnowledgeBase = () => {
    editable.value = false;
    formData.value = {
        name: "",
        code: "",
        size: "",
        distance: "",
        description: "",
    };
    dialogVisible.value = true;
};

const addKnowledge = async () => {
    addLoading.value = true;
    const payload = formData.value;
    const { code, data: res } = !editable.value ? await createKnowledge(payload) : await updateKnowledge(payload);
    addLoading.value = false;
    if (code === 200) {
        dialogVisible.value = false;
        tableDataRequest();
    }
};

const editKnowledge = (item) => {
    editable.value = true;
    formData.value = {
        name: item.name,
        id: item.id,
        description: item.description,
    };
    dialogVisible.value = true;
};

const deleteKnowledgeBase = async (row) => {
    const res = await deleteKnowledge(row.id);
    if (res.code === 200) {
        ElMessage({
            message: "删除成功",
            type: "success",
        });
        tableDataRequest();
    }
};

const useKnowledgeBase = async (code) => {
    const res = await selectKnowledgeBase(code);
    if (res.data) {
        ElMessage({
            message: "使用成功",
            type: "success",
        });
        userStore.setUserInfoField({
            key: "knowledge_base_code",
            value: code,
        });
    }
};

const viewKnowledge = (row) => {
    router.push({ name: "KnowledgeConfig", params: { id: row.id } });
}
</script>

<style></style>
