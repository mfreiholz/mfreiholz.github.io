+++
date = "2016-06-06T10:19:10+02:00"
title = "Switch to NGINX and Hugo"
author = "mfreiholz"
tags = ["server", "nginx", "hugo", "security"]
+++

I decided to make some changes to my current root server and websites.
I already migrated most of my websites to be statically generated with [Hugo](https://hugo.io).<!--more-->

# Why a static site generator?

- My page doesn't change very often, especially not dynamically.
  I create new content every 6 month, if at all.
- Get rid of PHP and third-party scripts for security reason (Wordpress,
  phpMyAdmin, custom scripts, ...). I use them too rarely.
- It's easier to backup. Since all my websites are static, managed via Git and
  hosted on GitHub, I don't have to worry about backups at all!

## ...but why Hugo

The first tool I tried a few month ago was Jekyll to host websites on GitHub-Pages
for free. I immediately hated the setup of Jekyll. I had to install Ruby and some
other frameworks I can't remember. Since I am still using Windows as primary OS
it was a pain in the a** (sorry) to find and install the correct versions.

At some point Hugo came out of nowhere for me and I loved it straightaway.
One binary, no dependencies and uses Go features (templates) - _Love it!_

# Switch to NGINX

Now that there is no more PHP or other server-side scripting involved for any
website, I'd like to try another HTTP server. I used Apache since the beginning
and only used NGINX for some rare use cases, but now where I only need a server
to deliver static contents and proxy HTTP requests to other background processes
written in C/C++/Go/Node, it might be better to go with NGINX. This is exactly
what it has been made for. Oh, and NGINX requires less resources.

NGINX now serves all my websites and proxies (+load balancing) HTTP requests for
TS3VIDEO conference- and version-check-lookups to a REST Server API written in
Go (<http://api.mfreiholz.de>).

# References

- [Hugo](http://gohugo.io/)
- [Jekyll](https://jekyllrb.com/)
- [NGINX](https://nginx.org/)
- [Apache HTTP Server](http://httpd.apache.org/)
