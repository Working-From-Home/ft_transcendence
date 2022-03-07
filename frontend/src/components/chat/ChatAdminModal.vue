<template>
<div class="modal fade text-black" id="adminModal" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Admin Modal</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <form @submit.prevent="">
			<div class="modal-body">
				<div class="input-group form-floating mb-4">
					<input
					v-model="userName"
					type="password"
					class="form-control"
					id="userName"
					placeholder=""
					required
					/>
					<label for="passWord" class="text-black">User Name</label>
					<button type="submit" class="btn btn-outline-warning">Mute</button>
					<button type="submit" class="btn btn-outline-danger">Ban</button>
				</div>
			</div>
			<div class="modal-footer">
			</div>
		</form>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	data() {
		return {
			userName: '' as string
		}
	},
})
</script>