<template>
  <div class="status-container">
    <el-row class="sr_status">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>通讯IO模块状态</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="24">
            <div style="display:inline-block;">
              <label class="radio-label">连接状态</label>
              <el-radio-group value="sr_port_status" text-color="red" fill="red">
                <el-radio :label="true" border>
                  {{ sr_port_status ? "连接成功" : "连接失败" }}
                </el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </div>
      </el-card>
    </el-row>
    <el-row class="sr_operation">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>通讯IO模块手动测试</span>
        </div>
        <div style="margin-bottom:50px;">
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn blue-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn light-blue-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn pink-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn green-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn tiffany-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
          <el-col :span="4" class="text-center">
            <router-link class="pan-btn yellow-btn" to="/status/status">
              Test
            </router-link>
          </el-col>
        </div>
      </el-card>
    </el-row>
    <el-row class="sr_status">
      <el-card class="box-card">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Status',
  components: {},
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['sr_port']),
    sr_port_status() {
      // if (!this.sr_port) return false;
      return true
    }
  },
  created() {}
}
</script>

<style lang="scss" scoped>
.status-container {
  margin: 20px;
  .el-row {
    margin-bottom: 20px;
  }
}
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
