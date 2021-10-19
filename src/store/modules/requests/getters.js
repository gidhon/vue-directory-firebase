export default {
    requests(state, getters, rootState, rootGetters) {
        const coachId = rootGetters.userId;
        return state.requests.filter(req => req.userId === coachId);
    },
    hasRequests(state, getters) {
        return getters.requests && getters.requests.length > 0;
    }
}
