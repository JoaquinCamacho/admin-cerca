<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Servicios</h3>
        <p>Administrá los tipos de servicios disponibles en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar servicio</button>
    </div>

    <div class="section-box">
      <div class="search-row">
        <input v-model="search" class="search-input" type="text" placeholder="Buscar servicio..." />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mandados</th>
              <th>Compañía</th>
              <th>Cuidado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="servicio in filteredServicios" :key="servicio.id">
              <td>{{ servicio.id }}</td>
              <td>{{ servicio.mandados ? servicio.mandados : 'N/D' }}</td>
              <td>{{ servicio.compania ? servicio.compania : 'N/D' }}</td>
              <td>{{ servicio.cuidado ? servicio.cuidado : 'N/D' }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(servicio)">Editar</button>
                <button class="delete-button" @click="deleteServicio(servicio.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear / Editar Servicio -->
    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar servicio' : 'Nuevo servicio' }}</h3>
            <p>Configuración del servicio.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveServicio">
          <label>Mandados</label>
          <input v-model="form.mandados" type="text" placeholder="Detalle de mandados..." />

          <label>Compañía</label>
          <input v-model="form.compania" type="text" placeholder="Detalle de compañía..." />

          <label>Cuidado</label>
          <input v-model="form.cuidado" type="text" placeholder="Detalle de cuidado..." />

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="primary-button">
              {{ editingId ? 'Guardar cambios' : 'Crear servicio' }}
            </button>
          </div>
        </form>
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
      search: '',
      showModal: false,
      editingId: null,
      servicios: [],
      form: {
        mandados: '',
        compania: '',
        cuidado: ''
      }
    }
  },
  computed: {
    filteredServicios() {
      const texto = this.search.toLowerCase()
      
      return this.servicios.filter(servicio => {
        const mandados = String(servicio.mandados).toLowerCase()
        const compania = String(servicio.compania).toLowerCase()
        const cuidado = String(servicio.cuidado).toLowerCase()

        return mandados.includes(texto) || compania.includes(texto) || cuidado.includes(texto)
      })
    }
  },
  mounted() {
    this.fetchServicios()
  },
  methods: {
    async fetchServicios() {
      const respuesta = await supabase.from('servicios').select('*')
      
      if (respuesta.error) {
        console.error('Error al obtener servicios:', respuesta.error.message)
      } else {
        this.servicios = respuesta.data
      }
    },

    openModal(servicio = null) {
      this.showModal = true

      if (servicio) {
        this.editingId = servicio.id
        this.form.mandados = servicio.mandados
        this.form.compania = servicio.compania
        this.form.cuidado = servicio.cuidado
      } else {
        this.editingId = null
        this.form.mandados = ''
        this.form.compania = ''
        this.form.cuidado = ''
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveServicio() {
      const datosAGuardar = {
        mandados: this.form.mandados,
        compania: this.form.compania,
        cuidado: this.form.cuidado
      }

      if (this.editingId) {
        // Actualizar servicio existente
        const respuesta = await supabase
          .from('servicios')
          .update(datosAGuardar)
          .eq('id', this.editingId)

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchServicios()
        }
      } else {
        // Crear nuevo servicio
        const respuesta = await supabase
          .from('servicios')
          .insert([datosAGuardar])

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchServicios()
        }
      }

      this.closeModal()
    },

    async deleteServicio(id) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este servicio?')
      
      if (confirmar) {
        const respuesta = await supabase
          .from('servicios')
          .delete()
          .eq('id', id)
          .select()

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else if (!respuesta.data || respuesta.data.length === 0) {
          alert('No se pudo borrar. Revisa los permisos RLS en Supabase.')
        } else {
          this.fetchServicios()
        }
      }
    }
  }
}
</script>