import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import { useAuth } from "@/stores/auth.js"
import { useUser } from '@/stores/user.js'
import LocalDataHandler from "@/utils/LocalDataHandler.js"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: LoginView,
        },
        {
            path: "/signup",
            name: "signup",
            component: () => import("../views/SignupView.vue"),
        },
        {
            path: "/",
            name: "home",
            meta: {
                requiresAuth: true,
            },
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/user/HomeView.vue"),
        },
        {
            path: "/admin/dashboard",
            name: "dashboard",
            meta: {
                requiresAuth: true,
                adminOnly: true
            },
            component: () => import("../views/admin/HomeView.vue"),
        }
    ],
});

router.beforeEach(async (to, from, next) => {
    const store = useAuth()
    const userStore = useUser()

    // if target requires authentication OR admin access
    if (to.meta.requiresAuth || to.meta.adminOnly) {
        // if access token or user is unable to be authenticated
        if (!LocalDataHandler.getAccessToken() || await userStore.getUser() === false) {
            // redirect to login page
            return next({name: 'login'})
        }
        // do not grant permissino if user is not admin
        if (to.meta.adminOnly && store.user.role === 'CUSTOMER') {
            return next({name: 'home'})
        }
        // prevent admin from accessing non-admin-only sites
        if (store.user.role !== 'CUSTOMER' && !to.meta.adminOnly) {
            return next({name: 'dashboard'})
        }
    }
    // only allow access to login page if logged out
    if (to.name === 'login' && await userStore.getUser() === true) {
        return next({name: 'home'})
    }

   return next()
})

export default router;
