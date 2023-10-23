<template>
    <div>
        <div>
            上传知识库文档更新
        </div>
        <div class="mt-4">
            <el-button color="#626aef" dark>上传文档</el-button>
        </div>
        <div class="mt-4">
          <el-upload
            v-model:file-list="fileList"
            class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">Click to upload</el-button>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500KB.
              </div>
            </template>
          </el-upload>
        </div>
    </div>
</template>