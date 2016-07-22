+++
date = "2016-07-19T07:52:54+02:00"
title = "LLTHW: Source Control Management (SCM)"
author = "mfreiholz"
tags = ["llthw", "article"]
draft = true
+++

> **LLTHW** is the acronym for a series of posts called **Lessons learned the
> hard way**, which handles common topics about software development and shows
> you DOS and DONTs based on cases that happens during real projects and jobs.

If you're a developer and never heard of _SCM_ or _Version Control_, you're either
a beginner or doing something deadly wrong.
SCM should always be the first thing you "initialize" as soon as you are starting
a new project.

# The Problem and my regrets

As I was beginning with programming arround the age of 14 and made a lot of websites
with PHP and MySQL for gaming clans, community websites and sometimes even small
companies (all for free and just for fun), I unfortunetaly didn't know of any
centralized SCM at this time -
what is probably the main reason why I lost most of this old code.
I surely developed ~10 forum-, ~20 clan-, ~20 blog-systems and hundreds of other
very cool scripts, web-designs and flash animations.
One HDD failure, no backups and everything was gone.
It didn't really bother me back then, but it does now - a lot.
I'm kind of a nostalgic person and I would love to look at my old code, only to say:
_"damn, this code is so ugly, I was such a newbie"_ or
_"man, I've made some great stuff"._

Well, now I can't.

# Get your code under version control

If you develop your own small scripts or do it for a big company, it doesn't matter.
It's easier than ever before to host your source code on a server, even for free.
[GitHub](https://github.com/) is the most popular code and open-source hosting
platform right now and offers a lot of additional features.

It doesn't matter whether your're using [CVS][cvs], [Subversion][svn], [Git][git]
or any other available system out there. The important thing is:
__Always use an SCM! It doesn't matter how small or big your project is!__

In my oppinion it's the best to always use a centralized repository.
This makes it easier to work in a team and having a backup strategy.
For example: You could host all your repositories on a rentend virtual server,
which does have automatic backup snapshots by your hosting provider.
_"Tadaa.."_, you don't even need to make the backups on your own.

## Why

Still need some arguments? Fine...

- you can keep track of every change to a source file (author, code)
- even after a long time, where a lot of developers might have changed something,
  you can lookup the author for every single line of code (blame)
- team collaboration: work on the same file and merge the changes
- if every developer downloads the repository to his/her working machine,
  you automatically have multiple backups

[svnadmin]: http://svnadmin.mfreiholz.de/
[cvs]: http://cvs.nongnu.org/
[svn]: https://subversion.apache.org/
[git]: https://git-scm.com/