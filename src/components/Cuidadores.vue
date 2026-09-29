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
              <th>Usuario</th>
              <th>Archivos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="caregiver in filteredCaregivers" :key="caregiver.id">
              <td>{{ caregiver.id }}</td>
              <td>{{ caregiver.usuario }}</td>
              <td>{{ caregiver.archivos }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(caregiver)">Editar</button>
                <button class="delete-button" @click="deleteCaregiver(caregiver.id)">Eliminar</button>
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

        <form @submit.prevent="saveCaregiver">
          <label>Usuario</label>
          <input v-model="form.usuario" type="text" required />

          <label>Archivos</label>
          <input v-model="form.archivos" type="text" placeholder="URL o nombre de archivo" />

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
import { supabase } from '@/supabase'

export default {
  name: 'Cuidadores',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      caregivers: [], // Se llena desde Supabase
      form: {
        usuario: '',
        archivos: ''
      }
    }
  },
  computed: {
    filteredCaregivers() {
      const text = this.search.toLowerCase()
      return this.caregivers.filter(caregiver =>
        `${caregiver.usuario} ${caregiver.archivos}`.toLowerCase().includes(text)
      )
    }
  },
  mounted() {
    this.fetchCaregivers()
  },
  methods: {
    // 1️⃣ SELECT: Obtener cuidadores
    async fetchCaregivers() {
      const { data, error } = await supabase
        .from('Cuidador')
        .select('*')

      if (error) {
        console.error('Error al obtener cuidadores:', error.message)
      } else {
        this.caregivers = data
      }
    },

    openModal(caregiver = null) {
      this.showModal = true
      if (caregiver) {
        this.editingId = caregiver.id
        this.form = { ...caregiver }
      } else {
        this.editingId = null
        this.form = { usuario: '', archivos: '' }
      }
    },

    closeModal() {
      this.showModal = false
    },

    // 2️⃣ & 3️⃣ INSERT o UPDATE
    async saveCaregiver() {
      if (this.editingId) {
        // UPDATE
        const { error } = await supabase
          .from('Cuidador')
          .update({
            usuario: this.form.usuario,
            archivos: this.form.archivos
          })
          .eq('id', this.editingId)

        if (error) {
          console.error('Error al actualizar cuidador:', error.message)
        } else {
          this.fetchCaregivers()
        }
      } else {
        // INSERT
        const { error } = await supabase
          .from('Cuidador')
          .insert([
            {
              usuario: this.form.usuario,
              archivos: this.form.archivos
            }
          ])

        if (error) {
          console.error('Error al crear cuidador:', error.message)
        } else {
          this.fetchCaregivers()
        }
      }

      this.closeModal()
    },

    // 4️⃣ DELETE
    async deleteCaregiver(id) {
      if (window.confirm('¿Seguro que querés eliminar este cuidador?')) {
        const { error } = await supabase
          .from('Cuidador')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error al eliminar cuidador:', error.message)
        } else {
          this.fetchCaregivers()
        }
      }
    }
  }
}
</script>