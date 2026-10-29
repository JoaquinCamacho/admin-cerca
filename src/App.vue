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
        <!-- Dashboard / Inicio -->
        <button
          class="nav-item"
          :class="{ active: currentSection === 'dashboard' }"
          @click="selectSection('dashboard')"
        >
          <span class="nav-icon">⌂</span>
          <span>Inicio</span>
        </button>

        <!-- Pestaña Usuarios con Desplegable -->
        <div class="nav-group">
          <button class="nav-item nav-parent" @click="toggleSubmenu">
            <div class="nav-label-box">
              <span class="nav-icon">👥</span>
              <span>Usuarios</span>
            </div>
            <span class="arrow-icon">{{ showSubmenu ? '▾' : '▸' }}</span>
          </button>

          <!-- Submenú de Usuarios -->
          <div v-if="showSubmenu" class="submenu">
            <button
              class="submenu-item"
              :class="{ active: currentSection === 'usuarios' }"
              @click="selectSection('usuarios')"
            >
              • Todos los usuarios
            </button>
            <button
              class="submenu-item"
              :class="{ active: currentSection === 'cuidadores' }"
              @click="selectSection('cuidadores')"
            >
              • Cuidadores
            </button>
            <button
              class="submenu-item"
              :class="{ active: currentSection === 'clientes' }"
              @click="selectSection('clientes')"
            >
              • Clientes
            </button>
          </div>
        </div>

        <!-- Servicios -->
        <button
          class="nav-item"
          :class="{ active: currentSection === 'servicios' }"
          @click="selectSection('servicios')"
        >
          <span class="nav-icon">📋</span>
          <span>Servicios</span>
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
        <Clientes v-if="currentSection === 'clientes'" />
        <Servicios v-if="currentSection === 'servicios'" />
      </section>
    </main>
  </div>
</template>

<script>
import Dashboard from './components/Dashboard.vue'
import Usuarios from './components/Usuarios.vue'
import Cuidadores from './components/Cuidadores.vue'
import Clientes from './components/Clientes.vue'
import Servicios from './components/Servicios.vue'

export default {
  name: 'App',
  components: {
    Dashboard,
    Usuarios,
    Cuidadores,
    Clientes,
    Servicios
  },
  data() {
    return {
      currentSection: 'dashboard',
      menuOpen: false,
      showSubmenu: true // Controla si el desplegable está abierto o cerrado
    }
  },
  computed: {
    // Título dinámico simple en la barra superior
    currentTitle() {
      if (this.currentSection === 'usuarios') return 'Usuarios'
      if (this.currentSection === 'cuidadores') return 'Cuidadores'
      if (this.currentSection === 'clientes') return 'Clientes'
      if (this.currentSection === 'servicios') return 'Servicios'
      return 'Inicio'
    }
  },
  methods: {
    selectSection(seccion) {
      this.currentSection = seccion
      localStorage.setItem('activeSection', seccion)
      this.menuOpen = false
    },

    toggleSubmenu() {
      if (this.showSubmenu === true) {
        this.showSubmenu = false
      } else {
        this.showSubmenu = true
      }
    }
  },
  created() {
    const savedSection = localStorage.getItem('activeSection')
    if (savedSection) {
      this.currentSection = savedSection
    }
  }
}
</script>

<style scoped>
/* Estilos adicionales simples para integrar el submenú respetando el tema visual */
.nav-group {
  display: flex;
  flex-direction: column;
}

.nav-parent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.nav-label-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrow-icon {
  font-size: 12px;
  opacity: 0.7;
}

.submenu {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  gap: 4px;
  margin-top: 4px;
  margin-bottom: 8px;
}

.submenu-item {
  background: transparent;
  border: none;
  color: #a0aec0;
  text-align: left;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.submenu-item.active {
  background: #3182ce;
  color: #ffffff;
  font-weight: bold;
}
</style>