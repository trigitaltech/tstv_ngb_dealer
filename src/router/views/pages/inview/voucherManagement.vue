<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import {
  getVoucherRequest,
  createVoucher,
  exportVoucher,
  getvouchercodes,
  getoffice,
} from '../../../../services/voucher'
import Multiselect from 'vue-multiselect'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'

export default {
  page: {
    title: 'Voucher Management',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader, Multiselect },
  data() {
    return {
      striped: false,
      bordered: true,
      small: false,
      voucher: [],
      fixed: false,
      tableData: [],
      title: 'Voucher Management',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Voucher Management',
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      purchaseid: '',
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,

      itemid: '',
      filterOn: [],
      dark: false,
      sortBy: 'age',
      sortDesc: false,
      fields: [
        { key: 'id', label: 'Sale Id', sortable: true },
        { key: 'requestedDate', label: 'Date', sortable: true },
        { key: 'itemDescription', sortable: true },
        // { key: 'fromOffice', sortable: true },
        // { key: 'toOffice', sortable: true },
        { key: 'orderdQuantity', label: 'Quantity', sortable: true },
        { key: 'chargeAmount', label: 'Amount', sortable: true },
        { key: 'status', sortable: true },
        { key: 'Action' },
      ],
      requestVoucher: false,
      Amount: '',
      discount: '',
      discounts: '',
      voucher: {
        orderedQuantity: '',
        unitPrice: '',
        voucherCode: '',
        purchaseFrom: '',
        orderAmount: '',
        voucherValue: '',
      },
      vouchers: [],
      officess: [],
      office: [],
      exportVoucher: false,
      Qty: '',
      client_id: '',
    }
  },
  computed: {
    rows() {
      return this.tableData.length
    },
    getUserDetails() {
      return this.$store.getters['auth/loggedInDetails']
    },
  },
  mounted() {
    this.getVoucherDetails()
    this.getvouchers()
    this.offices()
    // Set the initial number of items
    console.log(this.getUserDetails.officeId)
    this.totalRows = this.items.length
  },
  methods: {
    async offices() {
      try {
        NProgress.start()
        const response = await getoffice()
        this.officess = response.data.pageItems
        this.officess.map((e) => {
          this.office.push(e.name)
        })

        console.log('vouchers', this.office)
        NProgress.done()
      } catch (error) {}
    },
    async getvouchers() {
      try {
        NProgress.start()
        const response = await getvouchercodes()
        this.voucher = response.data.itemDatas
        this.voucher.map((e) => {
          this.vouchers.push(e.itemDescription)
        })
        // console.log('vouchers', this.vouchers)
        NProgress.done()
      } catch (error) {}
    },
    async getVoucherDetails() {
      try {
        NProgress.start()
        const response = await getVoucherRequest(this.getUserDetails.officeId)
        this.tableData = response.data

        NProgress.done()
      } catch (error) {
        this.tableData = []
      }
    },
    async officeid(value) {
      this.officess.map((e) => {
        if (this.voucher.purchaseFrom === e.name) {
          this.purchaseid = e.id
        }
        console.log('id', this.purchaseid)
      })
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    view(value) {
      this.$router.push(`/voucher-management-details-view/${value.id}`)
    },
    exports(value) {
      this.$router.push({
        path: `/voucher-management-details/${value.id}`,
        query: { name: 'export' },
      })
    },
    Discount() {
      console.log(this.Amount)
      this.discounts = (this.Amount * this.discount) / 100
      this.voucher.orderAmount = this.Amount - this.discounts
    },
    orderQtyprice() {
      this.Amount = this.voucher.orderedQuantity * this.voucher.unitPrice
    },
    voucherChange(value) {
      this.voucher.map((e) => {
        if (this.voucher.voucherCode === e.itemDescription) {
          this.itemid = e.id
        }
        console.log('id', this.itemid)
      })
      if (value.text === 'DAF') {
        this.voucher.voucherValue = 1400
      } else if (value.text === 'PVOD100') {
        this.voucher.voucherValue = 100
      } else if (value.text === 'PVOD200') {
        this.voucher.voucherValue = 200
      } else if (value.text === 'PVOD300') {
        this.voucher.voucherValue = 300
      } else if (value.text === 'PVOD400') {
        this.voucher.voucherValue = 400
      }

      this.calculateVoucher(value)
    },
    async createVoucher() {
      try {
        const payload = {
          orderQuantity: this.voucher.orderedQuantity,
          discount:this.discounts,
          itemId: this.itemid,
          unitPrice: this.voucher.unitPrice,
          currencyId: 104,
          chargeAmount: this.voucher.orderAmount,
          purchaseFrom: this.purchaseid,
          purchaseBy: this.getUserDetails.officeId,
          chargeCode: 6,
          locale: 'en',
          dateFormat: 'dd MMMM yyyy',
          purchaseDate: moment().format('DD MMMM YYYY'),
        }
        console.log('voucher', payload)

        const result = await createVoucher(payload)
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `You Created Voucher successfully`,
            duration: 5000,
          })
          this.requestVoucher = false
        }
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
      }
    },
    getFormattedDate(timeStamp) {
      let date = timeStamp[0] + '-' + timeStamp[1] + '-' + timeStamp[2]

      return moment(date).format('MMM Do YYYY')
    },
    calculateVoucher(value) {
      console.log('amt', value.text, this.voucher.orderedQuantity)
      if (value.text === 'DAF' && this.voucher.orderedQuantity >= 3000) {
        this.voucher.orderAmount = this.voucher.orderedQuantity * 1350
      } else {
        console.log('amt', value.text, this.voucher.orderedQuantity)
        this.voucher.orderAmount =
          this.voucher.voucherValue * this.voucher.orderedQuantity
      }
    },
    orderQtyChange() {
      console.log(
        'amt',
        this.voucher.voucherCode.text,
        this.voucher.orderedQuantity
      )
      if (
        this.voucher.voucherCode.text === 'DAF' &&
        this.voucher.orderedQuantity >= 3000
      ) {
        this.voucher.orderAmount = this.voucher.orderedQuantity * 1350
      } else {
        console.log(
          'amt',
          this.voucher.voucherCode.text,
          this.voucher.orderedQuantity
        )
        this.voucher.orderAmount =
          this.voucher.voucherValue * this.voucher.orderedQuantity
      }
    },
    async makeExportVoucher() {
      try {
        const payload = {
          quantity: this.Qty,
        }
        await exportVoucher(this.client_id, payload)
        this.exportVoucher = false
        this.$swal({
          title: 'Congratulation',
          type: 'success',
          text: `You Export Voucher Successfully`,
          duration: 5000,
        })
      } catch (e) {
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader  :items="items" />
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <b-card
          class="card-wrap"
          header="Vocuher Management"
          border-variant="info"
          header-text-variant="white"
        >
            <!-- <h4 class="header-title mt-0 mb-1">Advanced Data Table</h4> -->

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
              <div class="col-sm-12 col-md-6 text-md-right">
                <button
                  class="btn btn-primary text-md-right"
                  style="background-color: #26a69a"
                  @click="requestVoucher = true"
                  >Request Voucher</button
                >
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
                class="table"
                thead-class="header"
                :fields="fields"
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
                <template v-slot:cell(requestedDate)="data">{{
                  getFormattedDate(data.item.requestedDate)
                }}</template>
                <template v-slot:cell(action)="data">
                  <div >
                    <button
                   
                      class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                      @click="view(data.item)"
                      :disabled="data.item.itemDescription === 'DTH ACTIVATION' || data.item.status === 'New' "
                      style="color: #26a69a"
                    >
                      <feather type="eye" class="icon-xs mr-2"></feather>View
                    </button>
                    <button
                      class="btn btn-outline-dark btn-sm d-inline-flex align-items-center"
                      @click="exports(data.item)"
                      :disabled="data.item.itemDescription === 'DTH ACTIVATION' || data.item.status === 'New' "
                      style="color: #26a69a"
                    >
                      <feather type="download" class="icon-xs mr-2"></feather
                      >Exports
                    </button>
                  </div>
                  <!-- <div v-if="data.item.itemDescription !== 'DTH ACTIVATION' && data.item.status !== 'New' ">
                    <button
                      class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                      @click="view(data.item)"
                      style="color: #26a69a"
                    >
                      <feather type="eye" class="icon-xs mr-2"></feather>View
                    </button>
                    <button
                      class="btn btn-outline-dark btn-sm d-inline-flex align-items-center"
                      @click="exports(data.item)"
                      style="color: #26a69a"
                    >
                      <feather type="download" class="icon-xs mr-2"></feather
                      >Exports
                    </button>
                  </div> -->
                </template>
              </b-table>
            </div>
            <div class="row">
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
              <div class="col-sm-12 col-md-6">
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
        </b-card>
          
        </div>
      </div>
  
    <b-modal
      v-model="requestVoucher"
      title="Create Voucher"
      title-class="font-18"
    >
      <div class="row">
        <div class="col-md-12">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Voucher Code</label>
            <b-form-select
              v-model.trim="voucher.voucherCode"
              placeholder="Select Voucher Code"
              track-by="id"
              label="text"
              :options="vouchers"
              @input="voucherChange"
            ></b-form-select>
          </div>
        </div>
        <div class="col-md-6 col-md-6">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Purchased From</label>
            <b-form-select
              v-model.trim="voucher.purchaseFrom"
              class="form-control"
              placeholder="Enter Order Quantity"
              type="number"
              :options="office"
              @input="officeid"
            />
          </div>
        </div>
        <div class="col-md-6 col-md-6">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Order Quantity</label>
            <input
              v-model.trim="voucher.orderedQuantity"
              class="form-control"
              placeholder="Enter Order Quantity"
              type="number"
            />
          </div>
        </div>
        <div class="col-md-6 col-md-6">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Unit price</label>
            <input
              v-model.trim="voucher.unitPrice"
              class="form-control"
              placeholder="Enter unit price"
              type="number"
              @input="orderQtyprice"
            />
          </div>
        </div>
        <div class="col-md-6 col-md-6">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Discount</label>
            <input
              v-model.trim="discount"
              class="form-control"
              placeholder="Enter unit price"
              type="number"
              @input="Discount"
            />
          </div>
        </div>
        <div class="col-md-6 col-sm-6">
          <div class="form-group mt-3 mt-sm-0">
            <label for="default">Total Amount</label>
            <input
              v-model.trim="voucher.orderAmount"
              class="form-control"
              placeholder="Enter Order Amount"
              type="number"
              disabled
            />
          </div>
        </div>
        <!-- <span>
          <h5
            style="color:red;margin-left:10px"
          >Note :- Request will be processed only after the payment is done</h5>
        </span>-->
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="requestVoucher = false"
          >Close</b-button
        >
        <b-button
          variant="primary"
          @click.prevent="createVoucher"
          style="background-color: #26a69a"
          >Create</b-button
        >
      </template>
    </b-modal>
    <b-modal
      v-model="exportVoucher"
      title="Export Voucher"
      title-class="font-18"
    >
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Qty</label>
        <input
          v-model.trim="Qty"
          class="form-control"
          placeholder="Enter Qty"
          type="number"
        />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="exportVoucher = false"
          >Close</b-button
        >
        <b-button
          variant="primary"
          @click="makeExportVoucher"
          style="background-color: #26a69a"
          >Create</b-button
        >
      </template>
    </b-modal>
    <!-- end row -->
  </Layout>
</template>
<style  scoped>
.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: #26a69a;
  border-color: #26a69a;
}
.table th,
.table td {
  border-top: none !important;
}
.table-bordered th,
.table-bordered td {
  border: 2px solid #f6f6f7;
}
.table.b-table > thead > tr > [aria-sort]:not(.b-table-sort-icon-left),
.table.b-table > tfoot > tr > [aria-sort]:not(.b-table-sort-icon-left) {
  background-position: right calc(0.75rem / 2) center;
  padding-right: calc(0.75rem + 0.65em);
}
.header {
  background-color: #1a4d5f !important;
}
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