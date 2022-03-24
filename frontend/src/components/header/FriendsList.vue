<script setup lang="ts">
import { useCurrentUserStore } from '@/store/currentUser';
import { useStatusStore } from '@/store/status';
import { useRoute } from 'vue-router';
import { IFriend } from '@/models/IFriendLists';
import { computed, onMounted, ref, watch } from 'vue';
import FriendButtons from '../users/FriendButtons.vue';
import ChallengeButton from '../pong/ChallengeButton.vue';
import WatchButton from '../pong/WatchButton.vue';
import { Offcanvas } from 'bootstrap';
import ChatDMButton from '../chat/ChatDMButton.vue';

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
    if (statusStore.isOnline(friend.id)) count++;
  }
  return count;
});
const offline = computed<number>(() => {
  return friends.value.length - online.value;
});

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
  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offc"
    aria-labelledby="offcRightLabel"
    style="z-index: 1051"
  >
    <!-- header -->
    <div class="offcanvas-header">
      <h5 id="offcRightLabel" class="mb-0">Friends</h5>
      <button
        type="button"
        class="btn-close btn-close-white text-reset"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <!-- body -->
    <div class="offcanvas-body">
      <div class="accordion accordion-flush" id="listsAccordion">
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
              <span class="me-auto clickable-cursor">Pending requests</span>
              <small>{{ pendings.length }}</small>
            </button>
          </h2>
          <div
            id="collapseOne"
            class="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#listsAccordion"
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
                        {{ pending.username }}
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
              <span class="me-auto clickable-cursor">Online</span>
              <small>{{ online }}</small>
            </button>
          </h2>
          <div
            id="collapseTwo"
            class="accordion-collapse collapse show"
            aria-labelledby="headingTwo"
            data-bs-parent="#listsAccordion"
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
                        {{ friend.username }}
                      </router-link>
                    </td>
                    <td v-if="statusStore.isOnline(friend.id)" class="text-end">
                      <div class="d-flex flex-row justify-content-end">
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
                        <ChatDMButton
                          :otherUserId="friend.id"
                          :small="true"
                        ></ChatDMButton>
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
              <div class="me-auto clickable-cursor">Offline</div>
              <small>{{ offline }}</small>
            </button>
          </h2>
          <div
            id="collapseThree"
            class="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#listsAccordion"
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
                        {{ friend.username }}
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
</template>

<style lang="scss" scoped>
.accordion-body {
  padding: 0.5rem 0 0.5rem 0.3rem;
}

.accordion-button::after {
  margin-left: 1rem;
}

.table {
  margin-bottom: 0 !important;
}
</style>
