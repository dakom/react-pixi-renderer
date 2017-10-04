import * as React from 'react';

const c = name => props => React.createElement(name, props);

export const Container = c('container');
export const Text = c('text');
export const Sprite = c('sprite');