export default {

    async registerCoach(context, data) {

        const userId = context.rootGetters.userId;
        const AUTH_KEY = context.rootGetters.token;

        console.log(AUTH_KEY)

        const coachData = {
            firstName: data.first,
            lastName: data.last,
            description: data.desc,
            hourlyRate: data.rate,
            areas: data.areas,
        }

        const response = await fetch(
            `https://vue-main-project-444ed-default-rtdb.firebaseio.com/coaches/${ userId }.json?auth=${ AUTH_KEY }`,
            {
                method: 'PUT',
                body: JSON.stringify(coachData),
            }
        );

        if (!response.ok) {
            // error handling
        }

        // const responseData = await response.json();

        context.commit('registerCoach', {
            ...coachData,
            id: userId,
        });
    },

    async fetchCoaches(context, payload) {

        if (!payload.forceRefresh && !context.getters.shouldUpdate) return;

        const response = await fetch(
            'https://vue-main-project-444ed-default-rtdb.firebaseio.com/coaches.json'
        );

        const responseData = await response.json();

        if (!response.ok) {
            const error = new Error(
                responseData.message || 'Failed to fetch'
            );
            throw error;
        }

        const coaches = [];

        for (const key in responseData) {
            const coach = {
                id: key,
                firstName: responseData[key].firstName,
                lastName: responseData[key].lastName,
                description: responseData[key].description,
                hourlyRate: responseData[key].hourlyRate,
                areas: responseData[key].areas,
            }
            coaches.push(coach);
        }

        context.commit('setCoaches', coaches);
        context.commit('setFetchTimestamp');

    }
}
