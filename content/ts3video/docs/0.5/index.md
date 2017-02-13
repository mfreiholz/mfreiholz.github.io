+++
date = "2015-09-05T17:43:21+02:00"
draft = false
title = "Documentation v0.5"
+++

# Client <a name="client"></a>

## What is it? <a name="client-what-is-it"></a>

__TS3VIDEO__ is very simple. It doesn't blow your mind with a full set
of new features to communicate with your friends.
_It just adds video_ to the already existing audio, text-chat and
file-sharing TeamSpeak experience.

## Installation <a name="client-installation"></a>

After downloading the plugin, it can simply be installed with a double
click on the `*.ts3_plugin` file. This will start the TeamSpeak plugin
installer.

__It's highly recommended to close TeamSpeak before trying to install or
update the plugin.__

![TeamSpeak 3 plugin installer](/images/client-plugin-install.png)

## How to start a video conference <a name="client-start-video"></a>

In short: Right-click any channel in TeamSpeak and choose the
_Video_-option.

> TODO: Add long description with screenshot.

------------------------------------------------------------------------

# Server <a name="server"></a>

## Installation <a name="server-installation"></a>

The server package is usually a ZIP/TAR archive,
which can be extracted everywhere.

__Windows (ZIP archive)__

Download and extract to e.g.: `C:\ts3video`

__Linux (TAR archive)__

```bash
mkdir /opt/ts3video
cd /opt/ts3video
wget DOWNLOAD_URL_HERE
tar -xf ts3video-server.tar
```

## Configuration <a name="server-configuration"></a>

The server can be configured in multiple ways.
Currently it's possible to use command line parameters or a simple
configuration file.

### Command line parameters

| Parameter | Description | Example value |
| --------- | ----------- | ------------- |
| `--config` | Absolute path to configuration file. | `/opt/ts3video/default.ini` |
| `--service` | This parameter is required when started as a Windows Service. |  |

> TODO: Document all possible parameters.

### Config file _(Recommended)_

Saving the configuration in a file might be the better way to backup
the configuration. See the comments inside the config file for further
details.

__Beta note:__ It's not possible to run more than one virtual video server.
Support for multiple virtual servers will be implemented in the next releases.

```ini
# Default values for each server configuration.
#
# Special IP address values:
#   Any IPv4   = 0.0.0.0
#   Any IPv6   = ::
#   Any IPv4&6 = any
#
[default]

# The IP address on which to listen for new connections.
# @version 0.1
address=any

# The port for new connections and media data (TCP & UDP).
# @version 0.1
port=13370

# The IP address on which to listen for new web-socket (status) connections.
# It's recommended to allow only local access. You may allow restricted access via ProxyPass (Apache).
# @version 0.1
wsstatus-address=any

# The port for new web-socket (status) connections.
# @version 0.1
wsstatus-port=13375

# Maximum number of parallel client connections (slots).
# @version 0.1
connectionlimit=2147483647

# Maximum READ transfer rate the server is allowed to use (bytes/second).
# @version 0.1
bandwidthreadlimit=18446744073709551615

# Maximum WRITE transfer rate the server is allowed to use (bytes/second).
# @version 0.1
bandwidthwritelimit=18446744073709551615

# Comma separated list of valid channel-IDs, which are allowed to be used.
# This property maintains a list of raw channel IDs - not TS3 channel IDs.
# Leave empty to allow all.
# @todo Add "macro" to create raw-ids from TS3-Channel-ID.
# @version 0.1
validchannelids=

# Password to server.
# Leave empty to allow access to everyone.
# @version 0.1
password=

# Virtual server's administrator password.
# @version 0.3
adminpassword=admin

# Bridge to TeamSpeak via it's Query-Console.
#
# The bridge requires a user with the following permissions:
# - b_serverquery_login
# - b_virtualserver_select
# - b_virtualserver_client_list
# - i_channel_subscribe_power
# - i_channel_needed_subscribe_power
#
# @version 0.4
[teamspeak3-bridge]
# Enables the bridge to TeamSpeak.
# @version 0.4
enabled=0

# Address of the TeamSpeak server.
# It usually runs on the same host (127.0.0.1)
# @version 0.4
address=127.0.0.1

# The port of the TeamSpeak server query-console.
# @version 0.4
port=10011

# Login information for the query-console.
# @version 0.4
loginname=serveradmin
loginpassword=TiHxQDHt

# The connection will change the visible nickname of the query-console user.
# NOTE: Do not use yet! Leave it empty for now! Or at least not more than 10 characters!
# @version 0.4
nickname=OCS

# Port of the virtual server used for authorization.
# @version 0.4
virtualserverport=9987

# Comma separated list of server group IDs (sgid),
# which are allowed to use the video server.
# Leave empty to allow all groups.
# @version 0.4
allowedservergroups=
```

