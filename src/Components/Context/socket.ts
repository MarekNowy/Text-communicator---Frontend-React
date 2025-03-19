import { io } from 'socket.io-client';

const URL = 'http://localhost:3000';
let socket:any = null;

export const createSocket = (token: string) => {
    if (!socket) {
        socket = io(URL, { query: { token } });
    }
    return socket;
};

export const getSocket = () => {
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};