import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import uk from 'vuetify/es5/locale/uk';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { uk },
    current: 'uk',
  },
  icons: {
    iconfont: 'mdiSvg',
  },
});
