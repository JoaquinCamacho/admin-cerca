<template>
  <div>
    <div class="welcome">
      <div>
        <h3>¡Bienvenido al panel de Cerca!</h3>
        <p>Desde acá podés administrar la información de la aplicación.</p>
      </div>
    </div>

    <div class="cards">
      <div class="card">
        <div class="card-icon">👥</div>
        <div>
          <span>Usuarios</span>
          <strong>25</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">🤝</div>
        <div>
          <span>Cuidadores</span>
          <strong>12</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">📋</div>
        <div>
          <span>Servicios</span>
          <strong>18</strong>
        </div>
      </div>

      <div class="card">
        <div class="card-icon">🚨</div>
        <div>
          <span>Emergencias</span>
          <strong>3</strong>
        </div>
      </div>
    </div>

    <div class="section-box">
      <div class="section-header">
        <div>
          <h3>Últimos usuarios</h3>
          <p>Vista previa de los usuarios registrados.</p>
        </div>
        <button class="secondary-button">Ver todos</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Gmail</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Malena</td>
              <td>Del Valle</td>
              <td>malena@gmail.com</td>
              <td><span class="status active-status">Activo</span></td>
            </tr>
            <tr>
              <td>Juan</td>
              <td>Pérez</td>
              <td>juan@gmail.com</td>
              <td><span class="status active-status">Activo</span></td>
            </tr>
            <tr>
              <td>María</td>
              <td>López</td>
              <td>maria@gmail.com</td>
              <td><span class="status pending-status">Pendiente</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>
