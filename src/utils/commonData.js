export const uploadPositive = [
  {
    title: '身份证正面',
    btnText: '点击上传身份证正面',
    btnReplace: '点击更换身份证正面',
    src: '/static/images/auth/id_positive.png'
  }
];
export const uploadOtherSide = [
  {
    title: '身份证反面',
    btnText: '点击上传身份证反面',
    btnReplace: '点击更换身份证反面',
    src: '/static/images/auth/id_back.png'
  }
];
export const uploadLicense = [
  {
    title: '营业执照',
    btnText: '点击上传营业执照',
    btnReplace: '点击更换营业执照',
    src: '/static/images/auth/business_license.png'
  }
];
const development = process.env.NODE_ENV === 'development'; // 环境
let devAlyUrl = 'https://ltzm1.oss-cn-shenzhen.aliyuncs.com/';
let lineAlyUrl = 'https://img.ltzm66.com/';
export const imgUrl = development ? devAlyUrl : location.host === 'm.lingtianzhongmei.com' ? devAlyUrl : lineAlyUrl;
// export const devUrl = development ? 'http://47.106.240.143' : location.origin;
export const devUrl = location.origin;
