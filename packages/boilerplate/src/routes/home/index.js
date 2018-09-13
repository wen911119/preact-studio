import { h } from 'preact'
import style from './style'
import { Link } from 'preact-router/match'
const Home = () => (
  <div class={style.home}>
    <Link activeClassName={style.active} href="/scroller">
      scroller
    </Link>
  </div>
)
export default Home
