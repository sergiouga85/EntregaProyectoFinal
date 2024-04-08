import { usersDao } from '../dao/index.js';
import { appendJwtAsCookie } from './authentication.business.js';
import { UserDTO } from '../dto/userDto.js';
import { emailService } from '../services/email.service.js'

// Registrar un nuevo usuario
export const registerUser = async (req, res, next) => {
  try {
    // Llama a appendJwtAsCookie con los parámetros correctos
    await appendJwtAsCookie(req, res, next);
    res.successfullPost(req.user);
  } catch (error) {
    next(error);
  }
}


// Obtener información del usuario actual
export const getCurrentUser = async (req, res, next) => {
  try {
    // Crea un DTO del usuario con la información necesaria
    const userDTO = new UserDTO(req.user);
    res.successfullGet(userDTO);
  } catch (error) {
    next(error);
  }
}

// Obtener todos los usuarios (requiere rol de admin)
export const getAllUsers = async (req, res, next) => {
  try {
    // Verifica la autorización del usuario
    const usuarios = await usersDao.findAllUsers();
    res.successfullGet(usuarios);
  } catch (error) {
    next(error);
  }
};

export const getDataUsers = async (req, res, next) => {
  try { 
    const usuarios = await usersDao.findAllUsers();
    // Mapear los datos principales de los usuarios
    const simplifiedUsers = usuarios.map(user => ({
      name: user.first_name,
      email: user.email,
      rol: user.rol
    }));
    res.successfulGet(simplifiedUsers); // Suponiendo que res.successfulGet es un método para enviar una respuesta exitosa
  } catch (error) {
    next(error);
  }
};


export const deleteInactiveUsers = async (req, res, next) => {
  try {
    const tiempoLimite = new Date(Date.now() - 30 * 60 * 1000); // Últimos 30 minutos para prueba
    const usuariosInactivos = await usersDao.findInactiveUsers(tiempoLimite);
    // Aquí puedes realizar acciones adicionales con los usuarios inactivos, como enviar correos electrónicos
    
    usuariosInactivos.forEach(async (user) => {
      await emailService.send(
        user.email,
        'Hola',
        'Le informamos que su cuenta ha sido eliminada por inactividad!',
      );
    });
    // Por ahora, solo imprimiré en la consola los usuarios inactivos encontrados
    console.log('Usuarios inactivos encontrados:', usuariosInactivos);
    res.json({ mensaje: 'Usuarios inactivos encontrados.', usuariosInactivos });
  } catch (error) {
    next(error);
  }
};

export const modifyUserRole = async (req, res, next) => {
  const { userId, newRol } = req.body; // Suponiendo que los datos del usuario y el nuevo rol se envían en el cuerpo de la solicitud
  console.log(req.body)
  try {
      await usersDao.modifyRol(userId , newRol); // Llamar a la función modifyRol del usersDao
      res.status(200).json({ message: `Rol del usuario ${userId} modificado correctamente a ${newRol}` });
  } catch (error) {
      next(error); // Pasar el error al siguiente middleware para su manejo
  }
};



export const obtenerUsuarios = async (req, res) =>{
  try {
      let opciones = {}
      const filtro = (!req.query.filtro) ?  '' : { category: req.query.filtro }
      const itemsPorPagina = (!req.query.itemsPorPagina) ? opciones = { limit: 10, ...opciones } : opciones = { limit: req.query.itemsPorPagina, ...opciones }
      const pagina = (!req.query.pagina) ? opciones = { page: 1, ...opciones } : opciones = { page: req.query.pagina, ...opciones }
      const orden = (!req.query.order) ? '' : opciones = { sort: { 'price': req.query.order }, ...opciones }
      console.log(opciones)
      const paginado = await usersDao.paginado(filtro, opciones)
      console.log(paginado)
      const resoults = {
          status: 'success',
          payload: paginado.docs,
          totalPages: paginado.totalPages,
          prevPage: paginado.prevPage,
          nextPage: paginado.nextPage,
          page: paginado.page,
          hasPrevPage: paginado.hasPrevPage,
          hasNextPage: paginado.hasNextPage,
          prevLink: '',
          nextLink: ''
      }

      res.json(resoults)
  
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}



