<template>
  <div class="h-full flex flex-col help-code-header">
    <el-header>
      <div class="bg-[#545c64] px-[10rem]">
        <el-menu
          :default-active="currentRoute"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/">
            <router-link to="/"> 代码机器人 </router-link>
          </el-menu-item>
          <el-menu-item index="/knowledge">
            <router-link to="/knowledge"> 知识库 </router-link>
          </el-menu-item>
          <el-menu-item index="/upload">
            <router-link to="/upload"> 知识库上传 </router-link>
          </el-menu-item>
        </el-menu>
      </div>
    </el-header>
    <el-container>
      <el-main>
        <div class="w-[1400px] mx-auto">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const currentRoute = computed(() => {
  return route.path;
});
</script>

<style>
.help-code-header .el-header {
    padding: 0!important;
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
