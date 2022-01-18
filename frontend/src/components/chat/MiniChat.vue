<template>
	<div class="btn-group dropup">
		<!--<button
			type="button"
			class="btn btn-info  dropdown-toggle"
			id="dropdownMenuClickableInside"
			data-bs-toggle="dropdown"
			aria-expanded="false"
			data-bs-auto-close="outside"
		>
			Chat
		</button>
		<div class="dropdown-menu div">
			<chat-component size="mini" class="comp" aria-labelledby="dropdownMenuClickableInside"></chat-component>
		</div>-->
	 <button
			type="button"
			class="btn btn-info"
			data-bs-toggle="offcanvas" data-bs-target="#demo"
		>
			Chat
		</button>
		<div class="offcanvas offcanvas-bottom" id="demo">
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
	position: absolute;
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
</style>
