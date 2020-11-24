<template>
  <div>
    <div class="animated fadeIn">
      <b-row>
        <b-col md="8">
          <b-card
            class="card-wrap"
            header="Add Plan"
            border-variant="info"
            header-text-variant="white"
            style="width:1300px"
          >
            <b-row style="margin-top:10px">
              <b-col md="1">
                <span>Plan List</span>
              </b-col>
              <b-col md="5">
                <b-form-select
                  id="type"
                  v-model="plan"
                  placeholder="Select plan"
                  :options="list"
                  @change="getplanlist()"
                ></b-form-select>
              </b-col>

              <b-col md="1">
                <span>Start Date</span>
              </b-col>
              <b-col md="5">
                <b-input v-model="date"></b-input>
              </b-col>
            </b-row>
            <div v-if=" plan !== 'select-one'">
              <b-row style="margin-top:50px">
                <DualListBox
                  :source="source"
                  :destination="destination"
                  label="name"
                  @onChangeList="onChangeList"
                />
              </b-row>
            </div>
            <div class="row mt-1 justify-content-center">
              <div class="col-md-1" style="margin-top:50px">
                <button
                  style="background-color:#26a69a"
                  class="btn btn-primary d-inline-flex align-items-center"
                  @click="e => $emit('plan',e)"
                >Back</button>
              </div>
              <div class="col-md-11" style="margin-top:50px">
                <div class="d-flex justify-content-end">
                  <div class="form-group mt-5 mt-sm-0">
                    <label for="default">Amount</label>
                    <input
                      v-model.trim="amount"
                      class="form-control"
                      type="number"
                      disabled
                      placeholder="Amount"
                    />
                  </div>

                  <button
                    class="btn btn-primary d-inline-flex align-items-center"
                    style="background-color:#26a69a;margin-left:20px"
                    type="submit"
                    @click="add"
                    :disabled="submitted"
                  >Add Plan</button>
                </div>
              </div>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import Multiselect from 'vue-multiselect'
import DualListBox from 'dual-listbox-vue'
import 'dual-listbox-vue/dist/dual-listbox.css'
import moment from 'moment'
// import {
//   ValidationProvider,
//   ValidationObserver,
// } from 'vee-validate/dist/vee-validate.full'
import {
  // editcustomer,
  // cityTemplete,
  // registerTemplete,
  plandetails,
  plandata,
  planlist,
  addplan,
} from '../services/auth'
export default {
  name: 'Editcustomer',
  components: {
    Multiselect,
    DualListBox,
    moment,
  },
  props: {
    itemObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      submitted:false,
      list: [{ value: null, text: 'Please select an option' }],
      contractPeriodid: [],
      plan: null,
      date: this.getFormattedDate(),
      cid: this.itemObj.clientId,
      csid: this.itemObj.clientServiceId,
      planList: [],
      payloadData: [],
      source: [],
      amount:0,
      destination: [],
    }
  },
  async mounted() {
    console.log('hai', this.contractPeriodid)

    this.getdetails()
    this.getcatalog()
    // this.getplanlist()
    console.log('liiisi', this.itemObj)
  },
  methods: {
    onChangeList: function ({ source, destination }) {
      this.source = source
      this.destination = destination
      console.log("destination",this.destination)
      this.planList = this.destination.map(function (x) {
        return {
          id: x.id,
          label: x.label,
          price: x.price,
          chargecode: x.chargecode,
          planPoId: x.planPoId,
          dealPoId: x.dealPoId,
        }
      })
      this.amount = 0;
      this.destination.map(e=>{
        this.amount = this.amount + e.price
      });
// console.log("amount:",amount)
      //   console.log('plan', this.getplanlist())
      var ccid = this.cid
      var cssid = this.csid
      var date = this.getFormattedDate()
      var contractid = this.contractPeriodid
      //   var planPoId =  "",
      //   var dealPoId = "" ,
      //   var paytermCode = "",
      //   var contractPeriod = "",
      this.payloadData = this.planList.map(function (e) {
        return {
          id: e.id,
          planCode: e.id,
          planDescription: e.label,
          planPoId: e.planPoId,
          dealPoId: e.dealPoId,
          paytermCode: e.chargecode,
          contractPeriod: contractid,
          clientServiceId: cssid,
          billAlign: true,
          clientId: ccid,
          locale: 'en',
          dateFormat: 'dd MMMM yyyy',
          start_date: date,
          isNewplan: true,
        }
      })
      //   console.log('destination', this.planList[0].label)
    },
    async getdetails() {
      const result = await plandetails()
      this.clientTemplete = result.data

      console.log('contract', this.clientTemplete)
    },
    async getcatalog() {
      const result = await planlist()
      var plan = result.data.allPlanDatas
      console.log('plan', plan)
      plan.map((e) => {
        this.list.push(e.name)
      })
      console.log('plans', this.list)
    },
    async getplanlist() {
      //  debugger
      console.log('plam', this.plan, this.plans)
      if (this.plan !== '') {
        const result1 = await planlist()
        var lists = result1.data.allPlanDatas

        console.log('lists', lists)
        lists.map((e) => {
          if (e.name === this.plan) {
            this.id = e.id
          }
        })
        const result = await plandata(
          this.id,
          this.itemObj.clientId,
          this.itemObj.clientServiceId
        )

        this.contractPeriodid = result.data.subscriptiondata[0].id
        console.log('contractid', this.contractPeriodid)
        this.source = result.data.planData.map(function (x) {
          return {
            id: x.id,
            label:
              x.planDescription +
              '            ' +
              '           ' +
              x.price +
              '-Naira',
            price: x.price,
            chargecode: x.chargeCycle,
            dealPoId: x.dealPoId,
            planPoId: x.planPoId,
          }
        })
      }
      console.log('destination', this.source)
    },
    async add() {
      this.submitted=true
      console.log('id', this.ids)
      // if(this.form.firstName && this.form.lastName && this.form.number && this.form.address){
      try {
        const payload = { plans: this.payloadData }
        console.log('form', payload)
        const result = await addplan(this.cid, payload)
        if (result) {
          this.$swal({
            group: 'alert',
            type: 'success',
            text: `You added plan successfully`,
            duration: 5000,
          })
        }
        this.submitted=false
      } catch (e) {
        this.submitted=false
        this.$notify({
          group: 'alert',
          type: 'error',
          text: `${e.message.errors[0].developerMessage}`,
          duration: 5000,
        })
      }
      this.$emit('plan', {})
      // }
      // else
      // {
      //    this.$notify({
      //   group: "alert",
      //   type: "error",
      //   text: `You fill Data`,
      //   duration: 5000,
      // });
      // }
    },
    getFormattedDate() {
      return moment(new Date()).format('DD MMMM YYYY')
    },
  },
}
</script>
<style>
.list-box-wrapper .list-box-item .bulk-action .select-all {
  background-color: #26a69a;
}
.btn-action {
  background-color: #26a69a;
  border-color: #26a69a;
}
.list-box-wrapper .list-box-item .bulk-action .deselect-all {
  background-color: #c7c7ca;
  color: black;
}
.card-header {
  padding: 0.75rem 1.25rem;
  margin-bottom: 0;
  background-color: #26a69a;
  border-bottom: 0 solid rgba(0, 0, 0, 0.125);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>