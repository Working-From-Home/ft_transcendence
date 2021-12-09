<template>
	<card>
		<h1>Pong</h1>
		<pong-canvas></pong-canvas>
	</card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import  PongCanvas  from '../components/pong/PongCanvas.vue'

export default defineComponent({
	components: { PongCanvas }
})
</script>

<style scoped>
.card {
}
</style>
