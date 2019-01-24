import Vue from 'vue'
import Router from 'vue-router'
import Main from './views/main/Layer.vue'
import Sign from './views/sign/Layer.vue'
import Admin from './views/main/admin/Layer.vue'
import User from './views/main/user/Layer.vue'
import Own from './views/main/own/Layer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      children: [
        {
          path: '',
          component: () => import('./views/main/Home.vue'),
          name: 'home'
        },
        {
          path: 'about',
          component: () => import('./views/main/About.vue'),
          name: 'about'
        },
        {
          path: 'game/:englishName',
          component: () => import('./views/main/SingleGame.vue'),
          name: 'game'
        },
        {
          path: 'post/:englishName/:postId',
          component: () => import('./views/main/SinglePost.vue'),
          name: 'post'
        },
        {
          path: 'user',
          component: User,
          name: 'user',
          children:[
            {
              path: 'profile',
              component: () => import('./views/main/user/profile.vue'),
              name: 'Profile'
            },
            {
              path: 'account',
              component: () => import('./views/main/user/account.vue'),
              name: 'Account'
            }
          ]
        },
        {
          path: 'admin',
          component: Admin,
          name: 'admin',
          children:[
            {
              path: '',
              component: () => import('./views/main/admin/GameCollection.vue'),
              name: 'GameCollection'
            },
            {
              path: 'gameType',
              component: () => import('./views/main/admin/GameType.vue'),
              name: 'GameType'
            }
          ]
        },
        {
          path: 'own',
          component: Own,
          name: 'own',
          children:[
            {
              path: 'post',
              component: () => import('./views/main/own/OwnPost.vue'),
              name: 'post'
            },
            {
              path: 'reply',
              component: () => import('./views/main/own/OwnReply.vue'),
              name: 'reply'
            }
          ]
        }
      ]
    },
    {
      path: '/sign',
      name: 'sign',
      component: Sign,
      children: [
        {
          path: 'signup_email',
          name: 'Signup_email',
          component: () => import('./views/sign/Signup_email.vue')
        },
        {
          path: 'signup/email/confirm/:name_crypto/:verificationCode',
          name: 'Signup_email_verificationCode',
          component: () => import('./views/sign/Signup_email_verificationCode.vue')
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('./views/sign/Login.vue')
        }
      ]
    }
  ]
})
