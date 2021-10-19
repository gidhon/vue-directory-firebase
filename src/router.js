import { createRouter, createWebHistory } from 'vue-router'

import coachIndex from './views/coaches/index.vue';
import coachDetail from './views/coaches/detail';
import coachRegister from './views/coaches/register';
import requestsContact from './views/requests/contact';
import requestsInbox from './views/requests/inbox';
import UserAuth from './views/auth/UserAuth';
import error404 from './views/errors/404';
import store from './store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/coaches',
        },
        {
            path: '/coaches',
            component: coachIndex,
        },
        {
            path: '/coaches/:id',
            props: true,
            component: coachDetail,
            children: [
                {
                    path: 'contact',
                    component: requestsContact
                }
            ]
        },
        {
            path: '/register',
            component: coachRegister,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/requests',
            component: requestsInbox,
            meta: {
                requiresAuth: true,
            }
        },
        {
            path: '/auth',
            component: UserAuth,
            meta: {
                requiresUnauth: true,
            }
        },
        {
            path: '/:notFound(.*)',
            component: error404,
        },
    ],
});

router.beforeEach((to, from, next) => {

    if (to.meta.requiresAuth && !store.getters.isAuthenticated) next('/auth');
    else if (to.meta.requiresUnauth && store.getters.isAuthenticated) next('/coaches');
    else next();

});

export default router;
