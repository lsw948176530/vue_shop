<template>
  <div class="login_container">
    <div class="login_box">
<!--      头像区域-->
      <div class="avatar_box">
        <img src="../../assets/Akali.png" alt="">
      </div>
<!--      登录表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
<!--        用户名-->
        <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
<!--        按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮 重置登录表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，
    // 并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
    login() {
      // 如果返回值是promise 就用 async 和 await 来简化
      this.$refs.loginFormRef.validate(async valid => {
        // 如果是valid是flase 就return
        // 如果valid是true 就发送请求
        if(!valid) return
        // 解构
        const {data: res} = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')

        this.$message.success('登录成功')
        // 1．将登录成功之后的token，保存到客户端的sessionStorage中
        //   1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token只应在当前网站打开期间生效，所以将 token保存在sessionStorage中
        // console.log(res);
        window.sessionStorage.setItem('token', res.data.token)
        // 2．通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')

      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;

    //圆角边框
    border-radius: 3px;

    //放在中间
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); //横轴和负轴移动50%
  }

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    // box-shadow: offset-x offset-y blur spread color inset;
    // blur:模糊 spread:伸展 inset:内凹
    //offset-x：必需，取值正负都可。offset-x水平阴影的位置。
    //offset-y：必需，取值正负都可。offset-y垂直阴影的位置。
    //blur:可选，只能取正值。blur-radius阴影模糊半径，0即无模糊效果，值越大阴影边缘越模糊。
    //spread：可选，取值正负都可。spread代表阴影的周长向四周扩展的尺寸，正值，阴影扩大，负值阴影缩小。
    //color:可选。阴影的颜色。如果不设置，浏览器会取默认颜色，通常是黑色，但各浏览器默认颜色有差异，建议不要省略。可以是rgb(250,0,0)，也可以是有透明值的rgba(250,0,0,0.5)。
    //inset:可选。关键字，将外部投影(默认outset)改为内部投影。inset 阴影在背景之上，内容之下。
    // 向外扩张10px
    box-shadow:0 0 10px #ddd;

    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;


    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    // 盒子溢出处理
    box-sizing: border-box;
  }

  .btns {
    display: flex;
    justify-content: flex-end;
  }

</style>