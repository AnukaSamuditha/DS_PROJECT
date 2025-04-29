import {io} from 'socket.io-client';

const URL = import.meta.env.VITE_BACKEND_PREFIX
console.log("url",URL)

export const socket = io(URL);