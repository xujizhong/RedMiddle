import axios from 'axios';
import store from '../../store.js';
const http = store.state.api;
axios.defaults.withCredentials = true;    //跨域请求携带cookie

export default {
    //获取file url
    getFileUrl(postData) {
        return axios.post(http + `/getFileUrl`,postData)
            .then(res => res).catch(e => e)
    },
}