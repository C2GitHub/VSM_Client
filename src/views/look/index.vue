<template>
  <div class="look-container">
    <el-container>
      <aside class="topBar">
        <div class="selectDate">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          />
        </div>
      </aside>
    </el-container>
    <div class="swiper-wrap">
      <div class="toolbar">
        <button @click="toSlide(0)">To Slide Start</button>
        <button @click="toSlide(parseInt(imgs.length / 2) - 1)">To Slide Middle</button>
        <button @click="toSlide(imgs.length - 3)">To Slide End</button>
        <!-- <button @click="appendSlide">Append slide</button> -->
      </div>
      <swiper ref="imgSwiper" class="swiper" :options="swiperOption">
        <div slot="button-prev" class="swiper-button-prev" />
        <div slot="button-next" class="swiper-button-next" />
        <div slot="pagination" class="swiper-pagination" />
        <div slot="scrollbar" class="swiper-scrollbar" />
      </swiper>
    </div>
    <el-container class="sliderBar">
      <el-slider
        v-model="sliderNumber"
        :max="imgs.length - 3"
        :format-tooltip="formatSlidertip"
        @input="handleSliderChange"
      />
    </el-container>
  </div>
</template>

<script>
const fs = window.require('fs')
const path = window.require('path')
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { parseTime } from '@/utils/index'
import { mapGetters } from 'vuex'
import 'swiper/css/swiper.css'

