<template>
  <section>
    <div
      class="modal fade"
      id="staticBackdrop"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">New Channel</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <form @submit.prevent="createChannel">
            <div class="modal-body">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="ChannelName"
                  placeholder="name"
                  v-model.trim="ChannelName"
                />
                <label for="ChannelName">Channel name</label>
              </div>
              <div class="form-floating mb-2">
                <input
                  type="text"
                  class="form-control"
                  id="password"
                  placeholder="name"
                  v-model.trim="password"
                />
                <label for="password">Password (optional)</label>
              </div>              
              <button
                type="submit"
                class="btn btn-success mt-4"
                data-bs-dismiss="modal"
              >
                Create channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core';
import ChatService from '../../services/ChatService';
import { useNotificationsStore } from '@/store/notifications';

export default defineComponent({
  setup() {
    const notificationsStore = useNotificationsStore();
    return { notificationsStore };
  },
  data() {
    return {
      password: '',
      ChannelName: '',
    };
  },
  methods: {
    createChannel() {
      if (!this.ChannelName) {
        this.notificationsStore.enqueue(
          'warning',
          'Error',
          "Channel name can't be empty",
        );
        return;
      }
      ChatService.createChannel({
        title: this.ChannelName,
        password: this.password,
      })
        .then((resp) => {})
        .catch(({ response }) => {
          this.notificationsStore.enqueue(
            'warning',
            'Error',
            response.data.message,
          );
        });
    },
  },
});
</script>

<style>
#btn-front {
  margin: 1em;
  max-width: 100%;
}
</style>
