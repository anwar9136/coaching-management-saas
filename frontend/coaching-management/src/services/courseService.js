import api from "./api";

export const courseService = {
    getAll : () => api.get('/courses'),
    create: (data) => api.post('/courses',data),
    delete : (id) => api.delete(`/courses/${id}`),
    getById: (id) => api.get(`/courses/${id}`),
    update: (id, data) => api.patch(`/courses/${id}`, data)
}