<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
    import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
    export default {
        data () {
            return {
                clipped: false,
                drawer: false,
                fixed: false,
                items: [
                    {
                        icon: 'fa-home',
                        title: 'Home',
                        to: '/'
                    },
                    {
                        icon: 'fa-puzzle-piece',
                        title: 'Sliding puzzle',
                        to: '/sliding-puzzle'
                    },
                    {
                        icon: 'fa-th',
                        title: 'Gridworld',
                        to: '/gridworld'
                    },
                    {
                        icon: 'fa-table',
                        title: 'Q Table',
                        to: '/q-table'
                    }
                ],
                miniVariant: false,
                right: true,
                rightDrawer: false,
                title: 'Reinforcement learning '
            }
        }
    }
</script>
