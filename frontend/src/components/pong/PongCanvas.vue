<template>
    <div>
        <h3>this is the canvas</h3>
        <canvas id="canvas" width="320" height="180"></canvas>
    </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue'
import { Canvas } from './Canvas'

export default defineComponent({
    
    mounted() {
        const view = new Canvas('#canvas');
        view.drawSomething();
    }
})
</script>



<style>
    canvas {
        background: #eee;
    }
</style>
