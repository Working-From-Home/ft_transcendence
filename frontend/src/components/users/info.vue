<template>
  <div class="card mx-5 mb-3 py-3">
    <div class="row g-0 px-3">
      <div class="col-md-3 offset-md-1 d-flex align-items-center">
        <div class="image-wrapper m-auto">
          <img
            :src="count"
            class="img-fluid rounded-start cropped"
            @click="UndleClick"
            alt="profile picture"
          />
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            accept="image/*"
            name="uploaded_file"
            @change="changeIMG"
          />
        </div>
      </div>
      <div class="col-md-6 offset-md-1 my-auto">
        <div class="card-body text-black">
          <h2 class="card-title">{{ username }}</h2>
          <p class="card-subtitle">{{ email }}</p>
          <h3 class="h5 pt-3">Stats</h3>
          <div class="row pt-3 gx-3">
            <div class="col-4">victories: {{ victories }}</div>
            <div class="col-4">losses: {{ losses }}</div>
            <div class="col-4">level: {{ level }}</div>
          </div>
          <!-- <div class="row pt-5">
						<button-del></button-del>
					</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Options, Vue } from "vue-class-component";
import BaseButton from "../ui/BaseButton.vue";
import ButtonDel from "./ButtonDel.vue";
import { State } from "../../store/modules/profile/types";

export default defineComponent({
  components: {
    ButtonDel,
    BaseButton },
	data() {
		return {
			isMine: false,
      userId: "",
      username: "",
      email: "",
      avatar: "",
      level: 0,
			victories: 0,
			losses: 0
		}
	},
	created() {
		if (this.$route.path === "/profile")
      this.$store.dispatch("getProfile", { token: this.$store.getters.token, id: this.$store.getters.userID });
    else
      console.log("no param here !!!!!");
    // this.$store.dispatch("getStats", { token: this.$store.getters.token, id: this.$store.getters.userID });
    // this.$store.dispatch("getStats", this.$route.params.userid, { token: this.$store.getters.token, id: this.$store.getters.userID });
    this.userId = this.$store.getters.myUserId;
    this.username = this.$store.getters.myUserName;
    this.email = this.$store.getters.myEmail;
    this.avatar = this.$store.getters.myAvatar;
    this.level = this.$store.getters.myLevel;
    this.victories = this.$store.getters.myVictories;
    this.losses = this.$store.getters.myLosses;
	},
  computed: {
    count(): string {
      this.avatar = "data:image/png;base64," + this.$store.getters.myAvatar;
      return this.avatar;
    },
  },
	methods: {
    UndleClick() {
      this.$refs.fileInput.click();
    },
    async changeIMG(event: any) {
      const files = event.target.files;
      try {
        await this.$store.dispatch("uploadProfile", {
          img: files[0],
          id: this.$store.getters.userID,
          token: this.$store.getters.token,
        });
        this.avatar = this.$store.getters.myAvatar;
      } catch (err) {
        this.error = err.message || "Failed to authenticate, try later.";
      }
    },
    async defaultIMG() {
      await this.$store.dispatch("deleteAvatar", {
        id: this.$store.getters.userID,
        token: this.$store.getters.token,
      });
      this.avatar = this.$store.getters.myAvatar;
    },
  }
})

// @Options({
//   components: {
//     ButtonDel,
//     BaseButton,
//   },
//   data() {
//     return {
//       isMine: false,
//       userId: "",
//       username: "",
//       email: "",
//       avatar: "",
//       level: 0,
// 			victories: 0,
// 			losses: 0
//     };
//   },
//   created() {
//     if (this.$route.path === "/profile")
//       this.$store.dispatch("getProfile", { token: this.$store.getters.token, id: this.$store.getters.userID });
//     else
//       console.log("no param here !!!!!");
//     // this.$store.dispatch("getStats", { token: this.$store.getters.token, id: this.$store.getters.userID });
//     // this.$store.dispatch("getStats", this.$route.params.userid, { token: this.$store.getters.token, id: this.$store.getters.userID });
//     this.userId = this.$store.getters.myUserId;
//     this.username = this.$store.getters.myUserName;
//     this.email = this.$store.getters.myEmail;
//     this.avatar = this.$store.getters.myAvatar;
//     this.level = this.$store.getters.myLevel;
//     this.victories = this.$store.getters.myVictories;
//     this.losses = this.$store.getters.myLosses;
//   },
//   computed: {
//     count(): string {
//       this.avatar = "data:image/png;base64," + this.$store.getters.myAvatar;
//       return this.avatar;
//     },
//   },
//   methods: {
//     UndleClick() {
//       this.$refs.fileInput.click();
//     },
//     async changeIMG(event: any) {
//       const files = event.target.files;
//       try {
//         await this.$store.dispatch("uploadProfile", {
//           img: files[0],
//           id: this.$store.getters.userID,
//           token: this.$store.getters.token,
//         });
//         this.avatar = this.$store.getters.myAvatar;
//       } catch (err) {
//         this.error = err.message || "Failed to authenticate, try later.";
//       }
//     },
//     async defaultIMG() {
//       await this.$store.dispatch("deleteAvatar", {
//         id: this.$store.getters.userID,
//         token: this.$store.getters.token,
//       });
//       this.avatar = this.$store.getters.myAvatar;
//     },
//   },
// })
// export default class Info extends Vue {}
</script>

<style scoped>
.image-wrapper {
  width: 21vw;
  height: 21vw;
  overflow: none;
  cursor: pointer;
}

.cropped {
  /* object-fit: none; Do not scale the image */
  object-position: center;
  width: 100%;
  width: 100%;
}
</style>
