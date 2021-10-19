import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export default {

    state() {
        return {
            userId: null,
            token: null,
            didAutoLogout: null,
        }
    },

    actions,
    mutations,
    getters,
}
