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
                        <h5 class="d-inline align-middle ml-1 text-logo">Forget your username</h5>
                      </a>
                    </div>
                    <b-form class="authentication-form">
                      <div class="form-group">
                        <label class="form-control-label">Enter Email Id</label>
                        <div class="input-group input-group-merge">
                          <div class="input-group-prepend"></div>
                          <b-form-input
                            id="input-1"
                            v-model="email"
                            type="email"
                            required
                            placeholder="Enter Email Id"
                          ></b-form-input>
                          <b-form-group id="button-group" class="mt-0" style="margin-left:5px">
                            <b-button
                              type="submit"
                              variant="primary"
                              class="btn-block"
                              @click.prevent="myFunction"
                            >Submit</b-button>
                          </b-form-group>
                        </div>

                        <b-form-input
                          id="input-1"
                          v-model="emailid"
                          type="text"
                          required
                          disabled
                          placeholder="Check Email Id"
                        ></b-form-input>
                      </div>
                        <b-alert v-model="isAuthError" variant="success" dismissible>{{message}}</b-alert>
                      <b-form-group
                        id="button-group"
                        class="mt-0"
                        style="margin-left:5px;margin-top:5px"
                      >
                        <b-button
                          type="submit"
                          variant="primary"
                          class="btn-block"
                          @click.prevent="emailconfirm"
                        >Confirm Email</b-button>
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
import { verifyemail, confirmemail } from '../../../../services/customer'

export default {
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Multiselect, Rave },
  data() {
    return {
      email: '',
      useremail:'',
      emailid:null,
        confirmemail: null,
        message:null,
      // message:null,
      // isAuthError:false,
      isAuthError:false,
      clientId: null,
    }
  },
  computed: {
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
    rows() {
      return this.tableData.length
    },
  },
  async mounted() {
     setAuthorizationHeader('ZGVhbGVyOmRlYWxlcg==')

    // console.log('mounted', this.email)
  },
  methods: {
     async protect_email(confirmemail) {
      var avg, splitted, part1, part2
      splitted = confirmemail.split('@')
      part1 = splitted[0]
      avg = part1.length / 2
      part1 = part1.substring(0, part1.length - avg)
      part2 = splitted[1]
      return part1 + '***@' + part2
      // console.log('email', protect_email)
    },
    async myFunction() {
      try {
        setAuthorizationHeader('ZGVhbGVyOmRlYWxlcg==')
        NProgress.start()
        const result = await verifyemail(this.email)
        this.emailid = await this.protect_email(result.data.email)
        this.useremail = result.data.email
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
        NProgress.done()
      }
    },

    async emailconfirm() {
      try {
        //    setAuthorizationHeader('ZGVhbGVyOmRlYWxlcg==')
        //   NProgress.start()
        const result = await confirmemail(this.useremail)
        if (result) {
            this.isAuthError = true
          //    this.form = {}
          // this.query = "";
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Email Sent Successfully`,
            duration: 5000,
          })
            (this.message = `Your request sent to your email please check and change password`);
        }
      } catch (e) {
       this.email=""
       this.emailid=""
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