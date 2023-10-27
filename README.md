## Simple "TV" Player

This project is a simple and intuitive video player, developed to be used on TVs and Android devices, the player is made in HTML and uses Cordova for compilation to Android and Tizen on Samsung TV's.

### Goal

The goal of this project is to provide a simple and easy-to-use video player for TVs and Android devices. The player should be lightweight and fast, and should be able to play M3U (HLS) stream.

### Features

* Simple channel list, which can be navigated using the remote control arrows.
* Simple JSON data to  load a list of M3U (HLS) channels.

### JSON format
```json
[
  {
    "type": "A",
    "url": "xxx.m3u8",
    "img": "xxx.png"
  },
  {
    "type": "B",
    "url": "xxx.m3u8",
    "img": "xxx.jpg"
  }
]
```
***"type"** is only used for order items, **"img"** is recommend using a image at 320x180px.*

## Demo
If you want to view a demo in the browser, [here it is!](https://demo-player.randomixs.com/)

There are also [builds](https://github.com/RandoMixs/simple-tv-player/releases/latest) of an **apk** made with Cordova and **wgt** for Tizen (Samsung) televisions above 6.0 version.

**URL for Browser demo:** [https://demo-player.randomixs.com/](https://demo-player.randomixs.com/)

## Build?
*The Tizen and Cordova project files have been omitted from this repository, this is because the project is intended to be simple and easy to use.*

The build files can be found on the [releases page](https://github.com/RandoMixs/simple-tv-player/releases/latest) for those who are interested in testing the project on Tizen or Cordova devices!

## Contributions

Contributions are welcome! If you find any bugs or want to add new features, contact me or open an issue on GitHub.

I hope this is helpful!

**🚨 This project is linked to an API made by me that searches for some channels with open signal in Brazil, if it is not possible to view any channel on demo, it could be a momentary problem with my server!**