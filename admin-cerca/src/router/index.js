import { createRouter, createWebHistory } from 'vue-router'

// Importamos los componentes desde la carpeta components/
import Dashboard from '@/components/Dashboard.vue'
import Usuarios from '@/components/Usuarios.vue'
import Cuidadores from '@/components/Cuidadores.vue'
import Servicios from '@/components/Servicios.vue'

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
