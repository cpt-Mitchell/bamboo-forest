import {
  Button,
  Row,
  Col,
  Icon,
  Popup,
  Checkbox,
  CheckboxGroup,
  Cell,
  CellGroup,
  Field,
  NumberKeyboard,
  RadioGroup,
  Radio,
  Search,
  Switch,
  Loading,
  PullRefresh,
  List,
  Panel,
  Image,
  Cascader,
  Toast,
  NavBar,
  DatetimePicker,
  Dialog,
  ActionSheet,
  PasswordInput,
  Collapse,
  CollapseItem,
  Tabs,
  Tab
} from 'vant'
export default class VantUI {
  init(_vue) {
    _vue
      .use(Button)
      .use(Row)
      .use(Col)
      .use(Icon)
      .use(Popup)
      .use(Cell)
      .use(CellGroup)
      .use(Checkbox)
      .use(CheckboxGroup)
      .use(NumberKeyboard)
      .use(RadioGroup)
      .use(Search)
      .use(Field)
      .use(Radio)
      .use(Image)
      .use(Switch)
      .use(Loading)
      .use(PullRefresh)
      .use(List)
      .use(Panel)
      .use(Toast)
      .use(Cascader)
      .use(NavBar)
      .use(DatetimePicker)
      .use(ActionSheet)
      .use(PasswordInput)
      .use(Collapse)
      .use(CollapseItem)
      .use(Tabs)
      .use(Tab)
      .use(Dialog)
  }
}
