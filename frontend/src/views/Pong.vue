<template>
	<div class="container my-5 px-5">
		<router-view/>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { defineComponent, onUnmounted } from 'vue'
import io, { Socket }  from "socket.io-client";

@Options({
	data() {
		return {
		}
	},
})
export default class Pong extends Vue {

}
</script> 

<style scoped>
</style>
