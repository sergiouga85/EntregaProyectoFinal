import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { randomUUID } from 'crypto';
import { hasheadasSonIguales, hashear } from '../utils/criptografia.js';
import {productDao} from '../dao/index.js'

const schema = new Schema({
  _id: { type: String, default: randomUUID },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  rol: { type: String, default: 'user' },
  lastConnection: { type: Date, default: Date.now } 
}, {
  versionKey: false,
  strict: 'throw'
});

schema.plugin(mongoosePaginate);

export const usersModel = model('users', schema);


//-----------------------------------------------------------



export class usersDAO  {

  async createUser(userData) {
    try {
      userData._id = randomUUID()
      userData.password = hashear(userData.password)
      const user = await usersModel.create(userData)
      return user.toObject()
    } catch (error) {
      console.error('Error creating user:', error)
      throw error // Lanzar el error real para que se maneje adecuadamente
    }
  };

   // Obtener todos los productos paginados
   async paginado(filtro, opciones){
    try {
        const paginado= await usersModel.paginate(filtro, opciones);
        return paginado   
    } catch (error) {
        throw new Error(`Error al obtener los usuarios paginados: ${error.message}`);
    }
};

  async readOne(criteria) {
    const result = await usersModel.findOne(criteria).lean()
    if (!result) throw new Error('NOT FOUND')
    return result
  }


  deleteMany(criteria) {
    return Promise.reject(new Error('NOT IMPLEMENTED: usersDao::deleteMany'))
  }

  async findUserByUsername  ({username, password}){
    try {
        const user = await usersModel.findOne({ username })
        if (!user) { throw new Error('authentication error') }
        if (!hasheadasSonIguales({
          recibida: password,
          almacenada: user.password
        })) {
          throw new Error('authentication error')
        }
        return user.toObject() 
    } catch (error) {
      throw new Error('Error finding user by username');
    }
  };

  async findAllUsers (){
    try {
      return await usersModel.find({}, { password: 0 }).lean();
    } catch (error) {
      throw new Error('Error finding user by username');
    }
  };

  async findInactiveUsers(timeLimit) {
    try {
      return await usersModel.find(
        { lastConnection: { $lt: timeLimit },
          rol:{ $ne:'admin' }
       }).lean();
    } catch (error) {
      throw new Error('Error finding inactive users');
    }
  }
  
  async  modifyRol(userId, newRol) {
    try {
        // Aquí deberías tener una lógica para buscar al usuario por su nombre de usuario
        const user = await usersModel.findById(userId );

        // Si el usuario no existe, lanzamos un error
        if (!user) {
            throw new Error(`El usuario ${userId} no existe.`);
        }

        // Actualizamos el rol del usuario
        user.rol = newRol;

        // Guardamos los cambios en la base de datos
        await user.save();

        console.log(`Se ha modificado el rol de ${userId} a ${newRol}.`);
    } catch (error) {
        console.error('Error al modificar el rol del usuario:', error.message);
    }
  }

  async findByIdUser(usuarioId) {
    try {
      // Verificar si el usuario es admin o premium antes de permitir la modificación
      const usuario = await usersModel.findById(usuarioId);
      return usuario
    } catch (error) {
      console.error(error.message);
      throw new Error('Error finding user by email');
    }
  }

  async deleteUser(userId) {
    try {
        // Eliminar el usuario de la base de datos
        await usersModel.findByIdAndDelete(userId);
        console.log(`Se ha eliminado el usuario ${userId} de la base de datos.`);
    } catch (error) {
        console.error('Error al eliminar el usuario:', error.message);
        throw error; // Re-lanzar el error para que pueda ser manejado en la capa superior si es necesario
    }
  }

  async obtenerPropietarioProducto(productoId) {
    try {
        // Buscar el producto por su ID y obtener su propietario
        const producto = await productDao.obtenerProductoPorId(productoId);
        
        if (!producto) {
            throw new Error(`El producto con id ${productoId} no se encontró`);
        }

        // Obtener el propietario del producto
        const propietarioId = producto.owner;

        // Buscar al propietario en la base de datos
        const propietario = await usersModel.findById(propietarioId);

        if (!propietario) {
            throw new Error(`El propietario del producto con id ${productoId} no se encontró`);
        }

        return propietario;
    } catch (error) {
        throw new Error(`Error al obtener el propietario del producto: ${error.message}`);
    }
  }


}
