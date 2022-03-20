<template>
    <div class="login">
        <div class="loginBox">
            <span class="title">电商后台管理系统</span>
            <!-- 登录表单 -->
            <el-form :model="loginForm" :rules="loginRules" ref="loginRef" >
                <el-form-item  prop="username">
                    <el-input prefix-icon="el-icon-user" placeholder="请输入账号" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item   prop="password">
                    <el-input prefix-icon="el-icon-search" placeholder="请输入密码" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-row class="btn">
                    <el-button type="primary" @click="getLogin">登录</el-button>
                    <el-button type="info" @click="restForm">重置</el-button>
                </el-row>
            </el-form>
 


        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',

    data() {
        return {
            // 登录账号密码
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单验证对象
            loginRules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
            }



        };
    },

    created() {
        
    },

    methods: {
        // 重置表单
        restForm() {
            
            this.$refs.loginRef.resetFields()
        },

        // 对整个表单进行预验证，验证通过后发起登录请求
        getLogin() {
            this.$refs.loginRef.validate(async (valid) => {
                //console.log(valid)
                if (!valid) {
                    return this.$message.error('账号密码错误')
                }
                // 发起登录请求
                const {data:res} = await this.$http.post('login',  this.loginForm )
                if (res.meta.status !== 200) {
                    return this.$message.error('账号密码错误')
                }
                //console.log(res.data)
                // 保存token
                window.sessionStorage.setItem('token', res.data.token)
                // 跳转页面
                this.$router.push('/home')
                // 弹出登录成功弹框
                this.$message.success("登录成功")

            })    
        }
    },
};
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    background-color: #ccc;
    position: relative;
    .loginBox {
        width: 450px;
        height: 300px;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        text-align: center;
        .el-form {
            width: 100%;
            position: absolute;
            bottom: 0;
            padding: 0 10px;
            box-sizing: border-box;
            .btn {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 5px;
            }
        }
    }
}
</style>