<template>
  <ul class="suggest-list">
    <li class="suggest-item" key="zhida" v-if="zhida.type === 2" @click="selectSinger">
      <div class="singer-avatar">
        <img :src="'https://y.gtimg.cn/music/photo_new/T001R300x300M000' + zhida.singermid + '.jpg?max_age=2592000'"/>
      </div>
      <div class="name">
        <p class="text">{{zhida.singername}} - 歌手</p>
      </div>
    </li>
    <li class="suggest-item" :key="key" v-for="(item, key) in list" @click="selectSong(item)">
      <div class="icon">
        <i class="icon-music" ></i>
      </div>
      <img src="/static/images/vip.png" v-if="item.vip" class="vip"/>
      <div class="name">
        <p class="text">{{item.name}} - {{item.singer}}</p>
      </div>
    </li>
    <loading v-if="loading"></loading>
    <empty v-if="!loading && !list.length"></empty>
  </ul>
</template>

<script>
  import Loading from './loading'
  import Empty from './empty'
  import {modal} from '../utils'

  export default {
    name: 'search-list',
    components: {Empty, Loading},
    props: {
      zhida: {
        type: Object,
        default: {}
      },
      list: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      selectSinger() {
        this.$emit('select')
        mpvue.navigateTo({ url: `/pages/singer-songs/main?id=${this.zhida.singermid}` })
      },
      selectSong(item) {
        if (item.vip) {
          modal.alert('付费歌曲请下载QQ音乐app进行播放')
          return
        }
        this.$emit('select', item)
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .singer-avatar{
    width: 40px;
    height: 40px;
    margin: 0 10px 0 0;
    border-radius: 50%;
    overflow: hidden;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .vip{
        margin-right: 5px;
        width: 20px;
        height: 11px;
      }
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      .icon-music {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include ellipsis;
      }
    }
  }
</style>
