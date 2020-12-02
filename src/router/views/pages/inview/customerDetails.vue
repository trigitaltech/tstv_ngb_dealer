<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import editcustomer from '@components/editcustomer'
import addplan from '@components/addplan'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'
import {
  searchCustomer,
  searchCustomerId,
  orderByClient,
  transaction,
  movieItemDetails,
  movieList,
  cancelplan,
  moviePurchase,
  ordersdisconnect,
  topUp,
  redeem,
  refresh,
} from '../../../../services/customer'
export default {
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect, editcustomer, addplan },
  data() {
    return {
      isedit: false,
      isplan: false,
      striped: false,
      bordered: true,
      small: false,
      dark: false,
      fixed: false,
      customer: [
        { key: 'serial_no', value: 'Box ID' },
        { key: 'account_no', value: 'Customer Id' },
      ],
      query: '', // BOOX0009
      customerBy: { key: 'serial_no', value: 'Box ID' },
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
      date: this.getFormattedDate(),
      form: {
        title: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        email: '',
        balanceAmount: '',
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
        movieId: '',
      },
      disconnect: '',
      pinNumber: '',
      columns: [
        {
          key: 'planDescription',
          sortable: true,
        },
        {
          key: 'startDate',
          sortable: true,
        },
        {
          key: 'endDate',
          sortable: true,
        },
        {
          key: 'status',
        },
        //  {
        //   key: "Active"
        // },
        {
          key: 'action',
        },
      ],
      titles: ['Mr.', 'Sri.', 'Mrs'],
      genderOpt: ['Male', 'Female', 'Other'],
      bouquetsOpt: ['DAFT', 'BASE'],
      movieLists: [],
      totalRows: 1,

      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      disconnectdata: [],
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
        	submitted:false,
      canceldata: null,
      fields: [
        { key: 'transDate', sortable: true },
        { key: 'transactionType', sortable: true },
        // { key: 'histor', sortable: true },
        { key: 'user', sortable: true },
      ],
      movieFields: [
        { key: 'chargeCode', sortable: true },
        { key: 'eventdescription', label: 'Movie Name', sortable: true },
        { key: 'eventPrice', sortable: true },
        { key: 'bookedDate', sortable: true },
        { key: 'status', sortable: true },
      ],
      tableData: [],
      plans:[],
      movieTableData: [],
      topUp: false,
      redem: false,
      description: '',
      cancel: false,
      moviePurches: false,
      show: false,
      customers: {},
      clientId: null,
      startDate: moment().subtract(7, 'd').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }
  },
  computed: {
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
    rows() {
      return this.tableData.length
    },
 rows1() {
      return this.plans.length
    },
    // rows1() {
    //   return this.movieTableData.length
    // },
  },
  mounted() {
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    editReq(data) {
      this.details = this.form
      this.isedit = true
    },
    addplanReq(data) {
      this.details = this.form
      this.isplan = true
    },
    cancell(data) {
      console.log('data', data)
      this.canceldata = data
      this.cancel = true
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async findCustomer() {
      try {
        NProgress.start()
        const result = await searchCustomer(this.customerBy.key, this.query)
        this.clientId = result.data.id
        if (result) {
          const response = await searchCustomerId(result.data.id)
          // eslint-disable-next-line no-unused-vars
          const orderPlan = await orderByClient(
            response.data.orderData[0].planType,
            result.data.id
          )
          this.customers = response.data
          this.plans = response.data.orderData
          this.pwMovieList()
          this.show = true
          this.form = {
            title: this.customers.title,
            clientId: this.clientId,
            clientServiceId: this.customers.clientServiceData[0].id,
            activationDate: this.getDate(
              this.customers.orderData[0].activeDate
            ),
            officeId: this.customers.officeId,
            firstName: this.customers.firstname,
            balanceAmount: this.customers.balanceAmount,
            // middleName: this.customers.firstname,
            lastName: this.customers.lastname,
            // gender: this.customers.gender,
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
        this.getTransactionDetails(this.startDate, this.endDate)
        this.getMovie()
        this.orderdisconnect()
        NProgress.done()
      } catch (e) {
        
        this.$toasted.error('Customer Id Not Found', {
          duration: 7000,
        })
      }
    },
    getDate(timeStamp) {
      let date
      if (timeStamp !== undefined){
        date = timeStamp[0] + '-' + timeStamp[1] + '-' + timeStamp[2]
      return moment(date).format('DD MMMM YYYY')
      }
    },
    getFormattedDate(timeStamp) {
      //  console.log(timeStamp)
      let date
      if (timeStamp !== undefined){
        date = timeStamp[0] + '-' + timeStamp[1] + '-' + timeStamp[2]
      return moment(date).format('MMM Do YYYY')
      }
    },
    goFilter() {
      this.getTransactionDetails(this.startDate, this.endDate)
    },
    async getTransactionDetails(startTime, endTime) {
      try {
        NProgress.start()
        const response = await transaction(this.clientId, startTime, endTime)
        this.tableData = response.data.pageItems
      } catch (e) {
        this.tableData = []
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async orderdisconnect() {
      try {
        const response = await ordersdisconnect()
        // this.disconnectdata = response.data.disconnectDetails
        var disconects = response.data.disconnectDetails
        disconects.map((e) => {
          this.disconnectdata.push(e.mCodeValue)
        })
        console.log('disconect', this.disconnectdata)
      } catch (e) {
        this.movieTableData = []
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async getMovie() {
      try {
        const response = await movieList(this.clientId)
        this.movieTableData = response.data
      } catch (e) {
        this.movieTableData = []
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async movieChanges(value) {
      this.form.movieListValue = value.mediaId
      this.form.movieAmount = value.moviePrice
    },
    async pwMovieList() {
      const res = await movieItemDetails()
      this.movieLists = res.data
    },
    updateValue(value) {
      this.customerBy = value
    },
    async cancelPlan(data) {
      console.log('caneldata', this.canceldata)
      try {
        const payload = {
          disconnectReason: this.disconnect,
          orderNo: this.canceldata.orderNo,
          planPoId: this.canceldata.planPoId,
          dealPoId: this.canceldata.dealPoId,
          description: this.description,
          fromNGB: true,
          dateFormat: 'dd MMMM yyyy',
          disconnectionDate: this.date,
          locale: 'en',
        }
        let result = await cancelplan(this.canceldata.id, payload)
        if (result) {
          ;(this.disconnect = ''),
            (this.description = ''),
            this.$swal({
              group: 'alert',
              type: 'success',
              text: `You canceled plan successfully`,
              duration: 5000,
            })
          this.cancel = false
        }
      } catch (e) {
        this.$toasted.error(e.message, {
          duration: 7000,
        })
      }
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
        let result = await topUp(this.customers.orderData[0].id, payload)
        if (result) {
          this.form.voucherCode = ''
          this.$swal({
            title: 'Congratulation',
            type: 'success',
            text: `You Make TopUp Successfully`,
            duration: 7000,
          })
        }
        this.topUp = false
      } catch (e) {
        this.form.voucherCode = ''
        this.$toasted.error(e.message.errors[0].developerMessage, {
          duration: 7000,
        })
      }
    },
    async makeMoviePurchase() {
      try {
        const payload = {
          stbNo: this.form.stbNumber,
          // amount: this.form.movieAmount,
          // itemName: 'RC',
          // movieName: this.form.movieListValue,
          itemId: this.form.movieListValue,
          paymentDetails: {
            paymentType: 'voucherPayment',
            voucherId: this.form.voucherId,
          },
        }
        let result = await moviePurchase(this.customers.id, payload)
        if (result) {
          this.form.movieList = ''
          this.form.voucherId = ''
          this.form.movieAmount = ''
          this.$swal({
            title: 'Congratulation',
            type: 'success',
            text: `You Movie Purchase Successfully`,
            duration: 5000,
          })
        }
        this.moviePurches = false
      } catch (e) {
        this.form.movieList = ''
        this.form.voucherId = ''
        this.form.movieAmount = ''
        this.$toasted.error(e.message.errors[0].developerMessage, {
          duration: 7000,
        })
      }
    },

    async makeredeem() {
      this.submitted = true
      try {
        const payload = {
          pinNumber: this.pinNumber,
          clientId: this.customers.id,
        }
        let result = await redeem(payload)
        
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `Your Redeemption Done Successfully`,
            duration: 5000,
          })
          this.redem = false
          this.pinNumber=""
        }
         this.submitted = false
      } catch (e) {
         this.$toasted.error(e.message.errors[0].defaultUserMessage, {
          duration: 7000,
        })
        this.pinNumber=""
        this.submitted = false
      }
    },
    async refreshEntitlement() {
      try {
        const payload = {
          requestMessage: [{ Activation: 'true' }],
          requestType: 'RETRACK',
          clientServiceId: this.customers.orderData[0].clientServiceId,
          type: 'single',
          clientId: this.customers.id,
        }
        let result = await refresh(payload)
        if (result) {
          this.$swal({
            title: 'Congratulation',
            type: 'success',
            text: `You Refresh Entitlement Successfully`,
            duration: 5000,
          })
          this.refresh()
        }
      } catch (e) {
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async refresh() {
      setTimeout(function () {
        location.reload()
      }, 200)
    },
    getFormattedDate() {
      return moment(new Date()).format('DD MMMM YYYY')
    },
  },
}
</script>

<template >
  <Layout>
    <PageHeader :items="items" />
    <div class="row justify-content-center">
      <div class="col-md-12" v-if="!isplan">
        <b-card
          class="card-wrap"
          header="Customer Details"
          border-variant="info"
          header-text-variant="white"
        >
          <div class="card-body">
            <div class="row justify-content-center">
              <div class="col-md-5 mb-2">
                <multiselect
                  v-model.trim="customerBy"
                  placeholder="Select Customer By"
                  label="value"
                  :options="customer"
                  :selected="customerBy"
                  @update="updateValue"
                ></multiselect>
              </div>
              <div class="col-md-5 mb-2">
                <input
                  v-model.trim="query"
                  class="form-control"
                  placeholder="Search query"
                  type="text"
                />
              </div>
              <div class="col-md-2">
                <button
                  type="submit"
                  class="btn btn-primary"
                  @click="findCustomer"
                  style=" background-color:#26a69a;"
                >Search</button>
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </div>
    <div v-if="isedit">
      <editcustomer :item-obj="details" @edit="isedit = false"></editcustomer>
    </div>
    <div v-if="isplan">
      <addplan :item-obj="details" @plan="isplan = false"></addplan>
    </div>
    <div v-show="show" v-if="!isedit && !isplan" class="col-md-12">
      <b-card
        class="card-wrap"
        header="Customer Details"
        border-variant="info"
        header-text-variant="white"
      >
        <div class="card-body">
          <div class="row">
            <b-tabs pills justified class="navtab-bg w-100">
              <b-tab title="Customer Profile" active>
                <button
                  style="background-color:#26a69a"
                  type="submit"
                  class="btn btn-primary btn float-right mr-2"
                  @click="redem = true"
                >Redemption</button>
                <button
                  style="background-color:#26a69a"
                  type="submit"
                  class="btn btn-primary btn float-right mr-2"
                  @click="editReq(data)"
                >Edit Customer</button>
                <div class="row mb-2">
                  <div class="col-md-12">
                    <fieldset class="border p-2">
                      <legend class="w-auto">
                        <h4 class="header-title mt-0 mb-1">Service Info</h4>
                      </legend>
                      <div class="row">
                        <div class="col-md-4">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Account No</label>
                            <input
                              :value="form.accountNo"
                              class="form-control"
                              type="text"
                              placeholder="Enter Account No"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Box ID</label>
                            <input
                              :value="form.stbNumber"
                              class="form-control"
                              placeholder="Enter STB No"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Balance Amount</label>
                            <input
                              :value="form.balanceAmount"
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
                              :value="form.title + ' ' + form.firstName"
                              class="form-control"
                              placeholder="Enter First Name"
                              type="text"
                              disabled
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
                              :value="form.lastName"
                              class="form-control"
                              placeholder="Enter Last Name"
                              type="text"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Email</label>
                            <input
                              v-model="form.email"
                              placeholder="Enter Email"
                              class="form-control"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Phone Number</label>
                            <input
                              :value="form.number"
                              placeholder="Enter Phone Number"
                              class="form-control"
                              disabled
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
                              :value="form.address"
                              class="form-control"
                              type="text"
                              placeholder="Enter Address"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">Post Code</label>
                            <input
                              :value="form.postCode"
                              class="form-control"
                              placeholder="Enter PostCode"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">City</label>
                            <input
                              :value="form.city"
                              class="form-control"
                              type="text"
                              placeholder="Enter State"
                              disabled
                            />
                          </div>
                        </div>
                        <div class="col-md-4">
                          <div class="form-group mt-3 mt-sm-0">
                            <label for="default">State</label>
                            <input
                              :value="form.state"
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
                              :value="form.country"
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
                <hr />
                <b-tabs pills class="navtab-bg">
                  <b-tab title="Subscription" active>
                    <button
                      style="background-color:#26a69a;color:white"
                      class="btn btn-primary btn float-right mr-2"
                      @click="addplanReq()"
                    >Add Plan</button>

                    <div class="table-responsive">
                      <b-table
                        :dark="dark"
                        :striped="striped"
                        :bordered="bordered"
                        :small="small"
                        :fixed="fixed"
                        responsive="sm"
                        id="my-table"
                        :items="plans"
                        :current-page="currentPage"
                        :per-page="perPage"
                        :filter="filter"
                        thead-class="header"
                        class="mt-3"
                        :fields="columns"
                      >
                        <template v-slot:cell(startDate)="data">
                          <div class="table-row">{{ getFormattedDate(data.item.startDate) }}</div>
                        </template>
                        <template v-slot:cell(endDate)="data">
                            <div class="table-row">{{ getDate(data.item.endDate) }}</div>
                        </template>
                        <template v-slot:cell(action)="data">
                          <button
                            style="color:#26a69a"
                            class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                            @click="refreshEntitlement"
                          >
                            <feather type="refresh-cw" class="icon-xs mr-2"></feather>Refresh
                          </button>
                          <button
                            style="color:#26a69a"
                            class="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                            @click="topUp = true"
                          >
                            <feather type="zap" class="icon-xs mr-2"></feather>Recharge
                          </button>
                          <button
                            v-if="data.item.status !== 'DISCONNECTED'"
                            style="margin-left:10px;color:#26a69a"
                            class="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                            @click="cancell(data.item)"
                          >
                            <feather type="x-circle" class="icon-xs mr-2"></feather>Cancel
                          </button>
                        </template>
                        
                      </b-table>
                        <div style="float: right">
                      <b-pagination
                        v-model="currentPage"
                        :per-page="perPage"
                        :total-rows="rows1"
                        aria-controls="my-table"
                        hide-goto-end-buttons
                      ></b-pagination>
                    </div>
                      <!-- <table class="table mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Plan Description</th>
                              <th scope="col">Start Date</th>
                              <th scope="col">Expiry Date</th>
                              <th scope="col">Status</th>
                              <th scope="col">Active</th>
                            </tr>
                            
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in customers.orderData" :key="index">
                              <td>{{ item.planDescription }}</td>
                              <td>{{ getFormattedDate(item.startDate) }}</td>
                              <td>{{ getFormattedDate(item.endDate) }}</td>
                              <td>{{ item.status }}</td>
                              <td>
                                <button
                                  class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                                  @click="refreshEntitlement"
                                >
                                  <feather type="refresh-cw" class="icon-xs mr-2"></feather>Refresh
                                </button>
                                <button
                                  class="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                                  @click="topUp = true"
                                >
                                  <feather type="zap" class="icon-xs mr-2"></feather>Recharge
                                </button>
                                  <button style="margin-left:10px"
                                  class="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                                  @click="cancel = true"
                                >
                                  <feather type="minus" class="icon-xs mr-2"></feather>Cancel Plan
                                </button>
                               
                              </td>
                            </tr>
                            
                          </tbody>
                      </table>-->
                    </div>
                  </b-tab>
                  <!-- <b-tab title="Movies">
                  <div class="row mb-2">-->
                  <!-- Search -->
                  <!-- <div class="col-sm-12 col-md-6">
                          <div id="tickets-table_filter" class="dataTables_filter">
                            <label class="d-inline-flex align-items-center">
                              <b-form-input
                                v-model="filter"
                                type="search"
                                placeholder="Search..."
                                class="form-control ml-2"
                              ></b-form-input>
                            </label>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-6 d-flex justify-content-end">
                          <button
                           style="background-color:#26a69a"
                            class="btn btn-primary d-inline-flex align-items-center"
                            @click="moviePurches = true"
                          >
                            <feather type="tv" class="icon-xs mr-2"></feather>Movie Purchases
                          </button>
                        </div>
                      </div>
                  <div class="table-responsive mb-0">-->
                  <!-- <b-table
                          show-empty
                          :items="movieTableData"
                          :fields="movieFields"
                          responsive="sm"
                          :per-page="perPage"
                          :current-page="currentPage"
                          :sort-by.sync="sortBy"
                          :sort-desc.sync="sortDesc"
                          :filter="filter"
                          :filter-included-fields="filterOn"
                          @filtered="onFiltered"
                  >-->
                  <!-- <b-table
                          :dark="dark"
                          :striped="striped"
                          :bordered="bordered"
                          :small="small"
                          :fixed="fixed"
                          responsive="sm"
                          :current-page="currentPage"
                          :items="movieTableData"
                          :fields="movieFields"
                          class="mt-3"
                          :per-page="perPage"
                          :sort-by.sync="sortBy"
                          :sort-desc.sync="sortDesc"
                          :filter="filter"
                          :filter-included-fields="filterOn"
                          @filtered="onFiltered"
                        >
                          <template
                            v-slot:cell(bookedDate)="data"
                          >{{ getFormattedDate(data.item.bookedDate)}}</template>
                        </b-table>
                      </div>
                      <div class="row">
                        <div class="col-sm-12 col-md-6">
                          <div id="tickets-table_length" class="dataTables_length">
                            <label class="d-inline-flex align-items-center">
                              Show&nbsp;
                              <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                            </label>
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-6">
                          <div class="dataTables_paginate paging_simple_numbers float-right">
                  <ul class="pagination pagination-rounded mb-0">-->
                  <!-- pagination -->
                  <!-- <b-pagination
                                v-model="currentPage"
                                :total-rows="rows"
                                :per-page="perPage"
                              ></b-pagination>
                            </ul>
                          </div>
                        </div>
                      </div>
                  </b-tab>-->
                </b-tabs>
              </b-tab>
              <b-tab title="Transactions">
                <div class="row">
                  <!-- Search -->
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_filter" class="dataTables_filter">
                      <label class="d-inline-flex align-items-center">
                        <b-form-input
                          v-model="filter"
                          type="search"
                          placeholder="Search..."
                          class="form-control ml-2"
                        ></b-form-input>
                      </label>
                    </div>
                  </div>
                  <!-- End search -->
                  <div class="col-sm-12 col-md-6">
                    <div class="row justify-content-end">
                      <div class="col-md-4 mb-2 col-sm-12">
                        <label for="inputPassword2" class="sr-only">Start Date</label>
                        <flat-pickr
                          v-model="startDate"
                          class="form-control"
                          placeholder="Start Date"
                          name="startdate"
                        ></flat-pickr>
                      </div>
                      <div class="col-md-4 mb-2 col-sm-12">
                        <label for="inputPassword2" class="sr-only">End Date</label>
                        <flat-pickr
                          v-model="endDate"
                          class="form-control"
                          placeholder="End Date"
                          name="enddate"
                        ></flat-pickr>
                      </div>
                      <div class="col-md-2 col-sm-12">
                        <button
                          style="background-color:#26a69a"
                          type="submit"
                          class="btn d-block w-100 btn-primary"
                          @click="goFilter"
                        >Go</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Table -->
                <div class="table-responsive mb-0">
                  <b-table
                    :dark="dark"
                    :striped="striped"
                    :bordered="bordered"
                    :small="small"
                    :fixed="fixed"
                    responsive="sm"
                    :current-page="currentPage"
                    :per-page="perPage"
                    :items="tableData"
                    :fields="fields"
                    thead-class="header"
                    class="mt-3"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <!-- <b-table
                      show-empty
                      :items="tableData"
                      :fields="fields"
                      responsive="sm"
                      :per-page="perPage"
                      :current-page="currentPage"
                      :sort-by.sync="sortBy"
                      :sort-desc.sync="sortDesc"
                      :filter="filter"
                      :filter-included-fields="filterOn"
                      @filtered="onFiltered"
                    >-->
                    <template
                      v-slot:cell(transDate)="data"
                    >{{ getFormattedDate(data.item.transDate) }}</template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-6">
                    <div class="dataTables_paginate paging_simple_numbers float-right">
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </b-card>
    </div>
    <b-modal v-model="cancel" title="Cancel Plan" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <b-row>
          <b-col>
            <span>Plan List</span>
            <b-form-select
              id="type"
              v-model="disconnect"
              :options="disconnectdata"
              placeholder="Select plan"
            ></b-form-select>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span>Start Date</span>
            <b-input v-model="date"></b-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <span>Description</span>
            <textarea class="form-control" aria-label="With textarea" v-model="description"></textarea>
          </b-col>
        </b-row>
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="cancel = false">Close</b-button>
        <b-button variant="primary" @click="cancelPlan" style="background-color:#26a69a">Cancel Plan</b-button>
      </template>
    </b-modal>
    <b-modal v-model="redem" title="Redemption" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Pin Number</label>
        <input
          v-model.trim="pinNumber"
          class="form-control"
          placeholder="Enter Pin Number"
          type="text"
        />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="redem = false">Close</b-button>
        <b-button variant="primary" :disabled="submitted"  @click="makeredeem" style="background-color:#26a69a">Redeem</b-button>
      </template>
    </b-modal>
    <b-modal v-model="topUp" title="TopUp" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Voucher Code</label>
        <input
          v-model.trim="form.voucherCode"
          class="form-control"
          placeholder="Enter Voucher Code"
          type="text"
        />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="topUp = false">Close</b-button>
        <b-button variant="primary" @click="makeTopUp" style="background-color:#26a69a">Recharge</b-button>
      </template>
    </b-modal>
    <b-modal v-model="moviePurches" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Select Movie List</label>
        <multiselect
          v-model.trim="form.movieList"
          placeholder="Select Movie List"
          :options="movieLists"
          label="mediaTitle"
          @input="movieChanges"
        ></multiselect>
      </div>
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Voucher Id</label>
        <input
          v-model.trim="form.voucherId"
          class="form-control"
          placeholder="Enter Voucher Id"
          type="text"
        />
      </div>
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Amount</label>
        <input
          v-model.trim="form.movieAmount"
          class="form-control"
          placeholder="Enter Amount"
          type="number"
          disabled
        />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="moviePurches = false">Close</b-button>
        <b-button
          variant="primary"
          @click="makeMoviePurchase"
          style="background-color:#26a69a"
        >Make Movie Purchase</b-button>
      </template>
    </b-modal>
    <!-- end row -->
  </Layout>
</template>
<style  scoped>
.table th,
.table td {
  border-top: none !important;
}
.table-bordered th,
.table-bordered td {
  border: 2px solid #f6f6f7;
}
.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #f6f6f7;
}
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: #26a69a;
  border-bottom: 0 solid rgba(0, 0, 0, 0.125);
}
</style>