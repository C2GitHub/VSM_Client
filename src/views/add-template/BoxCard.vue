<template>
  <el-card class="box-card-component" style="margin-left:8px;">
    <div slot="header" class="box-card-header" @click="$emit('editPart', part.partID)">
      <img :src="part.img">
    </div>
    <div style="position:relative;">
      <!-- <mallki class-name="mallki-text" text="name" /> -->
      <div class="progress-item">
        <el-progress :percentage="part.score" />
        <div class="partInfo">
          <span class="info">{{ part.name }}</span>
          <el-button class="removeBtn"  @click="$emit('removePart', part.partID)" type="primary" icon="el-icon-delete" size="mini"></el-button>
        </div>
      </div>
      <!-- <div class="progress-item">
        
      </div> -->
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    part: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
    ])
  }
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
  .el-card__body{
    padding: 10px;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    width: 100%;
    height: 160px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    left: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
  .partInfo{
    position: relative;
    height: 28px;
    line-height: 28px;
    margin-top: 3px;
    .info{
      position: absolute;
      left: 0;
    }
    .removeBtn{
      position: absolute;
      right: 0;
    }
  }
}
</style>
