<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import { updatepassword } from '../../../../services/customer'
/**
 * Profile component
 */
export default {
  page: {
    title: 'Profile',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
  },
  data() {
    return {
      password: '',
      repeatpassword: '',
      topUp: false,
      title: 'Profile',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Profile',
          active: true,
        },
      ],
    }
  },
  computed: {
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
  },
  methods: {
    changepassword() {
      this.topUp = true
    },
    async updatepassword() {
      try {
        const payload = {
          password: this.password,
          repeatPassword: this.repeatpassword,
        }
        const result = await updatepassword(
          this.getUserDetails.officeId,
          payload
        )
        if (result) {
          this.form = {}
          this.query = ''
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Your Password Changed Successfully`,
            duration: 5000,
          })
        }
      } catch (e) {
        this.form = {}
        this.query = ''
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message}`,
          duration: 5000,
        })
      }
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <div class="text-center mt-3">
              <!-- <img
					src="data:image/png;base64,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"
					alt
					class="avatar-lg rounded-circle"
              />-->
              <h5 class="mt-2 mb-0">{{ $attrs.user.username }}</h5>
            </div>
            <div class="col-md-12">
              <button
                style="float:right;background-color:#26a69a"
                type="submit"
                class="btn btn"
                @click="changepassword()"
              >Change Password</button>
            </div>
            <!-- profile  -->
            <div class="mt-5 pt-2 border-top">
              <h4 class="mb-3 font-size-15">About</h4>
              <p class="text-muted mb-4">Hi I'm Crown.</p>
            </div>
            <div class="mt-3 pt-2 border-top">
              <h4 class="mb-3 font-size-15">Contact Information</h4>
              <div class="table-responsive">
                <table class="table table-borderless mb-0 text-muted">
                  <tbody>
                    <tr>
                      <th scope="row">Email</th>
                      <td>trigital@gmail.com</td>
                    </tr>
                    <tr>
                      <th scope="row">Phone</th>
                      <td>(123) 123 1234</td>
                    </tr>
                    <tr>
                      <th scope="row">Address</th>
                      <td>
                        1975 Boring Lane, San Francisco, California, United States -
                        94108
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <b-modal v-model="topUp" title="ChangePassword" title-class="font-18" hide-footer>
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
                type="text"
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
                type="text"
                required
                placeholder="confirm your new password"
              ></b-form-input>
            </div>
          </div>
          <b-button class="mt-3" variant="primary" block @click="updatepassword" style="background-color:#26a69a">Update</b-button>
          <!-- <b-button variant="primary" @click="updatepassword">Updatepassword</b-button> -->
        </b-modal>
        <!-- end card -->
      </div>
    </div>
  </Layout>
</template>
