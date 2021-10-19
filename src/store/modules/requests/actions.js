export default {

    async contactCoach(context, payload) {

        const newRequest = {
            email: payload.email,
            message: payload.message
        }

        const res = await fetch(`https://vue-main-project-444ed-default-rtdb.firebaseio.com/requests/${ payload.coachId }/.json`, {
            method: 'POST',
            body: JSON.stringify(newRequest),
        });

        const resData = await res.json();

        if (!res.ok) {
            const error = new Error(resData.message || 'could not submit message to coach');
            throw error;
        }

        // FireBase automatically generates a new document ID
        // (under "name") for each POST request it gets.
        newRequest.id = resData.name;
        newRequest.coachId = payload.coachId;

        context.commit('addRequest', newRequest);
    },

    async fetchRequests(context) {

        const coachId = context.rootGetters.userId;
        const AUTH_KEY = context.rootGetters.token;
        const res = await fetch(
            `https://vue-main-project-444ed-default-rtdb.firebaseio.com/requests/${ coachId }.json?auth=${ AUTH_KEY }`
        );

        const resData = await res.json();

        if (!res.ok) {
            const error = new Error(resData.message || 'could not fetch messages');
            throw error;
        }

        const messages = [];

        for (const key in resData) {
            const message = {
                id: key,
                userId: coachId,
                email: resData[key].email,
                message: resData[key].message
            }
            messages.push(message);
        }

        context.commit('setMessages', messages);
    }
}
