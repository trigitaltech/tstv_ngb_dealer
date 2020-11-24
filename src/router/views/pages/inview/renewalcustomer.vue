<template>
  <div>
    <div class="playvod-pages" style="background-color:rgba(0, 0, 0, 0.8)">
      <div class="overlay"></div>
      <div class="container">
        <div class="row" style="margin-left:250px">
          <div class="vod-right-form">
            <div class="row">
              <div class="col-md-12 mb-0">
                <fieldset class="p-2">
                  <legend class="w-auto text-center">
                    <h3 class="mt-0 mb-1" style="color:#fff;">Online Payment</h3>
                  </legend>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group mt-3 mt-sm-0">
                        <form ref="form" class="form">
                          <div class="from-group">
                            <label>Unique ID Number</label>
                            <input
                              v-model="query"
                              class="form-control"
                              placeholder="Enter Stb Number"
                              type="text"
                              @input="myFunction"
                            />
                            <label id="lFirst">First Name</label>
                            <input
                              :value="form.firstName"
                              class="form-control"
                              placeholder="Enter First Name"
                              type="text"
                              disabled
                            />
                            <label id="llast">Last Name</label>
                            <input
                              :value="form.lastName"
                              class="form-control"
                              placeholder="Enter Last Name"
                              type="text"
                              disabled
                            />
                            <label id="lemail">Email</label>
                            <input
                              v-model="form.email"
                              placeholder="Enter Email"
                              class="form-control"
                              disabled
                            />
                            <label id="lphone">Phone</label>
                            <input
                              :value="form.number"
                              placeholder="Enter Phone Number"
                              class="form-control"
                              disabled
                            />

                            <label id="laddress">Address</label>
                            <input
                              :value="form.address"
                              class="form-control"
                              type="text"
                              placeholder="Enter Address"
                              disabled
                            />

                            <label id="lamt">Amount</label>
                            <input
                              v-model="price"
                              class="form-control"
                              placeholder="Enter Price"
                              type="text"
                             
                            />
                            <label>Payment Type</label>
                            <multiselect
                              v-model.trim="paymentTypeSelected"
                              style="margin-top:30px"
                              placeholder="Select Payment Type"
                              :options="paymentType"
                              label="value"
                            ></multiselect>
                            <div v-if="paymentTypeSelected.value !== 'Online'">
                              <label id="lvoucher">Voucher Code</label>
                              <input
                                v-model.trim="form.voucherCode"
                                class="form-control"
                                placeholder="Enter Voucher Code"
                                type="text"
                              />
                            </div>
                          </div>

                          <b-form-group id="button-group" class="mt-4 mb-1">
                            <b-button
                              v-if="paymentTypeSelected.value !== 'Online'"
                              style="background-color:white;color:black"
                              @click="makeTopUp"
                            >Make TopUp</b-button>
                            <b-button
                              v-else
                              style="background-color:white;color:black"
                              @click="makePaymentTopUp"
                            >Make Payment</b-button>
                          </b-form-group>
                        </form>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
       paymentOptions= "card,ussd,qr,barter"

        :hosted-payment="paymentPayload.hostedPayment"
        currency="NGN"
      >
        <i id="pay">Pay</i>
      </Rave>
    </div>
  </div>
</template>
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
  movieList,
  topUp,
  makeOnlinePayment,
  getStatusService
} from '../../../../services/customer'

