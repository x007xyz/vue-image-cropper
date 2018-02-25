<template>
  <div class="cropper-page" v-show="isShow" ref="cropperPage">
    <header-bar ref="header">
      <span slot="right" @click="confirm">确定</span>
    </header-bar>
    <img src="" alt="" class="cropper-img" :style="imageStyle" ref="img">
    <div class="cover" :style="{height: coverHeight + 'px'}"></div>
    <div class="cropper-box" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend.prevent="touchEnd" ref="cropBox"></div>
    <div class="cover" :style="{height: coverHeight + 'px'}">
      {{info}}
    </div>
    <input ref="file" type="file" accept="image/*" @change="readImage">
  </div>
</template>
<style lang="css" scoped>
.cropper-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background-color: #fff;
  overflow: hidden;
}
.cover {
  background-color: rgba(0, 0, 0, 0.2);
}
.cropper-img {
  position: absolute;
  z-index: -1;
  /*width: 100%;*/
}
/*.cropper-box{
    width: 10rem;
    height: 10rem;
  }*/
input[type='file'] {
  opacity: 0;
  position: fixed;
  top: -1000px;
  left: -1000px;
}
</style>
<script>
import HeaderBar from '@/components/HeaderBar'

const getDinstance = function(point0, point1) {
  return Math.sqrt(Math.pow(point0.pageY - point1.pageY, 2) + Math.pow(point0.pageX - point1.pageX, 2))
}

