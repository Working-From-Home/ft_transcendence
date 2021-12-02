<template>
	<div>

		<span class="photo" @click="onPickFile">
				<img :src="'data:image/png;base64,' + avatar"/>
		</span>
		<input
			type="file"
			style="display: none"
			ref="fileInput"
			accept="image/*"
			name="uploaded_file"
			@change="onFilePicked"/>
		<span>
			<p>this is the profile of {{ userName }}</p>
			<p>email: {{ email }}</p>
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
			test: "http://purepng.com/public/uploads/large/purepng.com-red-appleappleapplesfruitsweet-170152718058288lsq.png"
		};
	},
  created() {
	this.userid = this.$store.getters.myUserId;
	this.userName = this.$store.getters.myUserName;
	this.email = this.$store.getters.myEmail;
	this.avatar = this.$store.getters.myAvatar;
  },
  methods: {
	  onPickFile () {
  		this.$refs.fileInput.click()
	  },
	  async onFilePicked (event: any) {
		const files = event.target.files;
		try {
       		await this.$store.dispatch('uploadProfile', {
				   img: files[0],
				   id: this.$store.getters.userID
				   ,token: this.$store.getters.token
			});
		} catch (err) {
			this.error = err.message || 'Failed to authenticate, try later.';
		}
	  }
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