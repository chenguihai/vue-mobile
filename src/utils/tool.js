/* eslint-disable */
import Cookie from 'js-cookie'
import { getUserInfo } from '@/api/service'
// import { msgcountT, msgcountS } from '@/api/list'
import areaList from "@/assets/js/area";
/* Array every polyfill */
export const TOKEN = 'token'
export const COOKIE_TOKEN = 'access_token'
export const USER_INFO = 'user_info'
export const MSG_T = 'msg_t'
export const MSG_S = 'msg_s'

export const isType = type => target => `[object ${type}]` === Object.prototype.toString.call(target)
export const isObject = isType('Object')
export const isNumber = isType('Number')
export const isString = isType('String')
export const isRegExp = isType('RegExp')
export const isBoolean = isType('Boolean')

export const regDaqo = {
        // 手机号  最底部有号段说明
        phone: /^((13[0-9]|14[1|5-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/,
        orderCanRead: /\.(png|jpg|gif|jpeg|xlsx|pdf|mp4|bmp|wma|wmi|3gp|rmvb|flv)$/,
        image: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        budget_money: /^[1-9]\d{2,}[\.]?\d*/,
        email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
        qq: /^[1-9][0-9]{4,10}$/,
        wechat: /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/,
        testName: /^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/
    }
    /**
     * @Description: 参数空检测
     * @param {
     * rule|String|Object,
     * rule => obj => {
     * name:String,
     * test:String|Boolean|RegExp
     * custom: Function 定制检测函数 参数为val值
     * }
     * oblig | Object
     * errFn | Function 单独的错误函数
     * }
     * @return: Boolean
     * @Date: 2019-10-29 13:14:39
     * @LastEditors: Eve
     * @LastEditTime: Do not edit
     */
export const checkEmptyValue = (rule, oblig, errFn) => {
    let res = true
    let val, type
        /* type 0 空值  1 不等值  2 正则不匹配 | custom验证不通过*/
    if (!_checkStringVal(rule)) return !res
    type = 0
    if (isString(rule)) {
        // 直接检测属性值是否为空
        val = oblig[rule]
        res = _checkStringVal(val)
    } else if (isObject(rule)) {
        // 如果是对象则取规则验证
        const { test, name, custom } = rule
        val = oblig[name]
        res = _checkStringVal(val)
        if (custom) {
            res = custom(val)
            type = 2
        } else {
            if (res && (isString(test) || isBoolean(test))) {
                // test是字符串或布尔值则验证是否与值相等
                res = val === test
                type = 1
            }
            // 正则则匹配比较
            if (res && isRegExp(test)) {
                res = test.test(val)
                type = 2
            }
        }
    }!res && errFn && errFn(type, rule.name || rule)
        // 其他情况则视为可空  直接返回
    return res
}

/**
 * @Description: 字符串空检测
 * @param {s String}
 * @return: Boolean 空 false
 * @Date: 2019-11-11 19:56:02
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function _checkStringVal(s) {
    return !!(s !== '' && s !== undefined && s !== null)
}

/*
中国电信号段
133、149、153、173、177、180、181、189、199
中国联通号段
130、131、132、145、155、156、166、171、175、176、185、186、166
中国移动号段
134(0-8)、135、136、137、138、139、147、150、151、152、157、158、159、172、178、182、183、184、187、188、198
其他号段
14号段以前为上网卡专属号段，如中国联通的是145，中国移动的是147等等。
虚拟运营商
电信：1700、1701、1702
移动：1703、1705、1706
联通：1704、1707、1708、1709、171
卫星通信：1349
*/

export async function loginDo(token, vm) {
  localStorage.setItem(TOKEN, token)
  Cookie.set(COOKIE_TOKEN, token)
  const user = await getUserInfo()
  if (!user) return
  localStorage.setItem(USER_INFO, JSON.stringify(user))
   // 记录token的有效开始时间
   localStorage.setItem('token_start_time', new Date().getTime())
  this && this.$store && this.$store.commit('CHANGE_USER_INFO', user)
}

// export async function mesNumT() {
//     const msgT = await msgcountT()
//     if (!msgT) return
//     localStorage.setItem(MSG_T, JSON.stringify(msgT))
//     this && this.$store && this.$store.commit('CHANGE_MSG_T', msgT)
// }

// export async function mesNumS() {
//     const msgS = await msgcountS()
//     if (!msgS) return
//     localStorage.setItem(MSG_T, JSON.stringify(msgS))
//     this && this.$store && this.$store.commit('CHANGE_MSG_S', msgS)
// }

export function logoutDo() {
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(USER_INFO)
    Cookie.remove(COOKIE_TOKEN)
    Cookie.remove('access_token')
}

// Proxy
export function createProxy(origin, whiteList) {
    return new Proxy(origin, {
        get(target, property) {
            return whiteList.includes(property) ?
                target[property] :
                beforeRun(target[property], ...whiteList.map(fn => target[fn]))
        }
    })
}

// 挂载到Vue
export function mount(general) {
    const res = {}
    for (let [key, val] of Object.entries(general)) {
        res[key] = function(...args) {
            val.bind(this)(...args)
        }
    }
    return res
}

// 函数前摇
export function beforeRun(fn, ...checks) {
    return function(...args) {
        if (checks.every(check => check.bind(this)())) {
            return fn.bind(this)(...args)
        }
    }
}

/*
事件侦听兼容IE
*/
export const EventUtil = {
    addHandler: function(element, type, handler, pop = false) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, pop)
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler, pop)
        } else {
            element['on' + type] = handler
        }
    },
    removeHandler: function(element, type, handler, pop = false) {
        if (element.removeEventListener) {
            element.removeEventListener(type, handler, pop)
        } else if (element.detachEvent) {
            element.detachEvent('on' + type, handler, pop)
        } else {
            element['on' + type] = null
        }
    }
}

