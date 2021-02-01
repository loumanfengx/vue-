<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!--Alert提示区域-->
        <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
        <!--步骤条区域-->
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!--添加商品form表单区域-->
        <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px" label-position="top">
        <!--tab标签页-->
          <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addGoodsForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品重量" prop="goods_weight">
                <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number">
                <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader v-model="addGoodsForm.goods_cat" :options="cateListData" :props="cascaderProps"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品参数" name="1">
              <!--渲染商品参数表单item项-->
              <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id" >
                <!--渲染attr_val多选框 (复选框组)-->
                <el-checkbox-group v-model="item.attr_vals" >
                  <el-checkbox :label="av" v-for="(av,i) in item.attr_vals" :key="i" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!--action 表示图片上传的后台API地址-->
              <el-upload class="upload-demo" :action="uploadURL" :on-preview="handlePreview"
                :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!--富文本编辑器组件 需要安装quill-editor开发依赖-->
              <quill-editor v-model="addGoodsForm.goods_introduce"/>
            <!--  添加商品的按钮-->
              <el-button type="primary" class="btnAdd" @click="addBtn">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
      <!--图片预览区域-->
      <el-dialog title="图片预览" :visible.sync="previewDialogVisible" width="50%">
        <img :src="picPreviewPath" alt="" class="previewImg">
      </el-dialog>
    </div>

</template>
<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data () {
    return {
      activeIndex: '0',
      // 添加表单数据对象
      addGoodsForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属分类数组
        goods_cat: [],
        // 图片的数组
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        attrs: []
      },
      // 添加表单验证规则对象
      addGoodsFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },
      // 商品分类列表数据
      cateListData: [],
      // 级联选择器配置
      cascaderProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 商品参数数据（动态参数）
      manyTableData: [],
      // 商品参数数据（静态属性）
      onlyTableData: [],
      // 图片上传路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览路径
      picPreviewPath: '',
      previewDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      this.cateListData = res.data
    },
    // 级联选择器选中项变化时出发
    handleChange () {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    // 切换标签页选项卡事件处理函数
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // Tab标签被选中时触发
    async tabClicked () {
      // 访问动态参数面板
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }
        // 将取得商品参数数据中的attr_vals 转为数组类型
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.getCateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性列表失败！')
        }
        this.onlyTableData = res.data
      }
    },
    // 处理图片的预览效果
    handlePreview (file) {
      this.picPreviewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const index = this.addGoodsForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splic 方法，把图片信息对象，从pics 数组中移除
      this.addGoodsForm.pics.splice(index, 1)
    },
    // 监听图片上传成功的事件
    handleSuccess (response) {
      // 1. 拼接得到一个图片信息对象
      // { pic: response.data.tmp_path } 代表一个object对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push到pics数组中
      this.addGoodsForm.pics.push(picInfo)
    },
    addBtn () {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) {
          this.$message.error('请输入必填的表单项！')
        }
        //  后续的逻辑业务
        // cloneDeep 深拷贝 需要安装loadsh开发依赖
        const form = _.cloneDeep(this.addGoodsForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addGoodsForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.addGoodsForm.attrs

        //  发起请求添加商品
        //  商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$router.push('/goods')
        this.$message.success('添加商品成功')
      })
    }
  },
  computed: {
    getCateId () {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>
