import config from './config'
import axios from 'axios'
import desCode from './aesUtil'
import mdCode from './md5'

let apiUrl = config.apiUrl.dev
if (location.origin == config.originUrl.test) {
    apiUrl = config.apiUrl.test
}

if (location.origin == config.originUrl.prod) {
    apiUrl = config.apiUrl.prod
}


// 登录
export const login = (params) => {
    let formData = new FormData();
    let wMsgID = desCode.wMsgID();
    let wParam = desCode.to3des('account=' + params.account + '_password=' + params.password);
    let md = mdCode.hexMD5('8888' + '200' + wMsgID + wParam + 'q1w2e3r4t5y6');
    formData.append('wAgent', 8888);
    formData.append('wAction', 200);
    formData.append('wMsgID', wMsgID);
    formData.append('wParam', wParam);
    formData.append('wSign', md);
    formData.append('wImei', '222');
    formData.append('wVersion', '2');
    formData.append('wRequestUserID', '4');
    let config = {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }
    return axios.post(apiUrl, formData, config)
}




// 签到页面

// ==========================(100)获取OpenID================================================
// 入参: code
export const getOpenID = (params) => {
    let formData = new FormData();
    let wMsgID = desCode.wMsgID();
    // let wParam = desCode.to3des('name=' + params.name + '_Id=' + params.id);
    let wParam = desCode.to3des(`code=${params.code}`);
    let md = mdCode.hexMD5('8888' + '100' + wMsgID + wParam + 'q1w2e3r4t5y6');
    formData.append('wAgent', 8888);
    formData.append('wAction', 100);
    formData.append('wMsgID', wMsgID);
    formData.append('wParam', wParam);
    formData.append('wSign', md);
    formData.append('wImei', '222');
    formData.append('wVersion', '2');
    formData.append('wRequestUserID', '4');
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return axios.post(apiUrl,formData,config)
  }







  // 选择姓名列表接口(104)
export const getNameList = () => {
  let formData = new FormData();
  let wMsgID = desCode.wMsgID();
  let md = mdCode.hexMD5('8888' + '104' + wMsgID + 'q1w2e3r4t5y6');
  formData.append('wAgent', 8888);
  formData.append('wAction', 104);
  formData.append('wMsgID', wMsgID);
  formData.append('wSign', md);
  formData.append('wImei', '222');
  formData.append('wVersion', '2');
  formData.append('wRequestUserID', '4');
  let config = {
      headers: {
          'Content-Type': 'multipart/form-data'
      }
  }
  return axios.post(apiUrl, formData, config)
}



  // 根据OpenId绑定用户接口(101)
  export const voteCommit = (params) => {
    let formData = new FormData();
    let wMsgID = desCode.wMsgID();
    let wParam = desCode.to3des(`openid=${params.openid}_username=${params.username}`);
    let md = mdCode.hexMD5('8888' + '101' + wMsgID + wParam + 'q1w2e3r4t5y6');
    formData.append('wAgent', 8888);
    formData.append('wAction', 101);
    formData.append('wMsgID', wMsgID);
    formData.append('wParam', wParam);
    formData.append('wSign', md);
    formData.append('wImei', '222');
    formData.append('wVersion', '2');
    formData.append('wRequestUserID', '4');
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    return axios.post(apiUrl,formData,config)
  }



    // 节目列表接口(102)
    export const programList = (params) => {
      let formData = new FormData();
      let wMsgID = desCode.wMsgID();
      let wParam = desCode.to3des(`userid=${params.userid}`);
      let md = mdCode.hexMD5('8888' + '102' + wMsgID + wParam + 'q1w2e3r4t5y6');
      formData.append('wAgent', 8888);
      formData.append('wAction', 102);
      formData.append('wMsgID', wMsgID);
      formData.append('wParam', wParam);
      formData.append('wSign', md);
      formData.append('wImei', '222');
      formData.append('wVersion', '2');
      formData.append('wRequestUserID', '4');
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      return axios.post(apiUrl,formData,config)
    }




    // 投票接口(103)



    // userid///用户Id
    // rightid///节目Id
    // username///用户姓名
    // votenum///投票数量
    // region///节目区域

    export const vote = (params) => {
      let formData = new FormData();
      let wMsgID = desCode.wMsgID();
      let wParam = desCode.to3des(`userid=${params.userid}_rightid=${params.rightid}_username=${params.username}_votenum=${params.votenum}_region=${params.region}`);
      let md = mdCode.hexMD5('8888' + '103' + wMsgID + wParam + 'q1w2e3r4t5y6');
      formData.append('wAgent', 8888);
      formData.append('wAction', 103);
      formData.append('wMsgID', wMsgID);
      formData.append('wParam', wParam);
      formData.append('wSign', md);
      formData.append('wImei', '222');
      formData.append('wVersion', '2');
      formData.append('wRequestUserID', '4');
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      return axios.post(apiUrl,formData,config)
    }




    // 更据OpenId获取用户信息(105)
    export const updateOpenId = (params) => {
      let formData = new FormData();
      let wMsgID = desCode.wMsgID();
      let wParam = desCode.to3des(`openid=${params.openid}`);
      let md = mdCode.hexMD5('8888' + '105' + wMsgID + wParam + 'q1w2e3r4t5y6');
      formData.append('wAgent', 8888);
      formData.append('wAction', 105);
      formData.append('wMsgID', wMsgID);
      formData.append('wParam', wParam);
      formData.append('wSign', md);
      formData.append('wImei', '222');
      formData.append('wVersion', '2');
      formData.append('wRequestUserID', '4');
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      return axios.post(apiUrl,formData,config)
    }