import { h, Component } from "preact";
import px2rem from "p-to-r";
const PageRender = ({
  children,
  header = {},
  footer = {},
  bgColor = "#fff",
  fix = true
}) => {
  let _style = {};
  if (fix) {
    _style = {
      container: {
        display: "flex",
        flexDirection: "column",
        height: "100%"
      },
      header: {
        height: px2rem(header.height || 0)
      },
      content: {
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column"
      },
      bottom: {
        height: px2rem(header.height || 0)
      }
    };
  } else {
    _style = {
      container: {
        paddingTop: px2rem(header.height || 0),
        paddingBottom: px2rem(footer.height || 0),
        minHeight: "100%",
        position: "relative",
        boxSizing: "border-box",
        backgroundColor: bgColor
      },
      header: {
        position: "fixed",
        width: "100%",
        left: 0,
        top: 0,
        zIndex: header.index || 1
      },
      content: {},
      bottom: {
        position: "fixed",
        width: "100%",
        left: 0,
        bottom: 0,
        zIndex: footer.index || 1
      }
    };
  }
  return (
    <div style={_style.container}>
      <div style={_style.header}>{header.render && header.render()}</div>
      <div id="_page_content_" style={_style.content}>
        {children}
      </div>
      <div style={_style.bottom}>{footer.render && footer.render()}</div>
    </div>
  );
};

export default class Page extends Component {
  constructor(props) {
    super(props);
    this.render = PageRender;
  }
  componentDidMount() {
    const contentHeight = document.getElementById("_page_content_")
      .clientHeight;
    this.props.onLayout && this.props.onLayout({ contentHeight });
  }
}
