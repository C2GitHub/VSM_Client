<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header">
        <a class="link-type link-title">
          主题切换
        </a>
      </div>
      <div class="box-item">
        <span class="field-label">换肤 : </span>
        <el-switch v-model="theme" />
        <aside style="margin-top:15px;">
          Tips: 不同的换肤方法。
        </aside>
      </div>
    </el-card>

    <div class="block">
      <el-tag v-for="tag in tags" :key="tag.type" :type="tag.type" class="tag-item">
        {{ tag.name }}
      </el-tag>
    </div>

    <div class="block">
      <el-radio-group v-model="radio">
        <el-radio :label="3">
          Option A
        </el-radio>
        <el-radio :label="6">
          Option B
        </el-radio>
        <el-radio :label="9">
          Option C
        </el-radio>
      </el-radio-group>
    </div>
    <el-container style="width:100%">
      <el-row class="sr_status" style="width:100%">
        <el-card class="box-card" style="width:100%">
          <div slot="header" class="clearfix">
            <span>提示</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-col :span="24">
              <div style="display:inline-block; margin-right: 20px;">
                <h3>功能开发中...</h3>
              </div>
              <router-link class="pan-btn green-btn" to="/">
                返回主画面
              </router-link>
            </el-col>
          </div>
        </el-card>
      </el-row>
    </el-container>
  </div>
  
</template>

<script>
import { toggleClass } from '@/utils'
import '@/assets/custom-theme/index.css' // the theme changed version element-ui css

export default {
  name: 'Theme',
  data() {
    return {
      theme: false,
      tags: [
        { name: 'Tag One', type: '' },
        { name: 'Tag Two', type: 'info' },
        { name: 'Tag Three', type: 'success' },
        { name: 'Tag Four', type: 'warning' },
        { name: 'Tag Five', type: 'danger' }
      ],
      slideValue: 50,
      radio: 3
    }
  },
  watch: {
    theme() {
      toggleClass(document.body, 'custom-theme')
    }
  }
}
</script>

<style scoped>
.field-label{
  vertical-align: middle;
}
.box-card {
  width: 100%;
  /* margin: 20px auto; */
}

.block {
  padding: 30px 24px;
}

.tag-item {
  margin-right: 15px;
}
</style>
