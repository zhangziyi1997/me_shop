<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="rolesList"  border>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row class="fristTag" v-for="item1 in scope.row.children" :key="item1.id">
                            <el-col :span="4">
                                <!-- 一级标签 -->
                                <el-tag >{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col  :span="20">
                                <!-- 二级标签 -->
                                <el-row class="twoTag"  v-for="item2 in item1.children" :key="item2.id">
                                    <el-col :span="4">
                                        <el-tag type="success" closable >{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级标签 -->
                                    <el-col :span="3" v-for="item3 in item2.children" :key="item3.id" >       
                                        <el-tag type="warning" closable @close="delTag(scope.row ,item3.id)">{{item3.authName}}</el-tag>       
                                    </el-col>
                                </el-row>
                            </el-col>
                            
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"> </el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
                <el-table-column  label="操作"> 
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <!-- 分配角色按钮 -->
                        <el-button type="warning" icon="el-icon-s-tools" size="mini" @click="showSetroleDialogVisible(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>


        </el-card>


        <!-- 分配角色对话框 -->
        <el-dialog
        title="分配角色"
        :visible.sync="roleDialogVisible"
        width="50%"
        @close="resetRights"
        >
        <!-- 主体 -->
        <el-tree
        :data="rightsTree"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"
        :props="treeProps">
        </el-tree>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>


    </div>
</template>

<script>
export default {
    name: 'MeShopRoles',

    data() {
        return {
            // 角色列表
            rolesList: [],
            // 控制分配角色对话框的显示与隐藏
            roleDialogVisible: false,
            // 权限列表树形控件
            rightsTree: [],
            // 树形控件
            treeProps: {
                label: 'authName',
                children: 'children'
            },
            // 树形控件默认选中项
            defKeys: [],
            // 当前即将分配权限的角色id
            roleId: ''
        };
    },

    created() {
        this.getRolesList()
    },

    methods: {
        async getRolesList() {
            const {data:res} = await this.$http.get('roles')
            
            if(res.meta.status !== 200 ) return this.$message.error('获取角色列表失败')

            // console.log(res.data);

            

            this.rolesList = res.data

        },

        // 删除二级三级标签
        async delTag(role,rightId) {
            
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

            if(res.meta.status !== 200) return this.$message.error('删除角色失败')

            this.$message.success('删除角色成功')

            role.children = res.data

        },

        // 展示对话框和设置树形控件
        async showSetroleDialogVisible(role) {

            this.roleId = role.id
            
            const {data:res} = await this.$http.get('rights/tree')

            if(res.meta.status !== 200) return this.$message.error('获取权限列表失败')

            // console.log(res.data);

            this.rightsTree = res.data

            // console.log(this.rightsTree);

            // 递归获取三级权限id
            this.getLeafKeys(role, this.defKeys)

            this.roleDialogVisible = true
        },

        // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys中
        getLeafKeys(node, arr) {
            // 如果当前node节点不包含children树形，则是三级节点
            if(!node.children) {
                return arr.push(node.id)
            } 

            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            });

        },

        // 修复树形控件小bug，每次点击分配角色，三级权限会越来越多
        // 关闭对话框的时候，重置数组
        resetRights() {
            this.defKeys = []
        },

        // 树形控件发情添加权限请求
        // 获取选中和半选中的id
        async allotRights() {
            const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
            // 获取树形控件的引用,调用树形控件内置的方法获取选中和半选中的id，并法如数组中
            
            // console.log(keys);

            // 将数组转为字符串
            const idStr = keys.join(',')
            
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

            if(res.meta.status !== 200) return this.$message.error('分配权限列表失败')

            this.$message.success('分配权限成功')

            this.getRolesList()

            this.roleDialogVisible = false
            

        }

    },
};
</script>

<style   scoped>

.fristTag {
    display: flex;
    justify-self: center;
    align-items: center;
    border-bottom: 1px solid #ccc;
}

.twoTag {
    display: flex;
    justify-self: center;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid #ccc;
}

.twoTag:last-child {
     border-bottom: 0;
}

</style>