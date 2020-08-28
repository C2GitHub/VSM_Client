<template>
  <div class="camera-container">
    <el-container>
      <el-row :gutter="10">
        <el-col :xs="22" :sm="20" :md="16" :lg="12" :xl="12">
          <div>
            <canvas ref="canvas" width="800px" height="600px"></canvas>
          </div>

          <el-button ref="photoBtn" @click="handleClick">拍照</el-button>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
const cv = window.require("opencv");
let camera = null;
try {
  camera = new cv.VideoCapture(0);
  /*
  setInterval(function() {
    camera.read(function(err, im) {
      if (err) throw err;
      console.log(im.size())
      if (im.size()[0] > 0 && im.size()[1] > 0){
        window.show(im);
      }
      window.blockingWaitKey(0, 50);
    });
  }, 20);
  */
} catch (e) {
  console.log("Couldn't start camera:", e);
}

export default {
  name: "Camera",
  components: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  methods: {
    handleClick() {
      if (!camera) return;
      camera.read(function(err, im) {
      if (err) throw err;
      im.sava('./temp.jpg')
        this.$refs.canvas.drawImage('./temp.jpg', 0, 0, 800, 600);
      });
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
.camera-container {
  margin: 20px;

  .imgbox {
    width: 800px;
    height: 600px;
  }
}
</style>
