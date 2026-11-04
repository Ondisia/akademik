export default [
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('./views/Dashboard.vue'),
        meta: { hideNavbar: true, blankLayout: true, requiresAuth: true },
    },
];