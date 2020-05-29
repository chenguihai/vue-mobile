import { createBEM } from 'vant/es/bem'
import { createComponent } from 'vant/es/component'
import { createI18N } from 'vant/es/i18n'
export function createNamespace (name) {
  name = 'van-' + name
  return [createComponent(name), createBEM(name), createI18N(name)]
}
