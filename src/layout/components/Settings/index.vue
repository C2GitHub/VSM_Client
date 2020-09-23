<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">布局配置</h3>

      <div class="drawer-item">
        <span>开启 Tags-View</span>
        <el-switch v-model="tagsView" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>固定 Header</span>
        <el-switch v-model="fixedHeader" class="drawer-switch" />
      </div>

      <div class="drawer-item">
        <span>侧边栏 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
    <div>
      <h3 class="drawer-title">参数设置</h3>

      <div class="drawer-item">
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
      </div>

      <div class="drawer-item">
        <span>保存图像</span>
        <el-switch
          v-model="ifSaveImage"
          class="drawer-switch"
          @change="cameraSetting('saveImage')"
        />
      </div>

      <div class="drawer-item">
        <span>启用图像匹配</span>
        <el-switch
          v-model="ifImageCheck"
          class="drawer-switch"
          @change="cameraSetting('imageCheck')"
        />
      </div>

      <div class="drawer-item">
        <span>侧边栏 Logo</span>
        <el-switch v-model="sidebarLogo" class="drawer-switch" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
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
      ifSaveImage: true,
      ifImageCheck: true
    }
  },
  mounted() {
    this.cameraSelected = Number(this.camera_num)
    this.ifSaveImage = this.saveImage != 0
    this.ifImageCheck = this.imageCheck != 0
  },
  computed: {
    ...mapGetters(['camera_num', 'saveImage', 'imageCheck']),
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'fixedHeader',
          value: val
        })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'tagsView',
          value: val
        })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'sidebarLogo',
          value: val
        })
      }
    }
  },
  methods: {
    handleCameraChange(val) {
      this.$store.dispatch('camera/changeCamera', val)
    },
    cameraSetting(type) {
      this.$store.dispatch('camera/cangeCameraSettings', type)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }
}
</style>
