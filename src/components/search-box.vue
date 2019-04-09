<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <div class="form">
      <input
        :placeholder="placeholder"
        placeholder-style="color: rgba(255, 255, 255, 0.3);"
        type="text"
        confirm-type="search"
        @input="onChange"
        v-model.trim="keywords"
        class="box"
      >
    </div>
    <i class="icon-dismiss" v-if="keywords" @click="clear"></i>
  </div>
</template>

<script>
  import {debounce} from '../utils'

  export default {
    name: 'search-box',
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        keywords: ''
      }
    },
    methods: {
      clear() {
        this.keywords = ''
        this.$emit('submit', '')
      },
      setValue(val) {
        this.keywords = val
      },
      onChange() {}
    },
    created() {
      this.onChange = debounce((n) => {
        const value = n.mp.detail.value
        this.$emit('submit', value)
      }, 500)
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";

  .search-box{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    height: 40px;
    background: $color-highlight-background;
    border-radius: 6px;
    .icon-search{
      font-size: 24px;
      color: $color-background;
    }
    .form{
      flex: 1;
    }
    .box{
      margin: 0 5px;
      line-height: 18px;
      background: $color-highlight-background;
      color: $color-text;
      font-size: $font-size-medium;
      width: 100%;
    }
    .icon-dismiss{
      font-size: 16px;
      color: $color-background;
    }
  }
</style>
