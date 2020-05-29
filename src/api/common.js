import axios from 'axios';
import {devUrl} from '@/utils/commonData'

export const hostname = window.location.hostname
export const apiUrl = (() => {
  return {
    'localhost': '//47.106.240.143', //预发布环境
  }[hostname] || '//47.106.240.143'
})()

//获取cookie、
export const getCookie = (name) => {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}

//设置cookie,增加到vue实例方便全局调用
export const setCookie = (name, value, hours, path, domain, secure) => {
  // var exdate = new Date();
  // exdate.setDate(exdate.getDate() + expiredays);
  // document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
  var cdata = name + "=" + value;
  if (hours) {
    var d = new Date();
    d.setHours(d.getHours() + hours);
    cdata += "; expires=" + d.toGMTString();
  }
  cdata += path ? ("; path=" + path) : "";
  cdata += domain ? ("; domain=" + domain) : "";
  cdata += secure ? ("; secure=" + secure) : "";
  document.cookie = cdata;
};


export function getUrl() {
  var current_url = window.location.href;
  var url = current_url;
  var code;
  if (url && url.indexOf("?") != -1) {
    code = getUrlParam('token');
  }
  if (code) {
    // alert(code);
    let dataObj = {
      "code": code,
      // appId:3
    }
    console.log("code", code);
    request(location.origin + "/api/auth/loginByWeixinCode", dataObj).then((response) => {
      if (response.data.errno == "0") {
        console.log(response.data.data);
        window.localStorage.setItem('userInfo', JSON.stringify(response.data.data))
        window.localStorage.setItem('token', response.data.data.token)
        window.location.href = window.localStorage.getItem("url");
        console.log("hahahaha");
      }

    }).catch((error) => {
      console.log(error);
    });
  }
  /**
   *
  else {
    // var MemberId = window.localStorage.getItem("memberId");
    let userInfo = window.localStorage.getItem('userInfo')
    // if (window.localStorage.getItem("memberId") == "undefined" || window.localStorage.getItem("memberId") == undefined) {
    if (!userInfo) {
      var appid = "wxef3036185104a56f";
      window.localStorage.setItem("url", current_url);
      var llcurrent_url = encodeURIComponent(current_url);

      window.location.href = devUrl + "/static/get-weixin-code.html?appid=wxef3036185104a56f&scope=snsapi_userinfo&state=hello-world&redirect_uri=" + llcurrent_url;
      // window.location.href = "http://47.106.240.143/static/get-weixin-code.html?appid=wxef3036185104a56f&scope=snsapi_userinfo&state=hello-world&redirect_uri=" + llcurrent_url;
      // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appid + "&redirect_uri=" + llcurrent_url + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";

    } else {
      // do your business
      return;
    }
  }
   */

}

function getUrlParam(paraName) {
  var url = document.location.toString();
  var arrObj = url.split("?");

  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split("&");
    var arr;

    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");

      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}

// 处理axios
export const request = (url, param = {}, method = "POST") => {

  return new Promise(function (resolve, reject) {

    axios({
      method: method,
      url: url,
      data: param,
      // headers: {
      //  'Content-Type': 'application/json',
      // 'X-Nideshop-Token': localStorage.getItem('token') || {}
      //'x-nideshop-communityId':communityId,
      //  }
    }).then(function (res) {
      // if (res.data.code == 0) {
      resolve(res);
      console.info('errMsg', res.data.msg)
      // } else {
      //   Toast(res.data.msg);
      //   // reject(res.errMsg);
      // }
    }).catch((error) => {
      console.log(error);
    });

  });
}

