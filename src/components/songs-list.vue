<template>
  <div class="song-list">
    <empty v-if="showEmpty"></empty>
    <loading v-if="loading"></loading>
    <ul>
      <li class="item" v-for="(item, key) in list" :key="key" @click="handleClick(item)">
        <div class="rank" v-if="rank">
          <span class="text" v-if="key > 2">{{key > 2 ? key + 1 : ''}}</span>
          <span class="icon" v-else>
            <img src="/static/images/rank/first.png" v-if="key === 0">
            <img src="/static/images/rank/second.png" v-if="key === 1">
            <img src="/static/images/rank/third.png" v-if="key === 2">
          </span>
        </div>
        <div class="content">
          <h2 class="name"><img src="/static/images/vip.png" v-if="item.vip">{{item.name}}</h2>
          <p class="desc">{{item.singer}}·{{item.album}}</p>
        </div>
        <div class="delete" v-if="del" @click.stop="delHandler(item)">
          <i class="icon-delete"></i>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import Empty from './empty'
  import Loading from './loading'
  import {mapActions, mapMutations} from 'vuex'
  import {modal} from '../utils'
  export default {
    name: 'songs-list',
    components: {Loading, Empty},
    props: {
      list: {
        type: Array,
        default: []
      },
      loading: {
        type: Boolean,
        default: false
      },
      rank: {
        type: Boolean,
        default: false
      },
      del: {
        type: Boolean,
        default: false
      },
      diy: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      showEmpty: {
        get() {
          return !this.loading && !this.list.length
        }
      }
    },
    methods: {
      ...mapActions({
        setCurrentSong: 'setCurrentSong'
      }),
      ...mapMutations({
        setPlayList: 'SET_PLAY_LIST'
      }),
      handleClick(val) {
        if (val.vip) {
          modal.alert('付费歌曲请下载QQ音乐app进行播放')
          return
        }
        if (this.diy) return this.$emit('select', val)
        const playList = this.list.filter(item => !item.vip)
        this.setPlayList(playList)
        this.setCurrentSong(val)
      },
      delHandler(item) {
        this.$emit('del', item)
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .song-list{
    .item{
      display: flex;
      align-items: center;
      box-sizing: border-box;
      height: 64px;
      font-size: $font-size-medium;
      .rank{
        flex: 0 0 25px;
        width: 25px;
        margin-right: 30px;
        text-align: center;
        .icon{
          display: inline-block;
          width: 25px;
          height: 24px;
          background-size: 25px 24px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .text{
          color: $color-theme;
          font-size: $font-size-large;
        }
      }
      .content{
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          @include ellipsis;
          color: $color-text;
          img{
            margin-right: 5px;
            width: 20px;
            height: 11px;
          }
        }
        .desc{
          @include ellipsis;
          margin-top: 4px;
          color: $color-text-d;
        }
      }
      .delete{
        flex: 0 0 20px;
        color: #fff;
      }
    }
  }
</style>
