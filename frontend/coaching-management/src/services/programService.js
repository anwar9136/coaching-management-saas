import api from "./api";

export const programService = {
    getAll:   ()         => api.get('/programs'),
    getById:  (id)       => api.get(`/programs/${id}`),
    create:   (data)     => api.post('/programs', data),
    update:   (id, data) => api.patch(`/programs/${id}`, data),
    delete:   (id)       => api.delete(`/programs/${id}`),
}
