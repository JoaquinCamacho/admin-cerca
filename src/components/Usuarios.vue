<template>
  ...
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
        `${user.nombre} ${user.apellido} ${user.email}`
          .toLowerCase()
          .includes(text)
      )
    }
  },

  async mounted() {
    await this.cargarUsuarios()
  },

  methods: {

    // LEER USUARIOS
    async cargarUsuarios() {
      const { data, error } = await supabase
        .from('registro')
        .select('*')

      if (error) {
        console.error('Error al cargar usuarios:', error)
        alert('No se pudieron cargar los usuarios')
        return
      }

      this.users = data.map(usuario => ({
        id: usuario.identificación,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.Gmail,
        password: usuario.contraseña,
        foto: usuario.foto_perfil
      }))
    },

    // ABRIR MODAL
    openModal(user = null) {
      this.showModal = true

      if (user) {
        this.editingId = user.id

        this.form = {
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          password: user.password || '',
          foto: user.foto || ''
        }
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

    // CERRAR MODAL
    closeModal() {
      this.showModal = false
      this.editingId = null
    },

    // CREAR O EDITAR
    async saveUser() {

      // EDITAR
      if (this.editingId) {

        const { error } = await supabase
          .from('registro')
          .update({
            nombre: this.form.nombre,
            apellido: this.form.apellido,
            Gmail: this.form.email,
            contraseña: this.form.password,
            foto_perfil: this.form.foto
          })
          .eq('identificación', this.editingId)

        if (error) {
          console.error('Error al editar usuario:', error)
          alert('No se pudo editar el usuario')
          return
        }

      } else {

        // CREAR
        const { error } = await supabase
          .from('registro')
          .insert({
            nombre: this.form.nombre,
            apellido: this.form.apellido,
            Gmail: this.form.email,
            contraseña: this.form.password,
            foto_perfil: this.form.foto
          })

        if (error) {
          console.error('Error al crear usuario:', error)
          alert('No se pudo crear el usuario')
          return
        }
      }

      // Volvemos a cargar la tabla
      await this.cargarUsuarios()

      this.closeModal()
    },

    // ELIMINAR
    async deleteUser(id) {

      const confirmed = window.confirm(
        '¿Seguro que querés eliminar este usuario?'
      )

      if (!confirmed) return

      const { error } = await supabase
        .from('registro')
        .delete()
        .eq('identificación', id)

      if (error) {
        console.error('Error al eliminar usuario:', error)
        alert('No se pudo eliminar el usuario')
        return
      }

      await this.cargarUsuarios()
    }
  }
}
</script>