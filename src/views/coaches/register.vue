<template>

  <section>
    <base-card>
      <h2>Register as a coach now!</h2>
      <coach-form @save-data="saveData"></coach-form>
    </base-card>
  </section>

</template>

<script>

  import Form from '@/components/coaches/Form';
  import BaseCard from '@/components/ui/BaseCard';
  import {useStore} from 'vuex';
  import {useRouter} from 'vue-router';

  export default {

    components: {
      BaseCard,
      'coach-form': Form,
    },

    setup() {

      const store = useStore();
      const router = useRouter();

      function saveData(formData) {
        store.dispatch('coaches/registerCoach', formData);
        router.replace('/coaches');
      }

      return {
        saveData,
      }

    }

  }

</script>

<style scoped>

</style>
