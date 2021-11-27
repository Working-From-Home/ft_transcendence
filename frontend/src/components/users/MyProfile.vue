<template>
	<div>
		<p>this is the profile of {{ userName }}</p>
		<p>email: {{ email }}</p>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
		return {
			userid: null,
			userName: null,
			email: null,
			avatarId: null
		};
	},
  created() {
	this.userid = this.$store.getters.myUserId;
	this.username = this.$store.getters.myUserName;
	this.email = this.$store.getters.myEmail;
	this.avatarId = this.$store.getters.avatarId;
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