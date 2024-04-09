window.addEventListener('load', async () => {
  const response = await fetch('/api/users/current')
  if (response.status !== 200) {
    alert('necesitas loguearte para ver esta info!')
    return (window.location.href = '/login')
  }

  const result = await response.json()
  const user = result.payload

  /*Swal.fire({
    title: "Sesion iniciada!",
    icon: "success",
    color: "write",
    text: `Hola, ${user.first_name} ${user.last_name} `
  });*/
})

const rutaFetchUsers = 'http://localhost:8080/api/users/'
const qryFetchUsers = {
  limite: 10,
  pagina: 1,
  orden: false
}


function getUsers() {
  fetch(rutaFetchUsers)
    .then(resp => resp.json())
    .then(data => {
      console.log(data);
      const targetDOM = document.getElementById('contenedorUsuarios')
      targetDOM.innerHTML = '';
      for (const el of data.payload) {
        const newElement = document.createElement('tr');
        newElement.innerHTML = `
                  <th scope="row">${el.first_name}</th>
                  <td id="email_${el._id}">${el.email}</td>
                  <td id="rol_${el._id}">${el.rol}</td>
                  <td style="text-align: center">
                    <button type="button" class="btn btn-success" onclick="modifyRolUsers('${el._id}')">Modificar</button>
                  </td>
                  `;
        targetDOM.appendChild(newElement);
      }
      
      let opcionesPaginacionUsers = {
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        nextPage: data.nextPage,
        prevPage: data.prevPage,
        prevLink: data.prevLink,
        nextLink: data.nextLink
      }
      console.log(opcionesPaginacionUsers)
      navSetupUsers(opcionesPaginacionUsers)

    })
    
}

async function navSetupUsers(opcionesPaginacionUsers) {
  const { page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, prevLink, nextLink } = await opcionesPaginacionUsers
  const targetDOM = document.getElementById('paginacionUsers')
  targetDOM.addEventListener('click', pageMoveUsers)
  targetDOM.innerHTML = ''
  let contentDOM
  // PrevPage
  const prevPageDisabled = (hasPrevPage) ? { status: '', goto: 'm' + prevPage } : { status: 'disabled', goto: 'none' }
  const nextPageDisabled = (hasNextPage) ? { status: '', goto: 'm' + nextPage } : { status: 'disabled', goto: 'none' }
  contentDOM = `<li class="page-item ${prevPageDisabled.status}">
                 <a class="page-link" href='#' id=${prevPageDisabled.goto}>Anterior</a>
                 </li>
                 `
  targetDOM.innerHTML += contentDOM
  for (i = 1; i <= totalPages; i++) {
    const actualPage = (page === i) ? 'active' : ''
    const id = 'p' + i
    contentDOM = `
        <li class="page-item"> <a class="page-link ${actualPage}" href="#" id='${id}' name='pageRef'>${i}</a></li>
        `
    targetDOM.innerHTML += contentDOM
  }
  contentDOM = `<li class="page-item ${nextPageDisabled.status}">
    <a class="page-link" href='#' id=${nextPageDisabled.goto}>Siguiente</a>
    </li>
    `
  targetDOM.innerHTML += contentDOM

}

function pageMoveUsers(e) {
  const pagina = e.target.id.substring(1)
}


