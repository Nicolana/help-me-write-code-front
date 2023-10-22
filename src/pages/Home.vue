<template>
    <div>
        <div class="flex">
            <div class="flex-1 mr-6">
                <div class="flex items-center justify-between">
                    <div>问题</div>
                    <div>
                        <el-button type="primary" :loading="loading" @click="onGenerateClick">生成提示词</el-button>
                    </div>
                </div>
                <div class="mt-4">
                    <el-input
                        v-model="queryText"
                        :rows="20"
                        type="textarea"
                        placeholder="请输入你的问题"
                    />
                </div>
            </div>
            <div class="flex-1 flex flex-col">
                <div class="flex-shrink-0 flex items-center justify-between">
                    <div>
                        提示词
                    </div>
                    <div>
                        <el-button @click="onCopy(outPutText)">复制</el-button>
                    </div>
                </div>
                <div class="mt-4 flex-grow">
                    <!--<div class="h-full border p-2">-->
                    <el-input
                        v-model="outPutText"
                        :rows="20"
                        type="textarea"
                        readonly
                        placeholder="不要在这儿输入，这儿是获取提示的地方"
                    />
                    <!--<span v-else class="text-black/60">不要在这儿输入，这儿是获取提示的地方</span>-->
                    <!--</div>-->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed, ref} from "vue";
import {getPrompt} from "../api";
import {isEmpty, copyContent} from "../utils/index.js";
import {ElMessage} from 'element-plus'

const queryText = ref(`为我写一个列表页面，列表包含以下字段信息：
- 表头字段: 宽度: 示例数据: [内容]
- 供应商: 160: 干岸 (CNSZYC), Gana (CNSZZG), Alphas (CNSZAJ), Alphas (CNSZSN), Gana (CNSZHB), 干岸 (CNSZBJ), 洪堡 (USCASS), Buzio (CNSZHK), 洪堡 (CNSZQA), 洪堡 (CNSZQA), 洪堡 (CNSZQA)
- 款项类别: 160: 一期款, 二期款, 一期款, 一期款, 一期款, 二期款, Overfue Storage Fee, VAS Fee, 二期款, Coupon 折扣费, 二期款
- 款项生成月份: 103: 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07, 2023-07
- 问题详情: 256: 08-06没有对应合同，无法生成一期款，请联系运营补合同, 在关键值（Spotter采购协议价）为0或者空，请反馈给产研部门处理, 一期款尚未生成，请检查, 资损核对未对平, 资损核对未对平, 资损核对未对平, 缺少仓库费用对账单, 缺少仓库费用对账单, 缺少亚马逊罚款结算单, 缺少亚马逊罚款结算单, 缺少亚马逊罚款结算单
- 创建时间: 216: 2023-10-10 11:22:54 UTC+8, 2023-10-10 10:30:00 UTC+8, 2023-10-10 04:12:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8
- 状态: 128: 待处理, 待处理, 待处理, 待处理, 待处理, 待处理, 已处理, 已处理, 已处理, 已处理, 已处理
- 处理人: 136: mary.Liu, ice.wu, ice.wu, nancy.wang, nancy.wang, cynthia.zhang, nancy.wang, nancy.wang, nancy.wang, nancy.wang, nancy.wang
- 处理时间: 216: -, -, -, -, -, -, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8, 2023-09-20 12:00:00 UTC+8
- 操作: 144: 重新生成, 无需处理, 重新生成, 无需处理, 重新生成, 无需处理, 重新生成, 无需处理, 重新生成, 无需处理, 重新生成, 无需处理
    `);
const outPutText = ref();
const loading = ref(false);

const isEmptyOutputText = computed(() => isEmpty(outPutText.value))

const onCopy = (text) => {
    copyContent(text)
    ElMessage({
        message: '复制成功',
        type: 'success',
    })
}
const onGenerateClick = async () => {
    if (isEmpty(queryText.value?.trim())) {
        ElMessage({
            message: '问题不能为空',
            type: 'error',
        })
        return;
    }
    loading.value = true
    const res = await getPrompt({query: queryText.value});
    loading.value = false
    if (res.status === 200) {
        outPutText.value = res.data;
    }
}
</script>
