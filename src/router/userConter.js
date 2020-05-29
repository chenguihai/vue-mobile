export default [
    {
        path:'/userContent/homePage/homePage',
        component:resolve => require(['@/components/userContent/homePage/homePage'],resolve),
        meta:{
          pageTitle:'个人中心',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myOrder',
        component:resolve => require(['@/components/userContent/myOrder/myOrder'],resolve),
        meta:{
          pageTitle:'我的订单',
          keepAlive:false,
        }
      }, 
      {
        path:'/userContent/homePage/orderInvoice',
        component:resolve => require(['@/components/userContent/orderInvoice/orderInvoice'],resolve),
        meta:{
          pageTitle:'申请发票',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myInvoice',
        component:resolve => require(['@/components/userContent/myInvoice/myInvoice'],resolve),
        meta:{
          pageTitle:'我的发票',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/invoiceData',
        component:resolve => require(['@/components/userContent/myInvoice/invoiceData'],resolve),
        meta:{
          pageTitle:'发票详情',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myEvaluate',
        component:resolve => require(['@/components/userContent/myEvaluate/myEvaluate'],resolve),
        meta:{
          pageTitle:'我的评价',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myRefund',
        component:resolve => require(['@/components/userContent/myRefund/myRefund'],resolve),
        meta:{
          pageTitle:'我的退款',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/refundData',
        component:resolve => require(['@/components/userContent/myRefund/refundData'],resolve),
        meta:{
          pageTitle:'退款详情',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myBalance',
        component:resolve => require(['@/components/userContent/myBalance/myBalance'],resolve),
        meta:{
          pageTitle:'账户余额',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/withdraw',
        component:resolve => require(['@/components/userContent/myBalance/withdraw'],resolve),
        meta:{
          pageTitle:'提现',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/moneyDetail',
        component:resolve => require(['@/components/userContent/moneyDetail/moneyDetail'],resolve),
        meta:{
          pageTitle:'余额明细',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/moneyRecord',
        component:resolve => require(['@/components/userContent/moneyDetail/moneyRecord'],resolve),
        meta:{
          pageTitle:'提现记录',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myBank',
        component:resolve => require(['@/components/userContent/myBank/myBank'],resolve),
        meta:{
          pageTitle:'银行卡管理',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/addBank',
        component:resolve => require(['@/components/userContent/myBank/addBank'],resolve),
        meta:{
          pageTitle:'添加银行卡',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/greemen',
        component:resolve => require(['@/components/userContent/myBank/greemen'],resolve),
        meta:{
          pageTitle:'绑定银行卡协议',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/allNews',
        component:resolve => require(['@/components/userContent/allNews/allNews'],resolve),
        meta:{
          pageTitle:'我的消息',
          keepAlive:false,
        }
      }, 
       {
        path:'/userContent/homePage/allNewsData',
        component:resolve => require(['@/components/userContent/allNews/allNewsData'],resolve),
        meta:{
          pageTitle:'消息',
          keepAlive:false,
        }
      },
      {
        name:'newsPage',
        path:'/userContent/homePage/newsPage',
        component:resolve => require(['@/components/userContent/allNews/newsPage'],resolve),
        meta:{
          pageTitle:'消息',
          keepAlive:false,
        }
      },

      {
        path:'/userContent/homePage/accountUser',
        component:resolve => require(['@/components/userContent/accountUser/accountUser'],resolve),
        meta:{
          pageTitle:'账号设置',
          keepAlive:false,
        }
      },
      {
        name:'changeInfo',
        path:'/userContent/homePage/changeInfo',
        component:resolve => require(['@/components/userContent/accountUser/changeInfo'],resolve),
        meta:{
          pageTitle:'账号修改',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/alterPhone',
        name:'alterPhone',
        component:resolve => require(['@/components/userContent/alterPhone/alterPhone'],resolve),
        meta:{
          pageTitle:'手机修改',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/alterPhoneIng',
        name:'alterPhoneIng',
        component:resolve => require(['@/components/userContent/alterPhone/alterPhoneIng'],resolve),
        meta:{
          pageTitle:'修改绑定手机号',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/alterPassword',
        component:resolve => require(['@/components/userContent/alterPassword/alterPassword'],resolve),
        meta:{
          pageTitle:'修改登录密码',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/realName',
        component:resolve => require(['@/components/userContent/realName/realName'],resolve),
        meta:{
          pageTitle:'实名认证',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/personage',
        component:resolve => require(['@/components/userContent/realName/personage/personage'],resolve),
        meta:{
          pageTitle:'个人实名认证',
          keepAlive:false,
        }
      },
       {
        path:'/userContent/homePage/enterprise',
        
        component:resolve => require(['@/components/userContent/realName/enterprise/enterprise'],resolve),
        meta:{
          pageTitle:'企业实名认证',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/enterprisePep',
        name:'enterprisePep',
        component:resolve => require(['@/components/userContent/realName/enterprise/enterprisePep'],resolve),
        meta:{
          pageTitle:'上传法人信息',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/accountInfor',
        name:'accountInfor',
        component:resolve => require(['@/components/userContent/realName/enterprise/accountInfor'],resolve),
        meta:{
          pageTitle:'对公账户信息',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/backfillMoney',
        name:'backfillMoney',
        component:resolve => require(['@/components/userContent/realName/enterprise/backfillMoney'],resolve),
        meta:{
          pageTitle:'对公打款对账',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/fail',
        component:resolve => require(['@/components/userContent/realName/enterprise/fail'],resolve),
        meta:{
          pageTitle:'认证失败',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/myThread',
        component:resolve => require(['@/components/userContent/myThread/myThread'],resolve),
        meta:{
          pageTitle:'我发布的线索',
          keepAlive:false,
        }
      },
      {
        path:'/tollMarket',
        component:resolve => require(['@/views/tollMarket/tollMarket'],resolve),
        meta:{
          pageTitle:'工具市场',
          keepAlive:false,
        }
      },
      {
        path:'/tollMarketData',
        component:resolve => require(['@/views/tollMarket/tollMarketData'],resolve),
        meta:{
          pageTitle:'工具详情',
          keepAlive:false,
        }
      },
      {
        path:'/userContent/homePage/novicClick',
        component:resolve => require(['@/components/userContent/novicClick/novicClick'],resolve),
        meta:{
          pageTitle:'新人专享',
          keepAlive:false,
        }
      },
  ]
  