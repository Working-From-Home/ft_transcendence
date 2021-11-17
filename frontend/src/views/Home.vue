<template>
<card>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo42.png" />
    <Index msg="Welcome to Ft_transcendance" />
  </div>
</card>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Index from "../components/Index.vue";

@Options({
  components: {
    Index
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
