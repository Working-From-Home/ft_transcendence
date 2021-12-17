<template>
  <div>
    <h1>{{ msg }} {{ user }}</h1>
	<h2>by hwinston, tlecoeuv, alesanto, juligonz</h2>
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
  props: {
    user: String,
  },
  data: (): State => {
		return {
			user: ''
		}
	},
  created() {
	this.user = this.$store.getters.myUserName;
  }
})
export default class HelloWorld extends Vue {
  msg!: string;
}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
