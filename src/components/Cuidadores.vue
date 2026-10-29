<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Cuidadores</h3>
        <p>Listado de cuidadores y los servicios que ofrecen.</p>
      </div>
    </div>

    <div class="section-box">
      <div class="search-row">
        <input v-model="search" class="search-input" type="text" placeholder="Buscar cuidador..." />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cuidador (Usuario)</th>
              <th>Servicios Ofrecidos</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuidador in filteredCuidadores" :key="cuidador.id">
              <td>{{ cuidador.id }}</td>
              <td>{{ cuidador.nombreCompleto }}</td>
              <td>
                <span v-if="cuidador.servicios.length > 0">
                  <span v-for="(ser, index) in cuidador.servicios" :key="index" class="badge">
                    {{ ser }}
                  </span>
                </span>
                <span v-else class="badge-empty">Sin servicio</span>
              </td>
              <td>{{ cuidador.archivo ?? 'Sin archivo' }}</td>
              <td class="actions">
                <!-- Usamos id_usuario para borrar todos sus servicios de un solo golpe -->
                <button class="delete-button" @click="deleteCuidador(cuidador.id_usuario)">Eliminar</button>
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
  name: 'Cuidadores',
  data() {
    return {
      search: '',
      cuidadoresList: []
    }
  },
  computed: {
    filteredCuidadores() {
      const texto = this.search.toLowerCase()
      return this.cuidadoresList.filter(c => {
        const nombreUsuario = c.nombreCompleto ? c.nombreCompleto.toLowerCase() : ''
        const coincideServicio = c.servicios && c.servicios.some(s => s.toLowerCase().includes(texto))
        return nombreUsuario.includes(texto) || coincideServicio
      })
    }
  },
  mounted() {
    this.fetchCuidadores()
  },
  methods: {
    async fetchCuidadores() {
      const { data, error } = await supabase
        .from('Cuidador')
        .select(`
          id,
          archivo,
          id_usuario,
          Usuarios (nombre, apellido),
          servicios (tipos_servicio)
        `)

      if (error) {
        console.error('Error al obtener cuidadores:', error.message)
      } else {
        // Agrupamos por id_usuario para mostrar una sola fila por cuidador
        const agrupados = {}

        data.forEach(item => {
          const userId = item.id_usuario
          const nombreUser = item.Usuarios ? `${item.Usuarios.nombre} ${item.Usuarios.apellido}` : 'Sin nombre'
          const nombreServicio = item.servicios ? item.servicios.tipos_servicio : null

          if (!agrupados[userId]) {
            agrupados[userId] = {
              id: item.id,
              id_usuario: userId,
              nombreCompleto: nombreUser,
              archivo: item.archivo,
              servicios: []
            }
          }

          if (nombreServicio && !agrupados[userId].servicios.includes(nombreServicio)) {
            agrupados[userId].servicios.push(nombreServicio)
          }
        })

        this.cuidadoresList = Object.values(agrupados)
      }
    },

    async deleteCuidador(idUsuario) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este cuidador y todos sus servicios asociados?')
      if (confirmar) {
        // Borramos directamente todas las filas de la tabla Cuidador que coincidan con este id_usuario
        const { error } = await supabase
          .from('Cuidador')
          .delete()
          .eq('id_usuario', idUsuario)

        if (error) {
          alert('Error al eliminar: ' + error.message)
        } else {
          this.fetchCuidadores()
        }
      }
    }
  }
}
</script>

<style scoped>
.badge {
  background: #edf2f7;
  color: #2d3748;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 4px;
  display: inline-block;
}

.badge-empty {
  color: #a0aec0;
  font-size: 12px;
  font-style: italic;
}
</style>