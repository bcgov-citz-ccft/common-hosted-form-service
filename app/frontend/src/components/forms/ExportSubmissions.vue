<template>
  <span>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          class="mx-1"
          @click="dialog = true"
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>get_app</v-icon>
        </v-btn>
      </template>
      <span>Export Submissions to File</span>
    </v-tooltip>

    <v-dialog
      v-if="dialog"
      v-model="dialog"
      width="900"
      content-class="export-submissions-dlg"
    >
      <v-card>
        <v-card-title class="text-h5 pb-0 titleObjectStyle">Export Submissions to File</v-card-title>
        <v-card-text>
          <hr style="height: 2px; border: none;background-color:#707070C1;margin-top:5px;"/>
          <v-row>
            <v-col>
              <p class="subTitleObjectStyle">Select the submission date</p>
              <v-radio-group v-model="dataFields" hide-details="auto">
                <v-radio label="All data/fields" :value="false">
                  <template v-slot:label>
                    <span class="radioboxLabelStyle">All data/fields</span>
                  </template>
                </v-radio>
                <!--<v-radio label="Select Date Range" :value="true">
                  <template v-slot:label>
                    <span class="radioboxLabelStyle">Selected data/fields</span>
                    <v-icon class="ml-3" color="#003366"> view_week</v-icon>
                  </template>
                </v-radio>
                -->
              </v-radio-group>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p class="subTitleObjectStyle">Select the submission date</p>
              <v-radio-group v-model="dateRange" hide-details="auto">
                <v-radio label="All" :value="false">
                  <template v-slot:label>
                    <span class="radioboxLabelStyle">All</span>
                  </template>
                </v-radio>
                <v-radio label="Select Date range" :value="true">
                  <template v-slot:label>
                    <span class="radioboxLabelStyle">Select date range</span>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <div v-if="dateRange">
            <v-row>
              <v-col cols="12" sm="6" offset-sm="0" offset-md="1" md="4">
                <v-menu
                  v-model="startDateMenu"
                  data-test="menu-form-startDate"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <label>From</label>
                    <v-text-field
                      v-model="startDate"
                      placeholder="yyyy-mm-dd"
                      append-icon="event"
                      v-on:click:append="startDateMenu = true"
                      readonly
                      v-on="on"
                      dense
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="startDate"
                    data-test="picker-form-startDate"
                    @input="startDateMenu = false"
                    :max="maxDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6" offset-sm="0" offset-md="1" md="4">
                <v-menu
                  v-model="endDateMenu"
                  data-test="menu-form-endDate"
                  :close-on-content-click="true"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <label>To</label>
                    <v-text-field
                      v-model="endDate"
                      placeholder="yyyy-mm-dd"
                      append-icon="event"
                      v-on:click:append="endDateMenu = true"
                      readonly
                      v-on="on"
                      dense
                      outlined
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="endDate"
                    data-test="picker-form-endDate"
                    @input="endDateMenu = false"
                    :min="startDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </div>

          <p class="subTitleObjectStyle" :class="!dateRange ? 'mt-8' : ''">Select your export options</p>
          <v-radio-group v-model="exportFormat" hide-details="auto">
            <v-radio label="CSV" value="csv">
              <template v-slot:label>
                <span class="radioboxLabelStyle">CSV</span>
              </template>
            </v-radio>
            <v-radio label="JSON" value="json">
              <template v-slot:label>
                <span class="radioboxLabelStyle">JSON</span>
              </template>
            </v-radio>
          </v-radio-group>

          <div class="mt-6 mb-3 fileLabelStyle">
            File Name and Type: <strong>{{ fileName }}</strong>
          </div>
          <div class="fileLabelStyle" :style="{'color': '#70707063'}">
            <small class="text--disabled">
              * The export data feature works well for simple form designs that
              don't contain complex nested arrays of form components. If you
              make changes to your form design the structure of your export will
              also change. We therefore caution against implementing automation
              with other systems without accounting for these factors.
            </small>
          </div>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn class="mb-5 mr-5 exportButtonStyle" color="primary" @click="callExport">
            <span>Export</span>
          </v-btn>
          <v-btn class="mb-5 cancelButtonStyle" outlined @click="dialog = false">
            <span>Cancel</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import moment from 'moment';
