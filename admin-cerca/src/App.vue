<template>
  <div class="app">
    <aside class="sidebar" :class="{ open: menuOpen }">
      <div class="brand">
        <div class="brand-logo">C</div>
        <div>
          <h1>Cerca</h1>
          <span>Administración</span>
        </div>
      </div>

      <nav class="nav">
        <button
          v-for="item in menu"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentSection === item.id }"
          @click="selectSection(item.id)"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-bottom">
        <button class="nav-item">
          <span class="nav-icon">⚙</span>
          <span>Configuración</span>
        </button>
      </div>
    </aside>

    <div v-if="menuOpen" class="overlay" @click="menuOpen = false"></div>

    <main class="main">
      <header class="topbar">
        <button class="menu-button" @click="menuOpen = !menuOpen">☰</button>
        <div>
          <h2>{{ currentTitle }}</h2>
          <p>Panel de administración de Cerca</p>
        </div>
        <div class="admin">
          <div class="admin-avatar">A</div>
          <div class="admin-info">
            <strong>Administrador</strong>
            <span>Panel admin</span>
          </div>
        </div>
      </header>

      <section class="content">
        <Dashboard v-if="currentSection === 'dashboard'" />
        <Usuarios v-if="currentSection === 'usuarios'" />
        <Cuidadores v-if="currentSection === 'cuidadores'" />
        <Servicios v-if="currentSection === 'servicios'" />
      </section>
    </main>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import Usuarios from './components/Usuarios.vue'
import Cuidadores from './components/Cuidadores.vue'
import Servicios from './components/Servicios.vue'

export default {
  name: 'App',
  components: {
    Dashboard,
    Usuarios,
    Cuidadores,
    Servicios
  },
  data() {
    return {
      currentSection: 'dashboard',
      menuOpen: false,
      menu: [
        { id: 'dashboard', label: 'Inicio', icon: '⌂' },
        { id: 'usuarios', label: 'Usuarios', icon: '👥' },
        { id: 'cuidadores', label: 'Cuidadores', icon: '🤝' },
        { id: 'servicios', label: 'Servicios', icon: '📋' }
      ]
    }
  },
  computed: {
    currentTitle() {
      const item = this.menu.find(item => item.id === this.currentSection)
      return item ? item.label : 'Inicio'
    }
  },
  methods: {
  selectSection(section) {
    this.currentSection = section
    localStorage.setItem('activeSection', section) // Lo guardamos
    this.menuOpen = false
  }
},
created() {
  // Cuando la app arranca, revisa si había una sección guardada
  const savedSection = localStorage.getItem('activeSection')
  if (savedSection) {
    this.currentSection = savedSection
  }
}
}
</script>