The own configuration file can be passed with the `--config` parameter.

```bash
./start.sh --config "/opt/ts3video/myconfig.ini"
```

## Start the server <a name="server-start"></a>

It's not recommended to use this way in production. Production systems
should always use the Windows-Service/Linux-Daemon way.

__Windows__

```bash
"C:\ts3video\videoserver.exe" --config "C:\ts3video\default.ini"
```

__Linux:__ On linux you need to use the _start.sh_ script, which prepares the system environment.

```bash
/opt/ts3video/start.sh start --config "/opt/ts3video/default.ini"
```

## Run as Windows Service <a name="server-windows-service"></a>

Installing the server process as a service can be done with the
built-in Windows tool `sc`.

_All upcoming commands need to run as a privileged Administrator!_

### Install as service

```bash
sc create "TS3VIDEO" binPath= "C:\ts3video\videoserver.exe --service --config \"C:\ts3video\myconfig.ini\"" start= auto
```

Even though it might look weird, the space after `binPath=`, `start=` and
other parameters you might append is important!

### Uninstall service

```bash
sc delete "TS3VIDEO"
```

### Troubleshooting

__Problem:__ The service doesn't start or exits immediately.
- Make sure that the user who runs the service has permissions to run the process.

## Run as Linux Daemon (Debian - SysV) <a name="server-linux-daemon-debian"></a>

The server comes with a `start-initd.sh` script which makes it
possible to control the server process in background.

___Note:__ You have to be logged in as root._

### 1. Create system user and set permissions

```bash
useradd --home-dir /opt/ts3video --system --shell /bin/sh --user-group ts3video
chown -R ts3video:ts3video /opt/ts3video
```

### 2. Prepare the start-up script

Open the file `start-initd.sh` for editing and update the variables on
top to fit your system.

```sh
USER="ts3video"
WORKDIR="/opt/ts3video"
CONFIG="${WORKDIR}/default.ini"
```

### 3. Install the script as start-up script

You can either copy or link the script into `/etc/init.d/`
before updating your run levels with it.

```bash
cp /opt/ts3video/start-initd.sh /etc/init.d/ts3video
update-rc.d ts3video defaults
```

### 4. Test it

That's it! You can now test it with the following commands.

```bash
/etc/init.d/ts3video start
/etc/init.d/ts3video stop
```

You should also reboot and test whether the VideoServer has been started
automatically.

The running process name may be different than expected.
You shouldn't see a `videoserver` process. The running process
name will be `ld-2.19.so`.

_Why is that?_ The server is shipped with its own set of common
libraries and a dynamic library loader because of portability
issues. This might change in future releases.
On some systems it's possible to run the `videoserver` binary directly (e.g. Ubuntu 14.04).

## Server status web-app                                                <a name="server-status" class="anchor"></a>

Please head to the [server status web-app documentation](./server-status) page.

## Logging                                                              <a name="server-logging" class="anchor"></a>

The server is configured to log into `$TEMP/ts3video-server.log`.
Upcoming releases will allow you to configure the location and verbose
level by your self.

## Kick / ban clients                                                   <a name="server-kick-ban" class="anchor"></a>

_Since: 0.3_

The server stores all bans to `$WORKDIR/bans.ini`.
If you need to unban the client's IP address, you must remove the IP from
this configuration file. Upcoming releases will provide a more
user-friendly way of managing those bans.