import { mapActions, mapGetters } from 'vuex';
import formService from '@/services/formService.js';
export default {
  data() {
    return {
      dateRange: false,
      dialog: false,
      endDate: moment(Date()).format('YYYY-MM-DD'),
      endDateMenu: false,
      dataFields:false,
      exportFormat: 'csv',
      startDate: moment(Date()).format('YYYY-MM-DD'),
      startDateMenu: false,

    };
  },
  computed: {
    maxDate() {
      let momentObj = moment(Date());
      let  momentString = momentObj.format('YYYY-MM-DD');
      return momentString;
    },
    ...mapGetters('form', ['form', 'userFormPreferences']),
    fileName() {
      return `${this.form.snake}_submissions.${this.exportFormat}`;
    },
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    async callExport() {
      try {
        // UTC start of selected start date...
        const from =
          this.dateRange && this.startDate
            ? moment(this.startDate, 'YYYY-MM-DD hh:mm:ss').utc().format()
            : undefined;
        // UTC end of selected end date...
        const to =
          this.dateRange && this.endDate
            ? moment(`${this.endDate} 23:59:59`, 'YYYY-MM-DD hh:mm:ss')
              .utc()
              .format()
            : undefined;
        const response = await formService.exportSubmissions(
          this.form.id,
          this.exportFormat,
          {
            minDate: from,
            maxDate: to,
            // deleted: true,
            // drafts: true
          },
          this.dataFields?this.userFormPreferences.preferences:undefined
        );
        if (response && response.data) {
          const blob = new Blob([response.data], {
            type: response.headers['content-type'],
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = this.fileName;
          a.style.display = 'none';
          a.classList.add('hiddenDownloadTextElement');
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.dialog = false;
        } else {
          throw new Error('No data in response from exportSubmissions call');
        }
      } catch (error) {
        this.addNotification({
          message:
            'An error occurred while attempting to export submissions for this form.',
          consoleError: `Error export submissions for ${this.form.id}: ${error}`,
        });
      }
    },
  },
  watch:{
    startDate() {
      this.endDate= moment(Date()).format('YYYY-MM-DD');
    },
    dateRange(value) {
      if(!value) {
        this.endDate= moment(Date()).format('YYYY-MM-DD');
        this.startDate= moment(Date()).format('YYYY-MM-DD');
      }
    }
  }
};
</script>
<style lang="scss" scoped>

  .titleObjectStyle {
    text-align: left !important;
    font-style: normal !important;
    font-size: 22px !important;
    font-weight: bold !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    letter-spacing: 0px !important;
    color: #000000 !important;
  };
  .subTitleObjectStyle {
    text-align: left !important;
    text-decoration: underline !important;
    font-style: normal !important;
    font-size: 18px !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    font-weight: normal !important;
    letter-spacing: 0px !important;
    color: #000000 !important;
  };
  .radioboxLabelStyle {
    text-align: left !important;
    font-style: normal !important;
    font-size: 14px !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    font-weight: normal !important;
    letter-spacing: 0px !important;
    color: #000000 !important;
  };

  .fileLabelStyle {
    text-align: left !important;
    font-style: normal !important;
    font-size: 14px !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    font-weight: bold !important;
    letter-spacing: 0px !important;
    color: #000000 !important;
  }

  .exportButtonStyle {
    width: 80px !important;
    background: #003366 0% 0% no-repeat padding-box !important;
    border: 1px solid #707070 !important;
    border-radius: 3px !important;
    font-style: normal !important;
    font-size: 18px !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    font-weight: bold !important;
    letter-spacing: 0px !important;
    color: #FFFFFF !important;
    text-transform:capitalize !important;
  }

  .cancelButtonStyle {
    width: 80px !important;
    background: #FFFFFF 0% 0% no-repeat padding-box !important;
    border: 1px solid #003366 !important;
    border-radius: 3px !important;
    font-style: normal !important;
    font-size: 18px !important;
    font-variant: normal !important;
    font-family: BCSans !important;
    font-weight: normal !important;
    letter-spacing: 0px !important;
    color: #38598A !important;
    text-transform:capitalize !important;
  }
</style>
