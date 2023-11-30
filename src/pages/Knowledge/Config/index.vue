<template>
    <div class="knowledge-item-config">
        <el-tabs v-model="activeName" class="knowledge-item-config-tabs" @tab-click="handleClick" type="card">
            <el-tab-pane label="数据集" name="dataset">
                <div class="text-xl">知识库文件</div>
                <!-- <div class="mt-4">
                    <el-upload
                        v-model:file-list="fileList"
                        class="upload-demo"
                        accept=".md"
                        name="files"
                        action="/api/upload_knowledges/"
                        multiple
                        :on-success="onFileUploadSuccess"
                        :limit="3"
                    >
                        <el-button color="#626aef" dark>上传文档到知识库</el-button>
                        <template #tip>
                            <div class="el-upload__tip">目前仅支持Markdown文件</div>
                        </template>
                    </el-upload>
                </div> -->
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="id" label="ID" width="80" />
                    <el-table-column prop="filename" label="名称" width="180" />
                    <el-table-column prop="file_size" label="大小" width="80" />
                    <el-table-column prop="create_at" label="创建时间" width="80" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="搜索测试" name="search">
                <div class="text-xl">做一些搜索测试的工作</div>
            </el-tab-pane>
            <el-tab-pane label="配置" name="config">
                <div class="text-xl">知识库配置方式</div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const fileList = ref([]);

const onFileUploadSuccess = () => {
    ElMessage({
        message: "上传成功",
        type: "success",
    });
};

const activeName = ref("dataset");

const handleClick = (tab, event) => {
    console.log(tab, event);
};

const tableData = [

];
</script>
