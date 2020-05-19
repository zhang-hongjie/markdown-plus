import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/matchesonscrollbar.css'

import CodeMirror from 'codemirror'

import 'codemirror/mode/gfm/gfm.js'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/ruby/ruby.js'
import 'codemirror/mode/shell/shell.js'
import 'codemirror/mode/r/r.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/mode/perl/perl.js'
import 'codemirror/mode/coffeescript/coffeescript.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/commonlisp/commonlisp.js'
import 'codemirror/mode/haskell/haskell.js'
import 'codemirror/mode/lua/lua.js'
import 'codemirror/mode/clojure/clojure.js'
import 'codemirror/mode/groovy/groovy.js'
import 'codemirror/mode/rust/rust.js'
import 'codemirror/mode/powershell/powershell.js'

import 'codemirror/addon/scroll/scrollpastend.js'
import 'codemirror/keymap/vim.js'
import 'codemirror/keymap/emacs.js'
import 'codemirror/keymap/sublime.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/jump-to-line.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/search/match-highlighter.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/selection/active-line.js'
import { syncPreview } from './sync_scroll'
// const fs = require('fs')
import * as fs from 'fs'

// load all the themes
export const themes = ['3024-day', '3024-night', 'abcdef', 'ambiance-mobile', 'ambiance', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 'elegant', 'erlang-dark', 'hopscotch', 'icecoder', 'isotope', 'lesser-dark', 'liquibyte', 'material', 'mbo', 'mdn-like', 'midnight', 'monokai', 'neat', 'neo', 'night', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'solarized', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'zenburn']
themes.forEach((theme) => {
  require(`codemirror/theme/${theme}.css`) // eslint-disable-line global-require
})

const mac = CodeMirror.keyMap['default'] === CodeMirror.keyMap.macDefault
const ctrl = mac ? 'Cmd' : 'Ctrl'

const editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
  lineNumbers: true,
  mode: 'gfm',
  theme: 'default',
  lineWrapping: true,
  scrollPastEnd: true,
  autofocus: true,
  styleActiveLine: { nonEmpty: true },
  tabSize: 8,
  indentUnit: 4
})

editor.on('scroll', (instance) => {
  syncPreview()
})

// custom keyboard shortcuts
const extraKeys = { 'Alt-F': 'findPersistent' }
const items = [[`${ctrl}-B`, 'i.fa-bold'], [`${ctrl}-I`, 'i.fa-italic'], [`${ctrl}-U`, 'i.fa-underline'], [`${ctrl}-,`, 'i.fa-cog']]
items.forEach((item) => {
  extraKeys[item[0]] = (cm) => {
    document.querySelector(item[1]).click()
  }
})
extraKeys['Tab'] = (cm) => {
  cm.execCommand('indentMore')
}
extraKeys['Ctrl-N'] = (cm) => {
  handleNewButton()
}
extraKeys['Ctrl-O'] = (cm) => {
  handleOpenButton()
}
extraKeys['Ctrl-S'] = (cm) => {
  handleSaveButton()
}

extraKeys['Ctrl-C'] = (cm) => {
  clipboard.writeText(editor.getSelection(), 'copy')
}
extraKeys['Ctrl-X'] = (cm) => {
  clipboard.writeText(editor.getSelection(), 'copy')
  editor.replaceSelection('')
}
extraKeys['Ctrl-V'] = (cm) => {
  editor.replaceSelection(clipboard.readText('copy'))
}
editor.setOption('extraKeys', extraKeys)

// default implementation of vim commands
CodeMirror.Vim.defineEx('w', 'w', (cm, input) => {
  console.log('write')
})
CodeMirror.Vim.defineEx('q', 'q', (cm, input) => {
  if (input.input === 'q') {
    console.log('quit')
  } else if (input.input === 'q!') {
    console.log('force quit')
  }
})
CodeMirror.Vim.defineEx('wq', 'wq', (cm, input) => {
  console.log('write then quit')
})

// custom commands
CodeMirror.commands.toUpperCase = (cm) => {
  cm.replaceSelection(cm.getSelection().toUpperCase())
}
CodeMirror.commands.toLowerCase = (cm) => {
  cm.replaceSelection(cm.getSelection().toLowerCase())
}

let newButton, openButton, saveButton
let menu
let fileEntry
let hasWriteAccess

const {remote, clipboard} = require('electron')
const { Menu, MenuItem, dialog } = remote

