<template>
  <div class="suspension" v-if="currentSong">
    <div class="mini-player">
      <div class="icon" @click="handleClick">
        <img :src="currentSong.image" :animation="animation">
      </div>
      <div class="text" @click="handleClick">
        <h2 class="name">{{currentSong.name}}</h2>
        <p class="desc">{{currentSong.singer}}</p>
      </div>
      <div class="control">
        <i @click="play" class="icon-mini" :class="miniIcon"></i>
      </div>
      <div class="control" @click="showList">
        <i class="icon-playlist"></i>
      </div>
    </div>
    <progress :percent="percent" stroke-width="2" backgroundColor="#222222" />
    <play-list v-model="show"></play-list>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {Rotate} from '../utils/animation'
  import {player} from '../utils/player'
  import PlayList from './play-list'

  export default {
    name: 'suspension',
    components: {PlayList},
    computed: {
      ...mapGetters([
        'currentSong',
        'currentTime',
        'playing'
      ]),
      percent: {
        get() {
          if (!this.currentSong) return 0
          return this.currentTime / this.currentSong.duration * 100
        }
      },
      miniIcon: {
        get() {
          return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        }
      }
    },
    data() {
      return {
        animation: '',
        show: false
      }
    },
    methods: {
      handleClick() {
        mpvue.navigateTo({ url: '/pages/player/main' })
      },
      showList() {
        this.show = !this.show
      },
      play() {
        if (player.paused) {
          player.play()
        } else {
          player.pause()
        }
      },
      handleAnimation(n) {
        setTimeout(() => {
          if (n) {
            this.rotate.play()
          } else {
            this.rotate.stop()
          }
        }, 20)
      }
    },
    created() {
      this.rotate = new Rotate((animation) => {
        this.animation = animation.export()
      })
      this.$watch('playing', n => {
        // this.handleAnimation(n)
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/styles/variable";
  .suspension{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    color: $color-theme;
    z-index: 5;
    background: rgba(51, 51, 51, .7);
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: relative;
    width: 100%;
    height: 55px;
    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      overflow: hidden;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        height: 40px;
        width: 40px;
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        @include ellipsis;
        font-size: $font-size-medium;
        color: $color-text;
      }
      .desc {
        @include ellipsis;
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }
    }
  }
</style>
