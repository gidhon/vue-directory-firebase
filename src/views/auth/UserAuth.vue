<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-Mail</label>
          <input type="email" id="email" v-model.trim="email">
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.trim="password">
        </div>
        <p v-if="!formIsValid">Please enter a valid E-mail and password.</p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button
            type="button"
            mode="flat"
            @click="switchAuthMode"
        >{{ switchModeButtonCaption }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>

  import {computed, ref} from 'vue';
  import {useStore} from 'vuex';
  import {useRouter, useRoute} from 'vue-router';

  export default {

    setup() {

      const store = useStore();
      const route = useRoute();
      const router = useRouter();

      const email = ref('');
      const password = ref('');
      const mode = ref('login');
      const formIsValid = ref(true);
      const isLoading = ref(false);
      const error = ref(null);

      const submitButtonCaption = computed(() => {
        return mode.value === 'login' ? 'Login' : 'Signup';
      });

      const switchModeButtonCaption = computed(() => {
        return mode.value === 'login' ? 'Or Signup' : 'Or Login';
      });

      async function submitForm() {

        const actionPayload = {
          email: email.value,
          password: password.value,
        }

        formIsValid.value = true;

        if (email.value === '' ||
            !email.value.includes('@') ||
            password.value.length < 6
        ) {
          formIsValid.value = false;
          return;
        }

        isLoading.value = true;

        try {
          if (mode.value === 'login') {
            console.dir(actionPayload)
            await store.dispatch('login', actionPayload);
          } else {
            await store.dispatch('signup', actionPayload);
          }

          const redirectUrl = `/${ route.query.redirect || 'coaches' }`;

          router.replace(redirectUrl);

        } catch (err) {
          error.value = err.message || 'Failed to authenticate.'
        }

        isLoading.value = false;

      }

      function switchAuthMode() {
        if (mode.value === 'login') {
          mode.value = 'signup';
        } else {
          mode.value = 'login'
        }
      }

      function handleError() {
        error.value = null;
      }

      return {
        email,
        password,
        mode,
        error,
        isLoading,
        formIsValid,
        submitButtonCaption,
        switchModeButtonCaption,
        submitForm,
        handleError,
        switchAuthMode,
      }

    }

  }

</script>

<style scoped>
  form {
    margin: 1rem;
    padding: 1rem;
  }

  .form-control {
    margin: 0.5rem 0;
  }

  label {
    font-weight: bold;
    margin-bottom: 0.5rem;
    display: block;
  }

  input,
  textarea {
    display: block;
    width: 100%;
    font: inherit;
    border: 1px solid #ccc;
    padding: 0.15rem;
  }

  input:focus,
  textarea:focus {
    border-color: #3d008d;
    background-color: #faf6ff;
    outline: none;
  }
</style>
