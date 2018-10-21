import React from 'react'
import { Centred } from 'story-router'
import Button from '../components/button'
import Story from './story'

const storyProps = { text: 'Parcel Storybook' }
const buttonProps = {
  name: 'My Button',
  style: {
    margin: '10px',
    height: '30px',
    color: 'black',
    background: 'blue',
  },
}

export default [
  {
    name: 'Story 1',
    component: Centred(Story),
    props: storyProps, // adding props
  },

  {
    name: 'Button',
    component: Centred(Button),
    props: buttonProps,
  },
  {
    name: 'without Prop', // without props
    component: Centred(() => <button>Test without props</button>),
  },
]