/**
 * @Description: 获取冒泡路径 兼容ios9 火狐 safari
 * @param {
 * event 事件对象
 * }
 * @return: eventPath Array
 * @Date: 2019-12-04 18:17:51
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function eventPath(evt) {
    const path = (evt.composedPath && evt.composedPath()) || evt.path,
        target = evt.target

    if (path != null) return path.indexOf(window) < 0 ? path.concat(window) : path

    if (target === window) return [window]

    function getParents(node, memo = []) {
        const parentNode = node.parentNode
        return !parentNode ? memo : getParents(parentNode, [...memo, ...parentNode])
    }

    return [target, ...getParents(target), window]
}

/**
 * @Description: 微信登录
 * @param {
 * 参数	是否必须	说明
 * redirect_uri	是	请使用urlEncode对链接进行处理
 * state	否	用于保持请求和回调的状态，授权请求后原样带回给第三方。该参数可用于防止csrf攻击（跨站请求伪造攻击），建议第三方带上该参数，可设置为简单的随机数加session进行校验}
 * @return:
 * @Date: 2019-11-25 15:02:16
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
const development = process.env.NODE_ENV === 'development'; // 环境
const flag = location.host === 'm.lingtianzhongmei.com'; // 环境
const origin = development ? 'api.ltzm66.com' : flag ? 'api.lingtianzhongmei.com' : 'api.zhongmei66.com';
// const originUrl = development ? 'api.lingtianzhongmei.com' : 'api.zhongmei66.com';
// export const apiUrl =  `${originUrl}`;
export function wxLogin(scope = 'snsapi_userinfo') {
    const state = '6f71412b5476e3ac085b2c9bc7846c72'
    const appid = development ? 'wx730fa1fc6dd9973f' : flag ? 'wxa4675f6df170d44d' : 'wxef3036185104a56f';
    let callbackUrl = `https://${origin}/api/proxy/wx/h5-login` // 公众号回调

    callbackUrl = encodeURIComponent(callbackUrl)
        // const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${callbackUrl}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`
    const url = 'https://' + origin + '/get-weixin-code.html?appid=' + appid + '&scope=snsapi_userinfo&state=hello-world&redirect_uri=' + callbackUrl
    location.replace(url)
}

export function qqLogin() {
    // 调用QC.Login方法，指定btnId参数将按钮绑定在容器节点中
    // QC.Login.showPopup({
    //   appId: 101572448,
    //   redirectURI: 'https://devmobile.zhongmei66.com/bind?type=2'
    // })
    // window.open( `http://dev.api.zhongmei66.com/api/qq/login`)
    window.open(`https://${origin}/api/qq/login`)
}
export const browser = {
    versions: (function() {
        let u = navigator.userAgent,
            app = navigator.appVersion
        return {
            trident: u.indexOf('Trident') > -1, // IE内核
            presto: u.indexOf('Presto') > -1, // opera内核
            webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone
            iPad: u.indexOf('iPad') > -1, // 是否iPad
            isWeChat: /MicroMessenger/i.test(u) // 是否微信
        }
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}

/*****
 分享配置
 var config = {
            title: 'title', // 标题，默认读取document.title
            desc: 'desc', // 描述, 默认读取head标签：<meta name="description" content="desc" />
            link: 'link', // 网址，默认使用window.location.href
            imgUrl: 'img link', // 图片, 默认取网页中第一个img标签
            types: ['wx', 'wxline', 'qq', 'qzone', 'sina'], // 开启的分享图标, 默认为全部
            infoMap: {
                wx: {
                    title: '微信分享',
                    desc: '我是微信的分享',
                    link: 'url地址',
                    imgUrl: '分享到图片'
                }
            },
            fnDoShare: function (type) {
                console.log(1);
            }
        };
 */
