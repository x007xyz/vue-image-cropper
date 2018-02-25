<template>
  <div>
    <h1>图像裁剪</h1>
    <button @click="getImage">图像裁剪</button>
    <image-cropper :callback="loadImage"></image-cropper>
    <img src="" alt="" ref="test">
  </div>
</template>

<script>
export default {
  components: {
    ImageCropper: () => import('./components/ImageCropper')
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    getImage() {
      this.$children[0].showCropper()
      // this.$broadcast('showCropper')
    },
    loadImage(data) {
      console.log(data)
      this.$refs.test.src = data
    }
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  font-family: Source Sans Pro, Helvetica, sans-serif;
}
</style>
