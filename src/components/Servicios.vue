<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Servicios</h3>
        <p>Administrá los servicios disponibles en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar servicio</button>
    </div>

    <div class="section-box">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mandados</th>
              <th>Compañía</th>
              <th>Cuidado</th>
              <th>ID usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td><span class="boolean">{{ service.mandados ? 'Sí' : 'No' }}</span></td>
              <td><span class="boolean">{{ service.compania ? 'Sí' : 'No' }}</span></td>
              <td><span class="boolean">{{ service.cuidado ? 'Sí' : 'No' }}</span></td>
              <td>{{ service.usuario }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(service)">Editar</button>
                <button class="delete-button" @click="deleteService(service.id)">Eliminar</button>
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
            <h3>{{ editingId ? 'Editar servicio' : 'Nuevo servicio' }}</h3>
            <p>Seleccioná los tipos de servicio.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveService">
          <label class="check">
            <input v-model="form.mandados" type="checkbox" />
            Mandados
          </label>

          <label class="check">
            <input v-model="form.compania" type="checkbox" />
            Compañía
          </label>

          <label class="check">
            <input v-model="form.cuidado" type="checkbox" />
            Cuidado
          </label>

          <label>ID de usuario</label>
          <input v-model="form.usuario" type="text" required />

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
export default {
  name: 'Servicios',
  data() {
    return {
      showModal: false,
      editingId: null,
      services: [
        { id: 1, mandados: true, compania: true, cuidado: false, usuario: 'UUID-001' },
        { id: 2, mandados: false, compania: true, cuidado: true, usuario: 'UUID-002' }
      ],
      form: {
        mandados: false,
        compania: false,
        cuidado: false,
        usuario: ''
      }
    }
  },
  methods: {
    openModal(service = null) {
      this.showModal = true

      if (service) {
        this.editingId = service.id
        this.form = { ...service }
      } else {
        this.editingId = null
        this.form = {
          mandados: false,
          compania: false,
          cuidado: false,
          usuario: ''
        }
      }
    },
    closeModal() {
      this.showModal = false
    },
    saveService() {
      if (this.editingId) {
        const index = this.services.findIndex(item => item.id === this.editingId)

        if (index !== -1) {
          this.services[index] = {
            ...this.services[index],
            ...this.form
          }
        }
      } else {
        const newId = this.services.length
          ? Math.max(...this.services.map(item => item.id)) + 1
          : 1

        this.services.push({
          id: newId,
          ...this.form
        })
      }

      this.closeModal()
    },
    deleteService(id) {
      if (window.confirm('¿Seguro que querés eliminar este servicio?')) {
        this.services = this.services.filter(item => item.id !== id)
      }
    }
  }
}
</script>
