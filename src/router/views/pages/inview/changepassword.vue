<template>
  <Layout>
    <!-- end row -->
    <div class="account-pages my-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-xl-10">
            <div class="card">
              <div class="card-body p-0">
                <div class="row">
                  <div class="col-md-6 p-5">
                    <div class="mx-auto mb-5">
                      <a routerLink="/">
                        <img src="@assets/images/tstvlogo.png" alt height="38" />
                        <h5 class="d-inline align-middle ml-1 text-logo">Change password</h5>
                      </a>
                    </div>
                    <b-form class="authentication-form">
                      <div class="form-group">
                        <label class="form-control-label">Enter Password</label>
                        <div class="input-group input-group-merge">
                          <div class="input-group-prepend">
                            <span class="input-group-text">
                              <feather type="lock" class="align-middle icon-dual"></feather>
                            </span>
                          </div>
                          <b-form-input
                            id="input-1"
                            v-model="password"
                            type="password"
                            required
                            placeholder="Enter your new password"
                          ></b-form-input>
                        </div>
                      </div>
                      <div class="form-group mt-4">
                        <label class="form-control-label">Confirm Password</label>
                        <div class="input-group input-group-merge">
                          <div class="input-group-prepend">
                            <span class="input-group-text">
                              <feather type="lock" class="align-middle icon-dual"></feather>
                            </span>
                          </div>
                          <b-form-input
                            id="password"
                            v-model="repeatpassword"
                            type="password"
                            required
                            placeholder="confirm your new password"
                          ></b-form-input>
                        </div>
                      </div>
                       <!-- <b-alert v-model="isAuthError" variant="danger" dismissible>{{message}}</b-alert> -->
                      <b-alert v-model="isAuthError" variant="success" dismissible>{{message}}</b-alert>
                      <b-form-group id="button-group" class="mt-4 mb-1">
                        <b-button
                          type="submit"
                          variant="primary"
                          class="btn-block"
                          @click.prevent="myFunction"
                        >Submit</b-button>
                      </b-form-group>
                    </b-form>
                  </div>
                  <div class="col-lg-6 d-none d-md-inline-block">
                    <div class="auth-page-sidebar">
                      <div class="overlay"></div>
                      <div class="auth-user-testimonial">
                        <p class="font-size-24 font-weight-bold text-white mb-1">I simply love it!</p>
                        <p class="lead">"I love TStv. I love it very much!"</p>
                        <p>- Admin User</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- end card-body -->
            </div>
            <!-- end row -->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
  </Layout>
</template>
<script>
import appConfig from '@src/app.config'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'
import Rave from 'vue-ravepayment'
import { setAuthorizationHeader } from '../../../../services/index'
import backgroundUrl from '@assets/images/header-bg.jpg'
import { changepassword } from '../../../../services/customer'

export default {
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Multiselect, Rave },
  data() {
    return {
      password: '',
      repeatpassword: '',
         message:null,
      // message:null,
      // isAuthError:false,
      isAuthError:false,
    }
  },
  computed: {
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
  },
  async mounted() {
       setAuthorizationHeader('ZGVhbGVyOmRlYWxlcg==')

    // id = this.$route.paramas
    // key = this.this.$route.paramas
    
    // console.log('mounted', this.$route.params)
  },
  methods: {
    async myFunction() {
      try {
        const payload = {
          secretKey: this.$route.params.key,
          password: this.password,
          repeatPassword: this.repeatpassword,
        }
        const result = await changepassword(this.$route.params.id, payload)
        if (result) {
          this.form = {}
          this.query = ''
         this.isAuthError = true
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Your Password Changed Successfully`,
            duration: 5000,
          })
           (this.message = `Your Password Changed Successfully`);
            
        }
      } catch (e) {
        this.form = {}
        // this.isAuthError = true
        //  this.message1 = `Congratulation!! Your request placed successfully with reference request no`;
        this.query = ''
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
        
      }
    },
  },
}
</script>