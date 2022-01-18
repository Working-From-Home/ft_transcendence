<template>
<div>
<form action="" class="">
    <div class="input-group mb-3">
        <input type="text" class="form-control form-control-lg" placeholder="Search Here">
        <button type="submit" class="input-group-text btn-success"><i class="bi bi-search me-2"></i> Search</button>
    </div>
</form>
  <chat-component size="large"></chat-component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ChatComponent from "../components/chat/ChatComponent.vue";

@Options({
  components: {
    ChatComponent,
  },
})
export default class Home extends Vue {

}
</script>