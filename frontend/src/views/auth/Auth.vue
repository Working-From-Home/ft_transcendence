<template id="sign-in">
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex align-items-center justify-content-around h-100">
        <div class="col-8 col-offset-2 col-lg-6 col-lg-offset-0 mb-4 mb-lg-0">
          <img src="../../assets/pong-signin.svg" class="img-fluid pong-logo mx-2" alt="Mythic pong game image" />
        </div>
        <div class="col-8 col-offset-2 col-lg-4 col-lg-offset-2">
          <Transition name="fade-form" mode="out-in">
            <LoginForm v-if="selectForm == AuthMode.Login" @change-form="selectForm = AuthMode.Register" />
            <RegisterFormOptional v-else-if="selectForm == AuthMode.RegisterOptional || authStore.registerInProgress"/>
            <RegisterForm v-else-if="selectForm == AuthMode.Register" @change-form=" (v) => selectForm = v" />
            <p v-else> error ! > </p>
          </Transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';
import RegisterForm from '@/components/auth/RegisterForm.vue';
import RegisterFormOptional from '@/components/auth/RegisterFormOptional.vue';
import { useAuthStore } from '@/store/auth';
import { PropType } from 'vue';
import { AuthMode } from './auth.interface';

defineProps({
  selectForm: { type: Number as PropType<AuthMode>, required: true, default: AuthMode.Login },
});

const authStore = useAuthStore();

</script>

<style lang="scss" scoped>
// utils
@mixin filter-invert($n: 100%) {
  -webkit-filter: invert($n); /* safari 6.0 - 9.0 */
  filter: invert($n);
}

// For the logo
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
.pong-logo {
  @include filter-invert(100%);
  animation: 1s ease-out 0s 1 slideInFromLeft;
  transition: filter 0.3s ease-out, -webkit-filter 0.3s ease-out;
}
.pong-logo:active,
.pong-logo:hover {
  @include filter-invert(0%);
}

// transition between forms
.fade-form-enter-active,
.fade-form-leave-active {
  transition: opacity 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fade-form-enter-from,
.fade-form-leave-to {
  opacity: 0;
}
</style>
