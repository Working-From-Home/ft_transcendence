<template>
	<div id="jumbo" class="container ">
		<div class="col-md-10 p-4 m-auto mt-4 mb-4 bg-info bg-opacity-75 rounded-3">
			<div id="welcomeTexte" class="container-fluid py-5">
				<not-log v-if="!isLoggedIn"></not-log>
				<h1 class="display-5 fw-bold">Welcome to Ft_transcendence</h1>
				<p>Projet for <a href="https://intra.42.fr/" class="text-white">42</a>, by <span class="text-white"> tlecoeuv, hwinston, juligonz, alesanto</span>.</p>
				<Index class="m-auto mt-5 col-md-8 fs-4"/>
			</div>
		</div>
		<div class="row align-items col-md-10 m-auto">
			<div class="col-md-6">
				<div  class="h-100 p-5 bg-success bg-opacity-75 rounded-3">
					<h2>Challenge Someone</h2>
					<p>You can play now</p>
					<!-- <button class="btn btn-outline-light" type="button">Play</button> -->
					<router-link to="/pong" class="btn btn-outline-light">Pong</router-link>
				</div>
			</div>
			<div class="col-md-6">
					<div class="h-100 p-5 bg-success bg-opacity-75 rounded-3">
					<h2>Talk to everyone</h2>
					<p>You can use the chat now</p>
					<button class="btn btn-outline-light" type="button">Chat</button>
				</div>
			</div>
    	</div>
	</div>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Index from "../components/Index.vue";
import NotLog from "../components/users/notLog.vue";

@Options({
  components: {
    Index, NotLog
  },
  computed: {
		isLoggedIn() {
			return this.$store.getters.isAuth;
		},
	},
})
export default class Home extends Vue {

}
</script>

<style scoped>
img {
	width: 50px;
	height: 50px;
}
#welcomeTexte {
	text-align: center;
}
#jumbo {
	background-color: blue-700;
}
</style>
