<template id="sign-in">
  <section class="vh-100">
    <div class="container py-5 h-100">
      <div class="row d-flex align-items-center justify-content-center h-100">
        <div class="col-md-8 col-lg-7 col-xl-6">
          <img src="../../assets/pong-signin.svg" class="img-fluid pong-logo" alt="Mythic pong game image" />
        </div>
        <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1 h-00">
          <Transition name="fade-form" mode="out-in">
            <LoginForm v-if="selectForm == AuthMode.Login" @change-form="selectForm = AuthMode.Register" />
            <RegisterForm v-else-if="selectForm == AuthMode.Register" @change-form=" (v) => selectForm = v" />
            <RegisterFormOptional v-else-if="selectForm == AuthMode.RegisterOptional"/>
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
import { PropType } from 'vue';
import { AuthMode } from './auth.interface';

defineProps({
  selectForm: { type: Number as PropType<AuthMode>, required: true, default: AuthMode.Login },
});
</script>

<style lang="scss" scoped>
// Inspect
// *:hover {
//   outline: 1px blue solid;
// }

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
