+++
date = "2017-01-17T19:29:32+01:00"
title = "How to use GeoServer / GeoWebCache with NASA WorldWind"
author = "mfreiholz"
tags = ["Administration", "Tutorial"]
+++

I currently develop and setup different software products which needs to display a map, like Google Maps or OpenStreetMaps. One very important requirement is to display the Map without an active internet connection. This quickly results in the idea to run my own [GeoServer](http://geoserver.org/) instance with local stored map data and distribute it via [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) (Web Map Service).

In the first step I simply added an OpenStreetMap layer and cached a few zoom levels with the built-in *GWC Seed Form* (batched caching) mechanism. I tested it with [OpenLayers](http://openlayers.org/) and everything worked just fine. Unfortunetaly one of the dozens software components I require, uses the [NASA WorldWind](https://worldwind.arc.nasa.gov/) viewer, which seems to use completely different zoom-levels (resolutions) than most other available viewers. Since I am new to this field I spend hours by searching for a solution, but couldn't find anything on the internet. Until...

## The Problem Cause

At some point I was able to get hands on the HTTP request URL, which the NASA WorldWind viewer sends to the server in the state where it was completely zoomed out. Pasting the URL into my browser's address bar lead to the following response from the *offline* GeoWebCache server:

**Request URL**

```
/geoserver/gwc/service/wms?service=WMS&request=GetMap&version=1.1.1&srs=EPSG:4326&layers=grob_osm_wsm:all&styles=&width=512&height=512&format=image/png&transparent=TRUE&bgcolor=0x000000&bbox=54.0,36.0,72.0,54.0&
```

**Response**

`
400: Requested horizontal resolution: 0.0703125 , best match:
0.703125 exceeds 10% threshold. Perhaps the client is configured with an incorrect set of scales (resolutions), or the DPI setting is off compared to the one in GWC ?
`

## The Solution

**TL;DR** It is required to create a new custom *Caching Gridset,* assign it to the layer which should be available and start the caching task with the *GWC Seed Form.*

### 1. Setup Gridset

- *Tile Caching* -> *Gridsets* \
Click *Create a copy* of the *EPSG:4326* Gridset
- Remove all levels except the first one from the *Tile Matrix Set* and paste `0.0703125` into the *Pixel Size* column. This is the horizontal resolution, which the above HTTP Response of the WMS contains.
- Clicking on *Add zoom level* will now automatically set the correct *Pixel* size for the next zoom level. It might be useful to add ~15-22 zoom levels.

In addition to the *Tile Matrix Set*, it is required to use set the *Tile-width and -height* to **512**. This seems to be the default tile-size requested from WorldWind (most other applications use 256x256 px).

### 2. Add Gridset To Layer

- *Tile Caching* -> *Tile Layers* -> *YOUR-LAYER* -> Tab: *Tile Caching* \
At the bottom is a table with Gridsets, which should be cached. Add the new Gridset here with MIN/MAX selected for published and cached zoom levels.

### 3. Fill GeoWebCache (Seed)

- *Tile Caching* -> *Tile Layers* -> *YOUR-LAYER* -> *Seed/Truncate* \
Make your perfered settings with the new Gridset and start the caching tasks.

## Final words

Always make sure that the request of your map-viewer matches exactly the settings of the cached gridset settings (resolution, tile-width, tile-height, format).

After all, this *small* problem costs me a lot of time and I hope this article helps somebody who faces the same problem.