  const { remote } = require('electron')
  const { Menu, MenuItem } = remote

  let submenu = new Menu()
  submenu.append(new MenuItem({ type: 'checkbox', label: 'box1' }))
  submenu.append(new MenuItem({ type: 'checkbox', label: 'box2' }))
  submenu.append(new MenuItem({ type: 'checkbox', label: 'box3' }))
  submenu.append(new MenuItem({ type: 'checkbox', label: 'box4' }))

  let menu1 = new Menu()
  menu1.append(new MenuItem({ label: 'MenuItem1', click () { window.alert('item 1 clicked') } }))
  menu1.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
  menu1.append(new MenuItem({ label: 'Disk', submenu: submenu }))

  window.addEventListener('contextmenu', function (e) {
    e.preventDefault()
    menu1.popup(remote.getCurrentWindow())
  }, false)
