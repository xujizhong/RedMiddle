const axios = require('axios');
const store = require('../../../store.js');
const http = store.default.state.api;

axios.defaults.withCredentials = true;    //跨域请求携带cookie

module.exports = {
    editGameType(data) {
        return axios.post(http + '/admin/editGameType',data)
            .then(res => res).catch(e => e)
    },
    deleteGameType(data) {
        return axios.post(http + '/admin/deleteGameType',data)
            .then(res => res).catch(e => e)
    },
    queryGameType() {
        return axios.post(http + '/admin/queryGameType')
            .then(res => res).catch(e => e)
    }

}