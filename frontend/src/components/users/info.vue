<template>
	<div class="profile">
		<img alt="img profil" :src="user.avatar" />
		<p>{{ user.pseudo}}</p>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  data() {
		return {
			user: null
		};
	},
  created() {
	this.user = this.$store.getters['users/users'];
  }
})
export default class info extends Vue {
}
</script>

<style scoped>
img {
	width: 50px;
	height: 50px;
}

p {
	display: inline-block;
	margin-left: 15px;
	position: relative;
	bottom: 30px;
	margin-bottom: 0;
}

.profile {
	text-align: left;
	width: 10rem;
	position: absolute;
	left:0px;
	top: 0px;
	margin-top: 0px;
	padding: 3px;
	border-radius: 3px;
  	box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.26);

}
</style>
