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
              <th>ID Usuario</th>
              <th>Archivo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cuidador in filteredCuidadores" :key="cuidador.id">
              <td>{{ cuidador.id }}</td>
              <td>{{ cuidador.id_usuario }}</td>
              <td>{{ cuidador.archivo ? cuidador.archivo : 'Sin archivo' }}</td>
              <td class="actions">
                <button class="edit-button" @click="openModal(cuidador)">Editar</button>
                <button class="delete-button" @click="deleteCuidador(cuidador.id)">Eliminar</button>
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

        <form @submit.prevent="saveCuidador">
          <label>Seleccionar Usuario</label>
          <select v-model.number="form.id_usuario" required>
            <option disabled value="">Selecciona un usuario registrado</option>
            <option v-for="user in usersList" :key="user.id" :value="user.id">
              {{ user.nombre }} {{ user.apellido }} (ID: {{ user.id }})
            </option>
          </select>

          <label>Archivo (Opcional)</label>
          <input v-model="form.archivo" type="text" placeholder="URL o nombre del archivo..." />

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
import { supabase } from '../supabase'

export default {
  name: 'Cuidadores',
  data() {
    return {
      search: '',
      showModal: false,
      editingId: null,
      cuidadores: [],
      usersList: [],
      form: {
        id_usuario: '',
        archivo: ''
      }
    }
  },
  computed: {
    filteredCuidadores() {
      const texto = this.search.toLowerCase()

      return this.cuidadores.filter(cuidador => {
        const idUsuario = String(cuidador.id_usuario).toLowerCase()
        return idUsuario.includes(texto)
      })
    }
  },
  mounted() {
    this.fetchCuidadores()
    this.fetchUsers()
  },
  methods: {
    async fetchCuidadores() {
      const respuesta = await supabase.from('Cuidador').select('*')

      if (respuesta.error) {
        console.error('Error al obtener cuidadores:', respuesta.error.message)
      } else {
        this.cuidadores = respuesta.data
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

    openModal(cuidador = null) {
      this.showModal = true

      if (cuidador) {
        this.editingId = cuidador.id
        this.form.id_usuario = cuidador.id_usuario
        this.form.archivo = cuidador.archivo
      } else {
        this.editingId = null
        this.form.id_usuario = ''
        this.form.archivo = ''
      }
    },

    closeModal() {
      this.showModal = false
    },

    async saveCuidador() {
      const datosAGuardar = {
        id_usuario: Number(this.form.id_usuario),
        archivo: this.form.archivo ? this.form.archivo : null
      }

      if (this.editingId) {
        // Actualizar cuidador
        const respuesta = await supabase
          .from('Cuidador')
          .update(datosAGuardar)
          .eq('id', this.editingId)

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchCuidadores()
        }
      } else {
        // Crear nuevo cuidador
        const respuesta = await supabase
          .from('Cuidador')
          .insert([datosAGuardar])

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else {
          this.fetchCuidadores()
        }
      }

      this.closeModal()
    },

    async deleteCuidador(id) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este cuidador?')

      if (confirmar) {
        const respuesta = await supabase
          .from('Cuidador')
          .delete()
          .eq('id', id)
          .select()

        if (respuesta.error) {
          alert('Error: ' + respuesta.error.message)
        } else if (!respuesta.data || respuesta.data.length === 0) {
          alert('No se pudo borrar. Revisa las Políticas de Seguridad (RLS) en Supabase.')
        } else {
          this.fetchCuidadores()
        }
      }
    }
  }
}
</script>