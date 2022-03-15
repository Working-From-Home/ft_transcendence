<template>
	<div class="btn-group dropup">
		<button
			type="button"
			class="btn btn-dark text-white dropdown-toggle"
			id="dropdownMenuClickableInside"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			data-bs-auto-close="outside"
		>
			Chat
		</button>
		<div class="dropdown-menu div p-0 bg-transparent">
			<chat-component size="mini" class="comp" aria-labelledby="dropdownMenuClickableInside"></chat-component>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ChatComponent from "./ChatComponent.vue";

@Options({
  components: {
    ChatComponent,
  },
})
export default class Home extends Vue {

}
</script>

<style scoped>
.dropup {
	position: fixed;
	bottom: 0%;
	right: 25%;
	margin: 0;
	padding: 0;
	background-color: transparent;
}

.div {
	width: 400px;
}

.comp {
	margin: 0;
	padding: 0;
}

#dropdownMenuClickableInside {
	width: 13em;
	padding: 0.5;
	border-bottom: 0;
	border-color: white;
	border-radius: 5px 5px 0px 0px;
}
</style>
