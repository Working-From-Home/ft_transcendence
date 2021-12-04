<template>
	<div>
		<div class="photo" @click="UndleClick">
				<img :src="count"/>
		</div>
		<input
			type="file"
			style="display: none"
			ref="fileInput"
			accept="image/*"
			name="uploaded_file"
			@change="changeIMG"/>
		<base-button @click="defaultIMG"  mode="flat">Image by default</base-button>
		<span>
			<p>This is the profile of {{ userName }}</p>
			<p>Email: {{ email }}</p>
		</span>
		<button-del></button-del>
	</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import BaseButton from "../ui/BaseButton.vue";
import ButtonDel from "./ButtonDel.vue";

@Options({
  components: {
    ButtonDel,
    BaseButton,
  },
  data() {
		return {
			userid: null,
			userName: null,
			email: null,
			avatar: null,
		};
	},
  created() {
	this.userid = this.$store.getters.myUserId;
	this.userName = this.$store.getters.myUserName;
	this.email = this.$store.getters.myEmail;
	this.avatar = this.$store.getters.myAvatar;
  },
  computed: {
	count() {
		this.avatar = 'data:image/png;base64,' + this.$store.getters.myAvatar
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
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.photo {
	border: none;
	background-color: none;
}
</style>