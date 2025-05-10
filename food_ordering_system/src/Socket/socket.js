import {io} from 'socket.io-client';

const URL = import.meta.env.VITE_DELIVERY_SERVICE_PREFIX

export const socket = io(URL);