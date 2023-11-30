<template>
    <div class="knowledge-item-config">
        <el-tabs v-model="activeName" class="knowledge-item-config-tabs" type="card">
            <el-tab-pane label="数据集" name="dataset">
                <div class="flex items-center justify-between mb-5">
                    <div class="text-xl">知识库: {{ title }}</div>
                    <div>
                        <el-button type="primary" @click="dialogVisible = true">新增数据</el-button>
                    </div>
                </div>
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column prop="filename" label="名称" />
                    <el-table-column prop="file_size" label="大小" width="80" />
                    <el-table-column prop="created_at" label="时间" width="200" />
                    <el-table-column prop="status" label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag v-if="row.status === 1" type="success">已同步</el-tag>
                            <el-tag v-else type="danger">未同步</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="200">
                        <template #default="{ row }">
                            <el-button
                                :loading="row.loading"
                                v-if="row.status !== 1"
                                link
                                type="primary"
                                size="small"
                                @click="syncData(row)"
                                >同步</el-button
                            >
                            <el-popconfirm title="确定要删除该知识库?" @confirm="deleteItem(row)">
                                <template #reference>
                                    <el-button link type="danger" size="small">删除</el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="mt-4 flex justify-end">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="pagination.total"
                        :page-size="pagination.limit"
                        :current-page="pagination.page"
                        @current-change="handleCurrentChange"
                    />
                </div>
            </el-tab-pane>
            <el-tab-pane label="搜索测试" name="search">
                <div class="flex items-start justify-between flex-nowrap h-full gap-4">
                    <div class="w-[450px] h-full px-3 py-3 bg-slate-100 rounded-md">
                        <div class="text-base mb-5">测试文本</div>
                        <div>
                            <el-input
                                type="textarea"
                                :rows="10"
                                v-model="searchText"
                                placeholder="请输入需要测试的文本?"
                            />

                            <div class="flex justify-end">
                                <el-button class="mt-2" type="primary" @click="submitSearch"> 测试 </el-button>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1">
                        <div v-for="(item, index) in searchDataList" :key="index">
                            <div class="bg-slate-100 px-3 py-3 mb-3 rounded-md text-sm">
                                <div class="flex items-center mb-2 gap-4">
                                    <div class="bg-slate-200 px-2 py-[1px] rounded-md tex-[12px]">
                                        # {{ index + 1 }}
                                    </div>
                                    <div class="flex-1">
                                        <el-progress :percentage="(item[1] * 100).toFixed(2)" :show-text="false" />
                                    </div>
                                    <span>
                                        {{ item[1] }}
                                    </span>
                                </div>
                                <div class="h-[100px] text-ellipsis overflow-hidden text-[12px]">
                                    {{ item[0].page_content }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="配置" name="config">
                <div class="text-xl">知识库配置方式</div>
            </el-tab-pane>
        </el-tabs>

        <el-dialog v-model="dialogVisible" title="新增数据" width="75%">
            <el-upload
                v-model:file-list="fileList"
                class="upload-demo"
                drag
                accept=".md"
                name="files"
                action="/api/knowledge_item/create"
                multiple
                :headers="uploadHeaders"
                :data="{ knowledge_id: id }"
                :on-success="onFileUploadSuccess"
                :limit="3"
            >
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">拖拽文件或<em>点击上传</em></div>
                <template #tip>
                    <div class="el-upload__tip">支持.txt, .doc, .docx, .pdf, .md 以及代码文件</div>
                </template>
            </el-upload>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRoute } from "vue-router";
import { UploadFilled } from "@element-plus/icons-vue";
import {
    getKnowledgeItemList,
    getKnowledgeBaseInfo,
    deleteKnowledgeItem,
    syncKnowledgeItem,
    searchKnowledgeItem,
} from "@/api";
import dayjs from "dayjs";
import { formatFileSize } from "@/utils";

const route = useRoute();

const id = computed(() => route.params.id);

const fileList = ref([]);

const activeName = ref("search");

const handleClick = (tab, event) => {
    console.log(tab, event);
};

// 处理表格数据
const tableData = ref([]);
const pagination = ref({
    page: 1,
    limit: 20,
    total: 0,
});

const title = ref("");
const knowledge_info = ref({});
const getKnowledgeInfo = async () => {
    const res = await getKnowledgeBaseInfo(id.value);
    if (res.code === 200) {
        title.value = res.data?.name;
        knowledge_info.value = res.data;
    }
};

getKnowledgeInfo();

const tableDataRequest = async () => {
    const res = await getKnowledgeItemList({
        page: pagination.page,
        limit: pagination.limit,
        knowledge_id: id.value,
    });
    if (res.code === 200) {
        tableData.value = res.data?.data?.map((item) => ({
            ...item,
            loading: false,
            created_at: dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss"),
            file_size: formatFileSize(item.file_size),
        }));
        pagination.total = res.data?.total;
    }
};

const handleCurrentChange = (val) => {
    pagination.page = val;
    tableDataRequest();
};

// 新增数据
const dialogVisible = ref(false);
const createKnowledgeItem = () => {
    console.log("上传新的知识库文件");
};

const syncData = async (data) => {
    console.log("同步数据到向量数据库，执行embedding!");
    data.loading = true;
    const res = await syncKnowledgeItem([data.id]);
    data.loading = false;

    if (res.code === 200 && res.data) {
        ElMessage({
            message: "同步成功",
            type: "success",
        });
        tableDataRequest();
    }
};

const deleteItem = (data) => {
    console.log("删除知识库文件", data);
};

const onFileUploadSuccess = () => {
    tableDataRequest();
    ElMessage({
        message: "上传成功",
        type: "success",
    });
};

const uploadHeaders = ref({
    Authorization: "Bearer " + localStorage.getItem("token"),
});

// 搜索测试
const searchText = ref();
const searchDataList = ref([]);

const submitSearch = async () => {
    const res = await searchKnowledgeItem({
        question: searchText.value,
        knowledge_code: knowledge_info.value.code,
        count: 10,
    });
    searchDataList.value = res;
    console.log("Res =", res);
};

watch(
    () => activeName.value,
    (newTab) => {
        if (newTab === "dataset") {
            tableDataRequest();
        }
    },
    { immediate: true }
);
</script>
