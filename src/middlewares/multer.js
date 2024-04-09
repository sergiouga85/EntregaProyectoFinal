
// Importar las bibliotecas necesarias
import  express from 'express';
import multer from 'multer';

// Crear el almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'profileImage') {
      cb(null, 'uploads/profiles/');
    } else if (file.fieldname === 'productImage') {
      cb(null, 'uploads/products/');
    } else {
      cb(null, 'uploads/documents/');
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Crear la instancia de Multer
export const upload = multer({ storage: storage });

// Aquí deberías exportar upload si necesitas usarlo en otro archivo.
