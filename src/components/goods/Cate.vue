<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片区域 -->
        <el-card>
            <!-- 添加分类按钮 -->
            <el-row>
                <el-col>
                     <el-button type="primary" @click="showCategoriesDialogVisible">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <tree-table 
            class="treeTable"
            :data="categoriesList"
            :columns="columns"
            show-index
            :expand-type="false"
            :selection-type="false"
            border
            >
            <!-- 是否有效 -->
            <template slot="isOk" slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                <i class="el-icon-error" v-else></i>
            </template>

            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
                <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
                <el-tag type="info" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                <el-tag type="warning" v-else>三级</el-tag>
            </template>

            <!-- 操作 -->
            <template slot="opt" > 
                <!-- 编辑 -->
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>


            </tree-table>


            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>

        </el-card>

        <!-- 添加分类对话框 -->
        <el-dialog
        title="添加分类"
        :visible.sync="categoriesDialogVisible"
        width="50%"
        @close='categoriesDialogVisibleClose'
        >
        <!-- 主体 -->
        <el-form :model="categoriesForm" :rules="categoriesFormRules" ref="categoriesFormRef"   label-width="100px">
            <el-form-item label="分类名称" prop="cat_name">
                <el-input v-model="categoriesForm.cat_name"></el-input>
            </el-form-item>
            <el-form-item label="父级分类">
                <el-cascader
                v-model="selectedKeys"
                :options="parentCateList"
                :props="{ 
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'

                 }"
                 @change="parentCateChanged"
                 clearable
                 change-on-select 
                ></el-cascader>
            </el-form-item>
        </el-form>
        <!-- 底部 -->
        <span slot="footer" class="dialog-footer">
            <el-button @click="categoriesDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
        </el-dialog>
        

    </div>
</template>

<script>
export default {
    name: 'MeShopCate',

    data() {
        return {
            // 请求商品分类数据列表参数
            queryInfo: {
                // 页码值
                pagenum: 1,
                // 每页显示条数
                pagesize: 10
            },
            // 总数
            total: 0,
            // 商品列表数据
            categoriesList: [],
            // 树形表格各列配置
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',

                },
                {
                    label: '是否有效',
                    type:  'template',
                    template: 'isOk'

                },
                {
                    label: '排序',
                    type:  'template',
                    template: 'order'
                    
                },
                {
                    label: '操作',
                    type:  'template',
                    template: 'opt'
                },
            ],
            // 控制添加分类对话框
            categoriesDialogVisible: false,
            // 添加分类数据
            categoriesForm: {
                // 分类父 ID
                cat_pid: 0,
                // 分类名称
                cat_name: '',
                // 分类层级
                cat_level: 0
            },
            // 添加分类表单验证
            categoriesFormRules: {
                 cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ],
            },
            // 父节点分类
            parentCateList: [],
            // 级联选择器选中的父级分类id
            selectedKeys: []


            
        };
    },

    mounted() {
        // 获取商品分页数据
        this.getCategoriesList()

        
    },

    methods: {
        // 获取商品分页数据
        async getCategoriesList() {
            const { data:res } = await this.$http.get('categories', { params: this.queryInfo })

            if(res.meta.status !== 200) return this.$message.error('获取商品列表数据失败')
            
            // console.log(res.data);

            this.categoriesList = res.data.result

            this.total = res.data.total

        },

        // 实现分页展示多少条数据
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCategoriesList()
        },
        // 实现页码跳转
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCategoriesList()
        },

        // 显示添加分类对话框
        showCategoriesDialogVisible() {
            // 获取父级分类
            this.getParentCateList()
            this.categoriesDialogVisible = true
        },

        // 获取父级分类列表
        async getParentCateList() {
            const {data:res} = await this.$http.get('categories', { params: { type: 2 } })

            if(res.meta.status !== 200) return this.$message.error('获取父级分类hi吧')

            // console.log(res.data);

            this.parentCateList = res.data
        },

        // 级联选择器父级分类发生变化触发
        parentCateChanged() {
            // console.log(this.selectedKeys);
            
            if(this.selectedKeys.length > 0) {
                this.categoriesForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                this.categoriesForm.cat_level = this.selectedKeys.length
                return
            }else {
                this.categoriesForm.cat_pid = 0
                this.categoriesForm.cat_level = 0
            }
        },
        // 点击添加分类对话框确认按钮
        addCate() {
            // console.log(this.categoriesForm);
            // 对表单进行预验证
            this.$refs.categoriesFormRef.validate(async valid=> {
                if(!valid) return

                const {data:res} = await this.$http.post('categories', this.categoriesForm)

                if(res.meta.status !== 201) return this.$message('添加分类失败')

                this.$message.success('添加分类成功')

                this.getCategoriesList()
                
                this.categoriesDialogVisible = false

            })
        },

        // 添加分类对话框关闭重置表单
        categoriesDialogVisibleClose() {
            this.$refs.categoriesFormRef.resetFields()
            this.selectedKeys = []
            this.categoriesForm.cat_pid = 0
            this.categoriesForm.cat_level = 0
        }
        
    },
};
</script>

<style scoped>
    .treeTable {
        margin: 20px 0;
    }

</style>