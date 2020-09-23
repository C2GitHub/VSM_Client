<template>
  <div class="home-container">
    <!-- <el-container>
      <aside :style="{ width: '100%', background: '#fff' }">
        <el-button-group>
          <el-tooltip content="连续采集" placement="top">
            <el-button
              type="primary"
              icon="el-icon-camera"
              @click="keepTakePhoto"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="拍照" placement="top">
            <el-button
              type="primary"
              icon="el-icon-picture-outline"
              @click="handleTakePhoto"
            ></el-button>
          </el-tooltip>
        </el-button-group>

        <div class="right-btn">
          <div class="selectPro">
            <el-tooltip content="模板调用" placement="top"> </el-tooltip>
          </div>
          <el-button-group>
            <el-tooltip content="模板保存" placement="top">
              <el-button type="success" icon="el-icon-download"></el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </aside>
    </el-container> -->
    <el-container class="mainBox">
      <div class="left">
        <el-card class="canvas-box">
          <canvas
            ref="baseLayer"
            class="baseLayer"
            width="800px"
            height="600px"
          />
          <canvas
            ref="topLayer"
            class="topLayer"
            width="800px"
            height="600px"
          />
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>控制参数</span>
          </div>
          <div style="margin-bottom:50px;">
            <el-row>
              <el-col :span="12">
                <el-tooltip content="连续采集" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-camera"
                    @click="keepTakePhoto"
                  />
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-tooltip content="拍照" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-picture-outline"
                    @click="handleTakePhoto"
                  />
                </el-tooltip>
              </el-col>
            </el-row>
            <el-divider />
            <el-row>
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
              <el-col :span="6">
                <el-row>
                  <el-tooltip content="相机切换" placement="top">
                    <!-- <el-col :span="6" class="text-center">
                      <span class="cameraName"
                        >{{ cameraName[camera_num] }}
                      </span>
                    </el-col> -->

                    <el-col>
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
                  </el-tooltip>
                </el-row>
              </el-col>
            </el-row>
            <el-divider />
            <el-row>
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
            </el-row>
            <el-divider />
            <el-row>
              <el-col> <box-card /></el-col>
            </el-row>
            <!-- <el-divider direction="vertical"></el-divider> -->
          </div>
        </el-card>
      </div>
    </el-container>
  </div>
</template>

<script>
const cv = window.require('opencv')
const fs = window.require('fs')
const ioHook = window.require('iohook')
const path = window.require('path')
const electron = window.require('electron')
import BoxCard from './BoxCard.vue'
import { mapGetters } from 'vuex'
import { createUniqueString, parseTime } from '@/utils/index'

let camera = null

