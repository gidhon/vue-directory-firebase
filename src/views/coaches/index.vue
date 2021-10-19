<template>

  <div>

    <base-dialog :show="!!error" @close="handleError" title="An error occurred">
      <p>{{ error }}</p>
    </base-dialog>

    <section>
      <coach-filter @change-filter="setFilters" />
    </section>

    <section>

      <base-card>

        <div class="controls">

          <base-button
              mode="outline"
              @click="fetchCoaches(true)"
          >Refresh
          </base-button>

          <base-button
              v-if="isLoggedIn && !isCoach && !loadingData"
              to="/register"
              link
          >Register as Coach
          </base-button>

          <base-button
              v-if="!isLoggedIn"
              to="/auth?redirect=register"
              link
          >Log in to register as a coach
          </base-button>

        </div>

        <div v-if="loadingData">
          <base-spinner/>
        </div>

        <ul v-else-if="hasCoaches">
          <Coach v-for="coach in filteredCoaches"
                 :key="coach.id"
                 :id="coach.id"
                 :rate="coach.hourlyRate"
                 :areas="coach.areas"
                 :first-name="coach.firstName"
                 :last-name="coach.lastName"
          />
        </ul>

        <h3 v-else>No Coaches found</h3>

      </base-card>

    </section>

  </div>

</template>

<script>

  import {computed, reactive, ref} from 'vue';
  import { useStore } from 'vuex';

  import Coach from '@/components/coaches/Coach';
  import Filter from '@/components/coaches/Filter';

  export default {

    components: {
      Coach,
      'coach-filter': Filter,
    },

    setup() {

      const store = useStore();

      const error = ref(null);
      const loadingData = ref(false);

      const activeFilters = reactive({
        frontend: true,
        backend: true,
        career: true
      })

      // run at creation time
      fetchCoaches();

      const isCoach = computed(() => {
        return store.getters['coaches/isCoach'];
      })

      const isLoggedIn = computed(() => {
        return store.getters['isAuthenticated'];
      })

      const filteredCoaches = computed(() => {
        const coaches = store.getters['coaches/coaches'];
        return coaches.filter(coach => {
          if (activeFilters.frontend && coach.areas.includes('frontend')) return true;
          if (activeFilters.backend && coach.areas.includes('backend')) return true;
          if (activeFilters.career && coach.areas.includes('career')) return true;
          return false;
        })
      })

      const hasCoaches = computed(() => {
        return !loadingData.value && store.getters['coaches/hasCoaches'];
      })

      function setFilters(updatedFilters) {
        Object.assign(activeFilters, updatedFilters);
      }

      async function fetchCoaches(refresh = false) {
        loadingData.value = true;
        try {
          await store.dispatch('coaches/fetchCoaches', { forceRefresh: refresh });
        } catch (errorFromAction) {
          error.value = errorFromAction.message || 'something went wrong';
        }
        loadingData.value = false;
      }

      function handleError() {
        error.value = false;
      }

      return {
        error,
        isCoach,
        setFilters,
        hasCoaches,
        loadingData,
        handleError,
        fetchCoaches,
        filteredCoaches,
        isLoggedIn,
      }

    }

  }

</script>

<style scoped>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .controls {
    display: flex;
    justify-content: space-between;
  }
</style>
