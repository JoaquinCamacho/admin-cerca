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
              <td>{{ servicio.mandados ?? 'N/D' }}</td>
              <td>{{ servicio.compania ?? 'N/D' }}</td>
              <td>{{ servicio.cuidado ?? 'N/D' }}</td>
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
      const text = this.search.toLowerCase()
      return this.servicios.filter(s =>
        String(s.mandados || '').toLowerCase().includes(text) ||
        String(s.compania || '').toLowerCase().includes(text) ||
        String(s.cuidado || '').toLowerCase().includes(text)
      )
    }
  },
  mounted() {
    this.fetchServicios()
  },
  methods: {
    async fetchServicios() {
      const { data, error } = await supabase.from('servicios').select('*')
      if (error) console.error('Error al obtener servicios:', error.message)
      else this.servicios = data
    },

    openModal(servicio = null) {
      this.showModal = true
      if (servicio) {
        this.editingId = servicio.id
        this.form = { ...servicio }
      } else {
        this.editingId = null
        this.form = { mandados: '', compania: '', cuidado: '' }
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveServicio() {
      const dataToSave = {
        mandados: this.form.mandados || null,
        compania: this.form.compania || null,
        cuidado: this.form.cuidado || null
      }

      if (this.editingId) {
        const { error } = await supabase.from('servicios').update(dataToSave).eq('id', this.editingId)
        if (error) {
          console.error('Error al actualizar servicio:', error.message)
          alert('Error: ' + error.message)
        } else {
          this.fetchServicios()
        }
      } else {
        const { error } = await supabase.from('servicios').insert([dataToSave])
        if (error) {
          console.error('Error al crear servicio:', error.message)
          alert('Error: ' + error.message)
        } else {
          this.fetchServicios()
        }
      }

      this.closeModal()
    },

    async deleteServicio(id) {
      if (!window.confirm('¿Seguro que querés eliminar este servicio?')) return

      const { data, error } = await supabase.from('servicios').delete().eq('id', id).select()

      if (error) {
        console.error('Error al eliminar servicio:', error.message)
        alert('Error: ' + error.message)
      } else if (!data || data.length === 0) {
        alert('No se pudo borrar. Verifica las Políticas de Seguridad (RLS) en Supabase para la tabla "servicios".')
      } else {
        this.fetchServicios()
      }
    }
  }
}
</script>