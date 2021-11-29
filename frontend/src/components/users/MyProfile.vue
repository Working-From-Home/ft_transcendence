<template>
	<div>
		<span>
			<img v-bind:src="avatar"/>
		</span>
		<span>
			<p>this is the profile of {{ userName }}</p>
			<p>email: {{ email }}</p>
		</span>
		<base-button>
			<button-del></button-del>
		</base-button>
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
</style>