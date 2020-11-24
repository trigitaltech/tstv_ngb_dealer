<script>
import appConfig from '@src/app.config'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'
import Rave from 'vue-ravepayment'; 
import { setAuthorizationHeader } from '../../../../services/index';

import {
  searchCustomer,
  searchCustomerId,
  orderByClient,
  transaction,
  movieItemDetails,
  movieList,
  moviePurchase,
  topUp,
  refresh,
  makeOnlinePayment
} from '../../../../services/customer'

export default {
  page: {
    title: 'Customer',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Multiselect, Rave },
  data() {
    return {
      selectedMovieItem: {
        contentProviderValue:"Content-1",
        mediaCategory:"Movie",
        mediaId:2,
        mediaTitle:"Catch.ER",
        moviePrice:0,
        releaseDate:Array[3],
        status:"ACTIVE",
      },
      topUpModalItem: {
        id: 0,
        price: 0
      },
      paymentPayload: {
        money: 0,
        hostedPayment: 1,
        key: 'FLWPUBK_TEST-dbacaad48125d6a50b6a15c0df5cba58-X',
        reference: '',
        redirect: ''  
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
      paymentTypeSelected: { key: 'online', value: 'Online'},
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
        movieListValue:''
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
        email: 'eb@gmail.com'
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
  mounted() {
    setAuthorizationHeader("ZGVhbGVyOmRlYWxlcg==");
    this.totalRows = this.items.length
  },
  methods: {
    callback(response){
      console.log(response)
    },
    close(){
      console.log("Payment closed")
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async findCustomer() {
      try {
        setAuthorizationHeader("ZGVhbGVyOmRlYWxlcg==");
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
    topUpModal(item){
      this.topUpModalItem = item;
      this.topUp = true
    },
    async makeTopUp() {
      const payload = {
        stbNo: this.form.stbNumber,
        amount: '1000',
        itemName: 'RC',
        paymentDetails: {
          paymentType: 'voucherPayment',
          voucherId: this.form.voucherCode,
        },
      }
      await topUp(this.customers.orderData[0].id, payload)
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
        if(result){
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `You Movie Purchase Successfully`,
            duration: 5000,
          })
        } 
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.defaultUserMessage}`,
          duration: 5000,
        })
      }
    },
    async makePaymentTopUp(){
      const payload = {
        clientId: this.clientId,
        amount: this.topUpModalItem.price,
        purchaseType: "topup",
        stbNo: this.form.stbNumber,
        refId: this.topUpModalItem.id
      }
      this.paymentPayload.money = this.topUpModalItem.price;
      const result = await makeOnlinePayment(payload);
      const txId = result.data.details.map.revorder.txId
      if(txId){
        this.paymentPayload.reference = txId;
        this.paymentPayload.redirect = result.data.details.map.callbackUrl
        const elem = document.getElementById('pay');
        setTimeout(() => {(elem).click()}, 1000);
      }
    },
    async makePayment(topUp){
      let payload = {
        clientId: this.clientId,
        amount: this.selectedMovieItem.moviePrice,
        purchaseType: "tvod",
        stbNo: this.form.stbNumber,
        refId: this.selectedMovieItem.mediaTitle
      }
      this.paymentPayload.money =  this.selectedMovieItem.moviePrice;
      const result = await makeOnlinePayment(payload);
      const txId = result.data.details.map.revorder.txId
      if(txId){
        this.paymentPayload.reference = txId;
        this.paymentPayload.redirect = result.data.details.map.callbackUrl
        const elem = document.getElementById('pay');
        setTimeout(() => {(elem).click()}, 1000);
      }
    },
    async refreshEntitlement() {
      const payload = {
        requestMessage: [{ Activation: 'true' }],
        requestType: 'RETRACK',
        clientServiceId: this.customers.orderData[0].clientServiceId,
        type: 'single',
        clientId: this.customers.id,
      }
      await refresh(payload)
    },
  },
}
</script>

<template>
  <div class="p-4">
    <!-- <PageHeader :title="title" :items="items" /> -->
    <div class="row justify-content-center">
      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="row  justify-content-center">
               <!-- <div class="col-md-1">
                <button
                  type="submit"
                  class="btn  btn-primary"
                  @click="findCustomer"
                  >Search</button
                >
              </div> -->
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
              <div class="col-md-1">
                <button
                  type="submit"
                  class="btn  btn-primary"
                  @click="findCustomer"
                  >Search</button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="show" class="col-md-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <b-tabs pills justified class="navtab-bg w-100">
                <b-tab title="Customer Profile" active>
                  <div class="row">
                    <div class="col-md-12 mb-2">
                      <fieldset class="border p-2">
                        <legend class="w-auto">
                          <h4 class="header-title mt-0 mb-1"
                            >Personal Info</h4
                          ></legend
                        >
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
                          </div> -->
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
                    <div class="col-md-12">
                      <fieldset class="border p-2">
                        <legend class="w-auto">
                          <h4 class="header-title mt-0 mb-1"
                            >Service Info</h4
                          ></legend
                        >
                        <div class="row">
                          <div class="col-md-6">
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
                          <div class="col-md-6">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">STB No</label>
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
                              <label for="default">Plan Name</label>
                              <input
                                :value="form.planName"
                                class="form-control"
                                type="text"
                                placeholder="Enter Plan Name"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Plan Amount</label>
                              <input
                                :value="form.planAmount"
                                class="form-control"
                                placeholder="Enter Plan Amount"
                                disabled
                              />
                            </div>
                          </div>
                          <div class="col-md-4">
                            <div class="form-group mt-3 mt-sm-0">
                              <label for="default">Expiry Date</label>
                              <input
                                :value="form.expiryDate"
                                class="form-control"
                                type="text"
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
                      <div class="table-responsive">
                        <table class="table mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Plan Description</th>
                              <th scope="col">Status</th>
                              <th scope="col">Start Date</th>
                              <th scope="col">Expiry Date</th>
                              <th scope="col">Active</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, index) in customers.orderData"
                              :key="index"
                            >
                              <td>{{ item.planDescription }}</td>
                              <td>{{ item.status }}</td>
                              <td>{{ getFormattedDate(item.startDate) }}</td>
                              <td>{{ getFormattedDate(item.endDate) }}</td>
                              <td>
                                <button
                                  class="btn  btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                                  @click="refreshEntitlement"
                                  ><feather
                                    type="refresh-cw"
                                    class="icon-xs mr-2"
                                  ></feather
                                  >Refresh</button
                                >
                                <button
                                  class="btn  btn-outline-primary btn-sm  d-inline-flex align-items-center"
                                  @click="topUpModal(item)"
                                  ><feather
                                    type="zap"
                                    class="icon-xs mr-2"
                                  ></feather
                                  >Recharge</button
                                ></td
                              >
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </b-tab>
                    <b-tab title="Movies">
                      <div class="row mb-2">
                        <div
                          class="col-sm-12 col-md-12 d-flex justify-content-end"
                        >
                          <button
                            class="btn  btn-primary  d-inline-flex align-items-center"
                            @click="moviePurches = true"
                            ><feather type="tv" class="icon-xs mr-2"></feather
                            >Movie Purchase</button
                          >
                        </div>
                      </div>
                      <div class="row mb-md-2">
                        <div class="col-sm-12 col-md-6">
                          <div
                            id="tickets-table_length"
                            class="dataTables_length"
                          >
                            <label class="d-inline-flex align-items-center">
                              Show&nbsp;
                              <b-form-select
                                v-model="perPage"
                                size="sm"
                                :options="pageOptions"
                              ></b-form-select
                              >&nbsp;entries
                            </label>
                          </div>
                        </div>
                        <!-- Search -->
                        <div class="col-sm-12 col-md-6">
                          <div
                            id="tickets-table_filter"
                            class="dataTables_filter text-md-right"
                          >
                            <label class="d-inline-flex align-items-center">
                              <b-form-input
                                v-model="filter"
                                type="search"
                                placeholder="Search..."
                                class="form-control  ml-2"
                              ></b-form-input>
                            </label>
                          </div>
                        </div>
                        <!-- End search -->
                      </div>
                      <div class="table-responsive mb-0">
                        <b-table
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
                        >
                          <template v-slot:cell(bookedDate)="data">
                            <td>{{
                              getFormattedDate(data.item.bookedDate)
                            }}</td>
                          </template>
                        </b-table>
                      </div>
                      <div class="row">
                        <div class="col">
                          <div
                            class="dataTables_paginate paging_simple_numbers float-right"
                          >
                            <ul class="pagination pagination-rounded mb-0">
                              <!-- pagination -->
                              <b-pagination
                                v-model="currentPage"
                                :total-rows="rows"
                                :per-page="perPage"
                              ></b-pagination>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </b-tab>
                  </b-tabs>
                </b-tab>
                <b-tab title="Transactions">
                  <div class="row mb-md-2">
                    <div class="col-sm-12 col-md-6">
                      <div id="tickets-table_length" class="dataTables_length">
                        <label class="d-inline-flex align-items-center">
                          Show&nbsp;
                          <b-form-select
                            v-model="perPage"
                            size="sm"
                            :options="pageOptions"
                          ></b-form-select
                          >&nbsp;entries
                        </label>
                      </div>
                    </div>
                    <!-- Search -->
                    <div class="col-sm-12 col-md-6">
                      <div
                        id="tickets-table_filter"
                        class="dataTables_filter text-md-right"
                      >
                        <label class="d-inline-flex align-items-center">
                          <b-form-input
                            v-model="filter"
                            type="search"
                            placeholder="Search..."
                            class="form-control  ml-2"
                          ></b-form-input>
                        </label>
                      </div>
                    </div>
                    <!-- End search -->
                  </div>
                  <!-- Table -->
                  <div class="table-responsive mb-0">
                    <b-table
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
                    >
                      <template v-slot:cell(transDate)="data">
                        <td>{{ getFormattedDate(data.item.transDate) }}</td>
                      </template>
                      <template v-slot:cell(referenceNO)="data">
                        <td>{{ data.item.transactionId }}</td>
                      </template>
                    </b-table>
                  </div>
                  <div class="row">
                    <div class="col">
                      <div
                        class="dataTables_paginate paging_simple_numbers float-right"
                      >
                        <ul class="pagination pagination-rounded mb-0">
                          <!-- pagination -->
                          <b-pagination
                            v-model="currentPage"
                            :total-rows="rows"
                            :per-page="perPage"
                          ></b-pagination>
                        </ul>
                      </div>
                    </div>
                  </div>
                </b-tab>
              </b-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="topUp" title="TopUp" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Price</label>
        <input
          :value="topUpModalItem.price"
          class="form-control"
          placeholder="Enter Voucher Code"
          type="text"
          disabled
        />
      </div>
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Payment Type</label>
        <multiselect
          v-model.trim="paymentTypeSelected"
          placeholder="Select Movie List"
          :options="paymentType"
          label="value"
        ></multiselect>
      </div>
      <div v-if="paymentTypeSelected.value !== 'Online'" class="form-group mt-3 mt-sm-0">
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
        <b-button v-if="paymentTypeSelected.value !== 'Online'" variant="primary" @click="makeTopUp">
          Make TopUp</b-button>
        <b-button v-else variant="primary" @click="makePaymentTopUp"
          >Make Payment</b-button
        >
      </template>
    </b-modal>
    <b-modal v-model="moviePurches" title="Movie Purchase" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Select Movie List</label>
        <multiselect
          v-model.trim="selectedMovieItem"
          placeholder="Select Movie List"
          :options="movieLists"
          label="mediaTitle"
          @input="movieChanges"
        ></multiselect>
      </div>
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Payment Type</label>
        <multiselect
          v-model.trim="paymentTypeSelected"
          placeholder="Select Movie List"
          :options="paymentType"
          label="value"
        ></multiselect>
      </div>
      <div v-if="paymentTypeSelected.value === 'Online'" class="form-group mt-3 mt-sm-0">
         <label for="default">Amount</label>
          <input
            :value="selectedMovieItem.moviePrice"
            class="form-control"
            placeholder="Enter Amount"
            type="number"
            disabled
          />
      </div>
      <div v-if="paymentTypeSelected.value !== 'Online'" class="form-group mt-3 mt-sm-0">
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
      <template v-slot:modal-footer>
        <b-button variant="light" @click="moviePurches = false">Close</b-button>
        <b-button v-if="paymentTypeSelected.value !== 'Online'" variant="primary" :disabled="!selectedMovieItem" @click="makeMoviePurchase"
          >Make Movie Purchase</b-button
        >
        <b-button v-else variant="primary" :disabled="!selectedMovieItem" @click="makePayment"
          >Make Payment</b-button
        >
      </template>
    </b-modal>
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
    <!-- end row -->
  </div>
</template>
