import { describe, it } from 'mocha';
import { expect } from 'chai';
import supertest from 'supertest';
import {app} from '../src/app.js';

const api = supertest(app);

describe('Sessions Router', () => {
  it('should login a user and return a JWT', async () => {
    const userCredentials = {
        username: 'admin',
        password: 'admin'
    };

    const response = await api.post('/api/sessions').send(userCredentials);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    // Agrega más validaciones según tu implementación
  });

  it('should reject login with invalid credentials', async () => {
    const credentials = {
      username: 'admin',
      password: 'wrongpassword'
    };
    const response = await api.post('/api/sessions').send(credentials);
  
    expect(response.status).to.equal(401);
  });


  it('should reject login for non-existent user', async () => {
    const credentials = {
      username: 'nonexistentuser',
      password: 'somepassword'
    };
  
    const response = await api.post('/api/sessions').send(credentials);
    expect(response.status).to.equal(401);
  });

  it('should get the current session user', async () => {
    const response = await api.get('/api/sessions/current');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
    // Agrega más validaciones según tu implementación
  });

  it('should logout the current session user', async () => {
    const response = await api.delete('/api/sessions/current');
    expect(response.status).to.equal(200);
    // Agrega más validaciones según tu implementación
  });
});