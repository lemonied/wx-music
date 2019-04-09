import store from '../store'
import * as types from '../store/mutation-types'
import Lyric from 'lyric-parser'
import {modal} from './index'
import {playMode} from './config'

let lyric

const player = mpvue.getBackgroundAudioManager()
player.onTimeUpdate(timeHandler)
player.onPlay(playHandler)
player.onPause(pauseHandler)
player.onError(ErrorHandler)
player.onSeeked(seekedHandler)
player.onStop(stopHandler)
player.onEnded(endedHandler)

store.subscribe((mutation, state) => {
  const type = mutation.type
  const payload = mutation.payload
  switch (type) {
    case types.SET_CURRENT_SONG:
      // 歌曲信息
      if (!payload) {
        lyric && lyric.stop()
        player.stop()
        return
      }
      initSongInfo(payload)
      lyric && lyric.stop()
      lyric = new Lyric(payload.lyric, lyricHandler)
      store.commit(types.SET_LYRIC_LINES, lyric.lines)
      player.play()
      break
    default:
  }
})

function initSongInfo(payload) {
  player.src = payload.url
  player.title = payload.name
  player.epname = payload.album
  player.singer = payload.singer
  player.coverImgUrl = payload.image
  player.webUrl = `https://y.qq.com/n/yqq/song/${payload.songmid}.html`
}
function endedHandler() {
  playNext()
}
function stopHandler() {
  if (lyric) {
    lyric.stop()
  }
}
function seekedHandler() {
  const num = Math.floor(player.currentTime)
  store.commit(types.SET_CURRENT_TIME, num)
  if (lyric && !player.paused) {
    lyric.seek(player.currentTime * 1000)
  }
}
function ErrorHandler(res) {
  modal.toast(res.errMsg)
  if (lyric) {
    lyric.stop()
  }
}
function pauseHandler() {
  store.commit(types.SET_PLAYING, false)
  lyric && lyric.stop()
}
function playHandler() {
  store.commit(types.SET_PLAYING, true)
  if (lyric) {
    lyric.play()
    lyric.seek(player.currentTime * 1000)
  }
}
function timeHandler() {
  // 该回调在pc端调试无作用
  const num = Math.floor(player.currentTime)
  if (num === store.state.currentTime) return
  store.commit(types.SET_CURRENT_TIME, num)
  const str = String(num)
  if (/5$/.test(str)) {
    lyric.seek(player.currentTime * 1000)
  }
}
function lyricHandler({lineNum, txt}) {
  store.commit(types.SET_CURRENT_LINE_NUM, lineNum)
}

// 随机播放
function randomPlay() {
  const state = store.state
  const index = Math.floor(Math.random() * state.playList.length)
  store.dispatch('setCurrentSong', state.playList[index])
}
// 顺序播放下一首
function sequencePlay() {
  const state = store.state
  const index = state.playList.findIndex(item => item.songid === state.currentSong.songid)
  if (index !== -1) {
    store.dispatch('setCurrentSong', state.playList[(index + 1) % state.playList.length])
  }
}
// 自动播放下一首
function playNext() {
  const state = store.state
  if (state.mode === playMode.loop) {
    initSongInfo(state.currentSong)
    player.play()
  } else if (state.mode === playMode.sequence) {
    sequencePlay()
  } else {
    randomPlay()
  }
}
// 手动上一手
function playPre() {
  const state = store.state
  if (state.mode === playMode.random) {
    randomPlay()
  } else {
    const index = state.playList.findIndex(item => item.songid === state.currentSong.songid)
    if (index !== -1) {
      store.dispatch('setCurrentSong', state.playList[(index - 1) % state.playList.length])
    }
  }
}

export {player, sequencePlay, playPre, randomPlay}
