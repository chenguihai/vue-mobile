import req, {
    post,
    get
} from '@/utils/req'

/**
 * @Description: 登录
 * @param {
 * username 用户名
 * password 密码
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function login(data) {
    return post({
        url: '/member/authorizations',
        data
    })
}

/**
 * @Description: 注册
 * @param {
 * username 用户名
 * password 密码
 * verification_key 短信秘钥
 * verification_code 验证码
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function register(opts) {
    const data = Object.assign({}, opts, {
        verification_key: opts.key,
        verification_code: opts.code,
        mobile: opts.username
    })
    return post({
        url: '/member/users',
        data
    })
}

/**
 * @Description: 注册短信
 * @param {
 * username 用户名
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function sendRegCode(username) {
    const data = {
        mobile: username
    }
    return post({
        url: '/member/verificationCodes',
        data
    })
}

/**
 * @Description: 短信登录
 * @param {
 * verification_key	是	string	短信秘钥
 verification_code	是	int	短信码
 mobile	是	int	手机号码
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function codeLogin(oblig) {
    console.log('oblig===', oblig)
    const data = {
        mobile: oblig.username,
        verification_key: oblig.key,
        verification_code: oblig.code,
        inviteUserId: oblig.inviteUserId
    }
    return post({
        url: '/member/mobile/authorizations',
        data
    })
}

/**
 * @Description: 短信登录发送短信
 * @param {
 * username 用户名
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function sendLoginCode(username) {
    const data = {
        mobile: username
    }
    return post({
        url: '/member/retrievepassword',
        data
    })
}
export function smsLogin(username) {
  const data = {
    mobile: username
  }
  return post({
    url: '/member/registered/sms',
    data
  })
}

/**
 * @Description: 找回密码短信
 * @param {
 * username 用户名
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function sendForgetCode(username) {
    const data = {
        mobile: username
    }
    return post({
        url: '/member/forgetsms',
        data
    })
}
/**
 * @Description: 找回密码短信验证
 * @param {
 * verification_key	是	string	短信秘钥
 * mobile	是	int	手机号码
 *  verification_code	是	int	短信码
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function forgetCodeValidate(oblig) {
    const data = {
        mobile: oblig.username,
        verification_key: oblig.key,
        verification_code: oblig.code
    }
    return post({
        url: '/member/checkpasswordsms',
        data
    })
}
/**
 * @Description: 确认修改密码
 * @param {
 * mobile	是	int	手机号码
 * newpassword	是	string	手机号码
 * }
 * @return:
 * @Date: 2019-11-12 20:57:47
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function forgetChange(oblig) {
    const data = {
        mobile: oblig.username,
        newpassword: oblig.password,
        verification_key: oblig.key,
        verification_code: oblig.code
    }
    return post({
        url: '/member/changepassword',
        data
    })
}

/**
 * @Description: 绑定账户
 * @param {
 * username	是	int	账户
 * password	是	int	密码
 * wechatid or qqid	是	int	微信qqID
}
 * @return:
 * @Date: 2019-12-03 17:11:13
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function bindAccount(data) {
    return post({
        url: '/member/thirdparty/authorizations',
        data
    })
}
// 图形验证码
export function getImgCode(data) {
    return post({
        url: '/captcha/users',
        data: data,
    });
};
// 登错查询次数
export function getErr(data) {
    return post({
        url: '/member/authorizations/number',
        data: data,
    });
};
/**
 * @Description: 绑定注册
 * @param {
 * verification_key	是	string	秘钥
 * verification_code	是	int	短信码
 * mobile	是	int	手机号码
 * wechatid or qqid	是	string	微信或qqId
 * avatar	是	string	头像
}
 * @return:
 * @Date: 2019-12-03 17:11:13
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function bindReg(data) {
    return post({
        url: '/member/thirdparty/registered',
        data
    })
}
/**
 * @Description: 微信授权
 * @param {
}
 * @return:
 * @Date: 2019-12-03 17:11:13
 * @LastEditors: Eve
 * @LastEditTime: Do not edit
 */
export function wechatOpen(code) {
    return post({
        url: '/wechat/oauth',
        data: {
            code
        }
    })
}
export function wxSharerProxy(url) { //分享数据
    return post({
        url: '/proxy/wx/share',
        data: {
            jsurl: url
        }
    })
}