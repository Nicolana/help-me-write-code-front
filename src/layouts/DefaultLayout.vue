<template>
    <div class="h-full flex flex-col help-code-header">
        <el-header>
            <div class="flex items-center justify-between mx-auto px-[20px]">
                <div class="menu-wrap flex items-center gap-4">
                    <div
                        class="menu-item px-2 text-gray-700"
                        :class="{
                            '!text-[#626aef]':
                                item.path === '/' ? item.path === currentRoute : currentRoute.startsWith(item.path),
                        }"
                        v-for="item in menus"
                        :key="item.path"
                    >
                        <router-link :to="item.path"> {{ item.title }} </router-link>
                    </div>
                </div>

                <div class="header-right flex-shrink-0">
                    <div class="user-info flex items-center" v-if="userInfo.id">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                        <div class="user-info-username text-white ml-[8px] mr-[8px]">
                            {{ userInfo.username }}
                        </div>
                        <el-button color="#626aef" dark @click="logout">登出</el-button>
                    </div>
                    <div class="user-login" v-else>
                        <el-button type="primary">登录</el-button>
                    </div>
                </div>
            </div>
        </el-header>
        <el-container>
            <el-main>
                <div class="mx-auto">
                    <router-view></router-view>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user";
import { ElButton } from "element-plus";
import { useRouter } from "vue-router";

const router = useRouter();

const route = useRoute();
const store = useUserStore();

const currentRoute = computed(() => {
    return route.path;
});

const userInfo = computed(() => {
    return store.userInfo;
});

const logout = () => {
    store.logout();
    router.push("/login");
};

const menus = ref([
    {
        title: "聊天机器人",
        path: "/",
    },
    {
        title: "知识库",
        path: "/knowledge",
    },
    {
        title: "Agent",
        path: "/agent",
    },
]);
</script>

<style>
.help-code-header .el-header {
    padding: 0 !important;
}

.el-header,
.el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
    line-height: 200px;
}

/* .el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
} */

body > .el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>
