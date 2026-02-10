export function useTableExport<RowType>(
  rows: ComputedRef<RowType[]>,
  schema: ColumnSchema<RowType>[],
  visibleColumns: Ref<string[]>
) {
  const exportRows = computed(() =>
    rows.value.map((row) => {
      const out: Record<string, any> = {}

      schema.forEach((col) => {
        if (
          col.exportable &&
          visibleColumns.value.includes(col.key as string)
        ) {
          out[col.label] =
            col.key.split('.').reduce((acc, k) => acc?.[k], row) ?? null
        }
      })

      return out
    })
  )

  return { exportRows }
}
