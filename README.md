[![Build Status](https://travis-ci.org/dakom/react-pixi-renderer.svg?branch=master)](https://travis-ci.org/dakom/react-pixi-renderer)

# React Pixi Renderer
## A React Fiber Renderer for PIXI

## [Demo](https://github.com/dakom/react-pixi-renderer-bunnymark)

## How to Install

### NPM

`npm install react-pixi-renderer`

### CDN

`<script src="//unpkg.com/react-pixi-renderer/dist/react-pixi-renderer.browser-production.js"></script>`

_Everything will be on globals via `ReactPixi` e.g. ReactPixi.ReactPixi, ReactPixi.Text, ReactPixi.Container, etc_

### DEPENDENCIES

The library is stripped of dependencies since it only makes sense in an environment that already has PIXI and React loaded.

However, there is an additional package `react-reconciler` which is currently waiting for a [PR merge](https://github.com/facebook/react/pull/10758).

For now, it's included here in `temp_modules` and you must import that in the consuming app as well.


## Usage

1. Setup a PIXI.Application as usual
2. Call `ReactPixi.render(rootElement, pixiContainer)`

## Code Sample

```javascript
import * as PIXI from "pixi.js";
import * as React from "react";
import {ReactPixi, Text, Container} from "pixi-react-renderer";

const app = new PIXI.Application({
    width: window.innerWidth, 
    height: window.innerHeight, 
    backgroundColor: 0x2a2a2a,
    view: document.getElementById("canvas") as HTMLCanvasElement,
    autoStart: true,
    });

const World = () => (
    <Container>
        <Text text="Hello world!" style={{fill: 0xFF00FF}} />
    </Container>
)

ReactPixi.render(<World />, app.stage);

```

## Manual rendering

You can also set `autoStart: false` in the PIXI application and control rendering manually. This is likely the more ideal setup for anything that will potentially take more than 1 frame of execution.

It requires one of two approaches:

1. Providing the renderer as a callback (third param). For example: `ReactPixi.render(<World />, app.stage, app.render);` (WIP - SEE https://github.com/facebook/react/issues/10950)
2. Making the root element a Higher Order Component and lifting app.render there for lifecycle management (this works. see the [bunnymark source](https://github.com/dakom/react-pixi-renderer-bunnymark) for example)

## Components

The currently available components are documented at [docs/Components](docs/Components.md)

The overall approach is to match the native PIXI object props 1:1

Events are sent back up the tree via prop callbacks - and may supply additional data to the original event (e.g. in order to avoid the requirement for `ref` on the component)

If a feature cannot be expressed inherently through _both_ React props and native PIXI object properties - then the feature will not be supported and implementation should be done by wrapping a base component into a Higher Order Component.

An example of that could be a Triangle component (which is really a series of calls on a PIXI.Graphics object), or getting measurements that are calculated post-mounting (or rather, after an onAdded event).

The bulk of the remaining work is simply copy/paste adding support for more components and filling the remaining properties. The links will bring you to the official PIXI docs for the native objects. PRs that add this in are welcome :)

## Gotchas

Compared to straight PIXI, performance kindof sucks if you use it for lots of nodes. See this test/demo that tries to figure out where the bottleneck is: https://dakom.github.io/react-renderer-test/

It turns out that the bottleneck is basically React itself and the size of the tree. So don't use this approach for lots of items! However - I get a solid framerate for like <4000 bunnies on desktop.

If performance is an issue for lots of items, and you still want to go this route, you can squeeze more juice out of it by constructing the architecture so that the edge nodes render null rather than proper elements, though that means ditching the inherent pipeline and managing your own objects. That technique can work with any renderer and using ReactDOM vs. this custom renderer does not see a significant difference, so there's no real point in using this renderer if you go that route (on other words, if you do this - the bulk of the work is then inside your renderer-agnostic components)

## Building, Testing, Roadmap, etc.

See [docs](docs/)