
import api from "./api";

export const lectureService = {
    getAll : () => api.get('/lectures'),
    create : (data) => api.post('/lectures', data),
    update : (id, data) => api.patch(`/lectures/${id}`, data),
    delete : (id) => api.delete(`/lectures/${id}`),
    getMyLectures : () => api.get('/lectures/my-lectures'),
    getById: (id) => api.get(`/lectures/${id}`)
}





