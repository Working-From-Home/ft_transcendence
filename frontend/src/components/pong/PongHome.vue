<template>
  <div class="row g-3 px-md-5 mt-md-2">
    <div class="col">
      <div class="gradient-blue-inverted rounded p-3 pb-5">
        <h1 class="display-6 mt-3 mb-4 fw-bold text-primary">Play Pong!</h1>
        <p class="fs-5 mb-4">find your opponent now and express your talent</p>
        <pong-matchmaking />
      </div>
    </div>
  </div>
  <div class="row g-3 px-md-5">
    <div class="col pt-3">
      <div class="gradient-blue rounded p-3">
        <h3 class="display-6 mt-3 mb-4 fw-bold text-primary">A bit of history</h3>
        <p class="fs-5 text-justify mx-md-5">
          Pong is a table tennis–themed arcade sports video game, featuring
          simple two-dimensional graphics, manufactured by Atari and originally
          released in 1972. It was created by Allan Alcorn as a training
          exercise assigned to him by Atari co-founder Nolan Bushnell, but
          Bushnell and Atari co-founder Ted Dabney were surprised by the quality
          of Alcorn's work and decided to manufacture the game. Bushnell based
          the game's concept on an electronic ping-pong game included in the
          Magnavox Odyssey, the first home video game console. In response,
          Magnavox later sued Atari for patent infringement...
        </p>
        <p class="fs-5 text-justify mx-md-5">
          Pong was the first commercially successful video game, and it helped
          to establish the video game industry along with the Magnavox Odyssey.
          Soon after its release, several companies began producing games that
          closely mimicked its gameplay. Eventually, Atari's competitors
          released new types of video games that deviated from Pong's original
          format to varying degrees, and this, in turn, led Atari to encourage
          its staff to move beyond Pong and produce more innovative games
          themselves.
        </p>
        <p class="fs-5 text-justify mx-md-5">
          Atari released several sequels to Pong that built upon the original's
          gameplay by adding new features. During the 1975 Christmas season,
          Atari released a home version of Pong exclusively through Sears retail
          stores. The home version was also a commercial success and led to
          numerous clones. The game was remade on numerous home and portable
          platforms following its release. Pong is part of the permanent
          collection of the Smithsonian Institution in Washington, D.C., due to
          its cultural impact.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStatusStore } from '@/store/modules/status/status';
import PongMatchmaking from './PongMatchmaking.vue';
import { useCurrentUserStore } from '@/store/currentUser';
import AddTwofaButton from '../auth/AddTwofaButton.vue';

export default defineComponent({
  components: { PongMatchmaking, AddTwofaButton},
  setup() {
    const statusStore = useStatusStore();
    const currentUserStore = useCurrentUserStore();
    return { statusStore, currentUserStore };
  },
  mounted() {
    const id = this.currentUserStore.userId!;
    console.log(`yo: ${id}`);
    if (!this.statusStore.getinGameusers.includes(id)) return;

    this.$pongSocket.emit('getGameId', id, (gameId: string) => {
      if (gameId) this.$router.push({ path: `/pong/${gameId}` });
    });
  },
  methods: {},
});
</script>

<style scoped>
.text-justify {
  text-align: justify;
}

</style>