function addProduct() {
  // Obtener los valores del formulario
  const title = document.getElementById('titulo').value;
  const description = document.getElementById('descripcion').value;
  const code = document.getElementById('codigo').value;
  const price = document.getElementById('precio').value;
  const status = document.getElementById('status').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('categoria').value;

  // Crear un objeto con los datos del producto
  const productData = {
    title,
    description,
    code,
    price,
    status,
    stock,
    category
  };

  // Realizar una solicitud de fetch para agregar el producto
  fetch('api/productos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  })
    .then(resp => resp.json())
    .then(data => {
      console.log('Producto agregado:', data);
      Swal.fire({
        title: "Producto Agregado!",
        icon: "success",
        color: "write",
      });
      setTimeout(() => {
        window.location.href = '/addProducts';
      },'3000');
    })
    .catch(error => {
      console.error('Error al agregar el producto:', error);

    });
}


const buttonLogout = document.getElementById('logout')

buttonLogout?.addEventListener('click', async event => {
  event.preventDefault()

  try {
    const res = await fetch(
      '/api/sessions/current',
      {
        method: 'DELETE',
      },
    )
    // Verificar si la solicitud fue exitosa (código de respuesta 2xx)
    if (res.ok) {
      // Redirigir a la nueva página
      window.location.href = '/login'
    } else {
      // Manejar otros casos si es necesario
      console.log('La solicitud no fue exitosa. Código de respuesta:', res.status)
    }

  } catch (err) {
    console.log(err.message)
  }
})


const rutaFetch = 'http://localhost:8080/api/productos/'
const qryFetch = {
  limite: 10,
  pagina: 1,
  orden: false
}
const stringFetch = rutaFetch

prepareFront()

getProducts('')

getUsers()

document.getElementById('applyFilter').addEventListener('click', setFilters)

function getProducts(filtros) {
  fetch(rutaFetch + filtros)
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      const targetDOM = document.getElementById('contenedorProductos')
      targetDOM.addEventListener('click', deleteProduct)
      targetDOM.innerHTML = ''
      for (el of data.payload) {
        const newElement = document.createElement('tr')
        newElement.innerHTML = `
                  <th scope="row">${el.title}</th>
                  <td>${el.description}</td>
                  <td>${el.category}</td>
                  <td style="text-align: right">${el.price}</td>
                  <td style="text-align: right">${el.stock}</td>
                  <td style="text-align: center">
                  <button type="button" class="btn btn-success" id="${el._id}">delete</button>
                  </td>
                  `
        targetDOM.appendChild(newElement)
      }

      let opcionesPaginacion = {
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        nextPage: data.nextPage,
        prevPage: data.prevPage,
        prevLink: data.prevLink,
        nextLink: data.nextLink
      }
      console.log(opcionesPaginacion)
      navSetup(opcionesPaginacion)

    })
}

async function navSetup(opcionesPaginacion) {
  const { page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage, prevLink, nextLink } = await opcionesPaginacion
  const targetDOM = document.getElementById('navBar')
  targetDOM.addEventListener('click', pageMove)
  targetDOM.innerHTML = ''
  let contentDOM
  // PrevPage
  const prevPageDisabled = (hasPrevPage) ? { status: '', goto: 'm' + prevPage } : { status: 'disabled', goto: 'none' }
  const nextPageDisabled = (hasNextPage) ? { status: '', goto: 'm' + nextPage } : { status: 'disabled', goto: 'none' }
  contentDOM = `<li class="page-item ${prevPageDisabled.status}">
                 <a class="page-link" href='#' id=${prevPageDisabled.goto}>Anterior</a>
                 </li>
                 `
  targetDOM.innerHTML += contentDOM
  for (i = 1; i <= totalPages; i++) {
    const actualPage = (page === i) ? 'active' : ''
    const id = 'p' + i
    contentDOM = `
        <li class="page-item"> <a class="page-link ${actualPage}" href="#" id='${id}' name='pageRef'>${i}</a></li>
        `
    targetDOM.innerHTML += contentDOM
  }
  contentDOM = `<li class="page-item ${nextPageDisabled.status}">
    <a class="page-link" href='#' id=${nextPageDisabled.goto}>Siguiente</a>
    </li>
    `
  targetDOM.innerHTML += contentDOM

}

function pageMove(e) {
  const pagina = e.target.id.substring(1)
  if (pagina) {
    setFilters(e, pagina)
  }
}

function prepareFront() {
  fetch('http://localhost:8080/api/productos/cat/')
    .then(resp => resp.json())
    .then(data => {
      const targetCombo = document.getElementById('comboCategorias')
      targetCombo.innerHTML = ''
      const defaultOption = document.createElement('option')
      defaultOption.value = ''; defaultOption.text = ''; defaultOption.selected = true; defaultOption.disable = true; defaultOption.hidden = true
      targetCombo.append(defaultOption)
      for (el of data) {
        const newOption = document.createElement('option')
        newOption.value = el._id
        newOption.text = el._id
        targetCombo.append(newOption)
      }
    })
  const comboPages = document.getElementById('comboPages')
  comboPages.innerHTML = ''
  const optionPages = document.createElement('option')
  optionPages.value = ''; optionPages.text = ''; optionPages.selected = true; optionPages.disable = true; optionPages.hidden = true
  comboPages.append(optionPages)
  const optionPages1 = document.createElement('option'); optionPages1.value = 3; optionPages1.text = 3
  comboPages.append(optionPages1)
  const optionPages2 = document.createElement('option'); optionPages2.value = 5; optionPages2.text = 5
  comboPages.append(optionPages2)
  const optionPages3 = document.createElement('option'); optionPages3.value = 10; optionPages3.text = 10
  comboPages.append(optionPages3)

  const comboSort = document.getElementById('comboOrden')
  comboSort.innerHTML = ''
  const optionSort = document.createElement('option')
  optionSort.value = ''; optionSort.text = ''; optionSort.selected = true; optionSort.disable = true; optionSort.hidden = true
  comboSort.append(optionSort)
  const optionSort1 = document.createElement('option')
  optionSort1.value = 'asc'; optionSort1.text = 'Ascendente'
  comboSort.append(optionSort1)
  const optionSort2 = document.createElement('option')
  optionSort2.value = 'desc'; optionSort2.text = 'Descendente'
  comboSort.append(optionSort2)

}

