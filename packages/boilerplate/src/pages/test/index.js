import { h, Component } from "preact";
import { ScrollerWithRefreshAndLoadMore } from "preact-scroller";
import { XCenterView } from "preact-layoutview";
import Text from "preact-text";
import WithNav from "../../components/WithNav";
import Page from "../../components/Page";
import Tabs from "../../components/Tabs";
const renderHeader = () => (
  <XCenterView height={100} bgColor="#ccc">
    <Text>标题</Text>
  </XCenterView>
);

const renderFooter = () => (
  <XCenterView height={100} bgColor="#ccc">
    <Text>底部</Text>
  </XCenterView>
);

@WithNav
class List extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.data === this.props.data) {
      return false;
    }
    return true;
  }
  render({ data, $nav: { push } }) {
    return (
      <div>
        {data.map(item => (
          <div onClick={() => push("detail", { id: item })}>
            <XCenterView height={200}>
              <Text>{item}</Text>
            </XCenterView>
          </div>
        ))}
      </div>
    );
  }
}

@WithNav
export default class ListPage extends Component {
  constructor(props) {
    super(props);
    this.loadmore = this.loadmore.bind(this);
    this.refresh = this.refresh.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.state = {
      list: [1, 2, 3, 4, 5, 6, 7, 8],
      index: 1,
      scrollerHeight: "calc(100vh - 3.99999rem)"
    };
    this.ref = c => {
      this.swiper = c;
    };
  }
  componentDidMount() {
    this.props.$nav.onPop(p => {
      this.setState({ list: [1, 2, 3, 4, p.name] });
    });
    this.props.$nav.onBack(p => {
      this.setState({ list: [1, 2, 3, p.name] });
    });
  }
  loadmore(done) {
    console.log("load-more");
    let newPageData = [];
    for (let l = this.state.list.length, i = l + 1; i < l + 11; i++) {
      newPageData.push(i);
    }
    const newList = Array.from(this.state.list).concat(newPageData);
    setTimeout(() => {
      this.setState({ list: newList });
      done(newList.length >= 10);
    }, 2000);
  }
  refresh(done) {
    setTimeout(() => {
      this.setState({ list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
      done();
    }, 2000);
  }
  onTabChange(index) {
    this.setState({ index });
  }
  render({}, { list, index, scrollerHeight }) {
    return (
      <Page
        header={{
          height: 100,
          render: renderHeader
        }}
        footer={{
          height: 100,
          render: renderFooter
        }}
        bgColor="#f4f4f4"
        fill={true}
      >
        <Tabs
          onChange={this.onTabChange}
          index={index}
          titles={["进行中的", "全部订单"]}
          fill={true}
        >
          <ScrollerWithRefreshAndLoadMore
            height={"100%"}
            onLoadmore={this.loadmore}
            onRefresh={this.refresh}
          >
            <List data={list} />
          </ScrollerWithRefreshAndLoadMore>
          <ScrollerWithRefreshAndLoadMore
            height={"100%"}
            onLoadmore={this.loadmore}
            onRefresh={this.refresh}
          >
            <List data={list} />
          </ScrollerWithRefreshAndLoadMore>
        </Tabs>
      </Page>
    );
  }
}
