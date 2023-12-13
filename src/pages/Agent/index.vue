<template>
    <div>
        <div class="text-3xl">
            {{ name }}
        </div>
        Here is Agent Page!!!
    </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref('Agent Page');
</script>

<style scoped>

</style>
