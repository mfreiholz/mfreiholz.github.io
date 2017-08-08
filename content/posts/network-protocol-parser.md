+++
date = "2017-08-16T21:03:14+02:00"
title = "Network protocol parser"
author = "mfreiholz"
tags = ["Development", "Tutorial", "C++"]
+++

# How to parse network protocols

I've implemented a lot of network protocols lately, for work and private projects. I'd like to show you the basic implementation I mostly use and has been proven to be very resource friendly, fast and stable.

## The Protocol

At the beginning there is the protocol definition. For this example I will use a simple single frame/packet based protocol to exchanges data between two endpoints (e.g.: client and server).

### The Packet

```cpp
// packet.h
```

As you can see the `Packet` is very basic. It doesn't distinguish between request or response, but it does have different sized data types to show the correct handling of them.

It does have a `serialization()` method, which writes the bytes of the object into a buffer. You could write them directly to network instead, of course. The important part of the method is the conversion of fields to network-byte-order (big-endian). You should always do this whether you are developing platform independent or not. It is a convention to always send data types in big-edian byte order over network.

### The Parser

The `Parser` is also very simple and only needs a single method to work. It is implemented as a single byte by byte parser.

```cpp
// parser.h
```



```cpp
// parser.cpp
```



