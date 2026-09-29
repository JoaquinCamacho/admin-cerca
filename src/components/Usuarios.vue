<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Usuarios</h3>
        <p>Administrá los usuarios registrados en Cerca.</p>
      </div>
      <button class="primary-button" @click="openModal()">+ Agregar usuario</button>
    </div>

    <div class="section-box">
      <div class="search-row">
        <input v-model="search" class="search-input" type="text" placeholder="Buscar usuario..." />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Gmail</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.gmail }}</td>
              <td><span class="status active-status">{{ user.estado || 'Activo' }}</span></td>
              <td class="actions">
                <button class="edit-button" @click="openModal(user)">Editar</button>
                <button class="delete-button" @click="deleteUser(user.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal para Crear / Editar Usuario -->
    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
            <p>Datos del usuario.</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveUser">
          <label>Nombre</label>
          <input v-model="form.nombre" type="text" required />

          <label>Apellido</label>
          <input v-model="form.apellido" type="text" required />

          <label>Gmail</label>
          <input v-model="form.gmail" type="email" required />

          <label>Estado</label>
          <input v-model="form.estado" type="text" placeholder="Ej: Activo / Pendiente" />

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="closeModal">Cancelar</button>
            <button type="submit" class="primary-button">
              {{ editingId ? 'Guardar cambios' : 'Crear usuario' }}
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
  name: 'Usuarios',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      users: [], // Se llenará con los datos reales de Supabase
      form: {
        nombre: '',
        apellido: '',
        gmail: '',
        estado: 'Activo'
      }
    }
  },
  computed: {
    filteredUsers() {
      const text = this.search.toLowerCase()
      return this.users.filter(user =>
        `${user.nombre} ${user.apellido} ${user.gmail}`.toLowerCase().includes(text)
      )
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    // SELECT: Obtener todos los usuarios de Supabase
    async fetchUsers() {
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')

      if (error) {
        console.error('Error al obtener usuarios:', error.message)
      } else {
        this.users = data
      }
    },

    openModal(user = null) {
      this.showModal = true

      if (user) {
        this.editingId = user.id
        this.form = { ...user }
      } else {
        this.editingId = null
        this.form = {
          nombre: '',
          apellido: '',
          gmail: '',
          estado: 'Activo'
        }
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveUser() {
      if (this.editingId) {
        // UPDATE: Actualizar usuario existente en Supabase
        const { error } = await supabase
          .from('Usuarios')
          .update({
            nombre: this.form.nombre,
            apellido: this.form.apellido,
            gmail: this.form.gmail,
            estado: this.form.estado
          })
          .eq('id', this.editingId)

        if (error) {
          console.error('Error al actualizar usuario:', error.message)
        } else {
          this.fetchUsers()
        }
      } else {
        // INSERT: Crear nuevo usuario en Supabase
        const { error } = await supabase
          .from('Usuarios')
          .insert([
            {
              nombre: this.form.nombre,
              apellido: this.form.apellido,
              gmail: this.form.gmail,
              estado: this.form.estado
            }
          ])

        if (error) {
          console.error('Error al crear usuario:', error.message)
        } else {
          this.fetchUsers()
        }
      }

      this.closeModal()
    },

    async deleteUser(id) {
      if (window.confirm('¿Seguro que querés eliminar este usuario?')) {
        // DELETE: Eliminar usuario en Supabase
        const { error } = await supabase
          .from('Usuarios')
          .delete()
          .eq('id', id)

        if (error) {
          console.error('Error al eliminar usuario:', error.message)
        } else {
          this.fetchUsers()
        }
      }
    }
  }
}
</script>