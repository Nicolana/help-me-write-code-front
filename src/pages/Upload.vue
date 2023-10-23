<template>
    <div>
        <div class="text-xl">
            知识库文档更新
        </div>
        <div class="mt-4">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            accept=".md"
            name="files"
            action="/api/upload_knowledges/"
            multiple
            :limit="3"
          >
            <el-button color="#626aef" dark>上传文档到知识库</el-button>
            <template #tip>
              <div class="el-upload__tip">
                目前仅支持Markdown文件
              </div>
            </template>
          </el-upload>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const fileList = ref([]);
</script>