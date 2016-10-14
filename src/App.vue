<template>
  <div id="app">
    <h1>图像裁剪</h1>
    <button @click="getImage">图像裁剪</button>
    <image-cropper :callback="loadImage"></image-cropper>
    <img src="" alt="" v-el:test>
  </div>
</template>

<script>
export default {
  components: {
    ImageCropper: require('./components/ImageCropper')
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    getImage () {
      this.$broadcast('showCropper')
    },
    loadImage (data) {
      console.log(data)
      this.$els.test.src = data
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
