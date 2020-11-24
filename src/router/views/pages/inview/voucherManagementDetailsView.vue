<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import NProgress from 'nprogress/nprogress'

import {
  // eslint-disable-next-line no-unused-vars
  getVoucherRequest,
  voucherView,
  exportVoucher,
  exportVoucherView,
  vouchersDownload,
} from '../../../../services/voucher'

export default {
  page: {
    title: 'Voucher Detail',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
       striped: false,
      bordered: true,
      small: false,
      dark: false,
      fixed: false,
      Availableqty:null,
      printPdf: [],
      tableData: [],
      title: 'Voucher Detail',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Voucher Detail',
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: 'age',
      sortDesc: false,
      fields: [
        { key: 'officeId', sortable: true },
          { key: 'saleRefNo', sortable: true },
        { key: 'serialNo', sortable: true },
        { key: 'pinNo', sortable: true },
      
         { key: 'status', sortable: true },
      ],
      voucherId: null,
      vouchers: {},
      Qty: null,
      tabIndex: 0,
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
  created() {
    this.voucherId = this.$route.params.id
    console.log(this.voucherId)
    let query = this.$route.query.name
    if (query) {
      this.tabIndex = 1
    } else {
      this.tabIndex = 0
    }
  },
  mounted() {
  
    this.getVoucherDetails()
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
    onProgress(progress) {
      if (progress > 99) {
        NProgress.done()
        // var doc = document.getElementsByClassName("vue-html2pdf").innerHTML;
        // var originalContents = document.body.innerHTML;
        // document.body.innerHTML = doc;
        // window.print();
        // document.body.innerHTML = originalContents;
      }
      console.log(`PDF generation progress: ${progress}%`)
    },
    async getVoucherDetails() {
      try {
        const res = await voucherView(this.voucherId)
        this.vouchers = res.data
        this.tableData = this.vouchers.voucherData
        console.log(this.vouchers)
      } catch (e) {
         this.$toasted.error(e.message.defaultUserMessage,{
          duration: 7000
        });
      }
         this.Availableqty = this.vouchers.orderQuantity - (this.vouchers.exportedQuantity + this.vouchers.redeemedQuantity)
    console.log("avavvavava",this.Availableqty)
     console.log("avavvavava",this.vouchers.orderQuantity)
      console.log("avavvavava",this.vouchers.exportedQuantity)
      console.log("avavvavava",this.vouchers.redeemedQuantity)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
  },
}
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col">
        <div class="card">
          <div class="card-body p-0">
            <!-- <h6 class="card-title border-bottom p-3 mb-0 header-title"
              >Project Overview</h6
            >-->
            <div class="row py-1">
              <!-- Widget -->

              <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="grid" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Item ID</h5>
                    <span class="text-muted">{{ vouchers.itemId }}</span>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="calendar" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Purchased Date</h5>
                    <span class="text-muted">{{ vouchers.purchaseDate }}</span>
                  </div>
                </div>
              </div>
                   <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="check-square" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Status</h5>
                    <span class="text-muted">{{ vouchers.status }}</span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-3">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="shopping-bag" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Order Qty</h5>
                    <span class="text-muted">{{ vouchers.orderQuantity }}</span>
                  </div>
                </div>
              </div>
         
              <div class="col-xl-3 col-sm-3">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="shopping-bag" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Exported Qty</h5>
                    <span class="text-muted">
                      {{
                      vouchers.exportedQuantity
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-3">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="briefcase" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Redeemed Qty</h5>
                    <span class="text-muted">
                      {{
                      vouchers.redeemedQuantity
                      }}
                    </span>
                  </div>
                </div>
              </div>
               <div class="col-xl-3 col-sm-3">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="briefcase" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Available Qty</h5>
                    <span class="text-muted">
                      {{Availableqty}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <b-tabs v-model="tabIndex" pills justified class="navtab-bg w-100">
              <b-tab title="Voucher Details">
                <div class="row mb-md-2">
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
                  <!-- Search -->
                  <div class="col-sm-12 col-md-6">
                    <div id="tickets-table_filter" class="dataTables_filter text-md-right">
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
                </div>
                <!-- Table -->
                <div class="table-responsive mb-0">
                  <b-table
                    show-empty
                    :items="tableData"
                    :fields="fields"
                     :dark="dark"
                    :striped="striped"
                    :bordered="bordered"
                    :small="small"
                    :fixed="fixed"
                     thead-class="header"
                    responsive="sm"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  ></b-table>
                </div>
                <div class="row">
                  <div class="col">
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
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>
<style lang="stylus" scoped>
.text-muted {
    color:black !important;
}
</style>