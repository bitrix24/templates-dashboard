<script setup lang="ts">
import type { TableColumn } from '@bitrix24/b24ui-nuxt'
import type { TableMeta, Row } from '@tanstack/vue-table'
import type { Sale } from '../../types'
import { useDealStats } from '../../composables/useDealStats'
import ChevronDownLIcon from '@bitrix24/b24icons-vue/outline/ChevronDownLIcon'

const { salesData, isLoading, formatCurrency, formatDateTimeShort, openDeal } = useDealStats()
const B24Badge = resolveComponent('B24Badge')
const B24Button = resolveComponent('B24Button')
const B24Link = resolveComponent('B24Link')

const columns: TableColumn<Sale>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'begindate',
    header: 'Begin date',
    cell: ({ row }) => {
      return formatDateTimeShort(new Date(row.getValue('begindate')))
    }
  },
  {
    accessorKey: 'closedate',
    header: () => {
      return h(
        B24Button,
        {
          color: 'air-tertiary-no-accent',
          label: 'Close date',
          size: 'sm',
          class: '-mx-2.5 [--ui-btn-height:20px]'
        },
        {
          trailing: () =>
            h(ChevronDownLIcon, {
              class: 'text-(--ui-btn-color) shrink-0 size-[13px]'
            })
        }
      )
    },
    cell: ({ row }) => {
      const value = row.getValue('closedate')
      if (value) {
        return formatDateTimeShort(new Date(`${value}`))
      }
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const color = {
        success: 'air-primary-success' as const,
        failed: 'air-primary-alert' as const,
        processing: 'air-tertiary' as const
      }[row.getValue('status') as string]

      return h(B24Badge, { class: 'capitalize', color }, () =>
        row.getValue('status')
      )
    }
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => {
      if (typeof row.original.editPath === 'undefined') {
        return row.original.title
      }

      return h(B24Link, {
        to: row.original.editPath,
        isAction: true,
        onClick: (e: Event) => {
          e.preventDefault()
          openDeal(row.original)
        }
      }, {
        default: () => row.original.title
      })
    }
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue('amount'))
      const currencyId = row.original.currencyId
      return h('div', { class: 'text-right font-(--ui-font-weight-medium)' }, formatCurrency(amount, currencyId))
    }
  }
]

const meta: TableMeta<Sale> = {
  class: {
    tr: (row: Row<Sale>) => {
      if (row.original.status === 'failed') {
        return 'bg-red-600/20'
      }
      // if (row.original.status === 'success') {
      //   return 'bg-green-550/20'
      // }
      return ''
    }
  }
}
</script>

<template>
  <B24Card
    class="base-mode"
    :b24ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }"
  >
    <B24Table
      :loading="isLoading"
      loading-animation="elastic"
      :data="salesData"
      :columns="columns"
      :meta="meta"
      class="shrink-0"
      :b24ui="{ separator: 'h-0' }"
    />
  </B24Card>
</template>
