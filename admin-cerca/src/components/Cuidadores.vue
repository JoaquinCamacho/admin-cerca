<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Cuidadores</h3>
        <p>Administrá los cuidadores registrados en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar cuidador</button>
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
              <th>ID Usuario</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuidador in filteredCuidadores" :key="cuidador.id">
              <td>{{ cuidador.id }}</td>
              <td>{{ cuidador.id_usuario }}</td>
              <td>{{ cuidador.archivo ?? 'Sin archivo' }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(cuidador)">Editar</button>
                <button class="delete-button" @click="deleteCuidador(cuidador.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear / Editar Cuidador -->
    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar cuidador' : 'Nuevo cuidador' }}</h3>
            <p>Datos del cuidador.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveCuidador">
          <label>ID Usuario</label>
          <input v-model.number="form.id_usuario" type="number" placeholder="Ej: ID del usuario registrado" required />

          <label>Archivo (Opcional)</label>
          <input v-model="form.archivo" type="text" placeholder="URL o nombre del archivo..." />

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="primary-button">
              {{ editingId ? 'Guardar cambios' : 'Crear cuidador' }}
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
  name: 'Cuidadores',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      cuidadores: [],
      form: {
        id_usuario: '',
        archivo: ''
      }
    }
  },
  computed: {
    filteredCuidadores() {
      const text = this.search.toLowerCase()
      return this.cuidadores.filter(c =>
        String(c.id_usuario).toLowerCase().includes(text)
      )
    }
  },
  mounted() {
    this.fetchCuidadores()
  },
  methods: {
    async fetchCuidadores() {
      const { data, error } = await supabase.from('Cuidador').select('*')
      if (error) console.error('Error al obtener cuidadores:', error.message)
      else this.cuidadores = data
    },

    openModal(cuidador = null) {
      this.showModal = true
      if (cuidador) {
        this.editingId = cuidador.id
        this.form = { ...cuidador }
      } else {
        this.editingId = null
        this.form = { id_usuario: '', archivo: '' }
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveCuidador() {
      const dataToSave = {
        id_usuario: Number(this.form.id_usuario),
        archivo: this.form.archivo ? this.form.archivo : null
      }

      if (this.editingId) {
        const { error } = await supabase.from('Cuidador').update(dataToSave).eq('id', this.editingId)
        if (error) console.error('Error al actualizar cuidador:', error.message)
        else this.fetchCuidadores()
      } else {
        const { error } = await supabase.from('Cuidador').insert([dataToSave])
        if (error) console.error('Error al crear cuidador:', error.message)
        else this.fetchCuidadores()
      }

      this.closeModal()
    },

    async deleteCuidador(id) {
      if (window.confirm('¿Seguro que querés eliminar este cuidador?')) {
        const { error } = await supabase.from('Cuidador').delete().eq('id', id)
        if (error) console.error('Error al eliminar cuidador:', error.message)
        else this.fetchCuidadores()
      }
    }
  }
}
</script>