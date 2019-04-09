<template>
  <ul class="switches">
    <li class="switch-item" :class="{active: value === key}" @click="onChange(key)" v-for="(val, key) in tabs" :key="key">
      <span>{{val}}</span>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'switches',
    props: {
      tabs: {
        type: Array,
        default: []
      },
      value: {
        type: Number,
        default: 0
      }
    },
    methods: {
      onChange(num) {
        this.$emit('input', num)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .switches{
    display: flex;
    align-items: center;
    width: 240px;
    margin: 0 auto;
    border: 1px solid $color-highlight-background;
    border-radius: 5px;
    .switch-item{
      flex: 1;
      padding: 8px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-text-d;
      &.active{
        background: $color-highlight-background;
        color: $color-text;
      }
    }
  }
</style>
