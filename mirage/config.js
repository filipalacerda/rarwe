import { createServer } from 'miragejs';
export default function (config) {
  let finalConfig = {
    ...config,
    models: config.models,
    routes,
  };
  return createServer(finalConfig);
}
function routes() {
  this.get('/bands');
  this.get('/bands/:id');
}
