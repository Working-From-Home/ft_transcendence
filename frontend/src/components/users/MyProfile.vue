<template>
	<div>
		<div class="card m-auto mt-5" style="max-width: 840px;">
			<div class="row g-0">
				<div class="col-md-4">
					<img :src="count" class="img-fluid rounded-start" @click="UndleClick" alt="...">
					<input
						type="file"
						style="display: none"
						ref="fileInput"
						accept="image/*"
						name="uploaded_file"
						@change="changeIMG"/>
					<base-button @click="defaultIMG"  mode="flat">Image by default</base-button>
				</div>
				<div class="col-md-8 my-auto">
					<div class="card-body text-black">
						<h5 class="card-title">Profile of {{ userName }}</h5>
						<p>Email: {{ email }}</p>
						<div class="row">
							<button-del></button-del>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseButton from "../ui/BaseButton.vue";
import ButtonDel from "./ButtonDel.vue";

interface State {
  userid: string,
  userName: string,
  email: string,
  avatar: string
}

@Options({
  components: {
    ButtonDel,
    BaseButton,
  },
  data: (): State => {
		return {
			userid: '',
			userName: '',
			email: '',
			avatar: '',
		};
	},
  created() {
	this.userid = this.$store.getters.myUserId;
	this.userName = this.$store.getters.myUserName;
	this.email = this.$store.getters.myEmail;
	this.avatar = this.$store.getters.myAvatar;
  },
  computed: {
	count(): string {
		this.avatar = 'data:image/png;base64,' + this.$store.getters.myAvatar;
		return this.avatar;
	}
  },
  methods: {
	  UndleClick() {
  		this.$refs.fileInput.click()
	  },
	  async changeIMG(event: any) {
		const files = event.target.files;
		try {
       		await this.$store.dispatch('uploadProfile', {
				img: files[0],
				id: this.$store.getters.userID,
				token: this.$store.getters.token,
			});
			this.avatar = this.$store.getters.myAvatar;
		} catch (err) {
			this.error = err.message || 'Failed to authenticate, try later.';
		}
	  },
	  async defaultIMG() {
		await this.$store.dispatch('deleteAvatar', {
			id: this.$store.getters.userID,
			token: this.$store.getters.token,
		});
		this.avatar = this.$store.getters.myAvatar;
	  },
  }
})
export default class MyProfile extends Vue {

}
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
a {
  color: #42b983;
}
.photo {
	border: none;
	background-color: transparent;
}
</style>