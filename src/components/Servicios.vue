<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Servicios</h3>
        <p>Administrá los servicios registrados en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar servicio</button>
    </div>

    <div class="section-box">
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Mandados</th>
              <th>Compañía</th>
              <th>Cuidado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.id">
              <td>{{ service.id }}</td>
              <td>{{ service.usuario }}</td>
              <td>{{ service.mandados ? 'Sí' : 'No' }}</td>
              <td>{{ service.compania ? 'Sí' : 'No' }}</td>
              <td>{{ service.cuidado ? 'Sí' : 'No' }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(service)">Editar</button>
                <button class="delete-button" @click="deleteService(service.id)">Eliminar</button>
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
            <p>Datos del servicio.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveService">
          <label>Usuario</label>
          <input v-model="form.usuario" type="text" required />

          <div class="checkbox-group" style="margin: 15px 0;">
            <label><input type="checkbox" v-model="form.mandados" /> Mandados</label>
            <label><input type="checkbox" v-model="form.compania" /> Compañía</label>
            <label><input type="checkbox" v-model="form.cuidado" /> Cuidado</label>
          </div>

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
import { supabase } from '@/supabase'

export default {
  name: 'Servicios',
  data() {
    return {
      showModal: false,
      editingId: null,
      services: [], // Se llena desde Supabase
      form: {
        mandados: false,
        compania: false,
        cuidado: false,
        usuario: ''
      }
    }
  },
  mounted() {
    this.fetchServices()
  },
  methods: {
    // 1️⃣ SELECT: Obtener servicios
    async fetchServices() {
      const { data, error } = await supabase
        .from('servicios')
        .select('*')

      if (error) {
        console.error('Error al obtener servicios:', error.message)
      } else {
        this.services = data
      }
    },

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

    // 2️⃣ & 3️⃣ INSERT o UPDATE
    async saveService() {
      if (this.editingId) {
        // UPDATE
        const { error } = await supabase
          .from('servicios')
          .update({
            mandados: this.form.mandados,
            compania: this.form.compania,
            cuidado: this.form.cuidado,
            usuario: this.form.usuario
          })
          .eq('id', this.editingId)

        if (error) {
          console.error('Error al actualizar servicio:', error.message)
        } else {
          this.fetchServices()
        }
      } else {
        // INSERT
        const { error } = await supabase
          .from('servicios')
          .insert([
            {
              mandados: this.form.mandados,
              compania: this.form.compania,
              cuidado: this.form.cuidado,
              usuario: this.form.usuario
            }
          ])

        if (error) {
          console.error('Error al crear servicio:', error.message)
        } else {
          this.fetchServices()
        }
      }

      this.closeModal()
    },

    // 4️⃣ DELETE
    async deleteService(id) {
      if (window.confirm('¿Seguro que querés eliminar este servicio?')) {
        const { error } = await supabase
          .from('servicios')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error al eliminar servicio:', error.message)
        } else {
          this.fetchServices()
        }
      }
    }
  }
}
</script>