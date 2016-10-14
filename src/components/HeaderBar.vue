<template>
	<div class="header-bar">
		<div class="header-left" v-on:click="goBack" v-if="option.showBack">
			<span class="icon icon-arrowleft"></span>
		</div>
		<div class="header-title">
      <div class="header-table">
        <div class="header-cell">
          <slot></slot>
        </div>
      </div>
    </div>
		<div class="header-right">
			<slot name="right"></slot>
		</div>
	</div>
</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    option: {
      type: Object,
      default () {
        return {
          showBack: true
        }
      }
    },
    customBack: {
      type: Function
    }
  },
  data () {
    return {
    }
  },
  methods: {
    goBack () {
      if (this.customBack) {
        this.customBack()
      } else {
        window.history.go(-1)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
	.header-bar{
		width: 100%;
		height: 44px;
    background-color: #fff;
		border-bottom: 1px solid #bfbfbf; 
    box-shadow: 0 1px 6px #ccc;
		position: relative;
	}
	.header-left,.header-right{
		position: absolute;
		width: 40px;
		height: 44px;
    line-height: 44px;
    text-align: center;
	}
	.header-right{
		top: 0;
		right: 0;
	}
	.header-title{
		margin: 0 50px;
    text-align: center;
    height: 44px;
    font-size: 16px;
    position: relative;
    vertical-align: middle;
	}
  .header-table{
    height: 100%;
    width: 100%;
    display: table;
  }
  .header-cell{
    display: table-cell;
    vertical-align: middle;
  }
  .search-input{
    display: block;
    width: 100%;
    border: 1px solid #bfbfbf;
    border-radius: 4px;
    height: 30px;
    overflow: hidden;
    background: #fff;
    font-size: 12px;
    position: absolute;
    top: 6px;
  }
  .search-input input{
    border: 0;
    background: none;
    font-size: 12px;
    line-height: 1.2em;
    height: 1.2em;
    padding-left: 10px;
    width: 100%;
    box-sizing: border-box;
    position: absolute;
    top: 10px;
    left: 0;
    outline: none;
  }
	.icon-back span{
		width: 20px;
		height: 20px;
		margin: 12px 0 0 10px;
		background-position: -20px 0;
	}
</style>