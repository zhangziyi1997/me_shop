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
                <el-aside :width=" isCollapse ? '64px' : '200px'">
                    <!-- 折叠按钮 -->
                    <div class="changeAside" @click="changeAside">|||</div>
                    <el-menu
                     background-color="#333744"
                     text-color="#fff"
                     active-text-color="#409EFF"
                     unique-opened
                     :collapse="isCollapse"
                     router
                     :default-active="activePath"
                     >
                    <!-- 一级导航 -->
                        <el-submenu :index="item1.id +''" v-for="item1 in menuList" :key="item1.id">
                            <!-- 一级标题模板 -->
                            <template slot="title">
                                <!-- 图标 -->
                                <i :class=" iconsObj[item1.id] "></i>
                                <!-- 文本 -->
                                <span>{{item1.authName}}</span>
                            </template>

                            <!-- 二级导航 -->
                            <el-menu-item :index="'/' + item2.path" v-for="item2 in item1.children" :key="item2.id"  @click="saveNavState('/' + item2.path)">
                                <template slot="title">
                                    <!-- 图标 -->
                                    <i class="el-icon-menu"></i>
                                    <!-- 文本 -->
                                    <span>{{item2.authName}}</span> 
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>


                <!-- 主体内容区域 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
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
            // 自定义字体图标
            iconsObj: {
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 折叠侧边栏
            isCollapse: false,

            // 激活导航项的链接
            activePath: ''
        };
    },

    created() {
        this.getMenuList()

        this.activePath = window.sessionStorage.getItem('activePath')
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

            // console.log(res.data)

            this.menuList = res.data

        },

        // 折叠侧边栏
        changeAside() {
            this.isCollapse = ! this.isCollapse
        },

        // 保存导航的高亮值
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
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
.el-menu {
  border-right:  none;
}

.el-menu {
    height: 640px;
}

.el-menu-item-group {
    font-size: 16px;
}

.iconfont {
    padding-right: 10px;
}

.changeAside {
    background-color: #333744;
    text-align: center;
    cursor: pointer;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
}

</style>