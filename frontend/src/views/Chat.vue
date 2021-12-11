<template>
  <chat-component></chat-component>
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