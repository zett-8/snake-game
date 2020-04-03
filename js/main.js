'use strict'

import Game from './game.js'
import { renderField  } from './renderer.js'
import { setKeyConfigs } from './controller.js'

// @ DOMs
window.canvas = document.getElementById('field')
window.ctx = window.canvas.getContext('2d')
window.startButton = document.querySelector('button')
window.modeSelectors = document.querySelectorAll('input')
window.scoreDiv = document.querySelector('#score')

const game = new Game()

window.onload = function() {
  setKeyConfigs(game)
  renderField(game)
}


