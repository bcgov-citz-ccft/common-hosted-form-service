<template>
  <span>
    <router-link
      :to="{
        name: 'UserFormView',
        query: {
          s: submission.submissionId,
        },
      }"
    >
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            :disabled="!hasViewPerm()"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>remove_red_eye</v-icon>
          </v-btn>
        </template>
        <span>View This Submission</span>
      </v-tooltip>
    </router-link>

    <span v-if="submission.status === 'DRAFT' || submission.status === 'REVISING'">
      <router-link
        v-if="submission.status === 'DRAFT' || submission.status === 'REVISING'"
        :to="{
          name: 'UserFormDraftEdit',
          query: {
            s: submission.submissionId,
          },
        }"
      >
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              :disabled="!hasEditPerm()"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mode_edit</v-icon>
            </v-btn>
          </template>
          <span>Edit This Draft</span>
        </v-tooltip>
      </router-link>
      <DeleteSubmission
        v-if="submission.status !== 'REVISING'"
        @deleted="draftDeleted"
        :disabled="!hasDeletePerm()"
        isDraft
        :submissionId="submission.submissionId"
      />
    </span>
  </span>
</template>

<script>
import DeleteSubmission from '@/components/forms/submission/DeleteSubmission.vue';
import { FormPermissions } from '@/utils/constants';

export default {
  name: 'MySubmissionsActions',
  components: {
    DeleteSubmission,
  },
  props: {
    submission: {
      type: Object,
      required: true,
    },
  },
  methods: {
    draftDeleted() {
      this.$emit('draft-deleted');
    },
    hasDeletePerm() {
      // Only the creator of the draft can delete it
      return this.submission.permissions.includes(
        FormPermissions.SUBMISSION_CREATE
      );
    },
    hasEditPerm() {
      return this.submission.permissions.includes(
        FormPermissions.SUBMISSION_UPDATE
      );
    },
    hasViewPerm() {
      return this.submission.permissions.includes(
        FormPermissions.SUBMISSION_READ
      );
    },
  },
};
</script>
