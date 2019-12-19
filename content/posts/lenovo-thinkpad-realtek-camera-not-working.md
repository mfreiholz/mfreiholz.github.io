+++
date = "2019-12-19T08:35:14+02:00"
title = "Lenovo Thinkpad Camera Not Working"
author = "mfreiholz"
tags = ["Troubleshooting", ""]
+++

I ran into a problem with Lenovo Thinkpad T470p, but it also happens on some other models. It didn't let me use the Integrated Webcam on Windows 10 anymore. Luckily I found the fix!
<!--more-->

Looks like it is a problem with the built-in _Realtek_ camera hardware.

### Fix with registry

- Press `Windows Key + R`, type `regedit`, and press `Enter`
- Navigate to `HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows Media Foundation\\Platform`
- Right-click on `Platform` folder and select `New -> DWORD`
- Name it `EnableFrameServerMode`, and change its value to `0`
- Do the same with: `HKEY_LOCAL_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows Media Foundation\\Platform`

Source: [Lenovo Forum](https://forums.lenovo.com/t5/ThinkPad-X-Series-Laptops/X1-Build-in-camera-freezes-and-displays-just-first-frame/m-p/4558178#M106470)

### More

There are also some other suggestion on the Internet:

- Disable camera's privacy mode in Lenovo Vantage App.
- Enable camera access in Windows 10 settings (`Settings -> Privacy -> Camera`).
