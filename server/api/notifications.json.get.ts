import { sub } from 'date-fns'

const notifications = [
  {
    id: 1,
    unread: true,
    sender: {
      name: 'Ethan Williams',
      email: 'ethan.williams@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Your order #12345 has been confirmed and is being prepared for shipment.',
    date: sub(new Date(), { minutes: 7 }).toISOString()
  },
  {
    id: 2,
    sender: {
      name: 'Mia White',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'We need your approval for the bulk purchase request from client XYZ.',
    date: sub(new Date(), { hours: 1 }).toISOString()
  },
  {
    id: 3,
    unread: true,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Invoice #INV-2026-03-06 is now available for download in your account.',
    date: sub(new Date(), { hours: 3 }).toISOString()
  },
  {
    id: 4,
    sender: {
      name: 'Ethan Williams',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Payment of $2,500 has been successfully received. Thank you for your business!',
    date: sub(new Date(), { hours: 3 }).toISOString()
  },
  {
    id: 5,
    sender: {
      name: 'Olivia Martinez',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Your subscription to Premium plan has been renewed for another month.',
    date: sub(new Date(), { hours: 7 }).toISOString()
  },
  {
    id: 6,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'A new lead has been assigned to you: Acme Corporation. Please contact them.',
    date: sub(new Date(), { days: 1, hours: 3 }).toISOString()
  },
  {
    id: 7,
    unread: true,
    sender: {
      name: 'Noah Harris',
      email: 'noah.harris@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Reminder: Follow up with client about the proposal sent yesterday.',
    date: sub(new Date(), { days: 2 }).toISOString()
  },
  {
    id: 8,
    sender: {
      name: 'Charlotte Martin',
      email: 'charlotte.martin@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'The deal with Global Tech has been closed. Congratulations on the sale!',
    date: sub(new Date(), { days: 5, hours: 4 }).toISOString()
  },
  {
    id: 9,
    unread: true,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Support ticket #T-4567 has been updated with a new message from customer.',
    date: sub(new Date(), { days: 6 }).toISOString()
  },
  {
    id: 10,
    sender: {
      name: 'Liam Thomas',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Your refund request has been processed and will reflect in 3-5 business days.',
    date: sub(new Date(), { days: 6 }).toISOString()
  },
  {
    id: 11,
    sender: {
      name: 'Amelia Robinson',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'The product demo scheduled for tomorrow at 10 AM has been confirmed.',
    date: sub(new Date(), { days: 7 }).toISOString()
  },
  {
    id: 12,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Please review the contract attached and sign it by the end of day.',
    date: sub(new Date(), { days: 9 }).toISOString()
  },
  {
    id: 13,
    sender: {
      name: 'Lucas Walker',
      email: 'lucas.walker@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Your quote #Q-789 has been approved by the client. Proceed with order.',
    date: sub(new Date(), { days: 10 }).toISOString()
  },
  {
    id: 14,
    sender: {
      name: 'Mia White',
      email: 'mia.white@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Stock alert: Item #XYZ-123 is back in stock. You can place an order now.',
    date: sub(new Date(), { days: 11 }).toISOString()
  },
  {
    id: 15,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Price drop alert: The item you viewed is now 15% off for a limited time.',
    date: sub(new Date(), { days: 12 }).toISOString()
  },
  {
    id: 16,
    sender: {
      name: 'Mason Lewis',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'Meeting with sales team rescheduled to 3 PM today in Conference Room B.',
    date: sub(new Date(), { days: 14 }).toISOString()
  },
  {
    id: 17,
    sender: {
      name: 'Sophia Anderson',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Task \'Prepare quarterly sales report\' has been completed by your team.',
    date: sub(new Date(), { days: 15, hours: 3 }).toISOString()
  },
  {
    id: 18,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Client feedback received: Positive review on Trustpilot. Great job!',
    date: sub(new Date(), { days: 15 }).toISOString()
  },
  {
    id: 19,
    sender: {
      name: 'Ethan Williams',
      email: 'ethan.williams@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'New comment on your proposal from John Doe: \'Looks good, let\'s schedule a call\'.',
    date: sub(new Date(), { days: 16 }).toISOString()
  },
  {
    id: 20,
    sender: {
      name: 'Charlotte Martin',
      email: 'charlotte.martin@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Order #5678 has been shipped. Tracking number: 1Z999AA10123456784.',
    date: sub(new Date(), { days: 17 }).toISOString()
  },
  {
    id: 21,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Your invoice is overdue. Please process payment at your earliest convenience.',
    date: sub(new Date(), { days: 17 }).toISOString()
  },
  {
    id: 22,
    sender: {
      name: 'Elijah Thompson',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'A new document has been shared with you: Sales Contract for Client A.',
    date: sub(new Date(), { days: 18 }).toISOString()
  },
  {
    id: 23,
    sender: {
      name: 'Isabella Jackson',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Your monthly sales target has been updated. Check the dashboard.',
    date: sub(new Date(), { days: 19 }).toISOString()
  },
  {
    id: 24,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Reminder: You have a call with potential client in 30 minutes.',
    date: sub(new Date(), { days: 20 }).toISOString()
  },
  {
    id: 25,
    sender: {
      name: 'Liam Thomas',
      email: 'liam.thomas@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/employee.png'
      }
    },
    body: 'The proposal you sent has been viewed by the client 3 times today.',
    date: sub(new Date(), { days: 21 }).toISOString()
  },
  {
    id: 26,
    sender: {
      name: 'Mia White',
      email: 'mia.white@example.com',
      avatar: {
        src: 'https://bitrix24.github.io/templates-dashboard/avatar/assistant.png'
      }
    },
    body: 'Congratulations! You\'ve reached your quarterly sales goal.',
    date: sub(new Date(), { days: 22 }).toISOString()
  },
  {
    id: 27,
    sender: {
      name: 'System User',
      avatar: {
        src: 'https://github.com/bitrix24.png'
      }
    },
    body: 'Action required: Please update the pipeline for deal #9876.',
    date: sub(new Date(), { days: 23 }).toISOString()
  }
]

export default eventHandler(async () => {
  return notifications
})
