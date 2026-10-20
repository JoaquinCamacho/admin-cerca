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
              <td>{{ user.id_rol ? user.id_rol : 'Sin rol' }}</td>
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

          <label>Rol del usuario</label>
          <select v-model.number="form.id_rol">
            <option value="">Sin rol / Ninguno</option>
            <option :value="1">Cliente (ID: 1)</option>
            <option :value="2">Cuidador (ID: 2)</option>
          </select>

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
      users: [],
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
      const texto = this.search.toLowerCase()
      return this.users.filter(user => {
        const nombreCompleto = `${user.nombre} ${user.apellido} ${user.gmail}`.toLowerCase()
        return nombreCompleto.includes(texto)
      })
    }
  },
  mounted() {
    this.fetchUsers()
  },
  methods: {
    async fetchUsers() {
      const respuesta = await supabase.from('Usuarios').select('*')
      if (respuesta.error) {
        console.error('Error al obtener usuarios:', respuesta.error.message)
      } else {
        this.users = respuesta.data
      }
    },

    openModal(user = null) {
      this.showModal = true
      if (user) {
        this.editingId = user.id
        this.form.nombre = user.nombre
        this.form.apellido = user.apellido
        this.form.gmail = user.gmail
        this.form.password = user.password
        this.form.foto_perfil = user.foto_perfil
        this.form.id_rol = user.id_rol
      } else {
        this.editingId = null
        this.form.nombre = ''
        this.form.apellido = ''
        this.form.gmail = ''
        this.form.password = ''
        this.form.foto_perfil = ''
        this.form.id_rol = ''
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveUser() {
      const datosUsuario = {
        nombre: this.form.nombre,
        apellido: this.form.apellido,
        gmail: this.form.gmail,
        password: this.form.password,
        foto_perfil: this.form.foto_perfil ? this.form.foto_perfil : null,
        id_rol: this.form.id_rol ? Number(this.form.id_rol) : null
      }

      if (this.editingId) {
        const respuesta = await supabase
          .from('Usuarios')
          .update(datosUsuario)
          .eq('id', this.editingId)

        if (respuesta.error) {
          alert('Error al actualizar usuario: ' + respuesta.error.message)
        } else {
          this.fetchUsers()
        }
      } else {
        // Al crear un nuevo usuario, pedimos que nos devuelva la fila creada (.select())
        const respuesta = await supabase
          .from('Usuarios')
          .insert([datosUsuario])
          .select()

        if (respuesta.error) {
          alert('Error al crear usuario: ' + respuesta.error.message)
        } else {
          const nuevoUsuario = respuesta.data[0]

          // AUTO-CARGA SEGÚN ROL:
          if (nuevoUsuario.id_rol === 1) {
            // Si es Cliente (ID 1), creamos su registro en la tabla Cliente
            const respCliente = await supabase
              .from('Cliente')
              .insert([{ id_usuario: nuevoUsuario.id }])

            if (respCliente.error) {
              console.error('Error al vincular en tabla Cliente:', respCliente.error.message)
            }
          } else if (nuevoUsuario.id_rol === 2) {
            // Si es Cuidador (ID 2), creamos su registro en la tabla Cuidador
            const respCuidador = await supabase
              .from('Cuidador')
              .insert([{ id_usuario: nuevoUsuario.id }])

            if (respCuidador.error) {
              console.error('Error al vincular en tabla Cuidador:', respCuidador.error.message)
            }
          }

          this.fetchUsers()
        }
      }

      this.closeModal()
    },

    async deleteUser(id) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este usuario?')
      if (confirmar) {
        const respuesta = await supabase.from('Usuarios').delete().eq('id', id).select()
        if (respuesta.error) {
          alert('Error al eliminar usuario: ' + respuesta.error.message)
        } else {
          this.fetchUsers()
        }
      }
    }
  }
}
</script>