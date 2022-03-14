<script setup lang="ts">
import { useCurrentUserStore } from '@/store/currentUser';
import { useStatusStore } from '@/store/modules/status/status';
import { useRoute } from 'vue-router';
import { IFriend } from '@/models/IFriendLists';
import { computed, onMounted, ref, watch } from 'vue';
import FriendButtons from './users/FriendButtons.vue';
import ChallengeButton from './pong/ChallengeButton.vue';
import WatchButton from './pong/WatchButton.vue';
import { Offcanvas } from 'bootstrap';
import ChatDMButton from './chat/ChatDMButton.vue';

const currentUserStore = useCurrentUserStore();
const statusStore = useStatusStore();
const route = useRoute();

const offcanvas = ref<Offcanvas>({} as Offcanvas);

const pendings = computed<IFriend[]>(() => {
  return currentUserStore.friendLists.pendings;
});
const friends = computed<IFriend[]>(() => {
  return currentUserStore.friendLists.friends;
});
const online = computed<number>(() => {
  let count: number = 0;
  for (const friend of friends.value) {
    if (statusStore.isOnline(friend.id))
      count++;
  }
  return count;
});
const offline = computed<number>(() => {
  return friends.value.length - online.value;
})

onMounted(() => {
  offcanvas.value = new Offcanvas('#offc');
});

watch(
  () => route.path,
  () => {
    offcanvas.value.hide();
  },
);
</script>


<template>

  <!-- <section> -->
    <!-- <button
      class="friendbtn btn btn-outline-primary font-monospace px-5"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offc"
      aria-controls="offc"
    >
      friends
    </button> -->

    <div
      class="offcanvas offcanvas-end text-black"
      tabindex="-1"
      id="offc"
      aria-labelledby="offcRightLabel"
      style="width: 300px !important; z-index: 1051"
    >
      <div class="offcanvas-header">
        <h5 id="offcRightLabel">Friends</h5>
        <button
          type="button"
          class="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div class="offcanvas-body">
        <div class="accordion accordion-flush" id="accordionExample">
          <!-- pendings -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="false"
                aria-controls="collapseOne"
              >
                <span class="me-auto">Pending requests</span>
                <small class="text-secondary">{{ pendings.length }}</small>
              </button>
            </h2>
            <div
              id="collapseOne"
              class="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <table class="table table-hover table-borderless table-sm">
                  <tbody>
                    <tr v-for="pending in pendings" class="align-middle">
                      <td class="text-start" style="width: 60%">
                        <router-link
                          :to="{
                            name: 'profile',
                            params: { userid: pending.id },
                          }"
                        >
                          <span class="text-dark">{{ pending.username }}</span>
                        </router-link>
                      </td>
                      <td style="text-align: right !important">
                        <FriendButtons
                          :userId="pending.id"
                          :small="true"
                        ></FriendButtons>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- online -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingTwo">
              <button
                class="accordion-button" 
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="true"
                aria-controls="collapseTwo"
              >
                <span class="me-auto">Online</span>
                <small class="text-secondary">{{ online }}</small>
              </button>
            </h2>
            <div
              id="collapseTwo"
              class="accordion-collapse collapse show"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <table class="table table-hover table-borderless table-sm">
                  <tbody>
                    <tr v-for="friend in friends" class="align-middle">
                      <td
                        v-if="statusStore.isOnline(friend.id)"
                        class="text-start"
                        style="width: 60%"
                      >
                        <router-link
                          :to="{
                            name: 'profile',
                            params: { userid: friend.id },
                          }"
                        >
                          <span class="text-dark">{{ friend.username }}</span>
                        </router-link>
                      </td>
                      <td
                        v-if="statusStore.isOnline(friend.id)"
                        class="text-end"
                      >
                        <div class="d-flex flex-row justify-content-end">
                          <ChatDMButton
                            :otherUserId="friend.id"
                            :small="true"
                          ></ChatDMButton>
                          <ChallengeButton
                            v-if="!statusStore.isInGame(friend.id)"
                            :id="'challengeFromFriendsList'"
                            :userId="friend.id"
                            :small="true"
                            class="mx-1"
                          ></ChallengeButton>
                          <WatchButton
                            v-else
                            :userId="friend.id"
                            :small="true"
                            class="mx-1"
                          ></WatchButton>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!-- offline -->
          <div class="accordion-item">
            <h2 class="accordion-header" id="headingThree">
              <button
                class="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <span class="me-auto">Offline</span>
                <small class="text-secondary">{{ offline }}</small>
              </button>
            </h2>
            <div
              id="collapseThree"
              class="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body">
                <table class="table table-hover table-borderless table-sm">
                  <tbody>
                    <tr v-for="friend in friends" class="align-middle">
                      <td
                        v-if="!statusStore.isOnline(friend.id)"
                        class="text-start"
                        style="width: 60%"
                      >
                        <router-link
                          :to="{
                            name: 'profile',
                            params: { userid: friend.id },
                          }"
                        >
                          <span class="text-dark">{{ friend.username }}</span>
                        </router-link>
                      </td>
                      <td
                        v-if="!statusStore.isOnline(friend.id)"
                        class="text-end"
                      >
                        <ChatDMButton
                          :otherUserId="friend.id"
                          :small="true"
                        ></ChatDMButton>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- </section> -->
</template>

<style lang="scss" scoped>
.accordion-body {
  padding: 0.5rem !important;
}
.accordion-button {
  padding: 1rem 0.5rem !important;
}
.accordion-button::after {
  margin-left: 1rem;
}

// .table {
//   margin-bottom: 0 !important;
// }

.friendbtn {
  position: absolute;
  right: 0%;
}

a:link {
  text-decoration: none;
  color: black !important;
}
</style>
