import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#fbd89f',
            secondary: '#d0ebff',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        },
      },
});
