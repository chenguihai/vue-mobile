const hostname = window.location.hostname
const NewApiRootUrl = (() => {
  return {
    'localhost': '//47.106.240.143/api/' //预发布环境
  }[hostname] || '//47.106.240.143/api/'
})()

module.exports = {
  IndexUrl: NewApiRootUrl + 'api/index' //首页数据接口
};
