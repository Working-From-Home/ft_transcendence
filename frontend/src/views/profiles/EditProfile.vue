<template>
	<edit-profile></edit-profile>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import EditProfile from "../../components/users/EditProfile.vue";

@Options({
  components: {
    EditProfile
  },
  computed: {
	},
})
export default class Home extends Vue {

}
</script>

<style scoped>

</style>
