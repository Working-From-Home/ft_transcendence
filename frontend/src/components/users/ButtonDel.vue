<template>
	<p @click="deleteUser">delete</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
		return {
		};
	},
  methods: {
	  async deleteUser() {
		  const formData = {
			userId: this.$store.getters.userID,
			token: this.$store.getters.token,
		};
		await this.$store.dispatch('deleteUser', formData);
		this.$store.dispatch('logout');
		this.$router.replace('/');
	  },
  },
})
export default class ButtonDel extends Vue {

}
</script>