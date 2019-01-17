// const axios = require('axios');
// const store = require('../../store.js');
import axios from 'axios';
import store from '../../store.js';
const http = store.state.api;
axios.defaults.withCredentials = true;    //跨域请求携带cookie

export default {
    //获取游戏数据
    getSingleGameData(englishName) {
        return axios.get(http + `/getSingleGameData/${englishName}`)
            .then(res => res).catch(e => e)
    },
    //获取游戏post
    getSingleGamePosts(postData){
        return axios.post(http + `/getSingleGamePosts`,postData)
            .then(res => res).catch(e => e)
    },
    //发表新帖
    sendNewPost(postData) {
        return axios.post(http + '/sendNewPost', postData)
            .then(res => res).catch(e => e)
    },
    //获取post回复
    getPostReply(postData){
        return axios.post(http + `/getPostReply`,postData)
            .then(res => res).catch(e => e)
    },
    //发表新帖
    sendNewReply(replyData) {
        return axios.post(http + '/sendNewReply', replyData)
            .then(res => res).catch(e => e)
    },
}