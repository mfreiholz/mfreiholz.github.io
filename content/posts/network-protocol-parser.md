+++
date = "2017-08-31T18:03:14+02:00"
title = "Network Protocol Parsing with C++"
author = "mfreiholz"
tags = ["Development", "Tutorial", "C++"]
+++

I've implemented a lot of network protocols lately, for work and private projects. I'd like to show you the basic implementation I mostly use and has been proven to be very resource friendly, fast and stable.
<!--more-->

## The Protocol

At the beginning there is the protocol definition. For this example I will use a simple single frame/packet based protocol to exchanges data between two endpoints (e.g.: client and server).

### The Packet

```cpp
// packet.h
#pragma once
#include <stdint.h>
#include <vector>

#ifdef _WIN32
#include <WinSock2.h>
#else
#include <arpa/inet.h>
#endif

class Packet
{
public:
	Packet();
	~Packet();

	/*
		Serializes the packet for network transport.
		Fields are written to `buf` in network byte order (big-endian).
	*/
	void serialize(std::vector<uint8_t>& buf);

public:
	uint8_t header = 0xAF; // Marks the begin of `Packet`
	uint8_t flags = 0x00; // Custom bitmask flags.
	uint16_t type = 0x0000; // Identifies the packet's type - what is it used for.
	uint32_t size = 0x00000000; // Size of `data`.
	std::vector<uint8_t> data; // Custom data.
	uint8_t checksum = 0x00; // XOR checksum.
};
```

As you can see the `Packet` is very basic. It doesn't distinguish between request or response, but it does have different sized data types to show the correct handling of them.

It does have a `serialization()` method, which writes the bytes of the object into a buffer. You could write them directly to network instead, of course. The important part of the method is the conversion of fields to network-byte-order (big-endian). You should always do this whether you are developing platform independent or not. It is a convention to always send data types in big-edian byte order over network.

```cpp
//packet.cpp
#include "packet.h"

Packet::Packet()
{}

Packet::~Packet()
{}

void
Packet::serialize(std::vector<uint8_t>& buf)
{
	buf.push_back(header);
	buf.push_back(flags);
	buf.push_back(htons(type) >> 8);
	buf.push_back(htons(type) >> 0);
	buf.push_back(htonl(size) >> 24);
	buf.push_back(htonl(size) >> 16);
	buf.push_back(htonl(size) >> 8);
	buf.push_back(htonl(size) >> 0);
	for (auto b : data)
		buf.push_back(b);
	buf.push_back(checksum);
}
```

### The Parser

The `Parser` is also very simple and only needs a single method to work.

```cpp
// parser.h
#pragma once
#include "packet.h"

class Parser
{
public:
	/*
		\param data
			The buffer of data which the function parses.
		\param len
			The len of `data` buffer.
		\param[in,out] bytesRead
			Will contain the number of bytes read by `parse()`.
			Note: It may be possible that the function returns
			before all bytes of `data` have been parsed, because
			the `packet` is complete.
		\param[in,out] packet
			Instance of `Packet` which will be filled from `data` by this  function.
	*/
	bool parse(uint8_t* data, size_t len, size_t& bytesRead, Packet& packet);

private:
	int _step = 0;
};
```

It is implemented as a single byte by byte parser.

```cpp
// parser.cpp
#include "parser.h"

#ifdef _WIN32
#include <WinSock2.h>
#else
#include <arpa/inet.h>
#endif

bool
Parser::parse(uint8_t* data, size_t len, size_t& bytesRead, Packet& packet)
{
	bytesRead = 0;
	for (size_t i = 0; i < len; ++i)
	{
		const auto b = data[i];
		bytesRead++;

		switch (_step)
		{
			// Header.
			case 0:
				if (b != 0xAF)
				{
					_step = 0;
					continue;
				}
				packet.header = b;
				_step++;
				break;

			// Flags.
			case 1:
				packet.flags = b;
				_step++;
				break;

			// Type (2 bytes!).
			case 2:
				packet.type = uint16_t(b) << 8;
				_step++;
				break;

			case 3:
				packet.type |= uint16_t(b) << 0;
				packet.type = ntohs(packet.type);
				_step++;
				break;

			// Size (4 bytes!).
			case 4:
				packet.size = uint32_t(b) << 24;
				_step++;
				break;

			case 5:
				packet.size |= uint32_t(b) << 16;
				_step++;
				break;

			case 6:
				packet.size |= uint32_t(b) << 8;
				_step++;
				break;

			case 7:
				packet.size |= uint32_t(b) << 0;
				packet.size = ntohl(packet.size);
				_step++;

				packet.data.clear();
				if (packet.size > 0)
				{
					packet.data.reserve(packet.size);
				}
				else
				{
					_step++; // Skip data step.
				}
				break;

			// Data.
			case 8:
				packet.data.push_back(b);

				if (packet.data.size() == packet.size)
					_step++;
				break;

			// Checksum.
			case 9:
				packet.checksum = b;
				_step = 0;
				return true;

		}
	}
	return false;
}
```

