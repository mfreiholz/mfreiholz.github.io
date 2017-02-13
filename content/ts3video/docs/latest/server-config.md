+++
date = "2016-04-26T07:02:28+02:00"
draft = false
title = "Server Configuration"
+++

The server can be configured in multiple ways.
Currently it's possible to use command line parameters or a simple
configuration file.

## Command line parameters

| Parameter | Description | Example value |
| --------- | ----------- | ------------- |
| `--config` | Absolute path to configuration file. | `/opt/ts3video/default.ini` |
| `--service` | This parameter is required when started as a Windows Service. |  |

> TODO: Document all possible parameters (Use configuration file for now, please)

## Config file - INI format _(Recommended)_

Saving the configuration in a file might be the better way to backup
the configuration. See the comments inside the config file for further
details.

Detailed documentation of sections and keys are inside the `default.ini`.   

The default configuration (`default.ini`) inside your server installation contains
all possible configuration keys. It is loaded by default, if you don't pass your own
config file.

The own configuration file can be passed with the `--config` parameter.

```bash
./videoserver.sh --config "/opt/ts3video/myconfig.ini"
```