function handleDocumentChange (title) {
  var mode = 'javascript'
  // eslint-disable-next-line no-unused-vars
  var modeName = 'JavaScript'
  if (title) {
    title = title.match(/[^/]+$/)[0]
    // document.getElementById('title').innerHTML = title
    document.title = title
    if (title.match(/.json$/)) {
      mode = {name: 'javascript', json: true}
      modeName = 'JavaScript (JSON)'
    } else if (title.match(/.html$/)) {
      mode = 'htmlmixed'
      modeName = 'HTML'
    } else if (title.match(/.css$/)) {
      mode = 'css'
      modeName = 'CSS'
    }
  } else {
    // document.getElementById('title').innerHTML = '[no document loaded]'
  }
  editor.setOption('mode', mode)
  // document.getElementById('mode').innerHTML = modeName
}

function newFile () {
  fileEntry = null
  hasWriteAccess = false
  handleDocumentChange(null)
}

function setFile (theFileEntry, isWritable) {
  fileEntry = theFileEntry
  hasWriteAccess = isWritable
}

function readFileIntoEditor (theFileEntry) {
  fs.readFile(theFileEntry.toString(), function (err, data) {
    if (err) {
      console.log('Read failed: ' + err)
    }

    handleDocumentChange(theFileEntry)
    editor.setValue(String(data))
  })
}

function writeEditorToFile (theFileEntry) {
  // var str = editor.getValue()
  fs.writeFile(theFileEntry, editor.getValue(), function (err) {
    if (err) {
      console.log('Write failed: ' + err)
      return
    }

    handleDocumentChange(theFileEntry)
    console.log('Write completed.')
  })
}

var onChosenFileToOpen = function (theFileEntry) {
  console.log(theFileEntry)
  setFile(theFileEntry, false)
  readFileIntoEditor(theFileEntry)
}

var onChosenFileToSave = function (theFileEntry) {
  setFile(theFileEntry, true)
  writeEditorToFile(theFileEntry)
}

function handleNewButton () {
  newFile()
  editor.setValue('')
}

function handleOpenButton () {
  dialog.showOpenDialog(remote.getCurrentWindow(), {
    properties: ['openFile']
  }).then(result => {
    if (result.canceled === false) {
      console.log('handleOpenButton: Selected file paths:' + result.filePaths)
      onChosenFileToOpen(result.filePaths[0])
    }
  }).catch(err => {
    console.log(err)
  })
}

function handleSaveButton () {
  if (fileEntry && hasWriteAccess) {
    writeEditorToFile(fileEntry)
  } else {
    dialog.showSaveDialog(remote.getCurrentWindow())
    .then(result => {
      if (result.canceled === false) {
        console.log('handleOpenButton: Selected file paths:' + result.filePath)
        onChosenFileToSave(result.filePath, true)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}

function initContextMenu () {
  menu = new Menu()
  menu.append(new MenuItem({
    label: 'Copy',
    click: function () {
      clipboard.writeText(editor.getSelection(), 'copy')
    }
  }))
  menu.append(new MenuItem({
    label: 'Cut',
    click: function () {
      clipboard.writeText(editor.getSelection(), 'copy')
      editor.replaceSelection('')
    }
  }))
  menu.append(new MenuItem({
    label: 'Paste',
    click: function () {
      editor.replaceSelection(clipboard.readText('copy'))
    }
  }))

  window.addEventListener('contextmenu', function (ev) {
    ev.preventDefault()
    menu.popup(remote.getCurrentWindow(), ev.x, ev.y)
  }, false)
}

initContextMenu()

newButton = document.getElementById('new')
openButton = document.getElementById('open')
saveButton = document.getElementById('save')

newButton.addEventListener('click', handleNewButton)
openButton.addEventListener('click', handleOpenButton)
saveButton.addEventListener('click', handleSaveButton)

export default editor

// function onresize () {
//   console.log('resize')
//   const container = document.getElementById('editor')
//   const containerWidth = container.offsetWidth
//   const containerHeight = container.offsetHeight
//
//   const scrollerElement = editor.getScrollerElement()
//   scrollerElement.style.width = containerWidth + 'px'
//   scrollerElement.style.height = containerHeight + 'px'
//
//   editor.refresh()
// }
// window.addEventListener('resize', function (ev) {
//   ev.preventDefault()
//   onresize()
// }, false)
