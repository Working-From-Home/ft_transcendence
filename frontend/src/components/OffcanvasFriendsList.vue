<template>
	<section>
		<button class="friendbtn btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Friends List</button>

		<div class="offcanvas offcanvas-end text-black" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
			<div class="offcanvas-header">
				<h5 id="offcanvasRightLabel">Friends List</h5>
				<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body">
				...
			</div>
		</div>
	</section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({

})
export default class Home extends Vue {

}
</script>

<style>
.friendbtn {
	position: absolute;
	right: 0%;
}

</style>