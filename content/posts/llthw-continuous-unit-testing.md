+++
date = "2016-07-19T21:30:24+02:00"
draft = true
title = "llthw continuous unit testing"
author = "mfreiholz"
tags = ["llthw", "article"]
+++

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
