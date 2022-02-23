<template>  
  <div class="container py-5 px-5 bg-info">
    <div class="row">
      <div class="col col-sm-12 col-md-3 rounded bg-white">
        <avatar></avatar>
      </div>
      <div class="col col-sm-12 col-md-8 offset-md-1 rounded bg-white">
        <info></info>
      </div>
    </div>
    <div class="row pt-2">
      <div class="col rounded bg-white">
        <history></history>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Avatar from "../../components/users/Avatar.vue";
import Info from "../../components/users/Info.vue";
import History from "../../components/users/History.vue";

@Options({
  components: {
    Avatar,
    Info,
    History
  },
  computed: {},
})
export default class Home extends Vue {}
</script>

<style scoped></style>
