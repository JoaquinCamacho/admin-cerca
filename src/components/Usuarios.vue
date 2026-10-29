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
            <p>Datos del usuario y configuración de rol.</p>
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

          <!-- SECCIÓN CONDICIONAL: Si es Cuidador (Rol ID: 2) -->
          <div v-if="form.id_rol === 2" class="services-box" style="margin-top: 15px; background: #f7fafc; padding: 12px; border-radius: 6px;">
            <label style="font-weight: bold; margin-bottom: 8px; display: block;">Servicios que prestará (podés seleccionar varios):</label>
            
            <div v-for="servicio in serviciosList" :key="servicio.id" style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <input 
                type="checkbox" 
                :value="servicio.id" 
                v-model="form.serviciosSeleccionados" 
              />
              <span>{{ servicio.tipos_servicio }}</span>
            </div>

            <label style="margin-top: 12px; display: block;">Archivo / Adjunto (Opcional)</label>
            <input v-model="form.archivo" type="text" placeholder="URL o nombre de archivo..." />
          </div>

          <div class="modal-actions" style="margin-top: 20px;">
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
      serviciosList: [],
      form: {
        nombre: '',
        apellido: '',
        gmail: '',
        password: '',
        foto_perfil: '',
        id_rol: '',
        serviciosSeleccionados: [],
        archivo: ''
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
    this.fetchServicios()
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

    async fetchServicios() {
      const { data, error } = await supabase.from('servicios').select('*')
      if (error) {
        console.error('Error al obtener servicios:', error.message)
      } else {
        this.serviciosList = data
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
        this.form.serviciosSeleccionados = []
        this.form.archivo = ''
      } else {
        this.editingId = null
        this.form.nombre = ''
        this.form.apellido = ''
        this.form.gmail = ''
        this.form.password = ''
        this.form.foto_perfil = ''
        this.form.id_rol = ''
        this.form.serviciosSeleccionados = []
        this.form.archivo = ''
      }
    },

    closeModal() {
      this.showModal = false
    },

 async saveUser() {
      console.log('Datos del formulario a guardar:', this.form) // <-- Miremos esto en la consola (F12)

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
        // 1. Creamos el usuario en la tabla Usuarios
        const respuesta = await supabase
          .from('Usuarios')
          .insert([datosUsuario])
          .select()

        console.log('Respuesta de creación de usuario:', respuesta) // <-- Ver qué devuelve Supabase

        if (respuesta.error) {
          alert('Error al crear usuario: ' + respuesta.error.message)
        } else {
          const nuevoUsuario = respuesta.data[0]
          console.log('Usuario creado con ID:', nuevoUsuario.id, 'Rol:', nuevoUsuario.id_rol)

          // 2. Si es Cliente (ID: 1)
          if (nuevoUsuario.id_rol === 1) {
            const respCliente = await supabase.from('Cliente').insert([{ id_usuario: nuevoUsuario.id }])
            if (respCliente.error) console.error('Error al crear cliente:', respCliente.error.message)
          } 
          // 3. Si es Cuidador (ID: 2)
          else if (nuevoUsuario.id_rol === 2) {
            if (this.form.serviciosSeleccionados && this.form.serviciosSeleccionados.length > 0) {
              
              // Mapeamos cada servicio seleccionado
              const registrosCuidador = this.form.serviciosSeleccionados.map(idServicio => {
                return {
                  id_usuario: nuevoUsuario.id,
                  id_servicio: Number(idServicio),
                  archivo: this.form.archivo ? this.form.archivo : null
                }
              })

              console.log('Registros a insertar en Cuidador:', registrosCuidador)

              const respCuidador = await supabase.from('Cuidador').insert(registrosCuidador)
              if (respCuidador.error) {
                console.error('Error al insertar servicios del cuidador:', respCuidador.error.message)
                alert('El usuario se creó, pero falló al guardar los servicios: ' + respCuidador.error.message)
              } else {
                console.log('¡Cuidadores y servicios guardados con éxito!')
              }
            } else {
              // Si no marcó ningún servicio
              await supabase.from('Cuidador').insert([{
                id_usuario: nuevoUsuario.id,
                id_servicio: null,
                archivo: this.form.archivo ? this.form.archivo : null
              }])
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