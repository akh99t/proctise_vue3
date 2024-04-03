import { axiosFun } from "./axiosFun";
// 验证用户凭证
export const checkUserCredentials = async () => {
  let user = localStorage.getItem("user");
  if (user) {
    let userCredentials = JSON.parse(user);
    let { _id, session } = userCredentials || {};
    if (_id) {
      let { data } = await axiosFun("/login/validateUserCredentials", "post", {
        _id,
      });
      if (data && data._id === _id) {
        return { _id, user: session?.user || "--" };
      }
    }
    localStorage.removeItem("user");
    return false;
  } else {
    localStorage.removeItem("user");
    return false;
  }
};
