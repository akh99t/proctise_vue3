import axios from "axios";
import { axiosFun } from "@/plugins/axiosFun";
import { ElMessage } from "element-plus";

// 请求AI数据
export const thirdPartyTransferAI = (content = "", parameter = {}) => {
  const requestData = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content }],
    ...parameter,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer sk-kIGNkbPVPeb3Vo6Q5vpr4wv2Pq9OQ661bZVV7bf67hOF0Klr",
  };

  return new Promise((resolve, reject) => {
    let chatInterface = axios.post(
      "https://api.chatanywhere.com.cn/v1/chat/completions",
      requestData,
      { headers }
    );

    chatInterface
      .then((value) => {
        let { status, data } = value;
        if (status === 200) {
          resolve(data.choices || []);
        } else {
          reject({ message: "未知错误, 请稍后重试或找网管!" });
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// 获取问答限制次数与可用次数
export const fetchQALimitAndAvailability = async (userName: string) => {
  let { code, data, message } = await axiosFun(
    "/openAI/fetchQALimitAndAvailability",
    "get",
    { userName }
  );
  if (code === 200) {
    return data;
  } else {
    ElMessage.warning(message);
    return false;
  }
};

// 上传对话数据
export const uploadConversationData = async (
  userName: string,
  qaRecord: { Q: string; A: { [key: string]: any }[]},
  userID: string,
) => {
  let { code, data, message } = await axiosFun(
    "/openAI/saveAIQARecord",
    "post",
    { userName, dataJSON: JSON.stringify(qaRecord), userID }
  );
};
