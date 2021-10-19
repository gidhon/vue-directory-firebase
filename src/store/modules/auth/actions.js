let timer;

export default {

    async auth(context, payload) {

        const mode = payload.mode;

        const API_KEY = 'THE_KEY';
        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${ API_KEY }`;

        if (mode === 'signup') {
            url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${ API_KEY }`;
        }

        const response = await fetch(
            url,
            {
                method: 'POST',
                body: JSON.stringify({
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true,
                }),
            }
        );

        const resData = await response.json();

        if (!response.ok) {
            const error = new Error(resData.message || 'Failed to authenticate...');
            throw error;
        }

        const expiresIn = +resData.expiresIn * 1000; // coerce to number and convert to milliseconds
        const tokenExpirationTime = new Date().getTime() + expiresIn;

        localStorage.setItem('coachesTestApp.token', resData.idToken);
        localStorage.setItem('coachesTestApp.userId', resData.localId);
        localStorage.setItem('coachesTestApp.tokenExpiration', tokenExpirationTime);

        // automatically log out once the token expires (typically an hour from login)
        timer = setTimeout(function() {
            context.dispatch('autoLogout');
        }, expiresIn)

        context.commit('setUser', {
            token: resData.idToken,
            userId: resData.localId,
        });

    },

    async signup(context, payload) {

        return context.dispatch('auth', {
            ...payload,
            mode: 'signup',
        });

    },

    async login(context, payload) {

        return context.dispatch('auth', {
            ...payload,
            mode: 'login',
        });

    },

    autoLogin({ commit, dispatch }) {
        const token = localStorage.getItem('coachesTestApp.token');
        const userId = localStorage.getItem('coachesTestApp.userId');
        const tokenExpirationTime = localStorage.getItem('coachesTestApp.tokenExpiration');

        const expiresIn = +tokenExpirationTime - new Date().getTime();

        // don't automatically log back in on page refresh if token has expired
        if (expiresIn < 0) return;

        timer = setTimeout(function() {
            dispatch('autoLogout');
        }, expiresIn)

        if (token && userId) {
            commit('setUser', {
                token,
                userId,
            });
        }
    },

    autoLogout({ dispatch, commit }) {
        dispatch('logout');
        commit('setAutoLogout');
    },

    logout(context) {

        localStorage.removeItem('coachesTestApp.token');
        localStorage.removeItem('coachesTestApp.userId');
        localStorage.removeItem('coachesTestApp.tokenExpiration');

        clearTimeout(timer);

        context.commit('setUser', {
            token: null,
            userId: null,
        })

    },
}
