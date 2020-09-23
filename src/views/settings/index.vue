<template>
  <div class="setting-container">
    <el-container>
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>相机选择</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-col :span="2" class="text-center">
              <span class="cameraName">{{ cameraOptions[camera_num].label }}</span>
            </el-col>
            <el-col :span="8">
              <el-select
                v-model="cameraSelected"
                filterable
                allow-create
                default-first-option
                @change="handleCameraChange"
              >
                <el-option
                  v-for="item in cameraOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </div>
        </el-card>
      </el-row>

    </el-container>
    <el-container style="margin-top:20px;">
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图像存储路径设置</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-col class="changePath">
              <div class="path-title">存储路径: </div>
              <el-tooltip content="存储路径" placement="top">
                <div class="path-content">
                  <el-input
                    v-model="storePath"
                    placeholder="默认路径"
                    :readonly="true"
                  >
                    <el-button slot="append" type="success" icon="el-icon-folder-opened" @click="handleChangePath" />
                  </el-input>
                </div>
              </el-tooltip>
            </el-col>
          </div>
        </el-card>
      </el-row>
    </el-container>
    <el-container style="margin-top:20px;">
      <el-row>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>图像存储路径设置</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-tooltip content="设置触发码" placement="top">
              <el-col :span="10" class="triger-box">
                <div class="triger-title">触发码: </div>
                <div class="triger-input">
                  <el-input
                    v-model="code"
                    placeholder="请输入内容"
                    @change="handleCodeChange"
                  />
                </div>
              </el-col>
            </el-tooltip>

            <el-col :span="8" style="margin-top: 8px; padding-left: 20px;">
              <div class="row-item">
                <span style="margin-right: 10px">保存图像</span>
                <el-switch
                  :value="saveImage == 1 ? true : false"
                  class="drawer-switch"
                  @change="cameraSetting('saveImage')"
                />
              </div>
              <!-- <el-divider direction="vertical" /> -->
            </el-col>
          </div>
        </el-card>
      </el-row>
    </el-container>
  </div>
</template>

<script>
const electron = window.require('electron')
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      cameraOptions: [
        {
          value: 0,
          label: '相机一'
        },
        {
          value: 1,
          label: '相机二'
        },
        {
          value: 2,
          label: '相机三'
        }
      ],
      cameraSelected: 0,
      storePath: ''
    }
  },
  computed: {
    ...mapGetters(['camera_num', 'triggerCode', 'saveImage', 'imgsPath'])
  },
  created() {
    // 相机信息
    this.cameraNum = this.camera_num
    this.cameraSelected = Number(this.camera_num)
    this.ifSaveImage = this.saveImage != 0

    // 触发码
    this.code = this.triggerCode

    // 图像保存路径
    this.storePath = this.imgsPath
  },
  methods: {
    handleCameraChange(val) {
      this.$store.dispatch('camera/changeCamera', val)
    },
    cameraSetting(type) {
      this.$store.dispatch('camera/cangeCameraSettings', type)
    },
    handleCodeChange(val) {
      this.$store.dispatch('app/settriggerCode', val)
    },
    handleChangePath() {
      console.log('handleChangePath')
      electron.ipcRenderer.send('open-directory-dialog', 'openDirectory')
    }
  }
}
</script>

<style lang="scss">
.setting-container {
  margin: 20px;
}
.el-row {
  width: 100%;
}
.cameraName {
  display: block;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  color: #303133;
}
.changePath{
  display: flex;
}
.changePath .path-title{
  width: 70px;
  line-height: 36px;
  margin-right: 10px;
}
.changePath .path-content{
  flex: 1;
}
.triger-box{
  display: flex;
  text-align: center;
  .triger-title{
    width: 70px;
    line-height: 36px;
    margin-right: 6px;
  }
  .triger-input{
    flex: 1;
  }
}
</style>
