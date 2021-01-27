<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import {
voucherreport
} from '../../../../services/auth'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'

export default {
  page: {
    title: 'Voucher Report',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: { Layout, PageHeader },
  data() {
    return {
        
    json_data: [],
      striped: false,
      bordered: true,
      small: false,
      dark: false,
      fixed: false,
      startDate: moment()
        .subtract(7, 'd')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      tableData: [],
      title: 'Transaction History',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Reports / Voucher Reports',
          active: true,
        },
      ],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: '',
      filterOn: [],
      sortBy: 'age',
      pinno:"",
      sortDesc: false,
    //    json_fields: {
        
    //     'AccountNO':0,
    //     'Serial NO':1,
    //      'Display Name':2,
    //     'Email': 3,
    //     'Phone':4,
    //   'Activation date':5,
    //   'Status':6
    //    },
      fields: [
        {label:'dealer_name', key: '0', sortable: true },
        {label:'voucher_serial_no', key: '1',  sortable: true },
        { label:'voucher_pin_no', key: '2', sortable: true },
        {label:'client_id', key: '3', sortable: true },
         {label:'date_used',  key: '4', sortable: true },
          {label:'box_id', key: '5', sortable: true },
           {label:'STATUS', key: '6', sortable: true },
           {label:'pin_value', key: '7', sortable: true },
      ],
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
    //  this.getTransactionDetails(this.startDate, this.endDate)
    // Set the initial number of items
    this.totalRows = this.items.length
  },
  methods: {
     
    getFormattedDate(timeStamp) {
     
     let date = timeStamp[0]+"-"+timeStamp[1]+"-"+timeStamp[2]
     
      return moment(date).format("MMM Do YYYY")
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    goFilter() {
      this.getTransactionDetails(this.startDate, this.endDate)
    },
   async findCustomer() {
        this.tableData=[]
      try {
         
        NProgress.start()
        const response = await voucherreport(this.pinno)
        
  
          var tableData1 = response.data.data
          console.log("result",tableData1)
          tableData1.map(e=>{
              this.tableData.push(e.row);
          })
          console.log(this.tableData)
          this.json_data= this.tableData
        // } else {
        //   const response = await getactivationsBySE(
        //     this.getUserDetails.officeId
        //   )
        //   this.tableData = response.data.columnHeaders
          NProgress.done()
        // }
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
            header="Voucher Reports"
            border-variant="info"
            header-text-variant="white"
           
          >
          <div class="card-body">
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
              <!-- End search -->
              <div class="col-sm-12 col-md-6">
                <div class="row justify-content-end">
                  <div class="col-md-6 mb-2 col-sm-12">
                    <label for="inputPassword2" class="sr-only">Start Date</label>
                    <b-form-input
                      v-model="pinno"
                      class="form-control"
                      placeholder="Enter PIN NO"
                      name="startdate"
                    ></b-form-input>
                  </div>
                
                   <div class="col-md-2 col-sm-12">
                      
                    <button type="submit" class="btn d-block w-100 btn-primary"  style="background-color:#26a69a;" @click="findCustomer">Submit</button>
                  </div>
                  <div class="col-md-4 col-sm-12">
                    <download-excel :data="json_data" >
                        <button type="submit" class="btn d-block w-100 btn-primary"  style="background-color:#26a69a;">
  Download Data
  </button>
</download-excel>  
                   
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
                <template v-slot:cell(dabitAmount)="data">
                  {{data.item.amount}}
                </template>
                <template v-slot:cell(transDate)="data">
                  {{getFormattedDate(data.item.transDate)}}
                </template>
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
          </div>
       </b-card>
        </div>
      
      </div>
  
    <!-- end row -->
  </Layout>
</template>
<style  scoped>
.card-header {
    padding: 0.75rem 1.25rem;
    margin-bottom: 0;
    background-color:#26a69a;
    border-bottom: 0 solid rgba(0, 0, 0, 0.125);
}
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
</style>