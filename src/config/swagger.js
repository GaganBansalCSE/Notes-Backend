const openApi = {
  openapi: '3.0.3',
  info: {
    title: 'Notes Backend API',
    version: '1.0.0',
    description: 'Production-grade multi-user notes SaaS backend'
  },
  servers: [{ url: '/' }],
  paths: {
    '/register': { post: { summary: 'Register user' } },
    '/login': { post: { summary: 'Login user' } },
    '/refresh-token': { post: { summary: 'Refresh access token' } },
    '/logout': { post: { summary: 'Logout user' } },
    '/notes': { get: { summary: 'List notes' }, post: { summary: 'Create note' } },
    '/notes/{id}': { get: { summary: 'Get note' }, put: { summary: 'Update note' }, delete: { summary: 'Delete note' } },
    '/notes/{id}/share': { post: { summary: 'Share note as read-only' } },
    '/notes/{id}/history': { get: { summary: 'Get note history' } },
    '/notes/{id}/restore/{versionId}': { post: { summary: 'Restore a note version' } },
    '/search': { get: { summary: 'Full-text search notes' } },
    '/about': { get: { summary: 'Service metadata' } },
    '/openapi.json': { get: { summary: 'OpenAPI schema' } }
  }
};

module.exports = { openApi };