export default {
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Multiselect, Rave },
  data() {
    return {
      price:"",
      backgroundUrl,
      selectedMovieItem: {
        contentProviderValue: 'Content-1',
        mediaCategory: 'Movie',
        mediaId: 2,
        mediaTitle: 'Catch.ER',
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
        hostedPayment: 3,
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
    setAuthorizationHeader('QWRtaW46VHN0djIwMTkh')
    this.totalRows = this.items.length
    // debugger
    console.log('mounted',this.$route.params)
     const { id } = this.$route.params
    //  console.log(id.split('&')[1].replace("txref=",""))
    console.log("hai",id)
    //  var id1 = id !== undefined?id.split('&')[1].replace("txref=",""):0;
    if (id > 0) {
      
      const result = await getStatusService(id)
      console.log('got status : ', result)
      var status = result.data.response.Result.status
      console.log('got txn status : ', status)
      if (status === 'success') {
        this.$swal({
          title: 'Congratulation',
          type: 'success',
          text: `Transaction done Successfully`,
          duration: 7000,
        })
      } else {
        this.$toasted.error('Transaction failed', {
          duration: 7000,
        })
      }
    }
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
      if (this.query.length === 18) {
      try {
        setAuthorizationHeader('QWRtaW46VHN0djIwMTkh')
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
            id: this.customers.orderData[0].id,
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
          text: `Box Id Not Found Please Register `,
          duration: 5000,
        })
        NProgress.done()
      }
      }
    },
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
    // getDate(timeStamp) {
    //   return moment(timeStamp).format('l')
    // },
    // getFormattedDate(timeStamp) {
    //   return moment(timeStamp).format('DD MMMM YYYY')
    // },
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
    async makeTopUp() {
      try {
        const payload = {
          stbNo: this.form.stbNumber,
          amount: '1000',
          itemName: 'RC',
          paymentDetails: {
            paymentType: 'voucherPayment',
            voucherId: this.form.voucherCode,
          },
          
        }
        const result = await topUp(this.customers.orderData[0].id, payload)
        if (result) {
          this.form = {}
          this.query = ''
          this.$swal({
            group: 'alert',
            type: 'success',
            text: ` TopUP Created Successfully`,
            duration: 5000,
          })
        }
      } catch (e) {
        this.form = {}
        this.query = ''
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
      }
    },
    async makePaymentTopUp() {
      const payload = {
        clientId: this.clientId,
        amount: this.price,
        purchaseType: 'topup',
        stbNo: this.form.stbNumber,
        refId: this.form.id,
      }

      this.paymentPayload.money = this.price
      const result = await makeOnlinePayment(payload)
      const txId = result.data.details.map.txid
      console.log('oid', txId)
       this.paymentPayload.reference = txId;
        this.paymentPayload.redirect = result.data.details.map.callbackUrl
      // debugger
      if (txId) {
        console.log("hjai")
    //  var txRef = "MG-1498408604222";
        // getpaidSetup is Rave's inline script function. it holds the payment data to pass to Rave.
        // FLWPUBK_TEST-dbacaad48125d6a50b6a15c0df5cba58-X

        getpaidSetup({
          PBFPubKey:"FLWPUBK-5d8f2ad301c2394c332999410d0fea20-X",
          customer_email: this.customers.email,
          customer_firstname: this.customers.firstname,
          customer_lastname: this.customers.firstname,
          amount: parseInt(this.paymentPayload.money),
          customer_phone: this.customers.number,
          custom_title:this.customers.displayName,
          payment_method: "ussd",
          redirect_url:this.paymentPayload.redirect,
          country: "NG",
          currency: "NGN",
          txref: txId, // Pass your UNIQUE TRANSACTION REFERENCE HERE.
          //integrity_hash: hashedValue, // pass the sha256 hashed value here.
          onclose: function() {},
          // callback: function(response) {
          //   var flwref = response.data.tx.flwRef;
          //    var txref = response.data.tx.txRef;// collect flwRef returned and pass to a 					server page to complete status check.
          // console.log("This is the response returned after a charge", response);
          // if(response.data.tx.chargeResponseCode === '00' || response.data.tx.chargeResponseCode === '0') {
            // debugger
            // redirect to a success page https://tstvbilling.com:8877/ngbplatform/api/v1/revpay/orderlock/txref/flwref
            //  this.redirect_url ="https://tstv.nextgenerationbilling.com/ngbplatform/api/v1/revpay/orderlock/"+txref+"/"+flwref  
          //  this.paymentPayload.redirect="https://tstvbilling.com/ngbplatform/api/v1/revpay/orderlock?flwref&txref"
        //  this.redirect_url,methods.POST
          // } else {
            // redirect to a failure page.
          // }
          // }
    
        });
      // });
    // });
      }
    },
  },
}
</script>

<style scoped>
.vod-right-form {
  width: 500px;
  margin: 50px;
  background-color: #cc0000;
  border: 1px solid #4b5263;
  padding: 30px;
  text-align: center;
}
.vod-right-form label {
  color: #fff;
  margin-right: 250px;
}
.make-payment-btn {
  display: block;
  background: #fff;
  width: 100%;
  color: #333;
  font-size: 18px;
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
label {
  display: inline-block;
  margin-bottom: 2px;
  margin-left: 0.5rem;

  color: #fff;
  font-weight: 600;
}
</style>
