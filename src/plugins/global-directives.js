import korLangOnly from '@/directives/korLangOnly'
import commaNumber from '@/directives/commaNumber'
import tooltip from '@/directives/tooltip'
import focus from '@/directives/focus'
import emailValidation from '@/directives/emailValidation'
import maxLength from '@/directives/maxLength'
import noSpecialChars from '@/directives/noSpecialChars'
import trim from '@/directives/trim'
import toUpperCase from '@/directives/toUpperCase'
import toLowerCase from '@/directives/toLowerCase'

export default {
  install(app) {
    app.directive('korLangOnly', korLangOnly)
    app.directive('commaNumber', commaNumber)
    app.directive('tooltip', tooltip)
    app.directive('focus', focus)
    app.directive('emailValidation', emailValidation)
    app.directive('maxLength', maxLength)
    app.directive('noSpecialChars', noSpecialChars)
    app.directive('trim', trim)
    app.directive('toUpperCase', toUpperCase)
    app.directive('toLowerCase', toLowerCase)
  },
}
