<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Cuidadores</h3>
        <p>Administrá los cuidadores registrados.</p>
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="caregiver in filteredCaregivers" :key="caregiver.id">
              <td>{{ caregiver.id }}</td>
              <td>{{ caregiver.usuario }}</td>
              <td>{{ caregiver.archivos || 'Sin archivos' }}</td>
              <td><span class="status active-status">Activo</span></td>
              <td class="actions">
                <button class="edit-button" @click="openModal(caregiver)">Editar</button>
                <button class="delete-button" @click="deleteCaregiver(caregiver.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar cuidador' : 'Nuevo cuidador' }}</h3>
            <p>Datos básicos del cuidador.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveCaregiver">
          <label>ID de usuario</label>
          <input v-model="form.usuario" type="text" required />

          <label>Archivos</label>
          <input v-model="form.archivos" type="text" placeholder="URL o referencia de archivos" />

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
export default {
  name: 'Cuidadores',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      caregivers: [
        { id: 1, usuario: 'UUID-001', archivos: 'documentacion.pdf' },
        { id: 2, usuario: 'UUID-002', archivos: 'certificado.pdf' }
      ],
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
  methods: {
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
    saveCaregiver() {
      if (this.editingId) {
        const index = this.caregivers.findIndex(item => item.id === this.editingId)
        if (index !== -1) {
          this.caregivers[index] = {
            ...this.caregivers[index],
            usuario: this.form.usuario,
            archivos: this.form.archivos
          }
        }
      } else {
        const newId = this.caregivers.length
          ? Math.max(...this.caregivers.map(item => item.id)) + 1
          : 1

        this.caregivers.push({
          id: newId,
          usuario: this.form.usuario,
          archivos: this.form.archivos
        })
      }

      this.closeModal()
    },
    deleteCaregiver(id) {
      if (window.confirm('¿Seguro que querés eliminar este cuidador?')) {
        this.caregivers = this.caregivers.filter(item => item.id !== id)
      }
    }
  }
}
</script>
