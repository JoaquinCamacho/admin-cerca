<template>
  <div>
    <div class="page-header">
      <div>
        <h3>Clientes</h3>
        <p>Listado de clientes registrados en Cerca.</p>
      </div>
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
              <th>Cliente (Usuario)</th> <!-- Cambiamos el título aquí -->
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cliente in filteredClientes" :key="cliente.id">
              <td>{{ cliente.id }}</td>
              <!-- Mostramos el nombre y apellido del usuario relacionado en lugar del ID numérico -->
              <td>
                {{ cliente.Usuarios ? cliente.Usuarios.nombre + ' ' + cliente.Usuarios.apellido : 'Usuario no encontrado' }}
              </td>
              <td class="actions">
                <button class="edit-button" @click="openModal(cliente)">Editar</button>
                <button class="delete-button" @click="deleteCliente(cliente.id)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
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
      clientes: []
    }
  },
  computed: {
    filteredClientes() {
      const texto = this.search.toLowerCase()
      return this.clientes.filter(cliente => {
        const nombreCompleto = cliente.Usuarios 
          ? `${cliente.Usuarios.nombre} ${cliente.Usuarios.apellido}`.toLowerCase() 
          : ''
        return nombreCompleto.includes(texto)
      })
    }
  },
  mounted() {
    this.fetchClientes()
  },
  methods: {
    async fetchClientes() {
      // Hacemos el JOIN con la tabla Usuarios usando la relación de Supabase
      const { data, error } = await supabase
        .from('Cliente')
        .select(`
          id,
          id_usuario,
          Usuarios (nombre, apellido)
        `)

      if (error) {
        console.error('Error al obtener clientes:', error.message)
      } else {
        this.clientes = data
      }
    },

    async deleteCliente(id) {
      const confirmar = window.confirm('¿Seguro que querés eliminar este cliente?')
      if (confirmar) {
        const { error } = await supabase.from('Cliente').delete().eq('id', id)
        if (error) {
          alert('Error al eliminar cliente: ' + error.message)
        } else {
          this.fetchClientes()
        }
      }
    }
  }
}
</script>