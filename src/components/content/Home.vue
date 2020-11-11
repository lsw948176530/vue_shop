<template>

<!--  头部区域-->
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../../assets/Akali.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
<!--    页面主体区域-->
    <el-container>
<!--      侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <i class="el-icon-caret-right"></i>
        </div>
<!--        侧边栏菜单区域-->
        <el-menu
            background-color="rgb(50,55,68)"
            text-color="#fff"
            active-text-color="rgb(52,155,255)"
            :unique-opened="true"
            :collapse=isCollapse
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
        >
<!--          一级菜单-->
<!--          index 应该是个字符串 item.id是number + ''就变成字符串了-->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
<!--            一级菜单的模板区域-->
            <template slot="title">
<!--              图标-->
              <i :class="iconsObj[item.id]"></i>
<!--              文本-->
              <span>{{item.authName}}</span>
            </template>
<!--            二级菜单-->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <!--            一级菜单的模板区域-->
              <template slot="title">
                <!--              图标-->
                <i class="el-icon-menu"></i>
                <!--              文本-->
                <span>{{subItem.authName}}</span>
              </template>

            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
<!--      右侧内容主体-->
      <el-main>
<!--        路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        '125': 'el-icon-s-custom',
        '103': 'el-icon-s-cooperation',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-data-analysis'
      },


      // 是否折叠 false不折叠
      isCollapse: false,
      // 被激活的连接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      // 清空token
      window.sessionStorage.clear()
      // 条状到登录页
      this.$router.push('/login')
    },
    async getMenuList() {// 获取所有的菜单
      const {data: res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res);
    },
    // 点击按钮, 切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse =  !this.isCollapse
      // if (this.isCollapse) {
      //   console.log('11');
      // }
      // console.log('22');
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    //左右贴边对齐
    justify-content: space-between;
    // 清除左边空白
    padding-left: 0;
    // 按钮居中
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      // 纵向居中对齐
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-header img{
    height: 60px;
    width: 60px;
  }

  .el-aside {
    background-color: rgb(50,55,68);
   transition: width 0.2s;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: rgb(234,237,242);
  }
  
  .toggle-button {
    background-color: rgb(74,80,98);
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    //  letter-spacing用于设置文本字符的间距表现。
    letter-spacing: 0.2em;
    //光标变成手
    cursor: pointer;
  }


</style>