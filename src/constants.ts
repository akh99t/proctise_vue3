// 获取当前域名协议端口号
const { protocol, hostname, port } = window.location || {}

// nodejs服务器端口号
const NODEJS_PORT = 3000
// 服务器网址
export const BASE_URL = `${protocol}//${hostname}:${NODEJS_PORT}`;