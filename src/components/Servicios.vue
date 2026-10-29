<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Servicios</h3>
        <p>Tipos de servicios disponibles en Cerca.</p>
      </div>
    </div>

    <div class="section-box">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo de Servicio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="servicio in serviciosList" :key="servicio.id">
              <td>{{ servicio.id }}</td>
              <td>
                <span class="badge">{{ servicio.tipos_servicio }}</span>
              </td>
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
  name: 'Servicios',
  data() {
    return {
      serviciosList: []
    }
  },
  mounted() {
    this.fetchServicios()
  },
  methods: {
    async fetchServicios() {
      // Consultamos los registros de la tabla servicios en Supabase
      const { data, error } = await supabase
        .from('servicios')
        .select('*')

      if (error) {
        console.error('Error al obtener servicios:', error.message)
      } else {
        this.serviciosList = data
      }
    }
  }
}
</script>

<style scoped>
/* Estilo limpio para que los servicios se vean ordenados */
.badge {
  background: #ebf8ff;
  color: #2b6cb0;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}
</style>