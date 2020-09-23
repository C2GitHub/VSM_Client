<template>
  <div class="camera-container">
    <el-container>
      <el-row class="topBar" :gutter="10">
        <el-col style="width: 110px">
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
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">
          <el-button ref="photoBtn" @click="handleTakePhoto">拍照</el-button>
        </el-col>
      </el-row>
    </el-container>
    <el-container>
      <el-row :gutter="10">
        <el-col :xs="22" :sm="20" :md="16" :lg="12" :xl="12">
          <div>
            <canvas ref="canvas" width="800px" height="600px"></canvas>
          </div>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
const cv = window.require("opencv");
const fs = window.require("fs");
const path = window.require("path");

let camera = null;
import { mapGetters } from "vuex";

export default {
  name: "Camera",
  components: {},
  data() {
    return {
      imgSrc: path.join(__static, "abc.jpg"),
      cameraOptions: [
        {
          value: 0,
          label: "相机1"
        },
        {
          value: 1,
          label: "相机2"
        },
        {
          value: 2,
          label: "相机3"
        }
      ],
      cameraName: ["相机一", "相机二", "相机三"],
      cameraSelected: 0,
      saveImage: true
    };
  },
  computed: {
    ...mapGetters(["camera_num"])
  },
  created() {},
  methods: {
    handleTakePhoto() {
      let cameraNum = Number(this.camera_num);
      try {
        camera = new cv.VideoCapture(cameraNum ? cameraNum : 0);
      } catch (e) {
        console.log("Couldn't start camera:", e);
      }

      if (!camera) return;

      if (this.cameraTimer) clearInterval(this.cameraTimer);
      this.cameraTimer = setInterval(() => {}, 100);

      camera.read((err, im) => {
        if (err) throw err;
        let imgPath = path.join(__static, "/temp/" + Date.now() + ".jpg");
        im.save(imgPath);
        this.imgSrc = imgPath;

        let img = new Image();
        img.onload = () => {
          this.ctx.drawImage(img, 0, 0, 800, 600);
          fs.unlinkSync(imgPath);
        };
        img.src = imgPath;

        if (!!camera) {
          camera.release();
          console.log("Camera Destroy");
        }
      });
    },
    handleCameraChange(val) {
      this.$store.dispatch("camera/changeCamera", val);
    }
  },
  watch: {},
  mounted() {
    if (!this.ctx) {
      this.ctx = this.$refs.canvas.getContext("2d");
    }
    this.cameraSelected = Number(this.camera_num);
  }
  // beforeRouteEnter(to, form, next) {
  //   try {
  //     camera = new cv.VideoCapture(0);
  //   } catch (e) {
  //     console.log("Couldn't start camera:", e);
  //   }
  //   next()
  // // },
  // beforeRouteLeave(to, form, next) {
  //   if (camera && this.cameraTimer) {
  //     clearInterval(this.cameraTimer)
  //     camera.release();
  //     console.log("Camera Destroy");
  //   }
  //   next()
  // }
};
</script>

<style lang="scss">
.camera-container {
  margin: 0 20px 20px 20px;

  .imgbox {
    width: 800px;
    height: 600px;
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
  width: 100%;
  height: 40px;
  margin: 4px 0;
  padding: 0 10px;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
</style>
