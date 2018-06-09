import { h } from 'preact'
import style from './style'
import Text from 'preact-text'

const Home = () => (
  <div class={style.home}>
    <h1>Home</h1>
    <p>This is the Home component.</p>
    <Text color="#f8584f">wenjun</Text>
  </div>
)

export default Home
