import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import UserList from './components/userList.vue'
import RoleManage from './components/roleManage.vue'
import RoleRight from './components/roleRight.vue'
import GoodClass from './components/goodClass.vue'
import GoodManage from './components/goodManage.vue'
import ClassParams from './components/classParams.vue'
import OrdeList from './components/ordeList.vue'
import DataStatis from './components/dataStatis.vue'
import Welcome from './components/Welcome.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, name: 'login' },
    {
      path: '/home',
      component: Home,
      name: 'home',
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome, name: 'welcome' },
        { path: '/userList', component: UserList, name: 'userList' },
        { path: '/roleManage', component: RoleManage, name: 'roleManage' },
        { path: '/roleRight', component: RoleRight, name: 'roleRight' },
        { path: '/goodClass', component: GoodClass, name: 'goodClass' },
        { path: '/goodManage', component: GoodManage, name: 'goodManage' },
        { path: '/classParams', component: ClassParams, name: 'classParams' },
        { path: '/ordeList', component: OrdeList, name: 'ordeList' },
        { path: '/dataStatis', component: DataStatis, name: 'dataStatis' }
      ]
    }
  ]
})
export default router
