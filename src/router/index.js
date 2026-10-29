import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes desde la carpeta components/
import Dashboard from '@/components/Dashboard.vue'
import Usuarios from '@/components/Usuarios.vue'
import Cuidadores from '@/components/Cuidadores.vue'
import Servicios from '@/components/Servicios.vue'
import Clientes from '@/components/Clientes.vue' // <-- 1. Importamos la vista de clientes

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: Usuarios
  },
  {
    path: '/cuidadores',
    name: 'Cuidadores',
    component: Cuidadores
  },
  {
    path: '/clientes',
    name: 'Clientes', // <-- 2. Agregamos la ruta de clientes
    component: Clientes
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router