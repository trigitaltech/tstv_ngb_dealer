import store from '@state/store'

// auth related routes
const authRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => lazyLoadView(import('@views/pages/account/login')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/forgot-password',
    name: 'Forgotpassword',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/forgotpassword')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/forgot-username',
    name: 'Forgotusername',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/forgotusername')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/change-password/:id/:key',
    name: 'Changepassword',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/changepassword')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },

  {
    path: '/topup-customer',
    name: 'TopupCustomer',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/topupCustomerDetails')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/renewal-customer',
    name: 'RenewalCustomer',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/renewalcustomer')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/renewal-customer/:id',
    name: 'RenewalCustomer',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/renewalcustomer')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/movie-purchase',
    name: 'Moviepurchase',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/moviepurchase')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  {
    path: '/movie-purchase/:id',
    name: 'Moviepurchase',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/moviepurchase')),
    meta: {
      beforeResolve(routeTo, routeFrom, next) {
        if (store.getters['auth/loggedIn']) {
          next({ name: 'dashboard' })
        } else {
          next()
        }
      },
    },
  },
  
  
  {
    path: '/make-payment',
    name: 'MakePaymentReturn',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/PaymentSuccess')),
  }
]

const inviewRoutes = [
  {
    path: '/customer-registers',
    name: 'Register',
    header: 'Apps',
    icon: 'lock',
    component: () => lazyLoadView(import('@views/pages/account/customerRegister')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/customer-details',
    name: 'Customer',
    header: 'Apps',
    icon: 'user',
    component: () => lazyLoadView(import('@views/pages/inview/customerDetails')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/voucher-management',
    name: 'Voucher Management',
    header: 'Apps',
    icon: 'user-x',
    component: () => lazyLoadView(import('@views/pages/inview/voucherManagement')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/transaction-history',
    name: 'Transaction History',
    header: 'Apps',
    icon: 'clock',
    component: () => lazyLoadView(import('@views/pages/inview/transactionHistory')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
},
{
  path: '/ticket',
  name: 'Ticket',
  header: 'Apps',
  icon: 'plus',
  component: () => lazyLoadView(import('@views/pages/inview/ticket')),
  meta: { authRequired: true },
  props: (route) => ({ user: store.state.auth.currentUser || {} }),
},
{
  path: '/Reports',
  name: 'Reports',
  header: 'Apps',
  icon: 'credit-card',
  meta: { label: 'Trip Reports' },
  component: {
    render(c) { return c('router-view') }
  },

  children: [
{
  path: 'CustomerActivationReports',
  name: 'Customer Activation Reports',
  component: () => lazyLoadView(import('@views/pages/inview/activationreport')),
  meta: { authRequired: true },
  props: (route) => ({ user: store.state.auth.currentUser || {} }),
},
{
  path: 'CurrentActivationsAlongWithPlansAndProvision',
  name: 'CurrentActivationsAlongWithPlansAndProvision',
  component: () => lazyLoadView(import('@views/pages/inview/currentactivation')),
  meta: { authRequired: true },
  props: (route) => ({ user: store.state.auth.currentUser || {} }),
},
{
  path: 'VoucherReport',
  name: 'Voucher Search',
  component: () => lazyLoadView(import('@views/pages/inview/voucherreport')),
  meta: { authRequired: true },
  props: (route) => ({ user: store.state.auth.currentUser || {} }),
},
  ]

}
]

// pageRoute
const pagesRoutes = [
  {
    path: '/profile',
    name: 'Profile',
    component: () => lazyLoadView(import('@views/pages/inview/profile')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  
  {
    path: '/voucher-management-details-view/:id',
    name: 'Voucher Management Details',
    component: () => lazyLoadView(import('@views/pages/inview/voucherManagementDetailsView')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
  {
    path: '/voucher-management-details/:id',
    name: 'Voucher Management Details',
    component: () => lazyLoadView(import('@views/pages/inview/voucherManagementDetails')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  }
]

// error pages
const errorRoutes = [
  {
    path: '/404',
    name: '404',
    component: require('@views/pages/error-404').default,
    props: true,
  },
  {
    path: '/500',
    name: '500',
    component: require('@views/pages/error-500').default,
    props: true,
  },
  {
    path: '*',
    redirect: '404',
  },
]

// dashboard
const dashboardRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    header: 'Navigation',
    icon: 'home',
    badge: {
      text: '1',
      varient: 'success',
    },
    component: () => lazyLoadView(import('@views/pages/dashboard/dashboard')),
    meta: { authRequired: true },
    props: (route) => ({ user: store.state.auth.currentUser || {} }),
  },
]

const authProtectedRoutes = [
  ...dashboardRoutes,
  ...inviewRoutes,
]

const allRoutes = [
  ...authRoutes,
  ...errorRoutes,
  ...authProtectedRoutes,
  ...pagesRoutes,
]

export { allRoutes, authProtectedRoutes }

function lazyLoadView(AsyncView) {
  const AsyncHandler = () => ({
    component: AsyncView,
    loading: require('@components/_loading').default,
    delay: 400,
    timeout: 10000,
  })

  return Promise.resolve({
    functional: true,
    render(h, { data, children }) {
      return h(AsyncHandler, data, children)
    },
  })
}