export default {
  name: 'Home',
  components: { BoxCard },
  data() {
    return {
      cameraTimer: null,
      baseCtx: null,
      topCtx: null,
      inputTimer: null,
      inputData: '',
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
      ifSaveImage: true,
      ifImageCheck: true,
      code: '8888',
      storePath: ''
    }
  },
  computed: {
    ...mapGetters(['camera_num', 'triggerCode', 'saveImage', 'imgsPath'])
  },
  watch: {
    inputData: {
      handler(val) {
        if (val === this.triggerCode || val === '8888') {
          this.handleTakePhoto()
        }
      },
      immediate: true
    }
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
  mounted() {
    camera = new cv.VideoCapture(this.cameraNum)
    // console.log(camera);
    setInterval(() => {
      camera.read(() => {})
    }, 80)
    // 监听输入状态
    ioHook.on('keypress', msg => {
      if (this.inputTimer) {
        clearTimeout(this.inputTimer)
        this.inputTimer = null
      }
      if (msg.rawcode !== 32) {
        this.inputData = this.inputData + String.fromCharCode(msg.rawcode)
      }
      this.inputTimer = setTimeout(() => {
        this.inputData = ''
        clearTimeout(this.inputTimer)
        this.inputTimer = null
      }, 200)
    })

    const f1 = ioHook.registerShortcut([59], (keys) => {
      this.keepTakePhoto()
    })
    const f2 = ioHook.registerShortcut([60], (keys) => {
      this.handleTakePhoto()
    })
    // start ioHook
    ioHook.start(true)

    // 初始化canvas背景
    if (!this.baseCtx) {
      this.baseCtx = this.$refs.baseLayer.getContext('2d')
    }
    if (!this.topCtx) {
      this.topCtx = this.$refs.topLayer.getContext('2d')
    }
    this.baseCtx.rect(0, 0, 800, 600)
    this.baseCtx.fillStyle = '#000'
    // this.baseCtx.font = 'bold 24px consolas'
    this.baseCtx.font = '16px consolas'
    // this.baseCtx.font = '20px Times New Roman'
    this.baseCtx.textAlign = 'left'
    this.baseCtx.textBaseline = 'top'
    this.baseCtx.strokeStyle = '#DF5326'
    var img = new Image()
    img.onload = () => {
      this.baseCtx.drawImage(img, 350, 250, 100, 100)
    }
    img.src = path.join(__static, './imgs/image.png')
    this.baseCtx.fill()

    // 改变图像保存路径
    electron.ipcRenderer.on('selectedItem', (e, path) => {
      this.storePath = path
      this.$store.dispatch('app/setImgsPath', path)
    })

    // next
  },
  methods: {
    handleTakePhoto() {
      // 关闭连续采集
      if (this.cameraTimer) {
        clearInterval(this.cameraTimer)
      }
      // 相机是否初始化完成
      if (!camera) {
        const cameraNum = Number(this.camera_num)
        try {
          camera = new cv.VideoCapture(cameraNum)
        } catch (e) {
          console.log("Couldn't start camera:", e)
        }
      }
      // camera.setFPS(1)
      const t = Date.now()
      const dir_name = parseTime(t, '{y}-{m}-{d}')
      const img_name = t.toString(16) + '-' + parseTime(t, '{h}{i}{s}') + '.jpg'
      const fullTime = parseTime(t) // '{y} - {m} - {d} {h} : {i} : {s}'
      const dir_path = path.join(this.imgsPath, dir_name)
      const img_path = path.join(dir_path, img_name)
      const temp_dir = path.join(this.imgsPath, 'temp')
      if (!fs.existsSync(temp_dir)) {
        fs.mkdirSync(temp_dir)
      }
      const temp_path = path.join(temp_dir, img_name)

      // 获取新图像
      camera.read((err, im) => {
        if (err) throw err

        if (!fs.existsSync(dir_path)) {
          fs.mkdirSync(dir_path)
        }
        im.save(temp_path)

        // 将图像绘制到页面
        const img = new Image()
        img.onload = () => {
          this.baseCtx.drawImage(img, 0, 0, 800, 600)
          fs.unlinkSync(temp_path)

          // 绘制图片信息
          this.baseCtx.fillStyle = '#fff'
          this.baseCtx.fillText(img_path, 20, 570)
          this.baseCtx.fillText(fullTime, 600, 570)

          // 保存图片
          if (Number(this.saveImage)) {
            const base64 = this.$refs.baseLayer.toDataURL('image/jpeg')
            // 过滤data:URL
            const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
            const dataBuffer = Buffer.from(base64Data, 'base64')
            fs.writeFileSync(img_path, dataBuffer)
          }
        }
        img.src = temp_path
      })
    },
    keepTakePhoto() {
      if (this.cameraTimer) {
        clearInterval(this.cameraTimer)
        this.cameraTimer = null
      }

      if (!camera) {
        const cameraNum = Number(this.camera_num)
        try {
          camera = new cv.VideoCapture(cameraNum || 0)
        } catch (e) {
          console.log("Couldn't start camera:", e)
        }
      }

      // 缓存路径
      const temp_dir = path.join(this.imgsPath, 'temp')
      if (!fs.existsSync(temp_dir)) {
        fs.mkdirSync(temp_dir)
      }

      this.cameraTimer = setInterval(() => {
        camera.read((err, im) => {
          if (err) throw err
          const imgPath = temp_dir + '/' + Date.now() + '.jpg'
          const fullTime = parseTime(Date.now())
          im.save(imgPath)

          const img = new Image()
          img.onload = () => {
            this.baseCtx.drawImage(img, 0, 0, 800, 600)
            this.baseCtx.fillStyle = '#fff'
            this.baseCtx.fillText(fullTime, 600, 570)
            let files = []
            if (fs.existsSync(temp_dir)) {
              files = fs.readdirSync(temp_dir)
              files.forEach((file, index) => {
                const curPath = temp_dir + '/' + file
                if (fs.existsSync(curPath)) {
                  fs.unlinkSync(curPath)
                }
              })
            }
          }
          img.src = imgPath
        })
      }, 60)
    },
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
  },
  beforeRouteLeave(to, form, next) {
    // 停止camera
    if (this.cameraTimer) {
      clearInterval(this.cameraTimer)
      this.cameraTimer = null
    }
    // 相机连接断开
    // if (camera) {
    //   camera.release()
    //   camera = null
    // }
    next()
  }
}
</script>

<style lang="scss">
.home-container {
  margin: 20px;
  aside {
    padding: 8px 0;
    margin-bottom: 0;
  }
}
.el-row {
  width: 100%;
}
.cameraName {
  display: inline-block;
  height: 40px;
  line-height: 40px;
  font-size: 15px;
  color: #303133;
}
.topBar {
  position: relative;
  width: 100%;
  height: 40px;
  margin: 10px 0;
  padding: 0 10px;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.mainBox {
  width: 100%;
  height: 600px;
  display: flex;
}
.left {
  width: 800px;
  height: 100%;
  margin-right: 10px;
}
.right {
  width: 100%;
  height: 100%;
}
.box-card {
  height: 100%;
}
.canvas-box {
  position: relative;
  width: 800px;
  height: 600px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  .el-card__body {
    padding: 0;
  }
  .baseLayer {
    position: absolute;
    left: 0;
    top: 0;
  }
  .topLayer {
    position: absolute;
    left: 0;
    top: 0;
  }
}
.row-item {
  display: inline-block;
}
.col-item div{
  display: inline-block;
  height: 36px;
  line-height: 36px;
}
.col-item .item-title{
  margin-right: 10px;
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
