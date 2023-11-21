<template>
    <div class="login-page">
        <div class="login-form-card rounded-md w-[450px] p-[16px] bg-white shadow shadow-light-600 mx-auto mt-1/2">
            <h2 class="login-form-title mb-[16px]">Code Generate Interactive</h2>
            <el-form ref="ruleFormRef" :model="loginForm" :rules="rules" label-position="top">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input
                        type="password"
                        v-model="loginForm.password"
                        placeholder="请输入密码"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        :loading="loading"
                        class="w-full mt-[16px]"
                        type="primary"
                        @click="submitForm(ruleFormRef)"
                        >登录</el-button
                    >
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useUserStore } from "../../store/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const store = useUserStore();
const ruleFormRef = ref();
const router = useRouter();
const loginForm = reactive({
    username: "",
    password: "",
});
const loading = ref(false);

const rules = reactive({
    username: [
        {
            validator: (rule, value, callback) => {
                if (!value || value?.trim() === "") {
                    return callback(new Error("请输入用户名"));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
    password: [
        {
            validator: (rule, value, callback) => {
                if (!value || value?.trim() === "") {
                    return callback(new Error("请输入密码"));
                }
                callback();
            },
            trigger: "blur",
        },
    ],
});

const submitForm = (el) => {
    if (!el) return;
    el.validate((valid) => {
        if (valid) {
            console.log("触发登录");
            loading.value = true;
            store
                .login(loginForm)
                .then((res) => {
                    ElMessage({
                        message: "登录成功",
                        type: "success",
                    });
                    setTimeout(() => {
                        router.replace("/");
                    }, 2000);
                })
                .catch(() => {
                    loading.value = false;
                });
        }
    });
};
</script>

<style lang="scss" scoped></style>
