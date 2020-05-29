export default [
    {
        path:'/classifyChild',
        component:resolve => require(['@/views/classifyChild/classifyChild'],resolve),
        meta:{
          pageTitle:'子分类列表',
          keepAlive:false,
        }
    },
    
  ]