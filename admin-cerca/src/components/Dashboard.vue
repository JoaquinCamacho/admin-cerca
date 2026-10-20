<template>
  <div>
    <div class="welcome">
      <div>
        <h3>¡Bienvenido al panel de Cerca!</h3>
        <p>Desde acá podés administrar la información de la aplicación.</p>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-icon">👥</div>
        <div>
          <span>Usuarios</span>
          <strong>{{ totalUsuarios }}</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">🤝</div>
        <div>
          <span>Cuidadores</span>
          <strong>{{ totalCuidadores }}</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">👤</div>
        <div>
          <span>Clientes</span>
          <strong>{{ totalClientes }}</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">📋</div>
        <div>
          <span>Servicios</span>
          <strong>{{ totalServicios }}</strong>
        </div>
      </div>
    </div>

    <div class="section-box">
      <div class="section-header">
        <div>
          <h3>Últimos usuarios</h3>
          <p>Vista previa de los últimos usuarios registrados.</p>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Gmail</th>
              <th>Rol ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in ultimosUsuarios" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.gmail }}</td>
              <td>{{ user.id_rol ? user.id_rol : 'Sin rol' }}</td>
            </tr>
            <tr v-if="ultimosUsuarios.length === 0">
              <td colspan="5" style="text-align: center;">No hay usuarios registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'Dashboard',
  data() {
    return {
      totalUsuarios: 0,
      totalCuidadores: 0,
      totalClientes: 0,
      totalServicios: 0,
      ultimosUsuarios: []
    }
  },
  mounted() {
    this.cargarEstadisticas()
  },
  methods: {
    async cargarEstadisticas() {
      // 1. Total de Usuarios
      const respUsuarios = await supabase.from('Usuarios').select('*', { count: 'exact' })
      if (!respUsuarios.error) {
        this.totalUsuarios = respUsuarios.count ? respUsuarios.count : 0
        // Tomamos los últimos 5 usuarios registrados
        this.ultimosUsuarios = respUsuarios.data.slice(-5).reverse()
      }

      // 2. Total de Cuidadores
      const respCuidadores = await supabase.from('Cuidador').select('*', { count: 'exact' })
      if (!respCuidadores.error) {
        this.totalCuidadores = respCuidadores.count ? respCuidadores.count : 0
      }

      // 3. Total de Clientes
      const respClientes = await supabase.from('Cliente').select('*', { count: 'exact' })
      if (!respClientes.error) {
        this.totalClientes = respClientes.count ? respClientes.count : 0
      }

      // 4. Total de Servicios
      const respServicios = await supabase.from('servicios').select('*', { count: 'exact' })
      if (!respServicios.error) {
        this.totalServicios = respServicios.count ? respServicios.count : 0
      }
    }
  }
}
</script>