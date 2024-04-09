import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import {app} from '../src/app.js';

const api = supertest(app);

describe('Carts Router', () => {
  it('should get a list of carts', async () => {
    const response = await api.get('/api/carts');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
    
  });

  it('should get a specific cart by ID', async () => {
    const cartId = '9480bffd-7039-4079-8819-3e7785a6b564'; // Reemplaza con un ID válido
    const response = await api.get(`/api/carts/${cartId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    
  });

  it('should create a new cart', async () => {
    const response = await api.post('/api/carts');
    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    
  });

  it('should update the quantity of a product in the cart', async () => {
    const cartId = '9480bffd-7039-4079-8819-3e7785a6b564'; // Reemplaza con un ID válido
    const productId = '8f783597-aeec-42d4-8239-123d695586c3'; // Reemplaza con un ID de producto válido
    const updatedQuantity = 3; // Reemplaza con la cantidad actualizada

    const response = await api.put(`/api/carts/${cartId}/producto/${productId}`).send({ quantity: updatedQuantity });
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    
  });

  it('should add a product to the cart', async () => {
    const cartId = '7e2fb118-1e17-4ad8-8b33-85c50930c9cf'; // Reemplaza con un ID válido
    const productId = '8f783597-aeec-42d4-8239-123d695586c3'; // Reemplaza con un ID de producto válido

    const response = await api.put(`/api/carts/${cartId}/add/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    
  });

  it('should delete a cart', async () => {
    const cartId = '9480bffd-7039-4079-8819-3e7785a6b564'; // Reemplaza con un ID válido
    const response = await api.delete(`/api/carts/${cartId}`);
    expect(response.status).to.equal(200);
    
  });

  it('should delete a product from the cart', async () => {
    const cartId = '7e2fb118-1e17-4ad8-8b33-85c50930c9cf'; // Reemplaza con un ID válido
    const productId = 'ced276fa-a63a-4ccd-8252-2c33a2346d31'; // Reemplaza con un ID de producto válido

    const response = await api.delete(`/api/carts/${cartId}/producto/${productId}`);
    expect(response.status).to.equal(200);
    
  });

  it('should purchase the cart', async () => {
    const cartId = '9480bffd-7039-4079-8819-3e7785a6b564'; // Reemplaza con un ID válido
    const response = await api.post(`/api/carts/${cartId}/purchase`);
    expect(response.status).to.equal(200);
    
  });
});