<script>
import appConfig from '@src/app.config'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'
import Rave from 'vue-ravepayment'
import { setAuthorizationHeader } from '../../../../services/index'
import backgroundUrl from '@assets/images/header-bg.jpg'

import {
  searchCustomer,
  searchCustomerId,
  orderByClient,
  transaction,
  movieItemDetails,
  makeOnlinePayment,
  movieList,
  moviePurchase,
} from '../../../../services/customer'

export default {
  components: { Multiselect, Rave },
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },

  data() {
    return {
      backgroundUrl,
      selectedMovieItem: {
        contentProviderValue: 'Content-1',
        mediaCategory: 'Movie',
        mediaId: '',
        mediaTitle: 'Select Movie ',
        moviePrice: 0,
        releaseDate: Array[3],
        status: 'ACTIVE',
      },
      topUpModalItem: {
        id: 0,
        price: 0,
      },
      paymentPayload: {
        money: 0,
        hostedPayment: 1,
        key: 'FLWPUBK-5d8f2ad301c2394c332999410d0fea20-X',
        reference: '',
        redirect: '',
      },
      customer: [
        { key: 'serial_no', value: 'STB No' },
        { key: 'account_no', value: 'Customer Id' },
      ],
      paymentType: [
        
        { key: 'online', value: 'Online' },
        { key: 'voucher', value: 'Voucher' },
      ],
      paymentAmount: 0,
      paymentTypeSelected: { key: 'online', value: 'Online' },
      query: '', // BOOX0009
      customerBy: { key: 'serial_no', value: 'STB No' },
      title: 'Customer',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Customer',
          active: true,
        },
      ],
      form: {
        title: '',
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
        planName: '',
        expiryDate: '',
        planAmount: '',
        voucherCode: '',
        movieList: '',
        movieAmount: '',
        voucherId: '',
        accountNo: '',
        movieListValue: '',
      },
      titles: ['Mr.', 'Sri.', 'Mrs'],
      genderOpt: ['Male', 'Female', 'Other'],
      bouquetsOpt: ['DAFT', 'BASE'],
      movieLists: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      fields: [
        { key: 'transDate', sortable: true },
        { key: 'transactionType', sortable: true },
        { key: 'referenceNO', sortable: true },
        { key: 'amount', sortable: true },
      ],
      movieFields: [
        { key: 'chargeCode', sortable: true },
        { key: 'eventName', sortable: true },
        { key: 'eventPrice', sortable: true },
        { key: 'bookedDate', sortable: true },
        { key: 'status', sortable: true },
      ],
      tableData: [],
      movieTableData: [],
      topUp: false,
      moviePurches: false,
      show: false,
      customers: {
        email: 'eb@gmail.com',
      },
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
    this.totalRows = this.items.length
  },
  methods: {
    callback(response) {
      console.log(response)
    },
    close() {
      console.log('Payment closed')
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async myFunction() {
      if (this.query.length === 12) {
        try {
          setAuthorizationHeader('ZGVhbGVyOmRlYWxlcg==')
          NProgress.start()
          const result = await searchCustomer(this.customerBy.key, this.query)
          this.clientId = result.data.id
          if (result) {
            const response = await searchCustomerId(result.data.id)
            await orderByClient(
              response.data.orderData[0].planType,
              result.data.id
            )
            this.customers = response.data
            this.pwMovieList()
            this.show = true
            this.form = {
              title: this.customers.title,
              firstName: this.customers.firstname,
              // middleName: this.customers.firstname,
              lastName: this.customers.lastname,
              // gender: this.customers.gender,
              price: this.customers.orderData[0].price,
              email: this.customers.email,
              number: this.customers.phone,
              address: this.customers.address,
              city: this.customers.city,
              state: this.customers.state,
              country: this.customers.country,
              postCode: this.customers.zip,
              stbNumber: this.customers.hwSerialNumber,
              planName: this.customers.orderData[0].planDescription,
              expiryDate: this.getDate(this.customers.orderData[0].endDate),
              planAmount: this.customers.planamount,
              accountNo: this.customers.accountNo,
            }
          }
          this.getTransaction()
          this.getMovie()
          NProgress.done()
        } catch (e) {
          this.$notify({
            group: 'alert',
            type: 'error',
            text: `${e.message}`,
            duration: 5000,
          })
          NProgress.done()
        }
      }
    },
    // getDate(timeStamp) {
    //   return moment(timeStamp).format('l')
    // },
    // getFormattedDate(timeStamp) {
    //   return moment(timeStamp).format('DD MMMM YYYY')
    // },
    getDate(timeStamp) {
      let date
      if (timeStamp !== undefined)
        date = timeStamp[0] + '-' + timeStamp[1] + '-' + timeStamp[2]
      return moment(date).format('DD MMMM YYYY')
    },
    getFormattedDate(timeStamp) {
      //  console.log(timeStamp)
      let date
      if (timeStamp !== undefined)
        date = timeStamp[0] + '-' + timeStamp[1] + '-' + timeStamp[2]
      return moment(date).format('MMM Do YYYY')
    },
    async getTransaction() {
      try {
        const response = await transaction(this.clientId)
        this.tableData = response.data.pageItems
      } catch (e) {
        this.tableData = []
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.defaultUserMessage}`,
          duration: 5000,
        })
      }
    },
    async getMovie() {
      try {
        const response = await movieList(this.clientId)
        this.movieTableData = response.data
      } catch (e) {
        this.movieTableData = []
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.defaultUserMessage}`,
          duration: 5000,
        })
      }
    },
    async movieChanges(value) {
      this.form.movieListValue = value.mediaId
    },
    async pwMovieList() {
      const res = await movieItemDetails()
      this.movieLists = res.data
    },
    updateValue(value) {
      this.customerBy = value
    },
    topUpModal(item) {
      this.topUpModalItem = item
      this.topUp = true
    },
    async makePayment(topUp) {
      let payload = {
        clientId: this.clientId,
        amount: this.selectedMovieItem.moviePrice,
        purchaseType: 'tvod',
        stbNo: this.form.stbNumber,
        refId: this.selectedMovieItem.mediaId,
      }
      this.paymentPayload.money = this.selectedMovieItem.moviePrice
      const result = await makeOnlinePayment(payload)
      const txId = result.data.details.map.revorder.txId
      if (txId) {
        this.paymentPayload.reference = txId
        this.paymentPayload.redirect = result.data.details.map.callbackUrl
        const elem = document.getElementById('pay')
        setTimeout(() => {
          elem.click()
        }, 1000)
      }
    },
    async makeMoviePurchase() {
      try {
        const payload = {
          stbNo: this.form.stbNumber,
          // amount: '1000',
          // itemName: 'RC',
          itemId: this.form.movieListValue,
          paymentDetails: {
            paymentType: 'voucherPayment',
            voucherId: this.form.voucherId,
          },
        }
        const result = await moviePurchase(this.customers.id, payload)
        if (result) {
           this.form = {}
        this.query = "";
          this.$notify({
            group: 'alert',
            type: 'success',
            text: `You Movie Purchase Successfully`,
            duration: 5000,
          })
        }
      } catch (e) {
         this.form = {}
        this.query = "";
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

<template>
  <!-- end row -->
  <div :style="{ backgroundImage: `url(${backgroundUrl})` } ">
  <div
    class="playvod-pages"
    style="background-color:rgba(0, 0, 0, 0.8)">
    <div class="overlay"></div>
    <div class="container">
      <div class="row">
        <div class="col-xl-7">
          <div class="playvod-leftside" style="margin-top:60px">
            <img src="@assets/images/vod.png" />
            <h1>PLAYVOD ON FREETV</h1>
            <p>PLAYVOD is a Video on Demand Service available on FREETV which allows you to enjoy loads of blockbuster Nollywood titles at your convenience. You can access this service by connecting a PLAYVOD Dongle to the USB port behind your FREETV Decoder.</p>
            <p>For Payment Related Enquiries and Error Messages Please send an email to dafpayments@freetv.ng</p>
          </div>
          <!-- end row -->
        </div>
        <div class="col-xl-5">
          <div class="vod-right-form">
            <div class="row">
              <div class="col-md-12 mb-0">
                <fieldset class="p-2">
                  <legend class="w-auto text-center">
                    <h3 class="mt-0 mb-1" style="color:#fff;">PLAYVOD PAYMENT</h3>
                  </legend>
                  <div class="row">
                    <label for="default">Unique ID Number</label>
                    <input
                      v-model="query"
                      class="form-control"
                      placeholder="Enter Stb Number"
                      type="text"
                       @input="myFunction"
                    />
                    <label for="default">First Name</label>
                    <input
                      :value="form.firstName"
                      class="form-control"
                      placeholder="Enter First Name"
                      type="text"
                      disabled
                    />
                    <label for="default">Last Name</label>
                    <input
                      :value="form.lastName"
                      class="form-control"
                      placeholder="Enter Last Name"
                      type="text"
                      disabled
                    />

                    <label for="default">Email</label>
                    <input
                      v-model="form.email"
                      placeholder="Enter Email"
                      class="form-control"
                      disabled
                    />

                    <label for="default">Phone Number</label>
                    <input
                      :value="form.number"
                      placeholder="Enter Phone Number"
                      class="form-control"
                      disabled
                    />

                    <label for="default">Address</label>
                    <input
                      :value="form.address"
                      class="form-control"
                      type="text"
                      placeholder="Enter Address"
                      disabled
                    />

                    <label>Select Movie List</label>
                    <multiselect
                      v-model.trim="selectedMovieItem"
                      placeholder="Select Movie List"
                      :options="movieLists"
                      label="mediaTitle"
                      @input="movieChanges"
                    ></multiselect>

                    <label for="default">Select Payment Type</label>
                    <multiselect
                      v-model.trim="paymentTypeSelected"
                      placeholder= "Select Movie List"
                      :options="paymentType"
                      label="value"
                    ></multiselect>

                    <div
                      v-if="paymentTypeSelected.value === 'Online'"
                      style="font-size: 0.875rem;font-weight: 400;width: 100%">
                      <label for="default">Amount</label>
                      <input
                        :value="selectedMovieItem.moviePrice"
                        class="form-control"
                        placeholder="Enter Amount"
                        type="number"
                        disabled
                      />
                    </div>
                    <div
                      v-if="paymentTypeSelected.value !== 'Online'"
                      class="form-group mt-2 mt-sm-0"
                    >
                      <div class="row">
                        <div class="col-md-6">
                          <label for="default">Voucher Id</label>
                          <input
                            v-model.trim="form.voucherId"
                            class="form-control"
                            placeholder="Enter Voucher Id"
                            type="text"
                          />
                        </div>
                        <div class="col-md-6">
                          <label for="default">Amount</label>
                          <input
                            :value="selectedMovieItem.moviePrice"
                            class="form-control"
                            placeholder="Enter Amount"
                            type="number"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
                <div>
                  <b-button
                    v-if="paymentTypeSelected.value !== 'Online'"
                    variant="primary"
                     style="background-color:white;color:black"
                    :disabled="!selectedMovieItem"
                    @click="makeMoviePurchase"
                   
                  >Make Movie Purchase</b-button>
                  <b-button
                    v-else
                      style="background-color:white;color:black"
                    variant="primary"
                    :disabled="!selectedMovieItem"
                    @click="makePayment"
                  
                  >Make Payment</b-button>
                </div>
              </div>
            </div>
          </div>
          <!-- end row -->
        </div>
        <!-- end col -->
      </div>
      <!-- end row -->
      <div :style="{ height: 0, overflow: 'hidden' }">
        <Rave
          :email="customers.email"
          :amount="parseInt(paymentPayload.money)"
          :reference="paymentPayload.reference"
          :rave-key="paymentPayload.key"
          :callback="callback"
          :redirect-url="paymentPayload.redirect"
          :customer-firstname="customers.firstname"
          :customer-lastname="customers.lastname"
          :custom-title="customers.displayName"
          :close="close"
          payment-options="card,barter,account,ussd"
          :hosted-payment="paymentPayload.hostedPayment"
          currency="NGN"
        >
          <i id="pay">Pay</i>
        </Rave>
      </div>
    </div>
    <!-- end container -->
  </div>
  </div>
</template>

<style scoped>
label {
  display: inline-block;
  margin-bottom: 2px;
  margin-left: 0.5rem;
  float: left;
  color: #fff;
  font-weight: 600;
}
.vod-right-form {
  margin: 50px;
  background: #266aaf;
  border: 1px solid #4b5263;
  padding: 30px;
  text-align: center;
}
.vod-right-form label {
  color: #fff;
}
.make-payment-btn {
  display: block;
  background: #fff;
  width: 100%;
  color: #333;
  font-size: 18px;
}
.vod-right-form .form-group {
  margin-bottom: 5px;
}
.playvod-leftside {
  padding-top: 60px;
  padding-right: 30px;
}
.playvod-leftside h1 {
  color: #fff;
  font-weight: bold;
}
.playvod-leftside p {
  color: #fff;
}
</style>
