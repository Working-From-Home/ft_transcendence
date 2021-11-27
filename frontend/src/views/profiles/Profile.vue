<template>
	<card>
		<p>User profile</p>
		<my-profile></my-profile>
	</card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import MyProfile from "../../components/users/MyProfile.vue";

@Options({
  components: {
    MyProfile
  },
  computed: {
	},
})
export default class Home extends Vue {

}
</script>

<style scoped>

</style>
