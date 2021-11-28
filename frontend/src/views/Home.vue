<template>
<card>
  <div class="home">
	<not-log v-if="!isLoggedIn"></not-log>
    <img alt="Vue logo" src="../assets/logo42.png" />
    <Index msg="Welcome to Ft_transcendance" />
  </div>
</card>
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
</style>
