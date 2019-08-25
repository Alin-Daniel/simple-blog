import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://mini-blog-c3c8a.firebaseio.com/'
});

export default instance;