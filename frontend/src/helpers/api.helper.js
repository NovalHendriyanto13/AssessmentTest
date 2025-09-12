import axios from 'axios'
import appConfig from '../configs/app.config'

const instance = axios.create({
    baseURL: appConfig.api_url,
    headers: {
        "Content-Type": "application/json"
    }
});

export default {
    get: async (url, config = {}) => (await instance.get(url, config)).data,
    post: async (url, data = {}, config = {}) => (await instance.post(url, data, config)).data,
    put: async (url, data = {}, config = {}) => (await instance.put(url, data, config)).data,
    delete: async (url, config = {}) => (await instance.delete(url, config)).data,
}
