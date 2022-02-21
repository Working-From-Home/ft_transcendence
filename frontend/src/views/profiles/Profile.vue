<template>
  <div class="container py-5">
    <info></info>
    <!-- <history></history>
    <achievements></achievements> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
// import MyProfile from "../../components/users/MyProfile.vue";
import Info from "../../components/users/Info.vue";
import History from "../../components/users/History.vue";
import Achievements from "../../components/users/Achievements.vue";

@Options({
  components: {
    Info,
    History,
    Achievements,
  },
  computed: {},
})
export default class Home extends Vue {}
</script>

<style scoped></style>
