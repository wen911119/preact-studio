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
    <div>
      <Link activeClassName={style.active} href="/swiper">
        swiper
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/tabs">
        tabs
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/tabsAndAutoList">
        tabsAndAutoList
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/modal">
        modal
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/dialog">
        dialog
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/toast">
        toast
      </Link>
    </div>
    <div>
      <Link activeClassName={style.active} href="/picker">
        picker
      </Link>
    </div>
  </div>
)
export default Home
