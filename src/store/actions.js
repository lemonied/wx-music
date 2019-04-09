import * as types from './mutation-types'
import {get, modal, post} from '../utils'
import {parseCharacter} from '../utils/parseCharacter'

export const selectSingleSong = function({commit, state}, val) {
  const index = state.playList.findIndex(item => item.songid === val.songid)
  if (index !== -1) {
    if (state.currentSong.songid !== val.songid) {
      setCurrentSong({commit, state}, val)
    }
  } else {
    addToPlayList({commit, state}, val)
    setCurrentSong({commit, state}, val)
  }
}
export const addToPlayList = function({commit, state}, val) {
  const index = state.playList.findIndex(item => item.songid === val.songid)
  const list = state.playList.slice(0)
  if (index === -1) {
    list.push(val)
    commit(types.SET_PLAY_LIST, list)
  }
}
export const addRecent = function({commit, state}, val) {
  const list = state.recent.slice(0)
  const index = list.findIndex(item => item.songid === val.songid)
  if (index !== -1) {
    list.splice(index, 1)
  }
  list.push(val)
  commit(types.SET_RECENT, list)
}
export const addSearchHistory = function({commit, state}, val) {
  const list = state.searchHistory.slice(0)
  const index = list.findIndex(item => item === val)
  if (index !== -1) {
    list.splice(index, 1)
  }
  list.push(val)
  commit(types.SET_SEARCH_HISTORY, list)
}
export const toggleCollect = function({commit, state}, val) {
  const index = state.collections.findIndex(item => item.songid === val.songid)
  const list = state.collections.slice(0)
  const o = Object.assign({}, val)
  // 删除歌词和播放地址后再进行存储  防止占用内存过大
  delete o.lyric
  delete o.url
  if (index === -1) {
    list.push(o)
  } else {
    list.splice(index, 1)
  }
  commit(types.SET_COLLECTIONS, list)
}
export const setCurrentSong = async function ({commit, state}, val) {
  if (!val) {
    commit(types.SET_CURRENT_SONG, val)
    return
  }
  const fn = global.loadingSong
  if (typeof fn === 'function') fn(true)
  try {
    const promises = await Promise.all([getLyric(val.songid), getPlayUrl(val.songmid)])
    const lyric = promises[0]
    const url = promises[1]
    const song = Object.assign({}, val, {
      lyric,
      url
    })
    commit(types.SET_CURRENT_SONG, song)
    addRecent({commit, state}, val)
  } catch (err) {
    modal.alert(err.message)
  }
  if (typeof fn === 'function') fn(false)
}

async function getLyric(musicid) {
  let res = await get('https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric.fcg', {
    uin: 0,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    nobase64: 1,
    musicid,
    songtype: 0,
    _: Date.now()
  })
  res = res.replace(/(^MusicJsonCallback\(|\)$)/g, '')
  res = JSON.parse(res)
  if (res.code === 0) {
    return parseCharacter(res.lyric)
  } else {
    throw new Error('获取歌词失败')
  }
}

async function getPlayUrl(songmid) {
  const data = JSON.stringify(
    {
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': '7500658880',
          'songmid': [songmid],
          'songtype': [],
          'uin': '0',
          'loginflag': 0,
          'platform': '23',
          'h5to': 'speed'
        }
      },
      'comm': {'uin': 0, 'format': 'json', 'ct': 23, 'cv': 0}
    }
  )
  let res = await post(`https://u.y.qq.com/cgi-bin/musicu.fcg?_=${Date.now()}`, data)
  res = res.req_0.data
  return `${res.sip[0]}${res.midurlinfo[0].purl}`
}
