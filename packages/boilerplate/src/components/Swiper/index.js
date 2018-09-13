import { h, Component } from "preact";
import { WithEnv } from "../Env";

const itemStyle = {
  width: "100vw",
  display: "inline-block",
  height: "100%"
};

const innerStyle = {
  display: "inline-block",
  whiteSpace: "nowrap",
  lineHeight: 0
};

// @WithEnv
// class Swiper extends Component {
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.index !== this.state.index) {
//       this.switchTo(nextProps.index);
//     }
//   }
//   onTouchStart(e) {
//     this.touchStart = e.touches[0];
//     this.setState({ animation: false });
//     this.lastTranslateX = this.state.translateX;
//   }
//   onTouchMove(e) {
//     const angle =
//       (this.touchStart.clientY - e.touches[0].clientY) /
//       (this.touchStart.clientX - e.touches[0].clientX);

//     if (Math.abs(angle) < 0.5) {
//       this.distance = e.touches[0].clientX - this.touchStart.clientX;
//       if (
//         (this.state.index === this.state.total && this.distance < 0) ||
//         (this.state.index === 1 && this.distance > 0)
//       ) {
//         this.distance = 0;
//       } else {
//         this.setState({
//           translateX: this.distance + this.lastTranslateX
//         });
//       }
//       e.preventDefault();
//     } else {
//       this.distance = 0;
//     }
//   }
//   onTouchEnd(e) {
//     if (Math.abs(this.distance) > 50) {
//       const direction = this.distance > 0 ? -1 : 1;
//       this.switchTo(this.state.index + direction);
//     } else if (Math.abs(this.distance) > 0) {
//       this.switchTo(this.state.index, true);
//     }
//   }
//   switchTo(index, isReset) {
//     if (index !== this.state.index || isReset) {
//       this.setState(
//         {
//           translateX: this.props.$env.containerWidth * (index - 1) * -1,
//           animation: true,
//           index: index
//         },
//         () => {
//           this.props.onChange && this.props.onChange(index);
//         }
//       );
//     }
//   }
//   constructor(props) {
//     super(props);

//     this.onTouchStart = this.onTouchStart.bind(this);
//     this.onTouchMove = this.onTouchMove.bind(this);
//     this.onTouchEnd = this.onTouchEnd.bind(this);
//     this.switchTo = this.switchTo.bind(this);
//     this.state = {
//       translateX: 0,
//       animation: false,
//       index: 1,
//       total: props.children.length
//     };
//   }
//   render({ children }, { translateX, animation }) {
//     return (
//       <div
//         style={wrapStyle}
//         onTouchStart={this.onTouchStart}
//         onTouchMove={this.onTouchMove}
//         onTouchEnd={this.onTouchEnd}
//       >
//         <div
//           style={Object.assign({}, innerStyle, {
//             transform: `translate3d(${translateX}px,0,0)`,
//             transition: animation ? "transform .3s" : null
//           })}
//         >
//           {children.map((child, index) => {
//             return (
//               <div key={index} style={itemStyle}>
//                 {child}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   }
// }

// export default Swiper;

export class SwipeResponder extends Component {
  constructor(props) {
    super(props);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }
  // shouldComponentUpdate() {
  //   return false;
  // }
  onTouchStart(e) {
    this.touchStartPoint = e.touches[0];
    this.touchStartTime = Date.now();
    this.props.onSwipeStart();
  }
  onTouchMove(e) {
    const angle =
      (this.touchStartPoint.clientY - e.touches[0].clientY) /
      (this.touchStartPoint.clientX - e.touches[0].clientX);
    if (Math.abs(angle) < 0.5) {
      const distance = e.touches[0].clientX - this.touchStartPoint.clientX;
      this.props.onSwiping({ distance });
      e.preventDefault();
    } else {
      this.touchStartPoint = e.touches[0];
    }
  }
  onTouchEnd(e) {
    const distance = e.changedTouches[0].clientX - this.touchStartPoint.clientX;
    const speed = Math.abs(distance / (Date.now() - this.touchStartTime));
    this.props.onSwipeEnd({ distance, speed });
  }
  render({ children, style = {} }) {
    return (
      <div
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        style={style}
      >
        {children}
      </div>
    );
  }
}

const Swipeable = ({
  children,
  index,
  offset,
  width,
  animation,
  style = {}
}) => {
  const translateX = (1 - index) * width + offset;
  return (
    <div
      style={Object.assign({}, style, innerStyle, {
        transform: `translate3d(${translateX}px,0,0)`,
        transition: animation ? "transform .3s" : null
      })}
    >
      {children.map((child, i) => {
        return (
          <div key={i} style={itemStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

@WithEnv
export default class Swiper extends Component {
  constructor(props) {
    super(props);
    this.onSwipeStart = this.onSwipeStart.bind(this);
    this.onSwiping = this.onSwiping.bind(this);
    this.onSwipeEnd = this.onSwipeEnd.bind(this);
    this.state = {
      activeIndex: 1,
      animation: false,
      distance: 0
    };
  }
  onSwipeStart() {
    this.setState({ animation: false });
  }
  onSwiping({ distance }) {
    if (
      (distance > 0 && this.state.activeIndex === 1) ||
      (distance < 0 && this.state.activeIndex === this.props.children.length)
    ) {
      return;
    }
    this.setState({ distance });
  }
  onSwipeEnd({ distance, speed }) {
    if (
      (distance > 0 && this.state.activeIndex === 1) ||
      (distance < 0 && this.state.activeIndex === this.props.children.length)
    ) {
      return;
    }
    const {
      children,
      $env: { containerWidth }
    } = this.props;
    let base = { distance: 0, animation: true };
    if (Math.abs(distance) > containerWidth / children.length || speed > 0.6) {
      base.activeIndex = this.state.activeIndex + (distance > 0 ? -1 : 1);
    }
    this.setState(base);
  }
  render(
    {
      children,
      $env: { containerWidth },
      fill
    },
    { activeIndex, animation, distance }
  ) {
    let wrapStyle = {
      overflow: "hidden"
    };
    if (fill) {
      wrapStyle.flex = 1;
    }
    return (
      <div style={wrapStyle}>
        <SwipeResponder
          onSwipeStart={this.onSwipeStart}
          onSwiping={this.onSwiping}
          onSwipeEnd={this.onSwipeEnd}
          style={{ lineHeight: 0, height: "100%" }}
        >
          <Swipeable
            index={activeIndex}
            width={containerWidth}
            animation={animation}
            offset={distance}
            style={{ height: "100%" }}
          >
            {children}
          </Swipeable>
        </SwipeResponder>
      </div>
    );
  }
}
