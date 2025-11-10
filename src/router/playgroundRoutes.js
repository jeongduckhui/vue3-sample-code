import PlaygroundView from '@/views/playground/PlaygroundView.vue'
import PlaygroundBasicDatePickerView from '@/views/playground/PlaygroundBasicDatePickerView.vue'
import PlaygroundUpperLowerDatePickerView from '@/views/playground/PlaygroundUpperLowerDatePickerView.vue'
import PlaygroundDisabledDatePickerView from '@/views/playground/PlaygroundDisabledDatePickerView.vue'
import VuePicDatePickerView from '@/views/playground/VuePicDatePickerView.vue'
import MultiSelectView from '@/views/playground/MultiSelectView.vue'
import VueDataGrid from '@/views/playground/VueDataGrid.vue'
import TransferPopupView from '@/views/playground/TransferPopupView.vue'

const playgroundRoutes = [
  {
    path: '/playground',
    name: 'Playground',
    component: PlaygroundView,
    children: [
      {
        path: 'basic',
        name: 'PlaygroundBasicDatePicker',
        component: PlaygroundBasicDatePickerView,
      },
      {
        path: 'upperlower',
        name: 'PlaygroundUpperLowerDatePicker',
        component: PlaygroundUpperLowerDatePickerView,
      },
      {
        path: 'disabled',
        name: 'PlaygroundDisabledDatePicker',
        component: PlaygroundDisabledDatePickerView,
      },
      {
        path: 'vuepic',
        name: 'VuePicDatePicker',
        component: VuePicDatePickerView,
      },
      {
        path: 'multiselect',
        name: 'MultiSelect',
        component: MultiSelectView,
      },
      {
        path: 'datagrid',
        name: 'VueDataGrid',
        component: VueDataGrid,
      },
      {
        path: 'transferpopup',
        name: 'TransferPopup',
        component: TransferPopupView,
      },
    ],
  },
]

export default playgroundRoutes
