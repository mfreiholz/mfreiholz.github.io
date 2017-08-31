+++
date = "2016-11-24T11:18:41+01:00"
title = "Manage And Deploy Static Websites (Hugo)"
author = "mfreiholz"
tags = ["Administration", "Tutorial"]
+++

I use static websites based on [Hugo](https://gohugo.io) since quite a while now. They are fast, nice to edit with the editor of my choice and can be served from any HTTP server. There are no requirements like PHP, Python or MySQL. Unfortunately I never got used to the deployment process.
<!--more-->

The *intended* way of deployment is a classic FTP/SFTP/SCP upload. You simply copy and overwrite everything on the remote server with the new data from your local machine. Sounds easy and is easy. But what if...

- the website does have a few big resources (pictures, files, ...), which may take some time? \
    You might pick only the new files by yourself, what I consider as very annoying. \
    Same for big structural changes. You can't pick in this case, you need to delete everything on the server and upload everything completely new.
- you're behind a firewall/proxy which blocks all non HTTP/HTTPS traffic? \
    This might happen within your work-placke or public WiFi spots.
- you don't have your RSA key for server authentication with you and don't have a simple FTP server running, which is insecure anyway? \
    It is possible to run an SFTP server with username/password authentication, but that's too much of a security concern in my oppition.

## The Solution (Requires Shell Access)

Since another rule in my life is: *"Put everything into [VC](https://en.wikipedia.org/wiki/Version_control) repository"* and a few searches on the Internet results with nearly the same idea, it should be the right way to go to put my website into a Git repository and directly deploy from it. Most solutions on the Internet suggest to use a single repository with a *generated* branch, but I don't like the idea to have the generated website filling up my source repository with redundant data. That's why I decided to use two repositories and one Cron-Job. In addition, this gives me the possibility to keep the source- private and the *generated*-repository public.

Here a small overview with real data of this website:

- **Source Repository**: <https://github.com/mfreiholz/mfreiholz.de.git> \
    This is the primary source repository. All work happens in this repository.
- **Output Repository**: <https://github.com/mfreiholz/mfreiholz.de-rendered.git> \
    This repository contains the latest generated version of the website.
    After editing and validating the contents of the website, I generate everything into this repository and push them to the remote server.
- **Cron-Job** (*/etc/crontab*): \
    `*/5 * * * * root cd /var/www/mfreiholz.de && git pull` \
    This job pulls the newest version of the *generated* repository every 5 minutes.

**Note:** You can host your repositories on your on server and don't have to use GitHub, of course.

In the next step I will show you, how to setup the environment step-by-step. You might stop reading now, if you already know how to setup the above scenario.


## How To Setup

I'm not going to show you, how to create the Git repositories. You should already know that and have a place to store them. I will use the above mentioned URLs for this example.

### Server Side

In the first setup, we need to checkout the repository to the configured virtual-host DocumentRoot of your Apache/NGINX server.

```bash
mkdir /var/www/mfreiholz.de
cd /var/www/mfreiholz.de
git clone https://github.com/mfreiholz/mfreiholz.de.git
```

Now setup cron-job for auto update every 5 minutes. Open your `/etc/crontab` and add the following line:

```bash
*/5 * * * * root cd /var/www/mfreiholz.de && git pull
``` 

Restart cron with `service cron restart` and you're done. That's all you have to do on your server. Everything else happens on client side.

### Client Side

I use to checkout everything flat into my main *source* directory, e.g.: `C:\Source` on Windows:

```bash
cd C:\Source
git clone https://github.com/mfreiholz/mfreiholz.de.git
git clone https://github.com/mfreiholz/mfreiholz.de-rendered.git
```

You do all your work in the first repository and as soon as you're done with your changes, validated and committed them in the first repository you can generate your website into the second repository with:

```bash
cd C:\Source\mfreiholz.de
hugo --cleanDestinationDir --destination ..\mfreiholz.de-rendered
```

Next you can publish your page with a simple Git `commit` and `push` command.

```
cd C:\Source\mfreiholz.de-rendered
git add -A
git commit -m "changes..."
git push 
```

That's all. Your server will automatically pull the changes from the *rendered* repository and make them public. Based on the cron-job setup this may take a minute.
