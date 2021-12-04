<template>
	<button v-if="!link" :class="mode">
		<slot></slot>
	</button>
	<router-link v-else :to="to" :class="mode">
		<slot></slot>
	</router-link>
</template>

<script>
export default {
	props: {
		mode: {
			type: String,
			required: false,
			default: null
		},
		link: {
			type: Boolean,
			required: false,
			default: false
		},
		to: {
			type: String,
			required: false,
			default: '/'
		}
	},
}
</script>

<style scoped>
button,
a {
  text-decoration: none;
  padding: 5px;
  font: inherit;
  background-color: #42b983;
  border: 1px solid #42b983;
  color: rgba(255, 255, 255, 0.884);
  cursor: pointer;
  border-radius: 0.3em;
  display: inline-block;
}

a:hover,
a:active,
button:hover,
button:active {
  background-color: #276b4c;
  border-color: #276b4c;
}

.flat {
  background-color: transparent;
  color: #42b983;
  border: none;
}

.outline {
  background-color: transparent;
  border-color: #270041;
  color: #270041;
}

.flat:hover,
.flat:active,
.outline:hover,
.outline:active {
  color: #276b4c;
  background-color: transparent;
}
</style>
