+++
date = "2016-04-26T07:01:48+02:00"
draft = false
title = "Server Installation on Linux (Debian)"
appName = "ts3video"
+++

## Download & Extract

The server package is usually a TAR archive, which can be extracted everywhere.
This documentation uses `/opt/ts3video` as base directory.

```bash
mkdir /opt/ts3video
cd /opt/ts3video
wget DOWNLOAD_URL_HERE
tar -xf server-<version>.tar
cd server-<version>
```

## Start the server

It's not recommended to use this way in production.
Live systems should always use the Windows-Service/Linux-Daemon way.

```bash
/opt/ts3video/server-<version>/videoserver.sh start --config "/opt/ts3video/default.ini"
```

## Run as Linux Daemon (Debian - SysV) <a name="server-linux-daemon-debian"></a>

The server comes with a `videoserver-initd.sh` script, which makes it
possible to control the server process in background.

__Note:__ You have to be logged in as root.

### 1. Create system user and set permissions

```bash
useradd --home-dir /opt/ts3video --system --shell /bin/sh --user-group ts3video
chown -R ts3video:ts3video /opt/ts3video
```

### 2. Prepare the start-up script

Open the file `videoserver-initd.sh` for editing and update the variables on
top to fit your system.

```sh
USER="ts3video"
WORKDIR="/opt/ts3video/server-<version>"
CONFIG="${WORKDIR}/default.ini"
```

### 3. Install the script as start-up script

You can either copy or link the script into `/etc/init.d/`
before updating your run levels with it.

```bash
cp /opt/ts3video/server-<version>/videoserver-initd.sh /etc/init.d/videoserver
update-rc.d videoserver defaults
```

### 4. Test it

That's it! You can now test it with the following commands.

```bash
/etc/init.d/videoserver start
/etc/init.d/videoserver stop
```

You should also reboot and test whether the `videoserver` has been started
automatically.

The running process name may be different than expected.
You shouldn't see a `videoserver` process. The running process
name will be `ld-linux.so` or similar.

_Why is that?_ The server is shipped with its own set of common
libraries and a dynamic library loader because of portability
issues. This might change in future releases.
On some systems it's possible to run the `videoserver` binary directly (e.g. Ubuntu 14.04).
