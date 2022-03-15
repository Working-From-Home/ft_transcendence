<template>
		<div class="position-absolute bottom-0 end-0 p-3" style="z-index: 1100">
			<div class="toast bg-warning" id="toastModal" role="alert" aria-live="assertive" aria-atomic="true">
				<div class="toast-header">
					<strong class="me-auto">{{title}}</strong>
					<small class="text-muted" v-if="smallMessage">{{smallMessage}}</small>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
				<div class="toast-body" >{{message}}</div>
			</div>
		</div>
</template>

<script lang='ts'>
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
	props: {
		title: {type: String, required: true},
		smallMessage: {type: String, required: false},
		message: {type: String, required: true},
		color: {type: String, required: false},
	},
})
</script>