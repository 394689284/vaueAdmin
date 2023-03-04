<template>
  <el-container>
    <el-header heigth="60px">
      <div class="home-title">
        <img src="../assets/heima.png" />
        <span> 电商后台管理系统</span>
      </div>
      <el-button type="info" @click="exit">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="asideWidth" ref="aside">
        <div class="horizon-bar" @click="toggle">
          <pre>|||</pre>
        </div>
        <el-menu background-color="#333744" text-color="#fff" unique-opened :router="true" :default-active="activePath"
          @select="onSelect" :collapse="!this.isToggle" :collapse-transition="false">
          <el-submenu v-for="(item, index) in navList" :key="index" :index="index.toString()">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="(item_s, index_s) in item.children" :key="index_s" :index="item_s.route"
              :route="{ name: item_s.route, params: { breadCrumb: [item.title, item_s.title] } }">
              <template slot="title">
                <i :class="item_s.icon"></i>{{ item_s.title }}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      navList: [
        {
          title: '用户管理',
          icon: 'iconfont icon-user',
          children: [
            { title: '用户列表', icon: 'el-icon-menu', route: 'userList' }
          ]
        },
        {
          title: '权限管理',
          icon: 'iconfont icon-tijikongjian',
          children: [
            { title: '角色列表', icon: 'el-icon-menu', route: 'roleManage' },
            { title: '权限列表', icon: 'el-icon-menu', route: 'roleRight' }
          ]
        },
        {
          title: '商品管理',
          icon: 'iconfont icon-shangpin',
          children: [
            { title: '商品列表', icon: 'el-icon-menu', route: 'goodManage' },
            { title: '商品分类', icon: 'el-icon-menu', route: 'goodClass' },
            { title: '分类参数', icon: 'el-icon-menu', route: 'classParams' }
          ]
        },
        {
          title: '订单管理',
          icon: 'iconfont icon-danju',
          children: [
            { title: '订单列表', icon: 'el-icon-menu', route: 'ordeList' }
          ]
        },
        {
          title: '数据统计',
          icon: 'iconfont icon-baobiao',
          children: [
            { title: '数据报表', icon: 'el-icon-menu', route: 'dataStatis' }
          ]
        }
      ],
      activePath: 'roleManage',
      isToggle: true,
      asideWidth: '200px'
    }
  },
  methods: {
    exit() {
      sessionStorage.clear()
      this.$router.replace('/login')
    },
    toggle() {
      this.isToggle = !this.isToggle
      this.isToggle ? this.asideWidth = '200px' : this.asideWidth = '64px'
    },
    onSelect(index, path) {
      const item = this.navList[Number(path[0])]
      const value = [index, [item.title, item.children.find(v => v.route === index).title]]
      sessionStorage.setItem('currentMenu', JSON.stringify(value))
    }
  },
  created() {
    let temp = sessionStorage.getItem('currentMenu')
    if (temp) {
      temp = JSON.parse(temp)
      this.activePath = temp[0]
      this.$router.history.current.params.breadCrumb = temp[1]
    }
  }
}
</script>
<style lang="less" scoped>
.el-container {
  color: #36d712;
  height: 100%;

  .el-header {
    padding-left: 0;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;

    .el-button {
      align-self: center;
    }

    .home-title {
      font-size: 20px;
      line-height: 56px;
      color: #fff;

      img {
        vertical-align: middle;
      }

      span {
        margin-left: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    text-align: left;

    .horizon-bar {
      height: 25px;
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      line-height: 25px;
    }

    .el-menu {
      border: 0;

      .el-menu-item-group>div {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }

      .el-menu-item {
        padding-left: 30px !important;
      }
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>
