import axios from "axios";

// 获取当前域名协议端口号
const { protocol, hostname, port } = window.location || {};
console.log("当前域名协议端口号", protocol, hostname, port);

// nodejs服务器端口号
const NODEJS_PORT = 3000;
// 服务器网址
export const BASE_URL = `${protocol}//${hostname}:${NODEJS_PORT}`;
// 网络备案号
export const ICP = "粤ICP备2024229783号";

// 请求第三方API获取ip信息
export const getIPFun = (() => {
  // // 当前IP地址
  let IP = "";
  // // IP归属地
  let IP_LOCATION = "";
  return new Promise((resolve, reject) => {
    try {
      axios
        .get("https://api.ipify.org?format=json")
        .then(({ data }) => {
          let { ip } = data || {};
          if (ip) {
            IP = ip;
            axios
              .get(`https://ipapi.co/${ip}/json/`)
              .then((response) => {
                let { country, city, region } = response?.data || {};
                IP_LOCATION = `${country} . ${region} . ${city}`;
                resolve({
                  IP,
                  IP_LOCATION,
                });
              })
              .catch((error) => {
                reject({ error });
              });
          }
        })
        .catch((error) => {
          reject({ error });
        });
    } catch (error) {
      reject({ error });
    }
  });
})();
