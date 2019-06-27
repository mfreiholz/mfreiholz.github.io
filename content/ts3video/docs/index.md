+++
date = "2016-04-26T06:37:32+02:00"
draft = false
title = "Documentation Index"
+++

- __[Latest](./latest)__ (0.6 / 0.7 / 0.8 / 0.10 / 0.11 / 0.12 / 0.13 / 0.14)
- [Version 0.5](./0.5)

## Note for Updaters (Linux)

It is NOT recommended to overwrite your old installation with the newest one.
You should always create a new directory.
The project is still in BETA state and a lot of things can change, which may require a clean environment.

Example directory structure:

```plain
/opt/ts3video/
    server-0.4/
        default.ini
        videoserver
        ...
    server-0.5/
        default.ini
        videoserver
        ...
    server-0.6/
        default.ini
        videoserver
        ...
```

# FAQ / Troubleshooting

#### The program can't start because api-ms-win-crt-runtime-l1-1-0.dll is missing

![missing dll api ms win crt screenshot](/images/missing-dll-api-ms-win-crt.png)

The problem is that the [KB2999226](https://support.microsoft.com/en-us/kb/2999226)
(Universal CRT) which is part of the Visual C++ Redistributable for Visual Studio 2015 failed to install.

__Solution__

- Install Windows Updates
- Restart your computer
- Reinstall TS3VIDEO (Conference Client)

#### The program can't start because MSVCP140.dll is missing

The problem is that your computer is missing the Visual C++ Redistributable for Visual Studio 2015.

__Solution__

- Download and install vcredist_x86.exe and vcredist_x64.exe from the 
[Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=48145)
