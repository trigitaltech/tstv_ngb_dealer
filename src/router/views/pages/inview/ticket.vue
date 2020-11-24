<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import PageHeader from '@components/page-header'

import {
  getTicket,
  createTicket,
  updateTicket,
  closeTicket,
} from '../../../../services/ticket'
import moment from 'moment'
import NProgress from 'nprogress/nprogress'

export default {
  page: {
    title: 'Ticket',
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
      startDate: null,
      endDate: null,
      tableData: [],
      title: 'Ticket',
      items: [
        {
          text: 'Home',
          href: '/',
        },
        {
          text: 'Ticket',
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
        { key: 'id', sortable: true },
        { key: 'ticketDate', sortable: true },
        { key: 'priority', sortable: true },
        { key: 'lastComment', sortable: true },
        // { key: 'problemCode', sortable: true },
        // { key: 'problemDescription', sortable: true },
        // { key: 'sourceOfTicket', sortable: true },
        { key: 'status', sortable: true },
        { key: 'action' },
      ],
      ticket: false,
      editTicket: false,
      dates: new Date(),
      description: '',
      ticketId: null,
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
  created() {
    this.dates = new Date()
  },
  mounted() {
    this.getTicketDetails()
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
    async getTicketDetails() {
      try {
        NProgress.start()
        const response = await getTicket(this.getUserDetails.officeId)
        console.log("HHH",response.data)
        this.tableData = response.data
        NProgress.done()
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
    async makeTicket() {
      try {
        const payload = {
          priority: 'LOW',
          sourceOfTicket: 'Phone',
          problemCode: 10,
          assignedTo: 1,
          type:"Office",
          title: 'Dealer Ticket',
          description: this.description,
          subCategory: 'Wrong Bill',
          locale: 'en',
          dateFormat: 'dd MMMM yyyy',
          ticketDate: moment(this.dates).format('DD MMMM yyyy'),
          ticketURL: '',
          ticketTime: ' ' + moment(new Date()).format('h:mm:ss A'),
        }
        console.log(this.getUserDetails.officeId)
        console.log(payload)
        let result = await createTicket(this.getUserDetails.officeId, payload)
         if (result) {
          this.$swal({
            title: 'Congratulation',
            type: 'success',
            text: `You Created Ticket Successfully`,
            duration: 5000,
          })
          // this.refresh()
        }
        this.ticket = false
        this.getTicketDetails()
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message}`,
          duration: 5000,
        })
      }
    },
    edit(value) {
      console.log(value.id)
      this.editTicket = true
      this.ticketId = value.id
    },
    async updateTicket() {
      try {
        const payload = {
          priority: 'LOW',
          sourceOfTicket: 'Phone',
          problemCode: 10,
          assignedTo: 1,
          title: 'Dealer Ticket',
          comments: this.description,
          subCategory: 'Wrong Bill',
          locale: 'en',
          dateFormat: 'dd MMMM yyyy',
          ticketDate: moment(this.dates).format('DD MMMM yyyy'),
          ticketURL: '',
          ticketTime: ' ' + moment(new Date()).format('h:mm:ss A'),
        }
        let result = await updateTicket(this.ticketId, payload)
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `You  Update Ticket Successfully`,
            duration: 5000,
          })
        }
        this.editTicket = false
        this.getTicketDetails()
      } catch (e) {
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
      }
    },
    async closeTickets(value) {
      const payload = {
        status: 228,
        resolutionDescription: 'closed',
        ticketURL: '',
      }
      await closeTicket(value.id, payload)
        value.status = 'CLOSED'
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
            header="Ticket"
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
              <div class="col-sm-12 col-md-6 text-right">
                <button type="submit" class="btn btn-primary"  style="background-color:#26a69a;" @click="ticket = true">Raise Ticket</button>
              </div>
            </div>
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table
                show-empty
                :dark="dark"
                :striped="striped"
                :bordered="bordered"
                :small="small"
                :fixed="fixed"
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
                <template
                  v-slot:cell(ticketDate)="data" >{{ getFormattedDate(data.item.ticketDate) }}</template>
                <template v-slot:cell(action)="data" >
                  <button   style="color:#26a69a"
                    v-if="data.item.status !== 'CLOSED'"
                    class="btn btn-outline-primary btn-sm mr-2 d-inline-flex align-items-center"
                    @click="edit(data.item)"
                  >
                    <feather type="edit" class="icon-xs mr-2"></feather>Edit Comment
                  </button>
                  <button  style="color:#26a69a"
                    v-if="data.item.status !== 'CLOSED'"
                    class="btn btn-outline-dark btn-sm mr-2 d-inline-flex align-items-center"
                    @click="closeTickets(data.item)"
                  >
                    <feather type="x" class="icon-xs mr-2"></feather>Close
                  </button>
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
  
    <b-modal v-model="ticket" title="Create Ticket" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Date</label>
        <!-- <input
          v-model.trim="Qty"
          class="form-control"
          placeholder="Enter Qty"
          type="number"
        />-->
        <flat-pickr v-model="dates" class="form-control" placeholder="End Date" name="enddate"></flat-pickr>
      </div>
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Description</label>
        <textarea v-model="description" rows="4" wrap="soft" class="form-control form-control-lg"></textarea>
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="ticket = false">Close</b-button>
        <b-button variant="primary" @click="makeTicket"  style="background-color:#26a69a">Raise Ticket</b-button>
      </template>
    </b-modal>
    <b-modal v-model="editTicket" title="Edit Ticket" title-class="font-18">
      <div class="form-group mt-3 mt-sm-0">
        <label for="default">Description</label>
        <textarea v-model="description" rows="4" wrap="soft" class="form-control form-control-lg"></textarea>
      </div>
      <template v-slot:modal-footer>
        <b-button variant="light" @click="editTicket = false">Close</b-button>
        <b-button variant="primary" @click="updateTicket"  style="background-color:#26a69a">Make Ticket</b-button>
      </template>
    </b-modal>
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