<script setup lang="ts">
const props = defineProps({
  classes: {
    type: String,
    required: false,
  },
  link: {
    type: Boolean,
    required: false,
  },
  to: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <button v-if="!link" :class="classes">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="classes">
    <slot></slot>
  </router-link>
</template>

<style scoped></style>
