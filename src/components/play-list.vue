<template>
  <div class="playlist" @click="showFlag = !showFlag" @touchmove.stop v-if="showFlag">
    <div class="list-wrapper" @click.stop :animation="animation">
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="iconMode" @click="changeMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
        </h1>
      </div>
      <!--使用scroll-view组件后，调试工具会非常卡，暂无解决方法-->
      <scroll-view
        scroll-y
        scroll-with-animation
        style="height: 240px"
        scroll-into-view="current"
      >
        <ul class="list-content">
          <li :key="item.id" class="item" v-for="(item, index) in playingList" @click="selectItem(item, index)">
            <i class="current icon-play" v-if="item.playing" id="current"></i>
            <span class="text">{{item.name}}</span>
            <span @click.stop="favoriteHandle(item, index)" class="like">
              <i class="icon-favorite" v-if="item.collection"></i>
              <i class="icon-not-favorite" v-else></i>
            </span>
            <span @click.stop="deleteOne(index)" class="delete"><i class="icon-delete"></i></span>
          </li>
        </ul>
      </scroll-view>
      <div class="list-operate">
        <div @click="addSong" class="add">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div @click="showFlag = !showFlag" class="list-close">
        <span>关闭</span>
      </div>
    </div>
  </div>
</template>

<script>
  import {playMode} from '../utils/config'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {modal} from '../utils'

  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    name: 'play-list',
    computed: {
      ...mapGetters([
        'mode',
        'playList',
        'collections',
        'currentSong'
      ]),
      showFlag: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      modeText: {
        get() {
          return this.mode === playMode.random ? '随机播放' : this.mode === playMode.sequence ? '顺序播放' : '单曲循环'
        }
      },
      iconMode: {
        get() {
          return this.mode === playMode.random ? 'icon-random' : this.mode === playMode.sequence ? 'icon-sequence' : 'icon-loop'
        }
      },
      playingList: {
        get() {
          return this.playList.slice(0).map(item => {
            return Object.assign({
              playing: item.songid === this.currentSong.songid,
              collection: this.collections.findIndex(val => val.songid === item.songid) !== -1
            }, item)
          })
        }
      }
    },
    data() {
      return {
        animation: ''
      }
    },
    methods: {
      ...mapMutations({
        setMode: 'SET_MODE',
        setCurrentSong: 'SET_CURRENT_SONG',
        setPlayList: 'SET_PLAY_LIST'
      }),
      ...mapActions([
        'toggleCollect',
        'setCurrentSong'
      ]),
      addSong() {
        mpvue.navigateTo({ url: '/pages/add-song/main' })
      },
      selectItem(item, index) {
        this.setCurrentSong(item, this.playList[index])
      },
      favoriteHandle(item, index) {
        this.toggleCollect(this.playList[index])
      },
      showConfirm() {
        modal.confirm('确定清除播放列表？').then(() => {
          this.showFlag = false
          this.setPlayList([])
          this.setCurrentSong(null)
        })
      },
      changeMode() {
        this.setMode((this.mode + 1) % 3)
      },
      deleteOne(index) {
        const list = this.playList.slice(0)
        list.splice(index, 1)
        if (list.length) {
          this.setPlayList(list)
        } else {
          this.showFlag = false
          this.setPlayList([])
          this.setCurrentSong(null)
        }
      }
    },
    created() {
      const animation = mpvue.createAnimation({ duration: 200 })
      this.$watch('showFlag', n => {
        setTimeout(() => {
          if (n) {
            this.animation = animation.opacity(1).step().export()
          } else {
            this.animation = ''
          }
        }, 50)
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";

  .playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: $topHeight;
    bottom: 0;
    z-index: 8;
    background-color: $color-background-d;
    .list-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      background-color: $color-highlight-background;
      opacity: 0;
      .list-header {
        position: relative;
        padding: 10px 30px 10px 20px;
        .title {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 10px;
            font-size: 30px;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
          .clear {
            @include extend-click;
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
      .list-content {
        .item {
          display: flex;
          align-items: center;
          height: 40px;
          padding: 0 30px 0 20px;
          overflow: hidden;
          .current {
            flex: 0 0 20px;
            width: 20px;
            font-size: $font-size-small;
            color: $color-theme-d;
          }
          .text {
            flex: 1;
            @include ellipsis;
            font-size: $font-size-medium;
            color: $color-text-d;
          }
          .like {
            @include extend-click;
            margin-right: 15px;
            font-size: $font-size-small;
            color: $color-theme;
            .icon-favorite {
              color: $color-sub-theme;
            }
          }
          .delete {
            @include extend-click;
            font-size: $font-size-small;
            color: $color-theme;
          }
        }
      }
      .list-operate {
        width: 140px;
        margin: 20px auto;
        .add {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid $color-text-l;
          border-radius: 100px;
          color: $color-text-l;
          .icon-add {
            margin-right: 5px;
            font-size: $font-size-small-s;
          }
          .text {
            font-size: $font-size-small;
          }
        }
      }
      .list-close {
        text-align: center;
        line-height: 50px;
        background: $color-background;
        font-size: $font-size-medium-x;
        color: $color-text-l;
      }
    }
  }
</style>
