export const ToastMsg = Object.freeze({
  common: {
    deleteTag: 'Tags deleted successfully',
  },
  modal: {
    assignTag: {
      successMsg: 'Tag assigned successfully',
      reArrangeMsg: 'Tag arrange successfully',
      updateMsg: 'Tag updated successfully',
    },
  },
  lead: {
    deleteMsg: 'Lead deleted successfully',
  },
  deal: {
    deleteMsg: 'Deal deleted successfully',
  },
  settings: {
    generalSettings: {
      personalSetting: {
        autoLoadSignature: 'Auto load signature status updated successfully.',
      },
      commonControls: {
        phoneType: {
          createMsg: 'Phone type created successfully',
          updateMsg: 'Phone type updated successfully',
          deleteMsg: 'Phone type deleted successfully',
        },
        leadDealSource: {
          createMsg: 'Source created successfully',
          updateMsg: 'Source updated successfully',
          deleteMsg: 'Source deleted successfully',
        },
        addressSetting: {
          updateMsg: 'Auto suggest address status updated successfully',
        },
        restoreSetting: {
          updateMsg: 'Restore data settings updated successfully',
        },
        tagControl: {
          deleteMsg: 'Tag deleted successfully',
        },
        notification: {
          success: 'Notification updated successfully',
        },
        securitySetting: {
          success: 'Two factor authentication  updated successfully',
          createMsg: 'IP created successfully',
          updateMsg: 'IP updated successfully',
          deleteMsg: 'IP deleted successfully',
        },
        snippet: {
          snippetSetting: {
            createMsg: 'Snippet created successfully',
            updateMsg: 'Snippet updated successfully',
            deleteMsg: (len: number) =>
              `${len > 1 ? 'Snippets' : 'Snippet'} deleted successfully`,
          },
          snippetCategory: {
            createMsg: 'Snippet Category created successfully',
            updateMsg: 'Snippet Category updated successfully',
            deleteMsg: (len: number) =>
              `Snippet ${
                len > 1 ? 'categories' : 'category'
              } deleted successfully`,
          },
        },
      },
    },
    userAndControl: {
      profileAndPermission: { inValidProfileId: 'Invalid profile id' },
    },
    moduleSettings: {
      lead: {
        status: {
          createMsg: 'Lead status created successfully',
          updateMsg: 'Lead status updated successfully',
          deleteMsg: 'Lead status deleted successfully',
        },
        leadTempStatus: {
          createMsg: 'Lead temperature status created successfully',
          updateMsg: 'Lead temperature status updated successfully',
          deleteMsg: 'Lead temperature status deleted successfully',
        },
      },
      deal: {
        generalSetting: {
          updateMsg: 'Memo status updated successfully',
        },
        closingDateSetting: {
          updateMsg: 'Deal closing date color settings updated successfully',
        },
        name: {
          updateMsg: 'Deal name settings updated successfully',
        },
        lostReason: {
          createMsg: 'Lost Reason created successfully',
          updateMsg: 'Lost Reason updated successfully',
          deleteMsg: 'Lost Reason deleted successfully',
        },
      },
      activity: {
        availability: {
          updateMsg: 'Availability updated successfully',
        },
        timeSet: { updateMsg: 'Default time set updated successfully' },
        alertTime: { updateMsg: 'Alert time updated successfully' },
      },
      contact: {
        jobRole: {
          createMsg: 'Job role created successfully',
          updateMsg: 'Job role updated successfully',
          deleteMsg: 'Job role deleted successfully',
        },
      },
      account: {
        name: {
          updateMsg: 'Parent account enable settings updated successfully',
        },
      },
      icon: {
        name: {
          updateMsg: 'Icon enable settings updated successfully',
        },
      },
    },
    emailSettings: {
      email_undo: {
        updateMsg: 'Default email undo delay time updated successfully',
      },
    },
  },
});
