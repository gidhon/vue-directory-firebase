<template>

  <div>

    <base-dialog :show="!!error" @close="handleError" title="An error occurred">
      <p>{{ error }}</p>
    </base-dialog>

    <section>

      <base-card>

        <header>
          <h2>Requests Received</h2>
        </header>

        <base-spinner v-if="isLoading"/>

        <ul v-else-if="hasRequests && !isLoading">
          <request-item v-for="request in requestsReceived"
            :email="request.email"
            :message="request.message"
            :key="request.id"
          />
        </ul>

        <h3 v-else>You haven't received any requests yet!</h3>

      </base-card>

    </section>

  </div>

</template>

<script>

  import {computed, ref} from 'vue';
  import {useStore} from 'vuex';
  import Request from '@/components/requests/Request';

  export default {

    components: {
      'request-item': Request,
    },

    setup() {

      const store = useStore();
      const isLoading = ref(false);
      let error = null;

      fetchMessages(); // run at "create" cycle

      const requestsReceived = computed(() => {
        return store.getters['requests/requests'];
      })

      const hasRequests = computed(() => {
        return store.getters['requests/hasRequests'];
      })

      async function fetchMessages() {
        isLoading.value = true;
        try {
          await store.dispatch('requests/fetchRequests');
        } catch (e) {
          error = e.message || 'something went wrong';
        }
        isLoading.value = false;
      }

      function handleError() {
        error = null;
      }

      return {
        error,
        isLoading,
        requestsReceived,
        hasRequests,
        handleError,
      }

    }

  }

</script>

<style scoped>
  header {
    text-align: center;
  }

  ul {
    list-style: none;
    margin: 2rem auto;
    padding: 0;
    max-width: 30rem;
  }

  h3 {
    text-align: center;
  }
</style>
