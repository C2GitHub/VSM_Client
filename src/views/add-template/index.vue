<template>
  <div class="template-container">
    <el-container>
      <aside :style="{ width: '100%', background: '#fff' }">
        <el-button-group>
          <el-tooltip content="连续采集" placement="top">
            <el-button
              type="primary"
              icon="el-icon-camera"
              @click="keepTakePhoto"
            />
          </el-tooltip>
          <el-tooltip content="拍照" placement="top">
            <el-button
              type="primary"
              icon="el-icon-picture-outline"
              @click="handleTakePhoto"
            />
          </el-tooltip>
          <el-tooltip v-if="addBeing" content="添加模板" placement="top">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addTempPart"
            />
          </el-tooltip>
          <el-tooltip v-if="addBeing" content="连续采集" placement="top">
            <el-button type="primary" icon="el-icon-edit" />
          </el-tooltip>
          <el-button type="primary" icon="el-icon-share" />
          <el-button type="primary" icon="el-icon-delete" />
          <el-button type="primary" icon="el-icon-edit" />
          <el-button type="primary" icon="el-icon-share" />
          <el-button type="primary" icon="el-icon-delete" />
        </el-button-group>

        <div class="right-btn">
          <div class="selectPro">
            <el-tooltip content="模板调用" placement="top">
              <el-select
                v-model="currentProj"
                filterable
                allow-create
                default-first-option
                @change="changeProj"
              >
                <el-option
                  v-for="item in allProj"
                  :key="item.name"
                  :label="item.name"
                  :value="item.projID"
                />
              </el-select>
            </el-tooltip>
          </div>
          <el-button-group>
            <el-tooltip content="新建模板" placement="top">
              <el-button
                type=""
                icon="el-icon-folder-add"
                @click="createNewTemp"
              />
            </el-tooltip>
            <el-tooltip content="模板保存" placement="top">
              <el-button
                type="success"
                icon="el-icon-download"
                @click="saveProj"
              />
            </el-tooltip>
          </el-button-group>
        </div>
      </aside>
    </el-container>
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
        <el-row :gutter="8">
          <el-col
            v-for="part in parts"
            :key="part.partID"
            :xs="{ span: 24 }"
            :sm="{ span: 12 }"
            :md="{ span: 12 }"
            :lg="{ span: 12 }"
            :xl="{ span: 8 }"
            style="padding-right:8px;margin-bottom:20px;"
          >
            <box-card
              :part="part"
              @editPart="editPart"
              @removePart="removePart"
            />
          </el-col>
        </el-row>
      </div>
    </el-container>
  </div>
</template>

<script>
const cv = window.require('opencv')
const fs = window.require('fs')
const ioHook = window.require('iohook')

const path = window.require('path')
import { mapGetters } from 'vuex'
import { createUniqueString } from '@/utils/index'
import proj from '@/utils/proj'
import BoxCard from './BoxCard'
let camera = null

