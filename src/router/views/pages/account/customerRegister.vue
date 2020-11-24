<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import Multiselect from 'vue-multiselect'
import { ModelSelect } from 'vue-search-select'
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate/dist/vee-validate.full'
import {
  registerTemplete,
  cityTemplete,
  simpleactivation,
  editcustomer,
  plans,
  planprice,
  searchvoucher,
  redeem,
} from '../../../../services/auth'

export default {
  page: {
    title: 'Register',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    ValidationProvider,
    ValidationObserver,
    ModelSelect,
  },
  data() {
    return {
      plandata: '',
      amount: '',
      submitted: false,
      title: 'Register',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Register',
          active: true,
        },
      ],
      finalModel: {},
      selected: null,
      clientId: '',
      options: ['DAF'],
      item: {
        value: '',
        text: '',
      },
      form: {
        personalTitle: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        email: '',
        number: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postCode: '',
        stbNumber: '',
        bouquets: null,
        amount: 0,
        voucherNo: '',
      },
      titles: ['Mr.', 'Sri.', 'Mrs'],
      vouchernumber: '',
      genderOpt: ['Male', 'Female', 'Other'],
      cityOpt: [],
      bouquetsOpt: [{value: null, text: 'Please select an option'} ,'FTA  AND STARTER'],
      clientTemplete: {},
    }
  },
  computed: {
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
  },
  mounted() {
    this.getClientDetails()
    this.getplans()
  },
  methods: {
    async makeredeem() {
      try {
        const payload = {
          pinNumber: this.vouchernumber,
          clientId: this.clientId,
        }
        let result = await redeem(payload)
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Your Redeemption Done Successfully`,
            duration: 5000,
          })
          this.refresh()
        }
      } catch (e) {
        this.$toasted.error(e.message.errors[0].developerMessage, {
          duration: 7000,
        })
      }
    },
    async myFunction() {
      if (this.vouchernumber.length === 18) {
        const result = await searchvoucher(this.vouchernumber)
        var CId = result.data

        console.log(CId)
        if (CId < 5) {
          this.$notify({
            group: 'alert',
            type: 'error',
            text: `invalid voucher id`,
            duration: 5000,
          })
          this.submitted = true
        } else {
          this.submitted = false
        }
      }
    },
     async getplanprices() {
       console.log("hai",this.amount)
       this.amount = 311
     },

    async getplans() {
      const result = await plans()
      this.plandata = result.data
      this.plandata.map((e) => {
        this.options.push(e.planCode)
      })
      // console.log(this.clientTemplete)
    },
    async getplanprice() {
      if (this.selected !== null) {
      this.amount = "311"
      }
      // console.log("planmdata",this.plandata)
      var id = ''
      if (this.selected !== null) {
        this.plandata.map((e) => {
          if (this.selected === e.planCode) {
            id = e.id
          }
        })
        console.log('id', id)
        const result = await planprice(id)
        // this.amount = result.data.pricingData[0].price

        // console.log("amount",amount)
      }
      //      plan.map((e) => {
      //   this.options.push(e.planCode)
      // })
      // console.log(this.clientTemplete)
    },
    validateStep(name) {
      var refToValidate = this.$refs[name]
      return refToValidate.validate()
    },
    mergePartialModels(model, isValid) {
      if (isValid) {
        // merging each step model into the final model
        this.finalModel = Object.assign({}, this.finalModel, model)
      }
    },
    async getClientDetails() {
      const result = await registerTemplete()
      this.clientTemplete = result.data
      this.cityOpt = this.clientTemplete.addressTemplateData.cityData
      console.log(this.clientTemplete)
    },
    async changeCity(value) {
      console.log(value)
      const result = await cityTemplete(value)
      this.form.state = result.data.state
      this.form.country = result.data.country
    },
    bouquetsChange(value) {
      if (value === 'DAFT') {
        this.form.amount = 1500
      } else {
        this.form.amount = 1500
      }
    },
    async register() {
      this.submitted = true
      // if(this.form.firstName && this.form.lastName && this.form.number && this.form.address){
      try {
        const payload = {
          forename: this.form.firstName,
          surname: this.form.lastName,
          gender: 'male',
          email: this.form.email,
          mobile: this.form.number,
          dob: '12101990',
          officeId: this.getUserDetails.officeId,
          // officeId: 2,
          address: [
            {
              addressNo: this.form.address,
              state: this.form.state,
              country: this.form.country,
              city: this.form.city,
              postCode: this.form.postCode,
              countryCode: 'NGA',
              addressType: 'PRIMARY',
            },
            {
              addressNo: this.form.address,
              state: this.form.state,
              country: this.form.country,
              city: this.form.city,
              postCode: this.form.postCode,
              countryCode: 'NGA',
              addressType: 'BILLING',
            },
          ],
          devices: [
            {
              deviceId: this.form.stbNumber,
            },
          ],
          plans: [
            {
              planCode: 'STARTER',
            },
            {
              planCode: 'FTA',
            },
          ],
          credentails: {
            username: this.form.stbNumber,
            password: 'paywd@123',
          },
          refId: '12233333',
          IsVerified: 'NO',
          // paymentInfo: {
          //   paymentMethodID: 'VOUCHER',
          //   voucherCodes: {
          //     voucherCode: this.form.voucherNo,
          //   },
          // },
          valid: true,
          salutation: this.form.personalTitle,
          // middlename: this.form.middleName,
        }
        console.log('form', payload)
        // debugger
        const result = await simpleactivation(payload)
        this.clientId = result.data.clientId
        if (result) {
          this.form = {}
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Your Customer Registeration Done Successfully`,
            duration: 5000,
          })
          this.makeredeem()
        }
        this.submitted = false
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].defaultUserMessage}`,
          duration: 5000,
        })
      }

      // }
      // else
      // {
      //    this.$notify({
      //   group: "alert",
      //   type: "error",
      //   text: `You fill Data`,
      //   duration: 5000,
      // });
      // }
    },
    async refresh() {
      setTimeout(function () {
        location.reload()
      }, 200)
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :items="items" />
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-xl-12 mx-auto">
            <b-card
              class="card-wrap"
              header="Register Customer"
              border-variant="info"
              header-text-variant="white"
            >
              <div class="card-body">
                <ValidationObserver v-slot="{ handleSubmit }">
                  <form @submit.prevent="handleSubmit(register)">
                    <div class="row">
                      <div class="col-md-12 mb-2">
                        <fieldset class="border p-2">
                          <legend class="w-auto">
                            <h4 class="header-title mt-0 mb-1"
                              >Personal Info</h4
                            >
                          </legend>

                          <div class="row">
                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Personal Title</label>
                                <multiselect
                                  v-model="form.personalTitle"
                                  placeholder="Select Personal Title"
                                  :options="titles"
                                ></multiselect>
                              </div>
                            </div>
                            <!-- <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Gender</label>
                                <multiselect
                                  v-model.trim="form.gender"
                                  placeholder="Select Gender"
                                  :options="genderOpt"
                                ></multiselect>
                              </div>
                            </div>-->
                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">First Name</label>
                                <!-- <ValidationProvider
                                  v-slot="{ errors }"
                                  name="First Name"
                                  rules="required"
                                >-->
                                <input
                                  for="firstname"
                                  type="text"
                                  v-model.trim="form.firstName"
                                  oninvalid="this.setCustomValidity('First Name is required ')"
                                  oninput="setCustomValidity('')"
                                  placeholder="Enter FirstName"
                                  class="form-control"
                                  required
                                />
                                <!-- <input
                                    v-model.trim="form.firstName"
                                    class="form-control"
                                    placeholder="Enter First Name"
                                    type="text"
                                />-->
                                <!-- <span class="text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>-->
                              </div>
                            </div>
                            <!-- 
                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Middle Name</label>
                                <input
                                  v-model.trim="form.middleName"
                                  class="form-control"
                                  placeholder="Enter Middle Name"
                                  type="text"
                                />
                              </div>
                            </div>-->

                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Last Name</label>
                                <!-- <ValidationProvider
                                  v-slot="{ errors }"
                                  name="Last Name"
                                  rules="required"
                                >-->
                                <input
                                  for="lastname"
                                  type="text"
                                  v-model.trim="form.lastName"
                                  oninvalid="this.setCustomValidity('last name is required ')"
                                  oninput="setCustomValidity('')"
                                  placeholder="Enter LastName"
                                  class="form-control"
                                  required
                                />
                                <!-- <input
                                    v-model.trim="form.lastName"
                                    class="form-control"
                                    placeholder="Enter Last Name"
                                    type="text"
                                  />
                                  <span class="text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>-->
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Email</label>
                                <input
                                  for="email"
                                  type="email"
                                  v-model.trim="form.email"
                                  oninvalid="this.setCustomValidity('Please Use @gmail.com ')"
                                  oninput="setCustomValidity('')"
                                  placeholder="Enter Email"
                                  class="form-control"
                                  required
                                />
                              </div>
                            </div>
                            <div class="col-md-6">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Phone Number</label>
                                <!-- <ValidationProvider
                                  v-slot="{ errors }"
                                  name="Phone Number"
                                  rules="required"
                                >-->
                                <input
                                  for="number"
                                  type="number"
                                  v-model.trim="form.number"
                                  oninvalid="this.setCustomValidity('Phone number is required ')"
                                  oninput="setCustomValidity('')"
                                  placeholder="Enter Phone Number"
                                  class="form-control"
                                  required
                                />
                                <!-- <input
                                    v-model.trim="form.number"
                                    placeholder="Enter Phone Number"
                                    class="form-control"
                                    type="number"
                                />-->
                                <!-- <span class="text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>-->
                              </div>
                            </div>

                            <div class="col-md-6">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Address</label>
                                <!-- <ValidationProvider
                                  v-slot="{ errors }"
                                  name="Address"
                                  rules="required"
                                >-->
                                <input
                                  for="address"
                                  type="text"
                                  v-model.trim="form.address"
                                  oninvalid="this.setCustomValidity('Address is required ')"
                                  oninput="setCustomValidity('')"
                                  placeholder="Enter Address"
                                  class="form-control"
                                  required
                                />
                                <!-- <input
                                    v-model.trim="form.address"
                                    class="form-control"
                                    placeholder="Enter Address"
                                    type="text"
                                />-->
                                <!-- <span class="text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>-->
                              </div>
                            </div>

                            <div class="col-md-6">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Post Code</label>
                                <input
                                  v-model.trim="form.postCode"
                                  placeholder="Enter Poster Code"
                                  class="form-control"
                                  type="number"
                                />
                              </div>
                            </div>

                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">City</label>
                                <multiselect
                                  v-model.trim="form.city"
                                  placeholder="Select City"
                                  :options="cityOpt"
                                  @input="changeCity"
                                ></multiselect>
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">State</label>
                                <input
                                  v-model.trim="form.state"
                                  class="form-control"
                                  type="text"
                                  placeholder="Enter State"
                                  disabled
                                />
                              </div>
                            </div>
                            <div class="col-md-4">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Country</label>
                                <input
                                  v-model.trim="form.country"
                                  class="form-control"
                                  type="text"
                                  placeholder="Enter Country"
                                  disabled
                                />
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>

                      <div class="col-md-12">
                        <fieldset class="border p-2">
                          <legend class="w-auto">
                            <h4 class="header-title mt-0 mb-1">Service Info</h4>
                          </legend>
                          <div class="row">
                            <div class="col-md-3">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Box ID</label>
                                <input
                                  v-model.trim="form.stbNumber"
                                  placeholder="Enter Box ID"
                                  class="form-control"
                                  type="text"
                                />
                              </div>
                            </div>

                            <!-- <div class="col-md-3">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Voucher No</label>
                                <input
                                  v-model.trim="form.voucherNo"
                                  class="form-control"
                                  placeholder="Enter Voucher No"
                                  type="number"
                                />
                              </div>
                            </div>-->

                            <div class="col-md-6">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Plan</label>
                                <!-- <b-form-select v-model="selected" :options="options"  v-on:change="getplanprice()"></b-form-select> -->
                                <!-- <model-select :options="options"
                                v-model="item"
                                placeholder="select item">
                                </model-select>-->
                                <b-form-select
                                    oninvalid="this.setCustomValidity('Plan is required ')"
                                  oninput="setCustomValidity('')"
                                  required
                                  v-model.trim="form.bouquets"
                                  placeholder="Select Bouquets"
                                  :options="bouquetsOpt"
                                  @change="getplanprices()"
                                ></b-form-select>
                              </div>
                            </div>

                            <div class="col-md-3">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Amount</label>
                                <input
                                  v-model.trim="amount"
                                  class="form-control"
                                  type="number"
                                  disabled
                                  placeholder="Amount"
                                />
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div class="col-md-12">
                        <fieldset class="border p-2">
                          <legend class="w-auto">
                            <h4 class="header-title mt-0 mb-1">Voucher Info</h4>
                          </legend>
                          <div class="row">
                            <div class="col-md-3">
                              <div class="form-group mt-3 mt-sm-0">
                                <label for="default">Voucher ID</label>
                                <input
                                  oninvalid="this.setCustomValidity('Voucher Id is required ')"
                                  oninput="setCustomValidity('')"
                                  required
                                  v-model.trim="vouchernumber"
                                  placeholder="Enter Voucher ID"
                                  class="form-control"
                                  type="text"
                                  @input="myFunction"
                                />
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>

                    <div class="row mt-2 justify-content-center">
                      <div class="col-md-12">
                        <div class="d-flex justify-content-end">
                          <button
                            class="btn btn-outline-primary mr-3"
                            style="color: #26a69a"
                            type="reset"
                            >Reset</button
                          >
                          <button
                            :disabled="submitted"
                            style="background-color: #26a69a"
                            type="submit"
                            class="btn btn-primary d-inline-flex align-items-center"
                            >Submit</button
                          >
                        </div>
                      </div>
                    </div>
                  </form>
                </ValidationObserver>
              </div>
            </b-card>
          </div>
        </div>
      </div>
    </div>

    <!-- end row -->
  </Layout>
</template>
<style lang="scss">
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: #26a69a;
  border-bottom: 0 solid rgba(0, 0, 0, 0.125);
}
</style>