export default {
  name: 'ImageCropper',
  components: { HeaderBar },
  props: {
    callback: {
      type: Function,
      default() {}
    }
  },
  data() {
    return {
      coverHeight: 0,
      cropperHeight: 0,
      imgInitTop: 0,
      amplitude: 0,
      imageState: {
        left: 0,
        top: 0,
        scale: 1,
        width: 0,
        height: 0,
        originX: 0,
        originY: 0
      },
      distance: 0,
      imageStyle: {
        top: '0',
        transform: 'translate3d(0px, 0px, 0px) scale(1)',
        transformOrigin: 'left top'
      },
      cropBoxRect: {},
      touchPos: {
        x: 0,
        y: 0
      },
      isShow: false,
      minScale: 0,
      info: ''
    }
  },
  watch: {
    imageState: {
      handler(val, oldVal) {
        // console.log(this.imageState.left)
        // this.imageStyle.transformOrigin = val.originX + '% ' + val.originY + '%'
        this.imageStyle.transform = 'translate3d(-' + val.left + 'px, -' + val.top + 'px, 0px) scale(' + val.scale + ')'
      },
      deep: true
    }
  },
  methods: {
    showCropper() {
      console.log('showCropper')
      this.$refs.file.click()
    },
    readImage(event) {
      console.log('read')
      var file = event.target.files[0]
      console.log(file)
      var reader = new window.FileReader()
      reader.onload = () => {
        // 通过 reader.result 来访问生成的 DataURL
        this.$refs.img.src = reader.result
        this.initCropper()
      }
      reader.readAsDataURL(file)
    },
    initCropper() {
      this.isShow = true // 显示裁剪界面
      // 回调会在dom更新后调用，如果不使用$nextTick，无法获取元素正确的高度
      this.$nextTick(() => {
        let cropperPage = this.$refs.cropperPage
        let pageWidth = cropperPage.clientWidth
        let pageHeight = cropperPage.clientHeight
        let headerHeight = this.$refs.header.$el.clientHeight
        this.coverHeight = (pageHeight - headerHeight - pageWidth) / 2
        let cropBoxTop = this.coverHeight + headerHeight
        this.imageState.left = 0
        this.imageState.top = 0
        this.imageStyle.top = cropBoxTop + 'px'
        this.$refs.cropBox.style = 'height:' + pageWidth + 'px'
        // var cropBoxRect = this.$refs.cropBox.getBoundingClientRect() // 获取的元素没有预期的参数
        this.cropBoxRect = {
          left: 0,
          top: cropBoxTop,
          width: pageWidth,
          height: pageWidth
        }

        let img = this.$refs.img
        var width = (this.imageState.width = img.naturalWidth)
        var height = (this.imageState.height = img.naturalHeight)
        // 计算imageState
        if (width > height) {
          this.minScale = this.imageState.scale = this.cropBoxRect.height / height
          this.imageState.left = (width * this.imageState.scale - this.cropBoxRect.width) / 2
        } else {
          this.minScale = this.imageState.scale = this.cropBoxRect.width / width
          this.imageState.top = (height * this.imageState.scale - this.cropBoxRect.height) / 2
        }
      })
    },
    confirm() {
      let imageState = this.imageState
      let cropBoxRect = this.cropBoxRect
      let scale = imageState.scale
      let image = this.$refs.img
      let height = cropBoxRect.height
      let width = cropBoxRect.width

      let canvas = document.createElement('canvas')
      canvas.width = cropBoxRect.width
      canvas.height = cropBoxRect.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(image, imageState.left / scale, imageState.top / scale, width / scale, height / scale, 0, 0, width, height)
      let data = canvas.toDataURL()
      // 调用处理函数
      this.callback(data)
      this.isShow = false
    },
    getFocalPoint(point0, point1) {
      return {
        x: (point0.pageX + point1.pageX) / 2,
        y: (point0.pageY + point1.pageY) / 2
      }
    },
    touchStart(event) {
      var fingerCount = event.touches.length
      if (fingerCount) {
        // 记录触摸初始位置
        let touchEvent = event.touches[0]
        this.touchPos = {
          x: touchEvent.pageX,
          y: touchEvent.pageY
        }
      }

      if (fingerCount >= 2) {
        // 获取两点距离、中点位置；两点距离old/new=放大倍数；中点位置，缩放中心；
        let point0 = event.touches[0]
        let point1 = event.touches[1]

        this.distance = getDinstance(point0, point1)
        this.touchPos = this.getFocalPoint(point0, point1)
        // 设置缩放倍数，
      }
    },
    touchMove(event) {
      // 根据触摸点位移，移动图片，重置触摸点位置
      var fingerCount = event.touches.length

      var touchEvent = event.touches[0]

      if (fingerCount === 1) {
        let distX = touchEvent.pageX - this.touchPos.x
        let distY = touchEvent.pageY - this.touchPos.y
        let newX = this.imageState.left - distX
        let newY = this.imageState.top - distY

        let scale = this.imageState.scale
        let maxX = this.imageState.width * scale - this.cropBoxRect.width
        let maxY = this.imageState.height * scale - this.cropBoxRect.height
        this.imageState.left = newX < 0 ? 0 : newX > maxX ? maxX : newX
        this.imageState.top = newY < 0 ? 0 : newY > maxY ? maxY : newY
        this.touchPos.x = touchEvent.pageX
        this.touchPos.y = touchEvent.pageY
      } else if (fingerCount > 1) {
        let point0 = event.touches[0]
        let point1 = event.touches[1]

        let distance = getDinstance(point0, point1)
        let zoom = distance / this.distance

        let scale = zoom * this.imageState.scale
        let maxX = this.imageState.width * scale - this.cropBoxRect.width
        let maxY = this.imageState.height * scale - this.cropBoxRect.height
        let touchPos = this.getFocalPoint(point0, point1)
        let newX = zoom * (this.imageState.left + touchPos.x) - touchPos.x
        let newY = zoom * (this.imageState.top - this.imgInitTop + touchPos.y) - touchPos.y + this.imgInitTop
        // 限制缩放

        // 图片新位置:由中点位置确认;(新位置到中点)/(旧位置到中点)=(new scale)/(old scale)
        // newLeft - touchPos.x = (distance / this.distance) * (oldLetf - touchPos.x)
        // oldLeft = 0 - this.imageState.left
        // oldTop = imgInitTop - this.imageState.top
        this.distance = distance
        if (scale < this.minScale) {
          this.imageState.scale = this.minScale
        } else {
          this.imageState.scale = scale
          this.imageState.left = newX < 0 ? 0 : newX > maxX ? maxX : newX
          this.imageState.top = newY < 0 ? 0 : newY > maxY ? maxY : newY
        }
        this.touchPos = touchPos
      }
    },
    touchEnd(event) {
      console.log('end')
    }
  }
}
</script>
