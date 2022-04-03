<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                    <!-- 输入框 -->
                    <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getUsersList">
                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="7">
                    <!-- 添加按钮 -->
                      <el-button type="primary" @click="showAddDialogVisible">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
             <el-table :data="usersList">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"> </el-table-column>
                <el-table-column prop="email" label="邮箱"> </el-table-column>
                <el-table-column prop="mobile" label="电话"> </el-table-column>
                <el-table-column prop="role_name" label="角色"> </el-table-column>
                <el-table-column label="状态"> 
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作"> 
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUser(scope.row.id)"></el-button>
                        <!-- 分配按钮 -->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-s-tools" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加用户对话框 -->
        <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="resetAddForm"
        >
        <!-- 内容主体 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"  label-width="70px">
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item label="密码" prop="password">
                <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <!-- 邮箱 -->
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <!-- 手机 -->
            <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
        </el-dialog>

        <!-- 修改用户对话框 -->
        <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="resetEditForm"
       >
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" >
            <el-form-item label="用户名">
                <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
        </el-dialog>


    </div>
</template>

<script>
export default {

    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
            // 合法的邮箱
            return cb()
        }

        cb(new Error('请输入合法的邮箱'))
        }

        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
            return cb()
        }

        cb(new Error('请输入合法的手机号'))
        }


        return {
            // 用户列表请求参数
            queryInfo: {
                // 查询参数
                query: '',
                // 当前页码
                pagenum: 1,
                // 每页显示条数
                pagesize: 2
            },
            // 总数
            total: 0,
            // 用户列表数据
            usersList: [],
            // 控制对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户表单
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加用户表单验证规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制修改对话框的显示与隐藏
            editDialogVisible: false,
            // 修改用户表单
            editForm: {},
            // 表单验证规则
            editFormRules: {
                 email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },



        };
    },

    mounted() {
        this.getUsersList()
    },

    methods: {
        // 获取用户列表
        async getUsersList() {
            const {data:res} = await this.$http.get('users', { params: this.queryInfo })

            if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败')

            // console.log(res.data);

            this.usersList = res.data.users
            this.total = res.data.total
            // console.log(this.usersList);
        },

        // 分页的每页显示条数改变
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.queryInfo.pagesize = newSize
            this.getUsersList()
        },

        // 分页的页码
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUsersList()
        },

        // 添加用户按钮对话框
        showAddDialogVisible() {
            // 显示对话框
            this.addDialogVisible  =  true
        },

        // 重置表单验证
        resetAddForm() {
            this.$refs.addFormRef.resetFields()
        },

        // 对表单进行预验证，并发起添加用户请求
        addUser() {
            this.$refs.addFormRef.validate(async (valid) => {
                // console.log(valid);
                if(!valid) return this.$message.error('信息填写不正确')

                // 发起添加用户请求
                const {data:res} = await this.$http.post('users', this.addForm)

                if(res.meta.status !== 201) return this.$message.error('添加用户失败')

                console.log(res.data);
                this.$message.success('添加用户成功')

                this.addDialogVisible  =  false

                this.getUsersList()

            })
        },

        // 修改用户信息按钮
        async showEditDialog(id) {
            // console.log(id);
            const {data:res} = await this.$http.get(`users/${id}`)

            if(res.meta.status !== 200) return this.$message.error('修改用户信息错误')

            // console.log(res.data);

            this.editForm = res.data

            this.editDialogVisible = true
        },      
        
        // 重置修改用户信息表单
        resetEditForm() {
            this.$refs.editFormRef.resetFields()
        },

        // 修改用户信息
        editUserInfo() {
            this.$refs.editFormRef.validate(async (valid)=> {
                // console.log(valid);
                if(!valid) return this.$message.error('请填写正确信息')

                const {data:res} = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })

                if(res.meta.status !== 200) return this.$message.error('修改用户信息失败')


                this.$message.success('修改用户信息成功')

                this.getUsersList()

                this.editDialogVisible = false


            })
        },

        // 删除用户
        delUser(id) {
             this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async  () => {
                    const {data:res} = await this.$http.delete(`users/${id}`)
                    
                    if(res.meta.status !== 200) return this.$message.error('删除失败')
                    
                    this.getUsersList()

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
             });
        },

    },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}

.el-pagination {
    margin-top: 20px;
}

</style>