<template>
    <div class="containerBox">
        <el-container>
            <!-- 布局头部 -->
            <el-header>
                <!-- logo和标题 -->
                <div class="title">
                    <img src="../assets/heima.png" alt="">
                    <span>电商后台管理系统</span>
                </div>

                <!-- 退出按钮 -->
                 <el-button type="primary" @click="clearToken">退出</el-button>

            </el-header>
            <!-- 布局下部 -->
            <el-container>
                <!-- 左侧边栏 -->
                <el-aside width="200px">
                    <el-menu
                    class="el-menu-vertical-demo"
                    background-color="#373d41"
                    text-color="#fff"
                    active-text-color="#ffd04b"
                    unique-opened
                    >
                    <!-- 一级导航 -->
                    <el-submenu :index="item1.id" v-for="item1 in menuList" :key="item1.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item1.authName}}</span>
                        </template>

                        <!-- 二级导航 -->
                        <el-menu-item v-for="item2 in item1.children" :key="item2.id">
                        <template slot="title">{{item2.authName}}</template>
                        </el-menu-item>
                    </el-submenu>
                    </el-menu>
                </el-aside>


                <!-- 主体内容区域 -->
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'Home',

    data() {
        return {
            // 左侧边栏数据
            menuList: [],
            
        };
    },

    mounted() {
        this.getMenuList()
    },

    methods: {
        // 点击退出，主页，返回登录页面
        clearToken() {
            // 原理：清除token
            window.sessionStorage.clear()
            // 跳转回登录页面
            this.$router.push('./login.vue')
        },

        // 获取侧边栏信息
        async getMenuList() {
            const {data:res} = await this.$http.get('menus')

            if (res.meta.status !== 200) {
                return this.$message.error('获取左侧菜单列表失败')
            }

            console.log(res.data)

            this.menuList = res.data

        }
        
    },
};
</script>

<style lang="less" scoped>

.containerBox {
    height: 100%;
    width: 100%;
    .el-container {
        height: 100%;
        width: 100%;
    }
}

.el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    color: #fff;
    font-size: 20px;
    background-color: #373d41;
    .title {
        display: flex;
        span {
            // vertical-align: middle;
            line-height: 56px;
            margin-left: 10px;
        }
    }
    .el-button {
        margin-right: 20px;
    }
}

.el-menu-vertical-demo {
    height: 100%;
    border-right:  0;
}
.el-menu-item-group {
    font-size: 16px;
}

</style>