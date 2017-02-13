+++
date = "2015-09-05T17:44:46+02:00"
draft = false
title = "Server status web-app documentation"

+++

Available since: 0.2

The server comes with a web-app to monitor basic status
information about the running server. It is located in the
*server-status* directory of the downloaded server package.

This documentation asumes that your server is installed in the
`/opt/ts3video` directory. Windows can use the same instructions in a
slightly modified way.

# Configure the status web-app

The web-app uses a [WebSocket][websocket] connection to retrieve
real-time information from the VideoServer.
Basic options can be changed in the web-app's `config.json` file.
Here is a list of the available options and what they include:

__server.statussocket.address__

> The host address to which the web-app's WebSocket will connect.
> Set to `null` to let the application use the host from the address bar
> in your browser (recommended).

__server.statussocket.port__

> The port to which the web-app's WebSocket will connect.

__server.statussocket.path__

> The web-app's WebSocket will use this path in it's HTTP request.
> It can be used to proxy-forward the WebSocket with your web-server
> (e.g.: Apache's `ProxyPass`, `ProxyPassReverse`).

__ui.updateinterval__

> The polling interval which is used to update visible information.

# Setup the quick and dirty way

Copy or link the `server-status` folder into the public reachable
web-server's *www* folder.

```bash
cp -rf /opt/ts3video/server-status /var/www/videoserver-status
```

Before the web-app can fetch any data from the VideoServer you need to
update the VideoServer's configuration file `/opt/ts3data/default.ini`
and set the following values (restart required):

```ini
[default]
wsstatus-address=any
wsstatus-port=13375
```

The VideoServer will now accept WebSocket connections from anywhere.
In case that you only want to access the web-app from localhost, you can
keep the VideoServer's default configuration values
(`wsstatus-address=127.0.0.1`).

Finally you need to restart the VideoServer

```bash
/etc/init.d/ts3video stop
/etc/init.d/ts3video start
```

and open the web-app in your browser,
e.g.: http://localhost/videoserver-status

<div class="hint hint-info">
Some firewalls and proxy servers may block connections to port 13375,
they usually only allow port 80 and 443.
</div>

# Setup Apache2 VirtualHost and password protection

**Requirements:**
Apache >=2.4.5 with *mod_proxy* and *mod_proxy_wstunnel* enabled.

<div class="hint hint-warning">
  I encountered a few problems using ProxyPass with WebSockets.
  It either took very long to establish the WebSocket connection or didn't
  work at all. You might fall back to the <em>Quick &amp; Dirty way</em>
  with localhost acccess only, if you encounter any problems.
</div>

First you need to create a new `VirtualHost` configuration.

```bash
cd /etc/apache2/sites-available
vi videoserver-status
```

Your configuration should look like this:

```apache
<VirtualHost *:80>
  ServerName videoserver-status.yourhost.com
  DocumentRoot /opt/ts3video/server-status

  # Password protection (optional)
  <Location />
    AuthType Basic
    AuthName "Video Server Status"
    AuthUserFile /opt/users.passwd
    require valid-user
  </Location>

  # Forward incoming WebSocket connections to the running VideoServer on port 13375.
  # Note: ProxyPass for WebSockets is available since Apache 2.4.5
  #       You need to have the Apache modules proxy_http and proxy_wstunnel enabled.
  <Location /ws>
    ProxyPass ws://127.0.0.1:13375
    ProxyPassReverse ws://127.0.0.1:13375
  </Location>

</VirtualHost>
```

Users can be managed with Apache's [htpasswd][htpasswd] tool.

Now you need to update the web-app's configuration file to match your
VirtualHost: \
`/opt/ts3video/server-status/config.json`

```json
{
  "server.statussocket.address": null,
  "server.statussocket.port": 80,
  "server.statussocket.path": "/ws",
  "ui.updateinterval": 5000
}
```

After a restart of the Apache web-server you can access the web-app:
http://videoserver-status.yourhost.com


[websocket]: https://www.websocket.org/
[htpasswd]: http://httpd.apache.org/docs/2.4/programs/htpasswd.html
