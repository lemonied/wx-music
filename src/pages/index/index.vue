<template>
  <default-layout>
    <suspension></suspension>
    <div class="home">
      <swiper
        autoplay
        indicator-dots
        circular
        class="swiper"
      >
        <swiper-item
          v-for="(val, key) in sliders"
          :item-id="key"
          :key="key"
        >
          <img :src="val.picUrl" mode="aspectFit" class="slider-img"/>
        </swiper-item>
      </swiper>
      <div class="rank">
        <h1 class="list-title">热门榜单</h1>
        <ul class="toplist skeleton" v-if="loading">
          <li class="item" v-for="val in 3" :key="val">
            <div class="icon">
              <div class="icon-img">
                <div class="icon-img-con"></div>
              </div>
            </div>
            <ul class="songlist">
              <li class="song"></li>
              <li class="song"></li>
              <li class="song"></li>
            </ul>
          </li>
        </ul>
        <ul class="toplist">
          <li class="item" v-for="val in topList" :key="val.id" @click="handleClick(val)">
            <div class="icon">
              <img :src="val.picUrl">
            </div>
            <ul class="songlist">
              <li class="song" v-for="(item, i) in val.songList" :key="i">
                <span>{{i + 1}}、</span>
                <span>{{item.songname}} - {{item.singername}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </default-layout>
</template>

<script>
  import {get} from '../../utils'
  import Suspension from '../../components/suspension'
  import DefaultLayout from '../../layouts/default-layout'

  export default {
    components: {DefaultLayout, Suspension},
    data() {
      return {
        sliders: [],
        topList: [],
        listLoading: false
      }
    },
    computed: {
      loading: {
        get() {
          return this.listLoading && !this.topList.length
        }
      }
    },
    methods: {
      async getSlides() {
        const res = await get('https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg', {
          _: Date.now(),
          uin: 0,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1
        })
        if (res.code === 0) {
          this.sliders = res.data.slider
        }
      },
      async getRanks() {
        const res = await get('https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg', {
          _: Date.now(),
          uin: 0,
          format: 'json',
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          platform: 'h5',
          needNewCode: 1
        }, loading => this.listLoading = loading)
        if (res.code === 0) {
          res.data.topList = res.data.topList.filter(item => item.id !== 201)
          this.topList = res.data.topList
        }
      },
      handleClick(val) {
        mpvue.navigateTo({ url: `/pages/music-list/main?id=${val.id}` })
      }
    },

    async onPullDownRefresh() {
      try {
        mpvue.showNavigationBarLoading()
        await Promise.all([this.getSlides(), this.getRanks()])
      } catch (err) {
        console.log(err)
      }
      mpvue.stopPullDownRefresh()
      mpvue.hideNavigationBarLoading()
    },

    created() {},
    onLoad() {
      this.getSlides()
      this.getRanks()
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/styles/variable";

  .home {
    background: $color-background;
    .swiper {
      height: 151px;
    }
    .slider-img {
      width: 100%;
      height: 100%;
    }
    .rank {
      .list-title {
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
        margin: 15px 0;
      }
      .toplist {
        height: 100%;
        overflow: hidden;
        .item {
          display: flex;
          margin: 0 20px;
          padding-bottom: 20px;
          height: 120px;
          box-sizing: border-box;
          &:last-child {
            padding-bottom: 20px
          }
          .icon {
            flex: 0 0 100px;
            width: 100px;
            height: 100px;
            img{
              height: 100%;
              width: 100%;
            }
          }
          .songlist {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 20px;
            height: 100px;
            overflow: hidden;
            background: $color-highlight-background;
            color: $color-text-d;
            font-size: $font-size-small;
            .song {
              @include ellipsis;
              line-height: 26px;
            }
          }
        }
        &.skeleton{
          .icon-img{
            height: 100%;
            width: 100%;
            background: $color-highlight-background;
            padding: 10px 10px;
            box-sizing: border-box;
            .icon-img-con{
              height: 100%;
              width: 100%;
              background: $color-background;
            }
          }
          .song{
            background: $color-background;
            height: 16px;
            margin: 5px 0;
          }
        }
      }
    }
  }
</style>
