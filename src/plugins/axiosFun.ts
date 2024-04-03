import axios from "axios";
import { ElMessage } from "element-plus";

const api = axios.create({
  baseURL: "http://127.0.0.1:3000", // 基础URL
  timeout: 10000, // 请求超时时间
});

// localStorage保存用户数据
export const saveUserDataToLocalStorage = function (data: {
  [key: string]: string;
}) {
  let { session } = data || {};
  if (session) {
    let obj = {
      ...data,
      session: JSON.parse(session),
    };
    localStorage.setItem("user", JSON.stringify(obj));
  } else {
    localStorage.removeItem("user");
  }
};

export const axiosFun = async (
  url: string,
  method: string = "get",
  parameters: {
    [key: string]: any;
  } = {}
) => {
  try {
    if ( !parameters?._id  ) {
      let userJSON = JSON.parse(localStorage.getItem('user') || '{}')
      parameters._id = userJSON._id || ''
      parameters.userName = parameters.userName || userJSON?.session?.user
    }

    let configuration = {
      // withCredentials: true,
      /**
       * 不使用 HTTPS 连接，在浏览器中自动保存接口返回的 Cookie 将会遇到一些限制，因为浏览器通常只在安全连接上保存 Cookie。
       * 可能会受到浏览器的限制或安全策略的影响，并不是一种通用的解决方案。在安全性方面，始终建议使用 HTTPS 连接来保护用户的数据和隐私。
       */
    };
    let Response;
    if (method === "get") {
      Response = await api.get(url, { params: parameters });
    }
    if (method === "post") {
      Response = await api.post(url, parameters, configuration);
    }

    if (Response && Response.data) {
      return Response.data;
    } else {
      return null;
    }
  } catch (error) {
    ElMessage.error("出现了意料之外的错误, 找网管吧!");
  }
};