function setFilters(e, page) {
  if (!page) page = 1
  const pagesPerViewDOM = document.getElementById('comboPages')
  const pagesPerView = pagesPerViewDOM.options[pagesPerViewDOM.selectedIndex].text
  const categoryPerViewDOM = document.getElementById('comboCategorias')
  const categoryPerView = categoryPerViewDOM.options[categoryPerViewDOM.selectedIndex].text
  const orderPerViewDOM = document.getElementById('comboOrden')
  const orderPerView = orderPerViewDOM.options[orderPerViewDOM.selectedIndex].value
  const validaFiltro = (pagesPerView || categoryPerView || orderPerView || page) ? '?' : false
  const optFiltro = []
  if (validaFiltro) {
    if (pagesPerView) { optFiltro.push(`itemsPorPagina=${pagesPerView}`) }
    if (orderPerView) { optFiltro.push(`order=${orderPerView}`) }
    if (categoryPerView) { optFiltro.push(`filtro=${categoryPerView}`) }
    if (page) { optFiltro.push(`pagina=${page}`) }
  }
  const strFiltro = '?' + optFiltro.join('&')
  console.log(strFiltro)
  getProducts(strFiltro)

}

async function deleteProduct(e) {
  const idProducto = e.target.id
  console.log(idProducto)

  if (!idProducto) { return }
  const rutaFetch = `http://localhost:8080/api/productos/${idProducto}`
  const res = await fetch(rutaFetch,
    {
      method: "DELETE",
    }
  )

  if (res.status == 200) {

    Swal.fire({
      title: "Producto eliminado!",
      icon: "success",
      color: "write"
    });
    setTimeout(() => {
      window.location.href = '/addProducts';
    },'1000');

  } else {
    Swal.fire({
      title: "Fallo de inicio",
      icon: "error",
      color: "write",
      text: "El producto no pudo ser eliminado!"
    });
    alert('No se pudo eliminar el producto!')
  }

}

document.getElementById('btnDelete').addEventListener('click', deleteInactiveUsers);

async function deleteInactiveUsers() {
  try {
    const res = await fetch('http://localhost:8080/api/users', {
      method: 'DELETE'
    });

    if (res.ok) {
      Swal.fire({
        title: 'Usuarios eliminados por inactividad',
        icon: 'success',
        color: 'write'
      });
      setTimeout(() => {
        window.location.href = '/addProducts';
      },'3000');
    } else {
      throw new Error('Error al eliminar usuarios inactivos');
    }
  } catch (error) {
    console.error(error);
    Swal.fire({
      title: 'Fallo de inicio',
      icon: 'error',
      color: 'write',
      text: 'No se pudieron eliminar los usuarios inactivos'
    });
  }
}



function modifyRolUsers(userId) {
  const rolElement = document.getElementById(`rol_${userId}`);
  const currentRol = rolElement.innerText;
  rolElement.innerHTML = `
      <select id="rolSelect_${userId}">
          <option value="user" ${currentRol === 'user' ? 'selected' : ''}>Usuario</option>
          <option value="admin" ${currentRol === 'admin' ? 'selected' : ''}>Administrador</option>
          <option value="premium" ${currentRol === 'premium' ? 'selected' : ''}>Premium</option>
      </select>
      <button type="button" onclick="saveRolChanges('${userId}')">Guardar</button>
      <button type="button" onclick="cancelRolChanges('${userId}', '${currentRol}')">Cancelar</button>
  `;
}

function saveRolChanges(userId) {
  const selectedRol = document.getElementById(`rolSelect_${userId}`).value;

  const data = {
      userId: userId,
      newRol: selectedRol
  };
  console.log(data)

  fetch('http://localhost:8080/api/users/modifyUserRol/', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (response.ok) {
              const rolElement = document.getElementById(`rol_${userId}`);
              rolElement.innerText = selectedRol;
              Swal.fire({
                  title: "Rol de usuario modificado!",
                  icon: "success",
                  color: "write"
              });
          } else {
              throw new Error('Error al actualizar el rol del usuario');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          Swal.fire({
              title: "Fallo de inicio",
              icon: "error",
              color: "write",
              text: "El rol del usuario no pudo ser modificado!"
          });
      });
}

function cancelRolChanges(userId, currentRol) {
  const rolElement = document.getElementById(`rol_${userId}`);
  rolElement.innerText = currentRol;
}




  


  