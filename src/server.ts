import express from 'express';

import './database';

const app = express();

app.get('/', (request, response) => {
  return response.json({ Hello: 'World' });
});

app.post('/users', (request, response) => {
  return response.json({ message: 'Usuário cadastrado com sucesso!' });
});

app.listen(3333, () => console.log('Server is running on port 3333'));
