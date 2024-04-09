import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import {app} from '../src/app.js';

const api = supertest(app);

describe('Productos Router', () => {
  it('should get a list of products', async () => {
    const response = await api.get('/api/productos');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    
  });

  it('should get a list of categories', async () => {
    const response = await api.get('/api/productos/cat');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    
  });

  it('should get a specific product by ID', async () => {
    const productId = 'a4d45713-9694-4a37-a8e9-933f324c712c'; // Reemplaza con un ID válido
    const response = await api.get(`/api/productos/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    
  });

  it('should create a new product', async () => {
    const newProduct = {
        title: 'Fuente Alimentacion Gadnic 30V 5A',
        description: 'Fuente de alimentación de laboratorio Gadnic 30v 5A',
        code: 'ACB234',
        price: 100000,
        status: true,
        stock: 20,
        category: 'Electrónica',
        thumbnail: 'sin imagen',
        owner: '9543a7b6-fe07-4447-b787-8fb4e38c0ddf'
    };

    const response = await api.post('/api/productos').send(newProduct);
    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    // Agrega más validaciones según tu implementación
  });

  it('should update a product by ID', async () => {
    const productId = 'ced276fa-a63a-4ccd-8252-2c33a2346d31'; // Reemplaza con un ID válido
    const updatedProduct = {
        title: 'Placa Elelctrónica ESP8266',
        description: 'Placa de desarrollo electrónica con modulo de wifi',
        code: 'ACB3',
        price: '10000',
        status: 'true',
        stock: 11,
        category: 'Placas de desarrollo electronicas',
        thumbnail: 'sin imagen',
        owner: '9543a7b6-fe07-4447-b787-8fb4e38c0ddf'
    };

    const response = await api.put(`/api/productos/${productId}`).send(updatedProduct);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    
  });

  it('should delete a product by ID', async () => {
    const productId = 'a4d45713-9694-4a37-a8e9-933f324c712c'; // Reemplaza con un ID válido
    const response = await api.delete(`/api/productos/${productId}`);
    expect(response.status).to.equal(200);
    
  });
});