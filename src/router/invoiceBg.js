export default [
  {  //订单发票
    path: '/orderInvoice',
    component: () => import('@/views/invoiceBg/orderInvoice')
  },
  {  //发票详情
    path: '/invoiceDetail',
    component: () => import('@/views/invoiceBg/invoiceDetail')
  },
  {  //发票详情
    path: '/closeData',
    component: () => import('@/views/closeData')
  },

]
