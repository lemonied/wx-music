<template>
  <div class="empty">
    <img src="/static/images/no-result.png">
    <p>{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: 'empty',
    props: {
      title: {
        type: String,
        default: '暂无数据~'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .empty{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    img{
      width: 100px;
      height: 105px;
    }
    p{
      padding: 15px 0;
      color: $color-text-l;
      font-size: 12px;
    }
  }
</style>
