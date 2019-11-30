import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: '控制台',
        meta: { title: '控制台', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/work',
    component: Layout,
    redirect: '/work/index',
    meta: {
      title: '工作事项',
      icon: 'list',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/work/index'),
        name: '我的工作',
        meta: { title: '我的工作', affix: true }
      },
      {
        path: 'assign',
        component: () => import('@/views/work/assign'),
        name: '指派工作',
        meta: { title: '指派工作' }
      },
      {
        path: 'view/:id',
        component: () => import('@/views/work/view'),
        name: '查看工作',
        meta: { title: '查看工作' },
        hidden: true
      },
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project',
    meta: { 
      title: '公司项目', 
      icon: 'tab',
      roles: ['admin', 'editor'] // you can set roles in root nav 
    },
    children: [
      {
        path: '',
        component: () => import('@/views/project/index'),
        name: '项目列表',
        meta: { title: '项目列表' }
      },
      {
        path: 'create',
        component: () => import('@/views/project/create'),
        name: '添加新项目',
        meta: { title: '添加项目' }
      },
      {
        path: 'update/:id',
        component: () => import('@/views/project/update'),
        name: '编辑项目',
        meta: { title: '编辑项目' },
        hidden: true,
      },
      {
        path: 'view/:id',
        component: () => import('@/views/project/view'),
        name: '查看项目',
        meta: { title: '查看项目' },
        hidden: true
      },
    ]
  },
  {
    path: '/department',
    component: Layout,
    name: '组织架构',
    meta: { title: '组织架构', icon: 'tree' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: '组织架构',
        meta: { title: '组织架构', }
      },
      {
        path: 'create/:id',
        component: () => import('@/views/department/create'),
        name: '增加部门',
        meta: { title: '增加部门'},
        hidden: true
      },
      {
        path: 'update/:id',
        component: () => import('@/views/department/update'),
        name: '修改部门',
        meta: { title: '修改部门'},
        hidden: true
      }
    ]
  },
  {
    path: '/position',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'create/:id',
        component: () => import('@/views/position/create'),
        name: '增加职位',
        meta: { title: '增加职位'},
        hidden: true
      },
      {
        path: 'view/:id',
        component: () => import('@/views/position/view'),
        name: '查看职位',
        meta: { title: '查看职位'},
        hidden: true
      },
      {
        path: 'update/:id',
        component: () => import('@/views/position/update'),
        name: '更新职位',
        meta: { title: '更新职位'},
        hidden: true
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    meta: {
      title: '员工管理',
      icon: 'user',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: '员工列表',
        meta: { title: '员工列表' }
      },
      {
        path: 'create',
        component: () => import('@/views/user/create'),
        name: '新增员工',
        meta: { title: '新增员工' }
      },
      {
        path: 'update/:id',
        component: () => import('@/views/user/update'),
        name: '更新员工信息',
        meta: { title: '更新员工信息' },
        hidden: true
      },
      {
        path: 'view/:id',
        component: () => import('@/views/user/view'),
        name: '查看员工信息',
        meta: { title: '查看员工信息' },
        hidden: true
      },
    ]
  },
  // {
  //   path: '/notice',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/department/index'),
  //       name: '发布通知',
  //       meta: { title: '发布通知', icon: 'message' }
  //     }
  //   ]
  // },


  {
    path: '/advance',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: '高级应用',
        meta: { title: '高级应用', icon: 'component' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: '系统设置',
        meta: { title: '系统设置', icon: 'edit' }
      }
    ]
  },
  {
    path: '/help',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/department/index'),
        name: '帮助',
        meta: { title: '帮助', icon: 'education' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    hidden : true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: '个人资料',
        meta: { title: '个人资料', icon: 'user', hidden: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  

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