export const sharePop = obj => {
    var config = {
        ...obj,
        wx: {
            appId: '', // 必填，公众号的唯一标识
            timestamp: '', // 必填，生成签名的时间戳
            nonceStr: '', // 必填，生成签名的随机串
            signature: '' // 必填，签名
        },
        fnDoShare: function(type) {
            console.log(1)
        }
    }
    Mshare.popup(config)
}

export function filterName(data = '') { //处理name
    let val = data.split('').fill('*', 1).join('')
    return val
}

export function filterPhone(data = '') { //处理手机号码
    let val = data.split('').fill('*', 3, 7).join('')
    return val
}

export function filterIdno(data = '') { //处理身份证
    let val = data.split('').fill('*', 4, 14).join('')
    return val
}

export function filterCode(data = '') { //处理企业统一信用代码
    let val = data.split('').fill('*', 4, 14).join('')
    return val
}

export function filterCard(data = '') { //处理银行卡
    if (!data) {
        return ''
    }
    let val = data.substr(0, 4) + "********" + data.substr(data.length - 4)
    return val
}

export function commonRegs(rules, form) {
    const unlock = rules.every(item => checkEmptyValue(item, form))
        // console.log('commonRegs',unlock)
    return unlock;
}

export function commonToastRegs(rules, form, errMsgList, that) {
    const unlock = rules.every(item => checkEmptyValue(item, form, (type, name) => that.$toast(errMsgList.get(name)[type])))
        // console.log('commonToastRegs',unlock)
    return unlock;
}

export function getAddressCommon(province, city, district) {
    if (!district) {
        return ''
    }
    let provinceName = '',
        cityName = '',
        districtName = '';
    const { province_list = {}, city_list = {}, county_list = {} } = JSON.parse(JSON.stringify(areaList));
    for (let key in province_list) {
        if (key == province) {
            provinceName = province_list[key];
        }
    }
    for (let key in city_list) {
        if (key == city) {
            cityName = city_list[key];
        }
    }
    for (let key in county_list) {
        if (key == district) {
            districtName = county_list[key];
        }
    }
    return `${provinceName}${provinceName === cityName ? "" : cityName}${districtName}`;
    // return provinceName + cityName + districtName;
}
