//aip接口域名
const development = process.env.NODE_ENV === 'development'; // 环境
const flag = location.host === 'm.lingtianzhongmei.com'; // 环境
export const apiUrl = development ? 'https://api.lingtianzhongmei.com/api' : flag ? 'https://api.lingtianzhongmei.com/api' : 'https://api.zhongmei66.com/api';