export default {
  name: 'AddTemplate',
  components: { BoxCard },
  data() {
    return {
      cameraTimer: null,
      addBeing: true,
      currentProj: '',
      allProj: [],
      baseCtx: null,
      topCtx: null,
      inputTimer: null,
      inputData: ''
    }
  },
  computed: {
    ...mapGetters(['camera_num']),
    parts() {
      const proj = this.findProj(this.currentProj)
      if (!proj || !proj.parts) {
        return []
      }
      return proj.parts
    }
  },
  watch: {
    addBeing: {
      handler(val) {
        if (!val) {
          var canvas = this.$refs.baseLayer
          canvas.onmouseenter = null
          canvas.style.cursor = 'default'
        }
      }
    },
    currentProj(val) {
      const proj = this.findProj(val)
      if (proj && proj.projSourceImage) {
        var img = new Image()
        img.onload = () => {
          this.baseCtx.drawImage(img, 0, 0, 800, 600)
        }
        img.src = proj.projSourceImage
      }
    },
    inputData: {
      handler(val) {
        if (val === '8888') {
          this.handleTakePhoto()
        }
      },
      immediate: true
    }
  },
  created() {
    // 获取配置文件
    const projObj = proj.getAllProj()
    this.allProj = projObj
  },
  mounted() {
    ioHook.on('keypress', (msg) => {
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
    // start ioHook
    ioHook.start()

    // 初始化canvas背景
    if (!this.baseCtx) {
      this.baseCtx = this.$refs.baseLayer.getContext('2d')
    }
    if (!this.topCtx) {
      this.topCtx = this.$refs.topLayer.getContext('2d')
    }

    // 选择默认配方
    this.currentProj = this.allProj[0].projID
    const proj = this.findProj(this.currentProj)
    if (proj && proj.projSourceImage) {
      var img = new Image()
      img.onload = () => {
        this.baseCtx.drawImage(img, 0, 0, 800, 600)
      }
      img.src = proj.projSourceImage
    } else {
      this.baseCtx.rect(0, 0, 800, 600)
      this.baseCtx.fillStyle = '#000'
      var img = new Image()
      img.onload = () => {
        this.baseCtx.drawImage(img, 350, 250, 100, 100)
      }
      img.src = path.join(__static, './imgs/image.png')
      this.baseCtx.fill()
    }

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
          camera = new cv.VideoCapture(cameraNum || 0)
        } catch (e) {
          console.log("Couldn't start camera:", e)
        }
      }

      // 获取当前编辑配方
      const proj = this.findProj(this.currentProj)
      let imgPath = ''

      // 获取新图像
      camera.read((err, im) => {
        if (err) throw err
        // if (this.addBeing || this.changeBeing) {
        // } else {
        //   imgPath = path.join(__static, "/temp/" + Date.now() + ".jpg");
        // }

        // im.resize(800, 600);
        // console.log("Image saved" + im.width() + "x" + im.height());

        // 创建模板文件夹
        if (!fs.existsSync(path.join(__static, '/proj/' + proj.name))) {
          fs.mkdirSync(path.join(__static, '/proj/' + proj.name))
        }
        imgPath = path.join(
          __static,
          '/proj/' + proj.name + '/scrProjImg' + '.jpg'
        )
        const tempImg = path.join(
          __static,
          '/temp/' + createUniqueString() + '.jpg'
        )
        proj.projSourceImage = imgPath

        im.save(imgPath)
        im.save(tempImg)

        // 将图像绘制到页面
        const img = new Image()
        img.onload = () => {
          this.baseCtx.drawImage(img, 0, 0, 800, 600)
          fs.unlinkSync(tempImg)
        }
        img.src = tempImg

        // 关闭相机
        if (camera) {
          camera.release()
          camera = null
          console.log('Camera Destroy')
        }
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

      this.cameraTimer = setInterval(() => {
        camera.read((err, im) => {
          if (err) throw err
          const basePath = path.join(__static, '/temp')
          const imgPath = basePath + '/' + Date.now() + '.jpg'
          im.save(imgPath)

          const img = new Image()
          img.onload = () => {
            this.baseCtx.drawImage(img, 0, 0, 800, 600)

            let files = []
            if (fs.existsSync(basePath)) {
              files = fs.readdirSync(basePath)
              files.forEach((file, index) => {
                const curPath = basePath + '/' + file
                fs.unlinkSync(curPath)
              })
            }
          }
          img.src = imgPath
        })
      }, 60)
    },
    createNewTemp() {
      return
      // if (this.addBeing) {
      //   this.$message({
      //     type: "info",
      //     message: "请先保存当前模板！"
      //   });
      //   return;
      // }

      // 创建新模板
      this.$prompt('请输入配方名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          this.addBeing = true
          const projBaseProps = {}
          projBaseProps.name = value
          projBaseProps.projID = 'proj-' + createUniqueString()
          projBaseProps.parts = []
          this.$set(this.allProj, this.allProj.length, projBaseProps)
          this.currentProj = projBaseProps.projID
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消创建'
          })
        })
    },
    changeProj() {
      return
      if (false) {
        this.$confirm('模板未保存, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addBeing = false
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      }
    },
    addTempPart() {
      return
      // 改变鼠标样式
      var canvas = this.$refs.topLayer
      canvas.onmouseenter = () => {
        canvas.style.cursor = 'crosshair'
      }

      // 取消创建
      window.onmouseup = e => {
        if (e.which === 3) {
          canvas.onmouseenter = null
          canvas.onmousemove = null
          canvas.style.cursor = 'default'
        }
      }

      // 获取创建点
      var startX, startY, x, y, width, height
      canvas.onmousedown = e => {
        var cBoxRect = canvas.getBoundingClientRect() // x, y, width, height
        if (e.which === 1) {
          startX = e.clientX
          startY = e.clientY
          x = startX - cBoxRect.x
          y = startY - cBoxRect.y
          canvas.onmousemove = ev => {
            width = ev.clientX - startX
            height = ev.clientY - startY
            this.drawRect(x, y, width, height)
          }
        } else {
        }
      }

      // 绘制最终结果
      canvas.onmouseup = e => {
        if (e.which === 1) {
          canvas.onmousedown = null
          canvas.onmousemove = null
          canvas.style.cursor = 'default'
          this.drawRect(x, y, width, height)

          // 创建新模板
          this.$prompt('请输入名称', '提示', {
            confirmButtonText: '确定'
          })
            .then(({ value }) => {
              const proj = this.findProj(this.currentProj)
              const projPath = path.join(__static, '/proj/' + proj.name)
              const sourceImage = projPath + '/scrProjImg.jpg'
              if (fs.existsSync(projPath)) {
                if (fs.existsSync(sourceImage)) {
                  cv.readImage(sourceImage, (err, im) => {
                    const img_crop = im.crop(x, y, width, height)
                    const basePartProps = {
                      name: value,
                      x: x,
                      y: y,
                      width: width,
                      height: height,
                      colorFilter: false,
                      isRun: true,
                      score: 60,
                      color: 'fff',
                      lower_threshold: [0, 0, 0],
                      upper_threshold: [255, 255, 255],
                      lowThresh: 0,
                      highThresh: 120
                    }
                    const partID = 'part-' + createUniqueString()
                    const imgSrc = projPath + '/' + partID + '.jpg'
                    basePartProps.partID = partID
                    basePartProps.img = imgSrc
                    this.$set(proj.parts, proj.parts.length, basePartProps)
                    img_crop.save(imgSrc)
                    this.$message({
                      message: '创建成功！',
                      type: 'success'
                    })
                  })
                } else {
                  throw new Error(projPath + '  路径不存在！')
                }
              } else {
                throw new Error(projPath + '  路径不存在！')
              }
            })
            .catch(() => {})
        }
      }
    },
    saveProj() {
      if (true || this.addBeing) {
        var canvas = this.$refs.topLayer
        canvas.onmouseenter = null
        canvas.onmousemove = null
        canvas.style.cursor = 'default'
      }
      proj.save(this.allProj)
      this.$message({
        message: '保存成功！',
        type: 'success'
      })
    },
    findProj(projID) {
      if (!projID) return
      return this.allProj.find(item => {
        return item.projID === projID
      })
    },
    drawRect(x, y, width, height) {
      if (!this.topCtx) {
        this.topCtx = this.$refs.topLayer.getContext('2d')
      }
      // this.baseCtx.moveTo(x, y);
      // this.baseCtx.lineTo(x + width, y);
      // this.baseCtx.lineTo(x + width, y + height);
      // this.baseCtx.lineTo(x, y + height);
      // this.baseCtx.closePath();
      this.topCtx.clearRect(0, 0, 800, 600)
      this.topCtx.strokeRect(x, y, width, height)
      this.topCtx.lineWidth = '1'
      this.topCtx.strokeStyle = 'red' // 描边颜色
      // this.baseCtx.fillStyle = fillStyle; //填充颜色
      // this.baseCtx.fill(); //填充
      this.topCtx.stroke() // 描边
    },
    editPart(partID) {
      this.$message({
        type: 'success',
        message: partID
      })
    },
    removePart(partID) {
      const pro = this.findProj(this.currentProj)
      const partIndex = pro.parts.findIndex(item => {
        return item.partID === partID
      })
      const part = pro.parts[partIndex]
      if (part.img && fs.existsSync(part.img)) {
        fs.unlinkSync(part.img)
      }
      pro.parts.splice(partIndex, 1)
      proj.save(this.allProj)
    }
  },
  beforeRouteLeave(to, form, next) {
    // if (this.addBeing) {
    //   this.$confirm('模板未保存, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(() => {
    //       this.addBeing = false
    //     })
    //     .catch(() => {
    //       next(false)
    //       return
    //     })
    // }

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
.template-container {
  margin: 0 20px 20px 20px;

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
  margin-right: 5px;
}
.right {
  flex: 1;
  height: 100%;
  overflow: scroll;
  .item-block {
    width: 33.33%;
    height: 33.33%;
    padding: 2px;
  }
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
.right-btn {
  display: inline-block;
  position: absolute;
  right: 20px;
}
.selectPro {
  width: 150px;
  display: inline-block;
  margin-right: 10px;
}
</style>
