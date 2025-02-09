<template>
  <span>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <v-btn
          class="mx-1"
          @click="loadHistory"
          color="primary"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>history</v-icon>
        </v-btn>
      </template>
      <span>View Edit History</span>
    </v-tooltip>

    <v-dialog v-model="dialog" width="900">
      <v-card>
        <v-card-title class="text-h5 pb-0">Edit History</v-card-title>
        <v-card-text>
          <hr />
          <p>
            This is an audit log of who has made changes to this submission
            after the original submission.
          </p>

          <v-data-table
            :headers="headers"
            :items="history"
            :loading="loading"
            loading-text="Loading... Please wait"
            item-key="id"
            class="status-table"
          >
            <template #[`item.actionTimestamp`]="{ item }">
              {{ item.actionTimestamp | formatDateLong }}
            </template>
          </v-data-table>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn class="mb-5 close-dlg" color="primary" @click="dialog = false">
            <span>Close</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import { mapActions } from 'vuex';
import formService from '@/services/formService.js';

export default {
  name: 'AuditHistory',
  props: {
    submissionId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'User Name', value: 'updatedByUsername' },
        { text: 'Date', value: 'actionTimestamp' },
      ],
      loading: true,
      history: [],
    };
  },
  methods: {
    ...mapActions('notifications', ['addNotification']),
    async loadHistory() {
      this.loading = true;
      this.dialog = true;
      try {
        const response = await formService.listSubmissionEdits(
          this.submissionId
        );
        this.history = response.data;
      } catch (error) {
        this.addNotification({
          message: 'An error occured while trying to fetch history.',
          consoleError: `Error getting audit history for ${this.submissionId}: ${error}`,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
