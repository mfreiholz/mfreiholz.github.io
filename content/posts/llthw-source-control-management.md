+++
date = "2016-07-19T07:52:54+02:00"
draft = true
title = "LLTHW: Source Control Management (SCM)"
author = "mfreiholz"
tags = ["llthw", "article"]
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
centralized SCM at this time.
That is probably the main reason why I lost most of this old code.
I surely developed ~10 forum-, ~20 clan-, ~20 blog-systems and hundreds of other
very cool scripts and web-designs.
One HDD failure, no backups and everything was gone.
It didn't really bother me back then, but it does now - a lot.
I'm kind of a nostalgic person and would love to look at my old code, only to say:
_"damn, this code is so ugly, I was such a newbie"_ or
_"man, I've made some great stuff"._

Well, now I can't.

# Get your code under version control

If you develop your own small scripts or do for a big company, it doesn't matter.
It's easier than ever before to host your source code on a server, even for free.
[GitHub](https://github.com/) is the most popular code and open-source hosting
platform right now.


-----


To be honest, I never worked without SCM
systems, except for the few years where I started programming
as a 14 years old child. But as soon as the first real work
came up I got introduced into CVS. The switch to Subversion
came very quickly, since it was suporior with its features and
much faster than CVS. I worked a few years with Subversion and
did even wrote an [Administration-UI][svnadmin] to integrate it in our
company Active Directory structure.

It doesn't matter wheather you're using [CVS][cvs], [Subversion][svn],
[Git][git] or any other available system out there. The important thing
is: __Always use an SCM! It doesn't matter how small or big your project is!__

I do even use it for non-source-code documents.
It's the best way to keep track of your changes and provides you the
possibility to go back to an older version.

It might be something personal, but I sometimes like it to look over some old
code, only to say "Oh man, that was so stupid of me.." or "That was such a cool
project" ;-)

# Continuous Unit Testing

This is the most important task and can't be mentioned often enough.
It's not only about _"test your code"_, no it's about _"test your code automatically"_.

In my job, I never got the chance to setup or even use an real development environment
with integrated test systems. Testing was always like:
Compile, test exactly the new feature once, check-in and forget until some bug
in a release comes up. There were no automatic tests with every build.
Somebody could change something in a central function, which applies to some new
feature everyone had forget about. Well, at least until the customer opens a ticket...

- safe time
- stressful, self testing with every change

# Strict Code Formatting

...

# Continuous Integration

...

# Stay Platform Independent

...

# Pre Performance Optimization

... thats so wrong ...

# You can't do it

Sometimes the problem is not on your site.
You might have a problem and know the solution, but aren't allowed to fix it.
People or decision makers are not always as involed into the software development
process as you are. All they hear, if you tell them "We need unit testing" is like
"Wasted time that doesn't make money". They often don't understand that it is like
an investment for the future.

[svnadmin]: http://svnadmin.mfreiholz.de/
[cvs]: http://cvs.nongnu.org/
[svn]: https://subversion.apache.org/
[git]: https://git-scm.com/