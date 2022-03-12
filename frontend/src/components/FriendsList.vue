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

onMounted(() => {
  offcanvas.value = new Offcanvas('#offc');
});

watch(() => route.path, 
  () => {
    offcanvas.value.hide();
  },
);
</script>

<template>
  <section>
    <button
      class="friendbtn btn btn-primary"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offc"
      aria-controls="offc"
    >
      Friends
    </button>

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

        <!-- pending requests -->
        <div v-if="pendings.length">
          <div class="position-relative">
            <h6
              data-bs-toggle="collapse"
              href="#collapsePendings"
              role="button"
              aria-expanded="false"
              aria-controls="collapsePendings"
            >
              Pending requests
            </h6>
            <span
              class="position-absolute top-50 end-0 translate-middle px-2 border border-primary rounded-circle text-primary fw-bold"
              >{{ pendings.length }}</span
            >
          </div>
          <div class="collapse pt-3" id="collapsePendings">
            <table class="table table-hover table-borderless table-sm">
              <tbody>
                <tr v-for="pending in pendings" class="align-middle">
                  <td class="text-start" style="width: 60%">
                    <router-link
                      :to="{ name: 'profile', params: { userid: pending.id } }"
                    >
                      <span class="text-dark">{{ pending.username }}</span>
                    </router-link>
                  </td>
                  <td style="text-align: right!important;"> 
                    <FriendButtons
                      :userId="pending.id"
                      :small="true"
                    ></FriendButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <hr />
        </div>
        
        <!-- online friends -->
        <div>
          <div class="position-relative">
            <h6
              data-bs-toggle="collapse"
              href="#collapseOnline"
              role="button"
              aria-expanded="true"
              aria-controls="collapseOnline"
            >Online</h6>
          </div>
          
          <div class="collapse show pt-3" id="collapseOnline">
            <table class="table table-hover table-borderless table-sm">
              <tbody>
                <tr v-for="friend in friends" class="align-middle">
                  <td
                    v-if="statusStore.isOnline(friend.id)"
                    class="text-start"
                    style="width: 60%"
                  >
                    <router-link
                      :to="{ name: 'profile', params: { userid: friend.id } }"
                    >
                      <span class="text-dark">{{ friend.username }}</span>
                    </router-link>
                  </td>
                  <td v-if="statusStore.isOnline(friend.id)" class="text-end">
                    <ChallengeButton
                      v-if="!statusStore.isInGame(friend.id)"
                      :id="'challengeFromFriendsList'"
                      :userId="friend.id"
                      :small="true"
                    ></ChallengeButton>
                    <WatchButton
                      v-else
                      :userId="friend.id"
                      :small="true"
                    ></WatchButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <hr />
        
        <!-- offline friends -->
        <div>
          <h6
            data-bs-toggle="collapse"
            href="#collapseOffline"
            role="button"
            aria-expanded="true"
            aria-controls="collapseOffline"
          >Offline</h6>
          <div class="pt-3" :class="friends.length && 'collapse show'" id="collapseOffline">
            <table class="table table-hover table-borderless table-sm">
              <tbody>
                <tr v-for="friend in friends" class="align-middle">
                  <td
                    v-if="!statusStore.isOnline(friend.id)"
                    class="text-start"
                    style="width: 60%"
                  >
                    <router-link
                      :to="{ name: 'profile', params: { userid: friend.id } }"
                    >
                      <span class="text-dark">{{ friend.username }}</span>
                    </router-link>
                  </td>
                  <td v-if="!statusStore.isOnline(friend.id)" class="text-end">
                    <FriendButtons
                      :userId="friend.id"
                      :small="true"
                    ></FriendButtons>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/../node_modules/bootstrap/scss/functions';
@import '@/../node_modules/bootstrap/scss/variables';

$offcanvas-horizontal-width: 100px !important;

.friendbtn {
  position: absolute;
  right: 0%;
}

a:link {
  text-decoration: none;
  font-weight: 500;
  color: black !important;
}
</style>
