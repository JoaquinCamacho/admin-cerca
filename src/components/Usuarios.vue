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
              <th>Rol ID</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.gmail }}</td>
              <td>{{ user.id_rol ?? 'Sin rol' }}</td>
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

          <label>Password</label>
          <input v-model="form.password" type="password" required />

          <label>Foto de Perfil (Opcional)</label>
          <input v-model="form.foto_perfil" type="text" placeholder="URL o nombre de archivo" />

          <label>ID Rol (Opcional)</label>
          <input v-model.number="form.id_rol" type="number" placeholder="Ej: 1" />

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
import { supabase } from '../supabase'

export default {
  name: 'Usuarios',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      users: [], // Se llena desde Supabase
      form: {
        nombre: '',
        apellido: '',
        gmail: '',
        password: '',
        foto_perfil: '',
        id_rol: ''
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
    // 1️⃣ SELECT: Obtener usuarios
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
          password: '',
          foto_perfil: '',
          id_rol: ''
        }
      }
    },

    closeModal() {
      this.showModal = false
    },

    // 2️⃣ & 3️⃣ INSERT o UPDATE
    async saveUser() {
      // Preparamos los datos convirtiendo los vacíos a null para campos opcionales
      const userData = {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        gmail: this.form.gmail,
        password: this.form.password,
        foto_perfil: this.form.foto_perfil ? this.form.foto_perfil : null,
        id_rol: this.form.id_rol ? Number(this.form.id_rol) : null
      }

      if (this.editingId) {
        // UPDATE
        const { error } = await supabase
          .from('Usuarios')
          .update(userData)
          .eq('id', this.editingId)

        if (error) {
          console.error('Error al actualizar usuario:', error.message)
        } else {
          this.fetchUsers()
        }
      } else {
        // INSERT
        const { error } = await supabase
          .from('Usuarios')
          .insert([userData])

        if (error) {
          console.error('Error al crear usuario:', error.message)
        } else {
          this.fetchUsers()
        }
      }

      this.closeModal()
    },

    // 4️⃣ DELETE
    async deleteUser(id) {
      if (window.confirm('¿Seguro que querés eliminar este usuario?')) {
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