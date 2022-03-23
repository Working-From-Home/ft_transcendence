<template>
	<p>Please wait...</p>
</template>

<script setup lang="ts">

const param = window.location.search;

if (window.opener) {
	window.opener.postMessage(param);
	window.close();
}

</script>

<style lang="scss" scoped>

</style>