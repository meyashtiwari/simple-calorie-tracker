import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";

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
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/user/HomeView.vue"),
        },
        {
            path: "/admin/dashboard",
            name: "dashboard",
            component: () => import("../views/admin/HomeView.vue"),
        }
    ],
});

export default router;
