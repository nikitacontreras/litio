const { contextBridge } = require('electron');

window.onload = () => {
    alert("funcó omg increible")
    var menuBar = document.createElement("header");
    menuBar.style.cssText += 'display:block;overflow: hidden;background-color: #333;position: fixed;top: 0;width: 100%;';
    document.body.appendChild(menuBar)
    console.log("worked :)")
}
