<template>
  <!--布局容器-->
  <el-container>
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/logo.png"/>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--侧边栏区域-->
      <el-aside :width="isCollapse ? '64px':'200px' ">
        <div class="toggle-button" @click="togleCollapse">|||</div>
        <!--侧边栏菜单区域-->
        <!--:collapse-transition="false" 关闭动画-->
        <!-- router -> 导航开启路由模式 -->
        <el-menu :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409FFF" :collapse="isCollapse" :collapse-transition="false" :router="true">
        <!--  一级菜单-->
        <!--  index属性控制同级菜单是否同时展开子级菜单-->
        <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
          <!--一级菜单模板区域-->
          <template slot="title">
            <!--图标-->
            <i :class="iconObj[item.id]"></i>
            <!--文本-->
            <span>{{item.authName}}</span>
          </template>
          <!--二级菜单-->
          <el-menu-item :index="'/' + subItem.path
" v-for="subItem in item.children" :key="subItem.id" @click="saveNavStatus('/' + subItem.path)">
            <template slot="title">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      </el-aside>
      <!--主体区域-->
      <el-main>
      <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 侧边菜单数据
      menuList: [],
      iconObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边菜单列表
    getMenuList () {
      this.$http.get('menus').then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message.error(res.data.meta.msg)
        }
        this.menuList = res.data.data
      })
    },
    // 菜单的折叠与展开
    togleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavStatus (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  }
}
</script>

<style lang="less" scoped>
  .el-container {
    height: 100%;
  }
  .el-header {
    background-color: #373f41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      img {
        height: 40px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background-color: #333744;

    .el-menu {
      border: none;
    }
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    // 鼠标放上去变成小手
    cursor: pointer;
  }
  .el-main {
    background-color: #eaedf1;
  }
</style>
