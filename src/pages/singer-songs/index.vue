<template>
  <rich-songs
    :loading="loading"
    :info="info"
    :list="list"
    :bg-style="bgStyle"
  ></rich-songs>
</template>

<script>
  import RichSongs from '../../components/rich-songs'
  import {get} from '../../utils'

  export default {
    name: 'index',
    components: {RichSongs},
    topId: '',
    data() {
      return {
        loading: false,
        info: {},
        list: [],
        bgStyle: ''
      }
    },
    methods: {
      getList(id) {
        mpvue.showNavigationBarLoading()
        get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg', {
          singermid: id,
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          format: 'json',
          hostUin: 0,
          needNewCode: 1,
          num: 150,
          songstatus: 1,
          begin: 0,
          order: 'listen',
          platform: 'yqq',
          _: Date.now()
        }, loading => this.loading = loading).then(res => {
          mpvue.hideNavigationBarLoading()
          if (res.code === 0) {
            const list = res.data.list
            this.info = {
              ListName: res.data.singer_name
            }
            this.list = list.map(item => {
              return {
                name: item.musicData.songname,
                singer: item.musicData.singer.map(item => item.name).join(','),
                album: item.musicData.albumname,
                vip: !!item.musicData.pay.payplay,
                songmid: item.musicData.songmid,
                songid: item.musicData.songid,
                duration: item.musicData.interval,
                image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.musicData.albummid}.jpg?max_age=2592000`
              }
            })
            this.bgStyle = `url(https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.singer_mid}.jpg?max_age=2592000)`
          }
        }).catch(() => {
          mpvue.hideNavigationBarLoading()
        })
      }
    },
    created() {
      // console.log(this.route)
    },
    onLoad(options) {
      if (this.singerId !== options.id) {
        this.info = {}
        this.list = []
        this.singerId = options.id
        this.getList(options.id)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
