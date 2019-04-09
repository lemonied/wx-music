<template>
  <div class="about">
    <p class="title">By:ChenJiYuan</p>
    <p class="text">该小程序所用API接口及音频全部来自QQ音乐网页版，仅用作学习交流</p>
    <p class="text">如有问题请联系我：</p>
    <p class="text">QQ：447334358</p>
    <p class="text">github：https://github.com/timoodada/wx-music</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";
  .about{
    color: $color-text-d;
    padding: 20px;
    .title{
      line-height: 40px;
    }
    .text{
      font-size: 14px;
      line-height: 30px;
    }
  }
</style>
