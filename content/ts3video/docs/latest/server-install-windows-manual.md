+++
date = "2016-04-26T22:03:03+02:00"
draft = false
title = "Server Installation on Windows (Manual)"
+++

In case you downloaded the ZIP archive or the service registration of the
Installer did not work as expected, you might need to setup some steps on your own.

# Run as Windows Service

Installing the server process as a service can be done with the
built-in Windows tool `sc`.

__Note:__ The Installer registers the server with the name __Conference Server__ (not TS3VIDEO, like the instructions below)

_All upcoming commands need to run as a privileged Administrator! You need to open a console as Administrator._

## Install as service

```bash
sc create "TS3VIDEO" binPath= "C:\ts3video\videoserver.exe --service --config \"C:\ts3video\myconfig.ini\"" start= auto
```

Even though it might look weird, the space after `binPath=`, `start=` and
other parameters you might append is important!

## Uninstall service

```bash
sc delete "TS3VIDEO"
```

## Troubleshooting

__Q:__ The service doesn't start or exits immediately!?  
__A:__ Make sure that the user who runs the service has permissions to run the process. 
