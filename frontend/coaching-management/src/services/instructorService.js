import api from "./api";

export const instructorService = {
    create:     (data)     => api.post('/instructors', data),
    getAll:     ()         => api.get('/instructors'),
    getPending: ()         => api.get('/instructors/pending'),
    approve:    (userId)   => api.post('/instructors/approve', { userId }),
    reject:     (userId)   => api.post('/instructors/reject',  { userId }),
    delete:     (id)       => api.delete(`/instructors/${id}`),
    getDetails: (id)       => api.get(`/instructors/${id}/details`),
    update:     (id, data) => api.patch(`/instructors/${id}`, data),
}




