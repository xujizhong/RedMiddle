import axios from 'axios';
import store from '../../store.js';
const http = store.state.api;
axios.defaults.withCredentials = true;    //跨域请求携带cookie

export default {
    //更新基本信息
    updateProfile(postData) {
        return axios.post(http + `/updateProfile`,postData)
            .then(res => res).catch(e => e)
    },
    //更新基本信息
    updateAccount(postData) {
        return axios.post(http + `/updateAccount`,postData)
            .then(res => res).catch(e => e)
    },
}