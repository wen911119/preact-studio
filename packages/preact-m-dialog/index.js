import { h } from 'preact'
import {
  ColumnView,
  RowView,
  SlotColumnView,
  XCenterView
} from 'preact-layoutview'
import Text from 'preact-text'
import { TouchableBlock } from 'preact-touchable'
import Modal from 'preact-modal'
import Line from 'preact-line'
let styleSheet = document.styleSheets[0]
const keyframesShow = `
    @keyframes dialog-zoom {
      0%{transform: scale(0)}
      50%{transform: scale(1.1)}
      100%{transform: scale(1)}
    }`
styleSheet.insertRule(keyframesShow, styleSheet.cssRules.length)

const baseStyle = {
  borderRadius: '0.32rem',
  animationDuration: '0.3s',
  animationName: 'dialog-zoom',
  minHeight: '3.4rem'
}

const Dialog = ({
  type = 'confirm',
  style = {},
  title,
  content,
  open,
  onConfirm,
  onCancel
}) => (
  <Modal open={open}>
    <ColumnView
      width={489}
      bgColor="#f8f8f8"
      style={Object.assign({}, baseStyle, style)}
    >
      <SlotColumnView hAlign="center" padding={[36, 69, 36, 69]} slot={10}>
        <Text size={31} color="#000" style={{ fontWeight: 'bold' }}>
          {title}
        </Text>
        <Text size={23} color="#000" style={{ textAlign: 'center' }}>
          {content}
        </Text>
      </SlotColumnView>
      <Line color="#dad9de" />
      {type === 'alert' ? (
        <RowView>
          <TouchableBlock onPress={onConfirm}>
            <Text>确定</Text>
          </TouchableBlock>
        </RowView>
      ) : (
        <RowView height={81}>
          <TouchableBlock
            onPress={onConfirm}
            style={{
              flex: 1,
              height: '100%'
            }}
          >
            <XCenterView style={{ height: '100%' }}>
              <Text size={28} color="#007afa" style={{ fontWeight: 'bold' }}>
                知道了
              </Text>
            </XCenterView>
          </TouchableBlock>
          <Line color="#dad9de" v />
          <TouchableBlock
            onPress={onCancel}
            style={{ flex: 1, height: '100%' }}
          >
            <XCenterView style={{ height: '100%' }}>
              <Text size={28} color="#007afa">
                去设置
              </Text>
            </XCenterView>
          </TouchableBlock>
        </RowView>
      )}
    </ColumnView>
  </Modal>
)

export default Dialog
