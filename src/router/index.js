// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import PontoComponet from '@/views/PontoComponet.vue';
import LoginComponent from '@/views/LoginComponent.vue';
import Colaborador from '@/views/ColaboradorComponent.vue';
import VariaveisStaticas from '@/store/VariaveisStaticas';
import MeuFuncionario from '@/views/MeuColaborador.vue';

function isUsuarioAuthenticated() {
    const permissao = VariaveisStaticas.getpermissao();
    return permissao;
}

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginComponent,
    },
    {
        path: '/cadastro',
        name: 'cadastro',
        component: PontoComponet,
        beforeEnter: (to, from, next) => {
            if (isUsuarioAuthenticated()) {
                next();
            } else {
                next('/');
            }
        },
    },
    {
        path: '/colaborador',
        name: 'colaborador',
        component: Colaborador,
        beforeEnter: (to, from, next) => {
            if (isUsuarioAuthenticated()) {
                next();
            } else {
                next('/');
            }
        },
    },
    {
        path: '/SeuColaborador',
        name: 'SeuColaborador',
        component:MeuFuncionario,
        beforeEnter: (to, from, next) => {
            if (isUsuarioAuthenticated()) {
                next();
            } else {
                next('/colaborador');
            }
        },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
