import axios from 'axios'
import md5 from 'js-md5'
import { wxSharerProxy } from '@/api/account'
import { imgUrl } from '@/utils/commonData'
// const JSEncrypt = process.server ? undefined : require("JSEncrypt").default;

const service = axios.create({
    baseURL: '', // 接口的域名地址
    headers: {
        'Content-Type': 'application/json', // ajax发送的就必须是json字符串。
        'X-Nideshop-Token': localStorage.getItem('token')
            // 请求和身份相关的接口时必须设置请求头'X-Nideshop-Token':token,其中token为登陆时获取到
    }
})
const formdata = axios.create({
        baseURL: '', // 接口的域名地址
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Nideshop-Token': localStorage.getItem('token')
        }
    })
    // 输出方法
export const request = (url, data = {}, method = 'get') => {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method,
            headers: {}
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        service(options)
            .then(res => {
                // console.log('返回数据', res)
                resolve(res.data)
            })
            .catch(error => {
                reject()
                console.error(error)
            })
    })
}

export const requestform = (url, data, method = 'get') => {
    return new Promise((resolve, reject) => {
        const options = {
            url,
            method
        }
        if (method.toLowerCase() === 'get') {
            options.params = data
        } else {
            options.data = data
        }
        formdata(options)
            .then(res => {
                // console.log('返回数据', res)
                resolve(res.data)
            })
            .catch(error => {
                reject();
                console.error(error)
            })
    })
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

export const formatTime = (number, format) => {
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
    var returnArr = []

    var date = new Date(number * 1000)
    returnArr.push(date.getFullYear())
    returnArr.push(formatNumber(date.getMonth() + 1))
    returnArr.push(formatNumber(date.getDate()))

    returnArr.push(formatNumber(date.getHours()))
    returnArr.push(formatNumber(date.getMinutes()))
    returnArr.push(formatNumber(date.getSeconds()))
    for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
    }
    return format
}

// key按字母排序后，取出value值组成字符串，然后将组成的value字符串md5加密
export function tk(myData) {
    // console.log("myData:", myData);
    let newkey = Object.keys(myData).sort()
        // console.log("newkey", newkey);
        // console.log('newkey='+newkey);
    let newObj = {} // 创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) {
        // 遍历newkey数组
        newObj[newkey[i]] = myData[newkey[i]]
            // 向新创建的对象中按照排好的顺序依次增加键值对
    }
    // console.log("返回排好序的新对象newObj:", newObj);
    let newParm = ''
    for (let key in newObj) {
        newParm += newObj[key]
    }
    // console.log("将要被加密的值:", newParm);
    let md5Url = md5(newParm)
        // console.log("加密完成的值tk:", self.tk);
    return md5Url
}

export function isios() {
    let ua = window.navigator.userAgent
    if (ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        // ios端
        console.log('ios端')
        return true
    } else if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
        // android端
        console.log('android端')
        return false
    }
}

// 获取url中lang的值
export function GetQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    var r = window.location.search.substr(1).match(reg) // 获取url中"?"符后的字符串并正则匹配
    var context = ''
    if (r != null) context = r[2]
    reg = null
    r = null
    return context == null || context == '' || context == 'undefined' ? '' : context
}

// alert(GetQueryString("q"));

export function wxShareCommon(title, url = '', desc = '') {
    // const share = localStorage.getItem('shareItem')
    // let shareItem = share ? JSON.parse(share) : {}
    // let shareUrl = localStorage.getItem('shareUrl');
    // document.querySelector('meta[name="keywords"]').setAttribute('content', 接口获取的keywords);
    // document.querySelector('meta[name="description"]').setAttribute('content', desc)
    let config = {
        link: window.location.href,
        imgUrl: url ? imgUrl + url + '?x-oss-process=image/resize,m_fill,h_200,w_200' : location.origin + '/static/share_img.jpg', // 分享图标
        title: title || document.title, // 分享标题
        desc: desc,
        // || document.querySelector('meta[name="description"]').getAttribute('content')
        success: () => {
            // 用户确认分享后执行的回调函数
        },
        cancel: () => {
            // 用户取消分享后执行的回调函数
        }
    }

    wx.ready(() => { // 分享给朋友
        wx.onMenuShareAppMessage(config)
            // 分享到朋友圈
        wx.onMenuShareTimeline(config)
        wx.onMenuShareQQ(config)
        wx.onMenuShareQZone(config)
    })
    wx.error((res) => {

    })
}
export function encryptedUtil(data = '') {
    const PUB_KEY = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDW3AJoMnSBW/2P80TYHT/GQJ8k
    Bxjb9TdJpXIquBcCjWiqjzpuUN1F/uyllm5u1X4XFxAviMwCWojOEoiTCI85b88Y
    jfeXuas2VQpp7j0xzF9+wZckbvj8r/Zy5K5/xGtvbzt4QEOF/sGHuOEYXZ/Ptzam
    iR0PeTwRBn2hdhGQBwIDAQAB
    -----END PUBLIC KEY-----`
    let encryptor = new JSEncrypt();
    // 设置公钥
    encryptor.setPublicKey(PUB_KEY);
    // 加密数据
    return encryptor.encrypt(data);
}
export function bin2Hex(str) {
    var re = /[\u4E00-\u9FA5]/;
    var ar = [];
    for (var i = 0; i < str.length; i++) {
        var a = '';
        if (re.test(str.charAt(i))) { // 中文
            a = encodeURI(str.charAt(i)).replace(/%/g, '');
        } else {
            a = str.charCodeAt(i).toString(16);
        }
        ar.push(a);
    }
    str = ar.join("");
    return str;
}