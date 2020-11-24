<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import appConfig from '@src/app.config'
import Layout from '@layouts/main'
import { getCardData } from '../../../../services/dashboard'
import StatChart from '@components/widget-stat-chart'
import Overview from '@components/overview'
import Member from '@components/member'
import Task from '@components/task'
import Chat from '@components/chat'

import {
  revenueAreaChart,
  targetsBarChart,
  salesDonutChart,
  salesDonutChartstb,
  ordersData,
} from './data'

/**
 * Dashboard-1 Component
 */
export default {
  page: {
    title: 'Dashboard',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  components: {
    VuePerfectScrollbar,
    Layout,
    StatChart,
    Overview,
    Member,
    Task,
    Chat,
  },
  data() {
    return {
      revenueAreaChart: revenueAreaChart,
      targetsBarChart: targetsBarChart,
      salesDonutChart: salesDonutChart,
      salesDonutChartstb :salesDonutChartstb ,
      ordersData: ordersData,

      maxHeight: '328px',
      overviewData: [
        {
          class: 'border-bottom py-4',
          icon: 'users',
          value: '121,000',
          title: 'Total Visitors',
        },
        {
          class: 'border-bottom py-4',
          icon: 'image',
          value: '21,000',
          title: 'Total Product Views',
        },
        {
          class: 'py-4',
          icon: 'shopping-bag',
          value: '$21.5',
          title: 'Revenue Per Visitor',
        },
      ],
      membersData: [
        {
          image: require('@assets/images/users/avatar-7.jpg'),
          text: 'Senior Sales Guy',
          name: 'Shreyu N',
        },
        {
          image: require('@assets/images/users/avatar-9.jpg'),
          text: 'Social Media Campaign',
          name: 'Greeva Y',
        },
        {
          image: require('@assets/images/users/avatar-4.jpg'),
          text: 'Inventory Manager',
          name: 'Nik G',
        },
        {
          image: require('@assets/images/users/avatar-1.jpg'),
          text: 'Sales Persons',
          name: 'Hardik G',
        },
        {
          image: require('@assets/images/users/avatar-2.jpg'),
          text: 'Sales Persons',
          name: 'Stive K',
        },
      ],
      tasksData: [
        {
          title: 'Draft the new contract document for sales team',
          text: 'Due on 24 Aug, 2019',
          id: 1,
        },
        {
          title: 'iOS App home page',
          text: 'Due on 23 Aug, 2019',
          id: 2,
        },
        {
          title: 'Write a release note for Shreyu',
          text: 'Due on 22 Aug, 2019',
          id: 3,
        },
        {
          title: 'Invite Greeva to a project shreyu admin',
          text: 'Due on 21 Aug, 2019',
          id: 4,
        },
        {
          title: 'Enable analytics tracking for main website',
          text: 'Due on 20 Aug, 2019',
          id: 5,
        },
        {
          title: 'Invite user to a project',
          text: 'Due on 28 Aug, 2019',
          id: 6,
        },
        {
          title: 'Write a release note',
          text: 'Due on 14 Aug, 2019',
          id: 7,
        },
      ],
      statChart: [],
      chatMessages: [
        {
          id: 1,
          image: require('@assets/images/users/avatar-9.jpg'),
          name: 'Greeva',
          message: 'Hello!',
          time: '10:00',
        },
        {
          id: 2,
          image: require('@assets/images/users/avatar-7.jpg'),
          name: 'Shreyu',
          message: 'Hi, How are you? What about our next meeting?',
          time: '10:01',
        },
        {
          id: 3,
          image: require('@assets/images/users/avatar-9.jpg'),
          name: 'Greeva',
          message: 'Yeah everything is fine',
          time: '10:01',
        },
        {
          id: 4,
          image: require('@assets/images/users/avatar-7.jpg'),
          name: 'Shreyu',
          message: 'Awesome! let me know if we can talk in 20 min',
          time: '10:02',
        },
      ],
      dateConfig: {
        mode: 'range',
      },
      selectedDate: [new Date().setDate(new Date().getDate() - 7), new Date()],
      topCard: {},
    }
  },
  mounted() {
    this.getDashboard()
  },
  methods: {
    async getDashboard() {
      const result = await getCardData()
      this.topCard = result.data
      console.log(this.topCard)

      this.statChart = [
        {
          mainTitle: 'Active',
          value: this.topCard.c_active,
          icon: 'check',
        },
        {
          mainTitle: 'Voucher Stock',
          value: this.topCard.voucher_stock,
          icon: 'file',
        },
        {
          mainTitle: 'provisioning Pending',
          value: this.topCard.provision_pending,
          icon: 'plus',
        },
        {
          mainTitle: 'In Stock',
          value: this.topCard.c_instock,
          icon: 'download',
        },
      ]
    },
  },
}
</script>

<template>
  <Layout>
    <div class="row page-title align-items-center">
      <div class="col-sm-4 col-xl-6">
        <h4 class="mb-1 mt-0">Dashboard</h4>
      </div>
      <!-- <div class="col-sm-8 col-xl-6">
				<form class="form-inline float-sm-right mt-3 mt-sm-0">
					<div class="form-group mb-sm-0 mr-2">
						<flat-pickr
							v-model="selectedDate"
							class="form-control"
							:config="dateConfig"
							name="date"
						></flat-pickr>
					</div>
					<div class="btn-group">
						<b-dropdown variant="primary" right>
							<template v-slot:button-content>
								<i class="uil uil-file-alt mr-1"></i>Download
								<i class="icon">
									<feather type="chevron-down" class="align-middle"></feather>
								</i>
							</template>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="mail"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Email</span>
							</b-dropdown-item>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="printer"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Print</span>
							</b-dropdown-item>
							<b-dropdown-divider></b-dropdown-divider>
							<b-dropdown-item href="#" class="notify-item">
								<feather
									type="file"
									class="icon-dual icon-xs mr-2 align-middle"
								></feather>
								<span>Re-Generate</span>
							</b-dropdown-item>
						</b-dropdown>
					</div>
				</form>
			</div> -->
    </div>

    <div class="row">
      <div
        v-for="(stat, index) of statChart"
        :key="index"
        class="col-md-6 col-xl-3"
      >
        <!-- <StatChart
					:main-title="stat.mainTitle"
					:value="stat.value"
				/> -->
        <div class="card"
          ><div class="card-body p-0"
            ><div class="media p-3"
              ><div class="media-body"
                ><span
                  class="text-muted text-uppercase font-size-12 font-weight-bold" style="color:black"
                  >{{ stat.mainTitle }}</span
                ><h2 class="mb-0">{{ stat.value }}</h2></div
              ><div class="align-self-center" style="position: relative;">
                <feather :type="stat.icon" class="icon-dual icon-xxl"></feather
              ></div> </div></div
        ></div>
      </div>
    </div>

    <!-- <div class="row">
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body pb-0">
            <ul class="nav card-nav float-right">
              <li class="nav-item">
                <a class="nav-link text-muted" href="javascript: void(0);"
                  >Today</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="javascript: void(0);"
                  >7d</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="javascript: void(0);">15d</a>
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="javascript: void(0);"
                  >1m</a
                >
              </li>
              <li class="nav-item">
                <a class="nav-link text-muted" href="javascript: void(0);"
                  >1y</a
                >
              </li>
            </ul>
            <h5 class="card-title mb-0 header-title">Revenue</h5> -->
            <!-- Revenue Area Chart -->
            <!-- <apexchart
              type="area"
              height="296"
              :series="revenueAreaChart.series"
              :options="revenueAreaChart.chartOptions"
            ></apexchart> -->
            <!-- end revenue chart -->
          <!-- </div>
        </div>
      </div> -->

      <!-- <div class="col-xl-6">
        <div class="card">
          <div class="card-body pb-0">
            <h5 class="card-title header-title">Targets</h5> -->
            <!-- Target Radialbar chart -->
            <!-- <div class="mt-3">
              <apexchart
                type="bar"
                height="282"
                :series="targetsBarChart.series"
                :options="targetsBarChart.chartOptions"
              ></apexchart>
            </div> -->
            <!-- end target chart -->
          <!-- </div>
        </div>
      </div>
    </div> -->

    <div class="row">
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-0 pb-2 header-title">Payment</h5>
            <!-- Sales donut chart -->
            <apexchart
              type="donut"
              height="304"
              :series="salesDonutChart.series"
              :options="salesDonutChart.chartOptions"
            ></apexchart>
            <!-- end sales chart -->
          </div>
        </div>
      </div>
      <div class="col-xl-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mt-0 pb-2 header-title">STB</h5>
            <!-- Sales donut chart -->
            <apexchart
              type="donut"
              height="304"
              :series="salesDonutChartstb.series"
              :options="salesDonutChartstb.chartOptions"
            ></apexchart>
            <!-- end sales chart -->
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<style scoped>
.text-muted {
    color: black!important;
}
</style>