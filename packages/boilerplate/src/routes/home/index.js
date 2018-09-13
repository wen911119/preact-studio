import { h } from 'preact'
import style from './style'
import { Link } from 'preact-router/match'
const Home = () => (
  <div class={style.home}>
    <div>
      <Link activeClassName={style.active} href="/scroller">
        scroller
      </Link>
    </div>

    <div>
      <Link activeClassName={style.active} href="/autolist">
        autolist
      </Link>
    </div>
  </div>
)
export default Home