const vm = {
  name: 'Look',
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      dateRange: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', parseInt(new Date() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24))
            }
          },
          {
            text: '昨天',
            onClick(picker) {
              const date = parseInt(new Date() / (1000 * 60 * 60 * 24) - 1) * (1000 * 60 * 60 * 24)
              // date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: '一周前',
            onClick(picker) {
              const date =  parseInt(new Date() / (1000 * 60 * 60 * 24) - 7) * (1000 * 60 * 60 * 24)
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      sliderNumber: 0,
      imgs: [],
      swiperOption: {
        slidesPerView: 2,
        // centeredSlides: true,
        spaceBetween: 10,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction'
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        },
        scrollbar: {
          el: '.swiper-scrollbar',
          hide: true
        },
        virtual: true,
        init: false,
        on: {
          slideChange: () => {
            this.sliderNumber = this.$refs.imgSwiper.$swiper.activeIndex
          }
        }
      }
    }
  },
  watch: {
    dateRange(val) {
      this.imgs.splice(0)
      this.sliderNumber = 0
      if (val == null) {
        this.imgs.push('Pelese Select Date Rage Before.')
      }
      if (val && val.length && val.length >= 1) {
        this.findImgs(val[0], val[1])
      }

      if (val && val.length == undefined) {
        this.findImgs(val, Date.now())
      }
    }
  },
  computed: {
    ...mapGetters(['camera_num', 'imgsPath'])
  },
  created() {
    const preLoad = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)
    this.dateRange = new Date(preLoad)
  },
  mounted() {
    this.render = true
    // 触发默认选择 dateRange
    this.$nextTick(() => {
      if (this.imgs.length === 0) {
        this.imgs.push('Pelese Select Date Rage Before.')
      }
      this.renderSwiper()
      // this.$refs.imgSwiper.$swiper.lazy.load()
    })
  },
  methods: {
    handleSliderChange(val) {
      this.$refs.imgSwiper.$swiper.slideTo(val, 800, true)
    },
    renderSwiper() {
      this.$refs.imgSwiper.$swiper.virtual.slides = this.imgs.map((item, index) => {
        return `<div class="swiper-slide"><img src="${item}" /> </div>`
      })
      this.$refs.imgSwiper.$swiper.init()
    },
    formatSlidertip(val) {
      const reg = /([0-9a-zA-Z]{11})-[0-9]{6}\.jpg$/
      const img = this.imgs[val] || ''
      if (reg.test(img.replace(/\\/g, '\\\\'))) {
        const t = parseInt(RegExp.$1, 16)
        return parseTime(t)
      }
      return val
    },
    toSlide(index) {
      this.$refs.imgSwiper.$swiper.slideTo(index, 800, true)
    },
    appendSlide() {
      this.imgs.push(this.imgs.length + 1)
    },
    findImgs(t1, t2) {
      if (!t1 || !t2) return
      const date1 = new Date(t1)
      const date2 = new Date(t2)
      let imgs = []
      // 1. 获取天数值
      const dateReg = /^([0-9a-zA-Z]{11})-[0-9]{6}\.jpg$/ // 174916cae38-190052.jpg
      const time1 = date1.getTime()
      const time2 = date2.getTime()
      const day1 = Math.floor(time1 / (1000 * 60 * 60 * 24))
      const day2 = Math.floor(time2 / (1000 * 60 * 60 * 24))
      const diff = day2 - day1

      const baseDay = Math.floor((time1 - (1000 * 60 * 60 * 8)) / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)
      const dir_arr = []
      for (let i = 0; i <= diff; i++) {
        const dirName = parseTime(baseDay + (i + 1) * 1000 * 60 * 60 * 24, '{y}-{m}-{d}')
        dir_arr.push(dirName)
      }
      const startImgsArr = []
      const middelImgsArr = []
      const endImgsArr = []

      const startFiles = this.getFileByPath(path.join(this.imgsPath, dir_arr[0]))
      startFiles.forEach(item => {
        if (dateReg.test(item)) {
          // console.log(RegExp.$1);
          const t = parseInt(RegExp.$1, 16)
          if (t >= time1 && t <= time2) {
            startImgsArr.push(path.join(this.imgsPath, dir_arr[0], item))
          }
        }
      })

      if (dir_arr.length >= 2) {
        const endFiles = this.getFileByPath(path.join(this.imgsPath, dir_arr[dir_arr.length - 1]))
        endFiles.forEach(item => {
          if (dateReg.test(item)) {
          // console.log(RegExp.$1);
            const t = parseInt(RegExp.$1, 16)
            if (t >= time1 && t <= time2) {
              endImgsArr.push(path.join(this.imgsPath, dir_arr[dir_arr.length - 1], item))
            }
          }
        })
      }

      if (dir_arr.length > 2) {
        for (let i = 1; i <= dir_arr.length - 2; i++) {
          const files = this.getFileByPath(path.join(this.imgsPath, dir_arr[i]))
          files.forEach(item => {
            if (dateReg.test(item)) {
            // console.log(RegExp.$1);
            // const t = parseInt(RegExp.$1, 16)
              middelImgsArr.push(path.join(this.imgsPath, dir_arr[i], item))
            }
          })
        }
      }

      imgs = imgs.concat(startImgsArr, middelImgsArr, endImgsArr)
      // imgs.sort((a, b) => {

      // })
      this.imgs = this.imgs.concat(imgs)
      this.renderSwiper()
      // 2. 获取天数差
      // 3. 起始天数格式化 2020-06-15
      // 4. 判断其实文件夹是否存在
      // 4.1 存在: 获取文件夹下的所有文件
      // 4.2 不存在: 天数加一格式化
    },
    getFileByPath(dirPath) {
      const jsonFiles = []
      if (!dirPath || !fs.existsSync(dirPath)) {
        return jsonFiles
      }
      const stat = fs.statSync(dirPath)
      if (stat.isDirectory() === true) {
        const files = fs.readdirSync(dirPath)
        files.forEach(function(item, index) {
          const fPath = path.join(dirPath, item)
          const fStat = fs.statSync(fPath)
          if (fStat.isFile() === true) {
            jsonFiles.push(item)
          }
        })
      }
      return jsonFiles
    }

  }
}
export default vm
</script>

<style lang="scss">
.look-container {
  margin: 0 20px 20px 20px;
  aside {
    width: 100%;
    height: 52px;
    display: flex;
    padding: 8px 0;
    margin-bottom: 0;
    justify-content: flex-end;
    background: #fff;
    // border-bottom: 1px solid #e0e0e0;
  }
}
.sliderBar {
  display: flex;
  text-align: center;
  margin-top: 20px;
  // .desc{
  //   width: 80px;
  //   margin-right: 10px;
  //   line-height: 38px;
  // }
  .el-slider {
    flex: 1;
  }
}
.swiper-wrap {
  height: auto;
  flex-direction: column;

  .swiper {
    height: 450px;
    width: 100%;

    .swiper-slide {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-weight: bold;
      font-size: 28px;
      background-color: #f7f7f7;
      img{
        height: 100%;
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: 2rem;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 20px;

    button {
      flex: 1;
      padding: 0;
      margin: 0;
      border: none;
      border-right: 1px solid #e0e0e0;
      background-color: #fff;
      cursor: pointer;
      &:last-child {
        border: none;
      }
      &:hover {
        background-color: #f7f7f7;
      }
    }
  }
}
</style>
