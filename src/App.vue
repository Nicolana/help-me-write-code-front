<script setup>
import DefaultLayout from './layouts/DefaultLayout.vue';
import { useUserStore } from './store/user';

const store = useUserStore();
store.getUserInfo();
</script>

<template>
    <DefaultLayout></DefaultLayout>
</template>

<style scoped></style>
