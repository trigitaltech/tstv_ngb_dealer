<template>
  <div>
    <div class="col-md-12">
      <div class="row">
        <div class="col-md-12">
          <div class="card">
            <div class="card-body">
              <ValidationObserver v-slot="{ handleSubmit }">
                <form @submit.prevent="handleSubmit(edit)">
                  <div class="row mb-2">
                    <div class="col-md-12">
                      <fieldset class="border p-2">
                        <legend class="w-auto">
                          <h2 class="header-title mt-0 mb-1">Edit Service Info</h2>
                        </legend>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Account No</label>
                              <input
                                v-model="itemObj.accountNo"
                                class="form-control"
                                type="text"
                                placeholder="Enter Account No"
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Box ID</label>
                              <input
                                v-model="itemObj.stbNumber"
                                class="form-control"
                                placeholder="Enter STB No"
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-2">
                      <fieldset class="border p-2">
                        <legend class="w-auto">
                          <h4 class="header-title mt-0 mb-1">Personal Info</h4>
                        </legend>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">First Name</label>
                              <input
                                v-model="itemObj.firstName"
                                class="form-control"
                                placeholder="Enter First Name"
                                type="text"
                              />
                            </div>
                          </div>
                          <!-- <div class="col-md-3">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Middle Name</label>
                              <input
                                :value.trim="form.middleName"
                                class="form-control"
                                placeholder="Enter Middle Name"
                                type="text"
                                disabled
                              />
                            </div>
                          </div>-->
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Last Name</label>
                              <input
                                v-model="itemObj.lastName"
                                class="form-control"
                                placeholder="Enter Last Name"
                                type="text"
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Email</label>
                              <input
                                v-model="itemObj.email"
                                placeholder="Enter Email"
                                class="form-control"
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Phone Number</label>
                              <input
                                v-model="itemObj.number"
                                placeholder="Enter Phone Number"
                                class="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                    <div class="col-md-6 mb-2">
                      <fieldset class="border p-2">
                        <legend class="w-auto">
                          <h4 class="header-title mt-0 mb-1">Address</h4>
                        </legend>
                        <div class="row">
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Address Line 1</label>
                              <input
                                v-model="itemObj.address"
                                class="form-control"
                                type="text"
                                placeholder="Enter Address"
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Post Code</label>
                              <input
                                v-model="itemObj.postCode"
                                class="form-control"
                                placeholder="Enter PostCode"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">City</label>

                              <multiselect
                                v-model="itemObj.city"
                                placeholder="Select City"
                                :options="cityOpt"
                                @input="changeCity"
                              ></multiselect>
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">State</label>
                              <input
                                v-model="itemObj.state"
                                class="form-control"
                                type="text"
                                placeholder="Enter State"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="col-md-3">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Country</label>
                              <input
                                v-model="itemObj.country"
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
                  </div>

                  <div class="row mt-2 justify-content-center">
                    <div class="col-md-4">
                      <button
                        class="btn btn-primary d-inline-flex align-items-center"
                        @click="e=>$emit('edit',e)"
                      >Back</button>
                    </div>
                    <div class="col-md-8">
                      <div class="d-flex justify-content-end">
                        <button
                          type="submit"
                          class="btn btn-primary d-inline-flex align-items-center"
                        >Submit</button>
                      </div>
                    </div>
                  </div>
                </form>
              </ValidationObserver>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import {
  ValidationProvider,
  ValidationObserver,
} from 'vee-validate/dist/vee-validate.full'
import { editcustomer, cityTemplete, registerTemplete } from '../services/auth'
export default {
  name: 'editcustomer',
  components: {
    Multiselect,
    ValidationProvider,
    ValidationObserver,
  },

  data() {
    return {
      cityOpt: [],
    }
  },
  props: {
    itemObj: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async getClientDetails() {
      const result = await registerTemplete()
      this.clientTemplete = result.data
      this.cityOpt = this.clientTemplete.addressTemplateData.cityData
      console.log(this.clientTemplete)
    },
    async changeCity(value) {
      console.log(value)
      const result = await cityTemplete(value)
      console.log('city', result)
      this.itemObj.state = result.data.state
      this.itemObj.country = result.data.country
    },
    async edit() {
      // if(this.form.firstName && this.form.lastName && this.form.number && this.form.address){
      try {
        const payload = {
          firstname: this.itemObj.firstName,
          lastname: this.itemObj.lastName,
          active: true,
          accountNo: this.itemObj.accountNo,
          email: this.itemObj.email,
          phone: this.itemObj.number,
          homePhoneNumber: '',
          clientCategory: this.itemObj.clientCategory,
          title: this.itemObj.title,
          officeId: this.itemObj.officeId,
          locale: 'en',
          dateFormat: 'dd MMMM yyyy',
          addressNo: this.itemObj.address,
          street: '',
          city: this.itemObj.city,
          district: '',
          state: this.itemObj.state,
          country: this.itemObj.country,
          activationDate: this.itemObj.activationDate,
        }
        console.log('form', payload)
        const result = await editcustomer(payload, this.itemObj.clientId)
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `You Customer Updated Successfully`,
            duration: 5000,
          })
        }
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].defaultUserMessage}`,
          duration: 5000,
        })
      }
      this.$emit('edit', {})
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
  },
  async mounted() {
    console.log('hai', this.$props.itemObj)
    this.getClientDetails()
  },
}
</script>