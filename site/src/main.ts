import { mount } from 'svelte'
import '../styled-system/styles.css'
import 'sigil-ui/theme.css'
import './app.css'
import App from './App.svelte'

const target = document.getElementById('app')
if (!target) throw new Error('missing #app mount point')
mount(App, { target })
