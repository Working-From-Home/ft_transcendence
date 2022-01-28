<template>
  <div>
    <p>This is not C or C++ basic functions! To do something that you’ve never
	done before without a piscine. Remind yourself at the beginning of your journey in
	computer science. Now, look where you are standing. Time to shine</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

interface State {
  user: string;
}

@Options({
})
export default class HelloWorld extends Vue {

}
</script>

<style scoped>
</style>
