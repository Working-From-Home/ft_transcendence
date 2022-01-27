<template>
  <div>
	  <div class="container py-4">
		<div class="p-2 mt-5 mb-4 bg-light rounded-3">
			<nav>
				<div class="nav nav-tabs" id="nav-tab" role="tablist">
					<button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Admin Users</button>
					<button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Admin Channels</button>
				</div>
			</nav>
			<div class="tab-content" id="nav-tabContent">
				<div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
					<div class="container-fluid py-5 text-black">
						<h1 class="display-5 fw-bold">List Users</h1>	
					</div>
				</div>
				<div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
					<div class="container-fluid py-5 text-black">
						<h1 class="display-5 fw-bold">List Channels</h1>	
					</div>
				</div>
			</div>
		</div>
  	  </div>
	  
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
  },
})
export default class Admin extends Vue {

}
</script>