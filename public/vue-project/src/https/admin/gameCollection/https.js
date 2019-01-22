const axios = require('axios');
const store = require('../../../store.js');
const http = store.default.state.api;

axios.defaults.withCredentials = true;    //跨域请求携带cookie

module.exports = {
    editGameCollection(data) {
        return axios.post(http + '/admin/editGameCollection', data)
            .then(res => res).catch(e => e)
    },
    deleteGameCollection(data) {
        return axios.post(http + '/admin/deleteGameCollection', data)
            .then(res => res).catch(e => e)
    },
    queryGameCollection() {
        return axios.post(http + '/admin/queryGameCollection')
            .then(res => res).catch(e => e)
    }

}