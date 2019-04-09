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
        get('https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg', {
          topid: id,
          inCharset: 'utf-8',
          outCharset: 'utf-8',
          notice: 0,
          format: 'json',
          needNewCode: 1,
          uin: 0,
          tpl: 3,
          page: 'detail',
          type: 'top',
          platform: 'h5',
          _: Date.now()
        }, loading => this.loading = loading).then(res => {
          mpvue.hideNavigationBarLoading()
          if (res.code === 0) {
            this.info = res.topinfo
            this.list = res.songlist.map(item => {
              return {
                name: item.data.songname,
                singer: item.data.singer.map(item => item.name).join(','),
                album: item.data.albumname,
                vip: !!item.data.pay.payplay,
                songmid: item.data.songmid,
                songid: item.data.songid,
                duration: item.data.interval,
                image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${item.data.albummid}.jpg?max_age=2592000`
              }
            })
            this.bgStyle = `url(${res.topinfo.pic_album})`
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
      if (this.topId !== options.id) {
        this.info = {}
        this.list = []
        this.topId = options.id
        this.getList(options.id)
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
