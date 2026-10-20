<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Clientes</h3>
        <p>Administrá los clientes registrados en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar cliente</button>
    </div>

    <div class="section-box">
      <div class="search-row">
        <input v-model="search" class="search-input" type="text" placeholder="Buscar cliente..." />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in filteredClientes" :key="cliente.id">
              <td>{{ cliente.id }}</td>
              <td>{{ cliente.id_usuario }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(cliente)">Editar</button>
                <button class="delete-button" @click="deleteCliente(cliente.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear / Editar Cliente -->
    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar cliente' : 'Nuevo cliente' }}</h3>
            <p>Datos del cliente.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveCliente">
          <label>Seleccionar Usuario</label>
          <select v-model.number="form.id_usuario" required>
            <option disabled value="">Selecciona un usuario registrado</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">
              {{ user.nombre }} {{ user.apellido }} (ID: {{ user.id }})
            </option>
          </select>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="primary-button">
              {{ editingId ? 'Guardar cambios' : 'Crear cliente' }}
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
  name: 'Clientes',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      clientes: [],
      usersList: [],
      form: {
        id_usuario: ''
      }
    }
  },
  computed: {
    filteredClientes() {
      const texto = this.search.toLowerCase()
      return this.clientes.filter(cliente => {
        const idUsuario = String(cliente.id_usuario).toLowerCase()
        return idUsuario.includes(texto)
      })
    }
  },
  mounted() {
    this.fetchClientes()
    this.fetchUsers()
  },
  methods: {
    async fetchClientes() {
      const respuesta = await supabase.from('Cliente').select('*')
      if (respuesta.error) {
        console.error('Error al obtener clientes:', respuesta.error.message)
      } else {
        this.clientes = respuesta.data
      }
    },

    async fetchUsers() {
      const respuesta = await supabase.from('Usuarios').select('*')
      if (respuesta.error) {
        console.error('Error al obtener usuarios:', respuesta.error.message)
      } else {
        this.usersList = respuesta.data
      }
    },

    openModal(cliente = null) {
      this.showModal = true
      if (cliente) {
        this.editingId = cliente.id
        this.form.id_usuario = cliente.id_usuario
      } else {
        this.editingId = null
        this.form.id_usuario = ''
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveCliente() {
      const datosAGuardar = {
        id_usuario: Number(this.form.id_usuario)
      }

      if (this.editingId) {
        const respuesta = await supabase
          .from('Cliente')
          .update(datosAGuardar)
          .eq('id', this.editingId)

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchClientes()
        }
      } else {
        const respuesta = await supabase
          .from('Cliente')
          .insert([datosAGuardar])

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchClientes()
        }
      }

      this.closeModal()
    },

    async deleteCliente(id) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este cliente?')
      if (confirmar) {
        const respuesta = await supabase
          .from('Cliente')
          .delete()
          .eq('id', id)
          .select()

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else if (!respuesta.data || respuesta.data.length === 0) {
          alert('No se pudo borrar. Revisa las Políticas de Seguridad (RLS) en Supabase para la tabla "Cliente".')
        } else {
          this.fetchClientes()
        }
      }
    }
  }
}
</script>
