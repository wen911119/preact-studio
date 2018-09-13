import { h, Component } from "preact";
import Swiper from "../Swiper";
import Text from "preact-text";
import { XCenterView, RowView } from "preact-layoutview";
import Line from "preact-line";
export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = {
      activeIndex: 1
    };
  }
  onChange(index) {
    this.setState({
      activeIndex: index
    });
  }
  render({ children, titles, style = {}, fill }, { activeIndex }) {
    let _style = {};
    if (fill) {
      _style = {
        display: "flex",
        flexDirection: "column",
        flex: 1
      };
    }
    return (
      <div style={Object.assign(_style, style)}>
        <RowView height={100}>
          {titles.map((t, index) => (
            <XCenterView
              style={{
                flex: 1
              }}
            >
              <Text color={index === activeIndex - 1 ? "#f8584f" : "#000"}>
                {t}
              </Text>
            </XCenterView>
          ))}
        </RowView>
        <Line />
        <Swiper onChange={this.onChange} index={activeIndex} fill>
          {children}
        </Swiper>
      </div>
    );
  }
}
