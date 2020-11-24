<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import NProgress from 'nprogress/nprogress'
// import JsonExcel from 'vue-json-excel'

// Vue.component('downloadExcel', JsonExcel)
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
    title: 'Exported Vouchers Detail',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
      json_fields: {
        'Pin Value': 'pinValue',
        serialNo: 'serialNo',
        'Expiry Date': 'expiryDate',
        'Pin Type': 'pinType',
        Status: 'status',
      },
      json_data: [],
      striped: false,
      bordered: true,
      small: false,
      dark: false,
      fixed: false,
      printPdf: [],
      tableData: [],
      title: 'Exported Vouchers Details',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Exported Vouchers Detail',
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      submitted:false,
      sortBy: 'age',
      sortDesc: false,
      exportFields: [
        { key: 'saleReqNo', sortable: true },
        { key: 'id', sortable: true },
        { key: 'requestDate', label: 'Date', sortable: true },

        { key: 'quantity', sortable: true },
        // { key: 'requestBy', sortable: true },

        { key: 'status', sortable: true },
        { key: 'action' },
      ],
      voucherId: null,
      vouchers: {},
      exportVouchers: false,
      Qty: null,
      exportVoucherData: [],
      tabIndex: 0,
    }
  },
  computed: {
    rows() {
      return this.exportVoucherData.length
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
    this.getExportVoucherDetails()
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
    hasStartedDownload() {
      console.log(`PDF has started generation`)
    },
    hasDownloaded() {
      console.log(`PDF has downloaded yehey`)
    },
    domRendered() {
      console.log('Dom Has Rendered')
    },
    async getVoucherDetails() {
      try {
        const res = await voucherView(this.voucherId)
        this.vouchers = res.data
      } catch (e) {
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async getExportVoucherDetails() {
      try {
        // eslint-disable-next-line camelcase
        const office_id = this.$store.state.auth.currentUser.officeId
        const id = this.voucherId
        const result = await exportVoucherView(office_id, id)
        this.exportVoucherData = result.data
      } catch (e) {
        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    async makeExportVoucher() {
      this.submitted = true
      try {
        const payload = {
          quantity: this.Qty,
          locale: "en",
        }
        await exportVoucher(this.voucherId, payload)
        this.getExportVoucherDetails()
        this.exportVouchers = false
        this.$swal({
          title: 'Congratulation',
          type: 'success',
          text: `You Export Voucher Successfully`,
          duration: 5000,
        })
        this.submitted=false
      } catch (e) {
        this.submitted = false
        this.$toasted.error(e.message.errors[0].developerMessage, {
          duration: 7000,
        })
      }
    },
    demoFun() {
      console.log('heee')
      var divContents = document.getElementById('pdf-voucher').innerHTML
      console.log(divContents)
      var a = window.open('', '', 'height=500, width=500')
      a.document.write('<html>')
      a.document.write('<body >')
      a.document.write(divContents)
      a.document.write('</body></html>')
      a.document.close()
      a.print()
    },
    exports(value) {
      this.exportVouchers = true
      console.log('log')
    },
    async print(pay) {
      try {
        NProgress.start()
        const result = await vouchersDownload(pay.id)
        const { data } = result
        this.printPdf = data.voucherData

        setTimeout(() => {
          this.demoFun()
        }, 2000)
      } catch (e) {
        NProgress.done()
        console.log(e)

        this.$toasted.error(e.message.defaultUserMessage, {
          duration: 7000,
        })
      }
    },
    async download(pay) {
      console.log('download')
      try {
        NProgress.start()
        const result = await vouchersDownload(pay.id)
        console.log('Result', result)

        this.json_data = result.data.voucherData
      } catch (e) {
        NProgress.done()
        console.log(e)

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
              <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="shopping-bag" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Order Quantity</h5>
                    <span class="text-muted">{{ vouchers.orderQuantity }}</span>
                  </div>
                </div>
              </div>

              <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="shopping-bag" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Exported Quantity</h5>
                    <span class="text-muted">
                      {{
                      vouchers.exportedQuantity
                      }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-xl-4 col-sm-6">
                <!-- stat 1 -->
                <div class="media p-3">
                  <feather type="briefcase" class="align-self-center icon-dual icon-lg mr-4"></feather>
                  <div class="media-body">
                    <h5 class="mt-0 mb-0">Redeemed Quantity</h5>
                    <span class="text-muted">
                      {{
                      vouchers.redeemedQuantity
                      }}
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
              <b-tab title="Exported Vouchers">
                <p class="text-muted font-13 mb-3"></p>
                <!-- <div class="row">
                  <div class="col-sm-12 text-right mb-2">
                    <button
                      class="btn btn-primary btn-sm d-inline-flex align-items-center"
                      @click="exports"
                    >
                      <feather type="download" class="icon-xs mr-2"></feather>Exports Voucher
                    </button>
                  </div>
                </div>-->
                <div class="row mb-md-2">
                  <div class="col-sm-6 col-md-2">
                    <div id="tickets-table_length" class="dataTables_length">
                      <label class="d-inline-flex align-items-center">
                        Show&nbsp;
                        <b-form-select v-model="perPage" size="sm" :options="pageOptions"></b-form-select>&nbsp;entries
                      </label>
                    </div>
                  </div>
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
                  <div class="col-sm-12 col-md-4 text-right">
                    <button
                      class="btn btn-primary btn-sm d-inline-flex align-items-center"
                      @click="exports"
                      style="background-color:#26a69a"
                    >
                      <feather type="download" class="icon-xs mr-2"></feather>Exports Voucher
                    </button>
                  </div>

                  <!-- End search -->
                </div>
                <!-- Table -->
                <div class="table-responsive mb-0">
                  <b-table
                    show-empty
                    :striped="striped"
                    :bordered="bordered"
                    :small="small"
                    :fixed="fixed"
                    :items="exportVoucherData"
                    :fields="exportFields"
                    responsive="sm"
                    thead-class="header"
                    :per-page="perPage"
                    :current-page="currentPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :filter="filter"
                    :filter-included-fields="filterOn"
                    @filtered="onFiltered"
                  >
                    <template v-slot:cell(action)="data">
                      <button
                        class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                        style="color:#26a69a"
                        @click="print(data.item)"
                      >
                        <feather type="printer" class="icon-xs mr-2"></feather>Print
                      </button>
                      <!-- <button  @click="download(data.item)" style="border:1px;margin:5px;background-color:white">
                        
                      <download-excel
                        class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                        :data="json_data"
                        :fields="json_fields"
                        worksheet="My Worksheet"
                        name="vouchers.xls"
                      >
                        <feather type="download" class="icon-xs mr-2"  ></feather>Download
                      </download-excel>
                      </button>-->
                      <!-- <download-excel :data="json_data">
                  
                        <feather type="download" class="icon-xs mr-2"></feather>Download
                      </download-excel>-->
                    </template>
                  </b-table>
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
                <div
                  id="pdf-voucher"
                  class="mt-4 pdf-voucher"
                  style="font-family: sans-serif;display:none"
                >
                  <section
                    class="pdf-content row justify-content-center"
                    style="display: -webkit-box;display: -ms-flexbox;display: flex;-ms-flex-wrap: wrap;flex-wrap: wrap;margin-right: -12px; margin-left: -12px;justify-content: center; "
                  >
                <section
                      v-for="(val, key) in printPdf"
                      :key="key"
                      class="chart-container bg-light m-2"
                      style="-webkit-box-flex: 0;-ms-flex: 0 040.6666666670%;flex: 0 0 40.6666666670%;max-width: 50.6666666670%;  padding: 15px;background: #e5e0dd;border: 3px solid black;"
                    >
                      <!-- <div style="position: relative; margin-top: 20px;"> -->
                      <!-- <h2
                          style="position: absolute;
                              top: 295%;
                              left: 10%;
                              font-size: 15px;
                              font-weight: 700;
                              color: #000;"
                        >{{val.pinNo.replace(/[^a-z0-9]+/gi, '').replace(/(.{4})/g, '$1 ')}}</h2>
                        <h4
                          style="position: absolute;
                              top: 258%;
                              left: 30%;
                              font-size: 12px;
                              font-weight: 700;
                              color: #000;"
                      >{{ val.serialNo }}</h4>-->
                      <!-- <img src="@assets/images/PIN.jpg" width="70%" /> -->
                      <!-- </div> -->
                      <div style="height:150px">
                        
                        <img
                          src="@assets/images/tstv_logo.jpg"
                          width="50%"
                          style="margin-left:50px;vertical-align:top"
                        />
                        <!-- <span class="field-amount">Pin value : {{val.pinValue}}</span> -->
                       
                          <h3 style="margin-left:10px">Pin NO : {{val.pinNo.replace(/[^a-z0-9]+/gi, '').replace(/(.{4})/g, '$1 ')}}</h3>
                       <div>
                        <h4>Serial NO :{{ val.serialNo }} <span style="color:red;margin-left:30px;font-size:20px">{{ val.pinValue }}</span></h4>
                        
                       </div>
                      </div>
                      <div class="page-break"></div>
                    </section>
                  </section>
                </div>
                <!-- <div class="container pdf-voucher" id="pdf-voucher">
        <div class="row">
        <div class="col-md-6"  v-for="(val, key) in printPdf"
                      :key="key">
          <div class="relative">
          <h2 class="print-voucher-text">{{val.pinNo}}</h2>
          <img src="@assets/images/PIN.jpg">
        </div>
        </div>
        </div>
                </div>-->
              </b-tab>
            </b-tabs>
          </div>
        </div>
      </div>
    </div>
    <b-modal v-model="exportVouchers" title="Export Voucher" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Qty</label>
        <input v-model.trim="Qty" class="form-control" placeholder="Enter Qty" type="number" />
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="exportVouchers = false">Close</b-button>
        <b-button variant="primary" @click="makeExportVoucher" :disabled="submitted">Create</b-button>
      </template>
    </b-modal>
    <!-- end row -->
  </Layout>
</template>
<style lang="scss" scoped media="print">
.page-item.active .page-link {
  z-index: 1;
  color: #fff;
  background-color: #26a69a;
  border-color: #5369f8;
}
.pdf-content {
  background: #fff;
  font-family: sans-serif;
  .chart-container {
    padding: 20px;
    background: #e5e0dd;
    border: 3px dotted #ddd;
    pointer-events: none;
    //   .vaucher {
    //     width: 100%;
    //   }
    //   .voucher-value {
    //     position: absolute;
    //   }
  }
  .brack {
    page-break-inside: avoid;
  }
}
.print-voucher-text {
  position: absolute;
  top: 36%;
  left: 14%;
  font-size: 17px;
  font-weight: 700;
  color: #000;
}
@media all {
  .page-break {
    display: none;
  }
}
.text-muted {
    color: black!important;
}
.page-break {
  display: block;
  page-break-before: always;
}
</style>
<style lang="stylus" scoped>
body {
  font-family: Arial;
}

.coupon {
  border: 5px dotted #bbb;
  width: 80%;
  border-radius: 15px;
  margin: 0 auto;
  max-width: 600px;
}

.container {
  padding: 2px 16px;
  background-color: #f1f1f1;
}

.promo {
  background: #ccc;
  padding: 3px;
}

.expire {
  color: red;
}
</style>