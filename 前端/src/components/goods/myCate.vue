<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showaddcatedialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" @click="shanchu(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addcatedialogVisible" width="50%">
      <!-- 添加分类的表单 -->
      <el-form :model="addcateForm" :rules="addcateFormrules" ref="addcateFormref" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addcateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <el-cascader expand-trigger="hover" :options="parentcatelist" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表,默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '是否有效', type: 'template', template: 'isok' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 控制添加分类对话框的显示与隐藏
      addcatedialogVisible: false,

      // 添加分类的表单数据对象
      addcateForm: {
        cat_name: '',
        cat_pid: '0',
        cat_level: '0'
      },
      // 添加分类表单的验证规则
      addcateFormrules: {
        cat_name: [{ require: true, messsage: '请输入分类的名称', trigger: 'blur' }]
      },
      // 父级分类的列表
      parentcatelist: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 选中的父级分类id数组
      selectedKeys: []
    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    // 获取商品分类数据
    async getcatelist () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      // if (res.meta.state !== 200) {
      //   return this.$message.error('获取商品分类败笔')
      // }
      console.log(res.data)
      // 把数据列表赋值给catelist
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getcatelist()
    },
    // 监听pagenum改变
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getcatelist()
    },
    // 点击按钮展示添加分类的对话框
    showaddcatedialog () {
      // 先获取父级分类的数据列表
      this.getparentcatelist()
      this.addcatedialogVisible = true
    },
    // 获取父级分类的数据列表
    async getparentcatelist () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // if (res.meta.state !== 201) {
      //   return this.$messsage.console.error('获取父级分类数据失败')
      // }
      console.log(res.data)
      this.parentcatelist = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      console.log(this.selectedKeys)
      // 如果selectedKeys数组中的length大于0,证明选中了父级分类
      // 反之,就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addcateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addcatedialogVisible.cat_level = this.selectedKeys.length
      } else {
        this.addcateForm.cat_pid = 0
        this.addcatedialogVisible.cat_level = this.selectedKeys.length
      }
    },
    // 点击按钮添加新的分类
    addcate () {
      this.$refs.addcateFormref.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('categories', this.addcateForm)
        if (res.meta.status !== 201) {
          return this.$messsage.error('添加分类失败')
        }
        this.$message.success('添加分类成功!')
        this.getcatelist()
        this.addcatedialogVisible = false
      })
    },
    // 监听对话框的关闭事件,重置表单数据
    addcatedialogClosed () {
      this.$refs.addcateFormrules.resetFields()
      this.selectedKeys = []
      this.addcateForm.cat_level = 0
      this.addcateForm.cat_pid = 0
    },
    // 删除
    async shanchu (id) {
      const confirRustle = await this.$confirm('此操作将永久删除该文件, 是否继续?', '删除分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirRustle !== 'confirm') {
        return this.$message.info('已取消删除操作!')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      // if (res.meta.status !== 200) {
      //   return this.$message.error('分类删除失败!')
      // }
      console.log(res)
      this.$message.success('该分类已经成功删除!')
      this.getcatelist()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
