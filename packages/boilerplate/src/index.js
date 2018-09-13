import './style'
import { h, Component } from 'preact'
import App from './pages/test'
import PullDownComponent from './components/PullDownComponent'
import PullUpComponent from './components/PullUpComponent'
// import {
//   SetDefaultLoadMoreComponent,
//   SetDefaultPullDownRefreshComponent
// } from 'preact-scroller'
// SetDefaultLoadMoreComponent(PullUpComponent)
// SetDefaultPullDownRefreshComponent(PullDownComponent)
export default () => h(App, document.body)
