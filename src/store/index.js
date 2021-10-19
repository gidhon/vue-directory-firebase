import { createStore } from 'vuex';

import coaches from './modules/coaches';
import requests from './modules/requests';
import authentication from './modules/auth';

const store = createStore({
    modules: {
        coaches,
        requests,
        authentication,
    }
});

export default store;
