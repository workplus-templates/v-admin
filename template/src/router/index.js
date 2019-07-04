import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 子菜单只会在route.children.length >= 1时生效
 *
 * hidden: true                   如设置为true，则该路由不会显示在侧边栏上（默认为false）
 * redirect: noRedirect           如设置为noRedirect，则该路由不会在面包屑上重定向
 * name:'router-name'             name用于<keep-alive>
 * meta : {
    title: 'title'               title显示在侧边栏和面包屑
    icon: 'svg-name'             显示在侧边栏的图标
    breadcrumb: false            如设置为false，该组件将在面包屑上隐藏（默认为true）
  }
 */

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/menu1',
    name: 'Example',
    meta: { title: '单级菜单', icon: 'example' },
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        component: () => import('@/views/menu1/index'),
        meta: { title: 'menu1', icon: 'example' }
      },
      {
        path: 'menu2',
        name: 'Menu2',
        component: () => import('@/views/menu2/index'),
        meta: { title: 'menu2', icon: 'example' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
