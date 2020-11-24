<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'
import {

  currentactivationsBySE,
} from '../../../../services/transaction'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'

export default {
  page: {
    title: 'Activation Report',
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
        .subtract(1, 'd')
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
          text: 'Reports / CurrentActivationsAlongWithPlansAndProvision',
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
        {label:'BRANCH', key: '0', sortable: true },
        {label:'ACCOUNTNO', key: '1', },
        { label:'SERIALNO', key: '2',  },
        {label:'CLIENTNAME', key: '3', },
         {label:'ACTIVATIONDATE',  key: '4', },
          {label:'PLAN', key: '5', },
           {label:'PLAN STARTDATE', key: '6', },
            {label:'PLAN_STATUS', key: '7',  },
             {label:'STATUS', key: '8', },
              {label:'ACTION', key: '9', },
               {label:'PROVISIONING STATUS', key: '10', },
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
     this.getTransactionDetails(this.startDate, this.endDate)
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
    async getTransactionDetails(startTime, endTime) {
        this.tableData=[]
      try {
        NProgress.start()
        // if (startTime && endTime) {
          const response = await currentactivationsBySE(
            this.getUserDetails.officeId,
            startTime,
            endTime
          )
          var tableData1 = response.data.data
          
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
            header="CurrentActivationsAlongWithPlansAndProvision"
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
                      
                    <button type="submit" class="btn d-block w-100 btn-primary"  style="background-color:#26a69a;" @click="goFilter">Go</button>
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
.table.b-table.thead.tr{
    background-position: right calc(0.5rem /1) center;
    padding-right: calc(0.35rem + 0.35em);
}
.table.b-table > tfoot > tr > [aria-sort]:not(.b-table-sort-icon-left) {
    background-position: right calc(0.75rem / 2) center;
    padding-right: calc(0.80em);
}
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
   padding-right: calc(0.35rem + 0.35em);
}
.table th,
.table td {
  padding: 0.55rem;
  vertical-align: top;
  border-top: 1px solid #f6f6f7;
}
</style>