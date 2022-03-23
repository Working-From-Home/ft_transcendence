<template>
	<div>
		<button
		type="button"
			class="btn btn-primary"
			data-bs-toggle="modal"
			data-bs-target="#addTwoFA"
		>
			<span>Add 2FA</span>
		</button>
		<add-twofa-modal />
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AddTwofaModal from '../auth/AddTwofaModal.vue';

export default defineComponent({
	components: { AddTwofaModal }
})

</script>

<style scoped>
</style>