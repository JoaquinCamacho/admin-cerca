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
        <input v-model="search" class="search-input" type="text" placeholder="Buscar por nombre, apellido o Gmail..." />
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Gmail</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.foto ? 'Sí' : 'No' }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(user)">Editar</button>
                <button class="delete-button" @click="deleteUser(user.id)">Eliminar</button>
              </td>
            </tr>
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="empty">No se encontraron usuarios.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-background" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <div>
            <h3>{{ editingId ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
            <p>{{ editingId ? 'Modificá los datos del usuario.' : 'Completá los datos para crear un usuario.' }}</p>
          </div>
          <button class="close-button" @click="closeModal">×</button>
        </div>

        <form @submit.prevent="saveUser">
          <label>Nombre</label>
          <input v-model="form.nombre" type="text" required />

          <label>Apellido</label>
          <input v-model="form.apellido" type="text" required />

          <label>Gmail</label>
          <input v-model="form.email" type="email" required />

          <label>Contraseña</label>
          <input v-model="form.password" type="password" :required="!editingId" />

          <label>Foto de perfil</label>
          <input v-model="form.foto" type="text" placeholder="URL de la foto" />

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
export default {
  name: 'Usuarios',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      users: [
        { id: 1, nombre: 'Malena', apellido: 'Del Valle', email: 'malena@gmail.com', password: '', foto: true },
        { id: 2, nombre: 'Juan', apellido: 'Pérez', email: 'juan@gmail.com', password: '', foto: false },
        { id: 3, nombre: 'María', apellido: 'López', email: 'maria@gmail.com', password: '', foto: true }
      ],
      form: {
        nombre: '',
        apellido: '',
        email: '',
        password: '',
        foto: ''
      }
    }
  },
  computed: {
    filteredUsers() {
      const text = this.search.toLowerCase()
      return this.users.filter(user =>
        `${user.nombre} ${user.apellido} ${user.email}`.toLowerCase().includes(text)
      )
    }
  },
  methods: {
    openModal(user = null) {
      this.showModal = true

      if (user) {
        this.editingId = user.id
        this.form = { ...user, foto: user.foto ? 'Foto cargada' : '' }
      } else {
        this.editingId = null
        this.form = {
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          foto: ''
        }
      }
    },
    closeModal() {
      this.showModal = false
    },
    saveUser() {
      if (this.editingId) {
        const index = this.users.findIndex(user => user.id === this.editingId)

        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            nombre: this.form.nombre,
            apellido: this.form.apellido,
            email: this.form.email,
            password: this.form.password,
            foto: !!this.form.foto
          }
        }
      } else {
        const newId = this.users.length
          ? Math.max(...this.users.map(user => user.id)) + 1
          : 1

        this.users.push({
          id: newId,
          nombre: this.form.nombre,
          apellido: this.form.apellido,
          email: this.form.email,
          password: this.form.password,
          foto: !!this.form.foto
        })
      }

      this.closeModal()
    },
    deleteUser(id) {
      const confirmed = window.confirm('¿Seguro que querés eliminar este usuario?')

      if (confirmed) {
        this.users = this.users.filter(user => user.id !== id)
      }
    }
  }
}
</script>
