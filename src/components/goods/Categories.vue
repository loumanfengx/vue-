<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
  <!--  卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--  第三方表格区域-->
      <tree-table
        class="treeTable" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false"
        index-text="#" :show-row-hover="false" show-index border>
        <!--是否有效列-->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!--排序列-->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
      <!--  操作列-->
        <template slot="operation">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--  分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 5]"
                     :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!--添加分类对话框区域-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="addCateDialogClosed" width="30%">
      <!--添加分类表单区域-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--级联选择器区域(下拉框联动)-->
          <!--options 用来指定数据源-->
          <!--props 用来指定配置对象-->
          <el-cascader v-model="selectedKysArray" :options="parentCateList"
            :props="cascaderProps" @change="parentCateChanged" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateButton">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 查询信息
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 数据总条数属性
      total: 0,
      // 分类列表数据
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
          // align: 'center'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'operation'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类表单数据对象
      addCateForm: {
        // 将要添加分类名称
        cat_name: '',
        // 分类父级id
        cat_pid: 0,
        // 分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level: 0
      },
      // 添加分类表单验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // 次级菜单的展开方式 可选值：click / hover
        expandTrigger: 'hover',
        // 是否严格的遵守父子节点不互相关联
        checkStrictly: true
      },
      // 选中的父级分类的id数组
      selectedKysArray: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表数据方法
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      console.log(res.data)
      // 把列表数据赋值给 cateList
      this.cateList = res.data.result
      // 把数据总条数赋值给total
      this.total = res.data.total
    },
    // 监听 pageSize  改变事件
    handleSizeChange (newPagesize) {
      this.queryInfo.pageSize = newPagesize
      this.getCateList()
    },
    // 监听 pagenum 改变事件
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    },
    // 监听添加分类按钮点击事件
    showAddCateDialog () {
      // 获取父级分类列表数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 监听添加分类对话框关闭事件
    addCateDialogClosed () {
      // resetFields 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
      this.$refs.addCateFormRef.resetFields()
      this.selectedKysArray = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 获取父级分类列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (!res.meta.status === 200) {
        this.$message.error('获取父级分类列表失败！')
      }
      this.parentCateList = res.data
    },
    // 监听级联选择器选项发生变化事件
    parentCateChanged () {
      // 如果 selectedKeys 数组中的 length 大于0 ，证明选中了
      // 反之，就说明没有选中任何父级分类
      // 父级分类
      if (this.selectedKysArray.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKysArray[this.selectedKysArray.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKysArray.length
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 监听 点击添加分类对话框确定按钮事件
    addCateButton () {
      // 对表单数据进行预验证
      this.$refs.addCateFormRef.validate(async valid => {
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        console.log(this.addCateForm)
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败!')
        }
        this.addCateDialogVisible = false
        this.$message.success('添加分类成功')
        this.getCateList()
      })
    }
  }

}
</script>

<style scoped>
  .treeTable {
    margin-top: 20px;
  }
</style>
