[![Build Status](https://travis-ci.org/dakom/react-pixi-renderer.svg?branch=master)](https://travis-ci.org/dakom/react-pixi-renderer)

# React Pixi Renderer
## A React Fiber Renderer for PIXI

## [Demo](https://github.com/dakom/react-pixi-renderer-bunnymark)

## How to Install

NPM

`npm install react-pixi-renderer`

CDN (external browser)

`<script src="//unpkg.com/react-pixi-renderer/dist/react-pixi-renderer.min.js"></script>`

_note: if loading externally, everything will be on globals via `ReactPixi`. e.g. ReactPixi.ReactPixi, ReactPixi.Text, ReactPixi.Container, etc_
_additionally, since JSX requires transpilation, you'll need to use the string keys for each component. See [src/tests/external-browser](src/tests/external-browser) for example._
_it is *highly* recommended to use a bundler like fuse-box or webpack instead!_

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

You can also set `autoStart: false` in the PIXI application and control rendering manually. 
That requires one of two approaches:

1. Providing the renderer as a callback (third param). For example: `ReactPixi.render(<World />, app.stage, app.render);` (WIP - SEE https://github.com/facebook/react/issues/10950)
2. Making the root element a Higher Order Component and lifting app.render there for lifecycle management (this works. see the [bunnymark source](https://github.com/dakom/react-pixi-renderer-bunnymark) for example)

## Components

See the currently available components at [docs/Components](docs/Components.md)

The overall approach is to match the native PIXI object props 1:1

Events are sent back up the tree via prop callbacks - and may supply additional data to the original event (e.g. in order to avoid the requirement for `ref` on the component)

If a feature cannot be expressed inherently through _both_ React props and native PIXI object properties - then the feature will not be supported and implementation should be done by wrapping a base component into a Higher Order Component.

An example of that could be a Triangle component (which is really a series of calls on a PIXI.Graphics object), or getting measurements that are calculated post-mounting (or rather, after an onAdded event).

The bulk of the remaining work is simply copy/paste adding support for more components and filling the remaining properties. The links will bring you to the official PIXI docs for the native objects. PRs that add this in are welcome :)


## Building, Testing, Roadmap, etc.

See [docs](docs/)