The parser works based on steps/positions. As soon as the first byte matches the fixed header value of `0xAF` (`step=0`), it continues to parse packet attributes step by step and _byte for byte._ Remember this, it is important when it comes to handling multi-byte data types.

`flags` (`step=1`) is a single-byte attribute, which can be assigned as it is.
Single-byte types doesn't require any kind of bit/byte order conversion.

`type` (`step=2-3`) is a multi-byte data type and requires two bytes and an byte-order conversion to be complete. The Parser left-shifts the next two upcoming bytes into the `packet.type` attribute. After it is completely filled the Parser needs to convert the byte-order into the host-byte-order with `ntohs()`.

`size` (step=`4-7`) is a multi-byte data type and requires four bytes and an byte-order conversion with `htohl()` to be complete. With step `7` it is complete and the `packet.data` attribute can be prepared by clearing all previous bytes and reserving enough space for the new data bytes.

`data` (`step=8`) will be filled up until it contains `packet.size` number of bytes. It may required special handling of internal fields, based on the packet's type.

`checksum` (`step=9`) is a single-byte data type. In best case scenario a checksum calculation and validation would run here. I skip it for this example.

Thats it. Based on your own packet format there would be more or less steps but the core functionality is always the same.

### Using it, Testing

Here is a small example. It serializes two packets into a buffer, which would be the network stack and parses it with `Parser`. Read the inline code comments for details.

```cpp
// main.cpp
#include "packet.h"
#include "parser.h"

int main(int argc, char** argv)
{
	// Network buffer.
	std::vector<uint8_t> buf;

	// CLIENT SIDE
	// Serialize and send packets.
	// Instead of sending we simply write them to a buffer `buf`.

	// 1st packet.
	Packet pkt1;
	pkt1.header = 0xAF;
	pkt1.flags = 0x00;
	pkt1.type = 0x0001;
	pkt1.size = 3;
	pkt1.data = { 0x11, 0x22, 0x33 };
	pkt1.checksum = 0xFF;
	pkt1.serialize(buf);

	// Add some random invalid bytes to network buffer.
	buf.push_back(0x87);
	buf.push_back(0x09);
	buf.push_back(0x43);

	// 2nd packet.
	Packet pkt2;
	pkt2.header = 0xAF;
	pkt2.flags = 0x80;
	pkt2.type = 0x0002;
	pkt2.size = 1;
	pkt2.data = { 0x88 };
	pkt2.checksum = 0xEE;
	pkt2.serialize(buf);

	// Add some random invalid bytes to network buffer.
	buf.push_back(0x11);
	buf.push_back(0x22);
	buf.push_back(0x33);

	// SERVER SIDE
	// Parse packets from network/buffer `buf`.

	// Parsing.
	Parser parser;
	Packet packet;
	uint8_t* p = buf.data();
	size_t plen = buf.size();
	while (plen > 0)
	{
		size_t bytesRead = 0;
		if (parser.parse(p, plen, bytesRead, packet))
		{
			// At this point the `packet` is complete.
			printf("INFO new packet! type=%d; size=%d\n", packet.type, packet.size);
		}
		p += bytesRead;
		plen -= bytesRead;
	}
	return 0;
}
```

You may want to read and debug the `main()` implementation very careful to fully understand how it works.

The sources are available on GitHub: <https://github.com/mfreiholz/blog-article-sources/tree/master/network-protocol-parsing>