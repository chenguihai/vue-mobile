/* eslint-disable*/
import axios from 'axios'
import qs from 'qs'
import {
    Toast
} from 'vant'
import router from '../router'
import {
    logoutDo
} from '@/utils/tool'
import {
    apiUrl
} from '@/utils/apiUrl'
import {
    loginDo
} from "@/utils/tool";
import {
    setCookie
} from "@/api/common";
import {
    getInterval
} from "@/utils/mixins";
import {
    refreshToken
} from "@/api/list";
const whiteList = ['/api/service/checkStatus', '/api/user/msgcount']
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers['Content-Type'] = 'text/plain;charset=UTF-8'

const BASE_URL = apiUrl;


// const BASE_URL = '/api'
const OUT_TIME = 10000
const req = axios.create({
    baseURL: BASE_URL
})

// req({ url: '/asd', method: 'get' })
class AxiosOpts {
    /**
     * @Description: 请求参数类
     * @param {Object
     * props ⏬
     * method 方法  url 地址 data 参数 baseURL 基础地址 json 是否json forms 是否formData
     * time 超时时间
     * }
     * @return: 用于axios请求的参数
     * @Date: 2019-11-11 11:27:06
     * @LastEditors: Eve
     * @LastEditTime: Do not edit
     */

    constructor({
        method,
        url,
        data,
        baseURL = BASE_URL,
        json = true,
        forms,
        time = OUT_TIME
    }) {
        this.baseURL = baseURL
        this.timeout = time
            // 改变header
        if (method !== 'get') {
            this.headers = {
                'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; '
            }
        }
        this.URLpolyfill(url, method)
        this.initForm(data, json, forms)
    }

    data
    params
    baseURL
    url
    headers
    timeout
    method
    form = new FormData()
    formString = ''

    initForm(data, json, forms) {
        // 初始化data
        if (forms) {
            for (let [key, val] of Object.entries(data)) {
                if (!Array.isArray(val)) {
                    this.form.append(key, val)
                } else {
                    val.forEach(item => this.form.append(`${key}[]`, item))
                }
            }
            this.data = this.form
        } else if (json) {
            this.data = data
        } else {
            this.formString = qs.stringify(data)
            this.data = this.formString
        }
        if (this.method === 'get') {
            this.params = data
        }
    }

    URLpolyfill(url, method) {
        if (method === 'get') {
            const cache = `__cache__=${new Date().getTime()}`
            this.url = url.indexOf('?') !== -1 ? `${url}&${cache}` : `${url}?${cache}`
        } else {
            this.url = url
        }
        this.method = method
    }
}

function fusion(opts, args) {
    let axiosOpts = new AxiosOpts(opts)
    return req(args ? Object.assign({}, axiosOpts, args) : axiosOpts)
}

req.interceptors.request.use(
    config => {
        let Token = localStorage.getItem('token')
        if (Token) {
            config.headers.Authorization = 'Bearer ' + Token
                // token的时效性，30-60分钟之间需要更换令牌
            const tokenTime = getInterval(localStorage.getItem('token_start_time'), new Date().getTime()).minute
                // console.log('11111',tokenTime)
            if (tokenTime > 30 && tokenTime < 60) {
                localStorage.setItem('token_start_time', new Date().getTime())
                refreshToken().then((res) => {
                        // console.log('2222222222',res)
                        loginDo(res.access_token)
                            // setCookie('access_token',res.access_token)
                        localStorage.setItem("token", res.access_token);
                    },
                    (err) => {}
                )
            }

        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
req.interceptors.response.use(
        resp => {
            return resp
        },
        error => {
            const res = error.response
            if (res && res.status === 401) {
                let sampleUrl = error.config.url.split('?')[0];
                if (whiteList.includes(sampleUrl)) return
                logoutDo()
                    // Toast('未登录或登录已失效')
                let redirect = router.currentRoute.fullPath
                if (res.config && res.config._to) redirect = res.config._to.fullPath
                router.replace({
                    path: '/login',
                    query: {
                        redirect
                    }
                })
            }
            return Promise.reject(res)
        }
    )
    /**
     * @Description: 统一请求
     * @param {
     *  options 请求主体
     *  args 非常规融合参数
     *  extrajudicial 额外请求处理规则  默认处理 code 200
     *  extrajudicial:Object | 模板如下
     * {
     * code:any,
     * toast:boolean | false即可阻止自动提示 针对 "丰富"的接口准备
     * }
     * }
     * @return:
     * @Date: 2019-11-11 19:43:00
     * @LastEditors: Eve
     * @LastEditTime: Do not edit
     */
export const post = ({
        url,
        data,
        baseURL,
        json,
        forms
    }, args, extrajudicial) =>
    reqStatus(fusion({
        method: 'post',
        url,
        data,
        baseURL,
        json,
        forms
    }, args), extrajudicial)
export const get = ({
        url,
        data,
        json = false,
        baseURL
    }, args, extrajudicial) =>
    reqStatus(fusion({
        method: 'get',
        url,
        data,
        baseURL,
        json
    }, args), extrajudicial)
export const del = ({
        url,
        data,
        json = false,
        baseURL
    }, args, extrajudicial) =>
    reqStatus(fusion({
        method: 'delete',
        url,
        data,
        baseURL,
        json
    }, args), extrajudicial)
export const put = ({
        url,
        data,
        json = false,
        baseURL
    }, args, extrajudicial) =>
    reqStatus(fusion({
        method: 'put',
        url,
        data,
        baseURL,
        json
    }, args), extrajudicial)

export async function reqStatus(request, extrajudicial) {
    if (!request) return false
    const resSync = await request.catch(e => {
            if (e && e.data) {
                if (e.data.code == 401) return
                    // if (whiteList.includes(e.config.url)) return
                Toast(e.data.message)
            }
        })
        // console.log('2222222222', resSync)
    if (!resSync) return false
    const {
        data
    } = resSync
    if (data && (extrajudicial ? data.code == (extrajudicial.code || 200) : data.code == 200)) {
        return extrajudicial ? data : data.data
    } else if (data && extrajudicial && extrajudicial.code === 1000) {
        return data.data || data
    } else if (data && extrajudicial && extrajudicial.code === 900) {
        return data
    } else {
        (!extrajudicial || extrajudicial.toast !== false) && Toast(data.message)
        Promise.reject(resSync)
        return false
    }
}

export default req