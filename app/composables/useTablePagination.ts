import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'

export function useTablePagination(
  tableRef?: Ref<any>,
  initialPage = 0,
  initialSize = 20
) {
  // Estado interno de paginación
  const pagination = ref({
    pageIndex: initialPage,
    pageSize: initialSize
  })

  // currentPage basado en pagination
  const currentPage = computed(() => pagination.value.pageIndex + 1)

  // itemsPerPage basado en pagination
  const itemsPerPage = computed(() => pagination.value.pageSize)

  // totalItems puede depender de la tabla si se pasa tableRef
  const totalItems = computed(
    () => tableRef?.value?.tableApi?.getFilteredRowModel().rows.length ?? 0
  )

  // Maneja cambio de página
  const handlePageChange = (page: number) => {
    pagination.value.pageIndex = page - 1
    // también actualiza la tabla si se pasó
    if (tableRef?.value?.tableApi) {
      tableRef.value.tableApi.setPageIndex(page - 1)
    }
  }

  // Maneja cambio de pageSize si quieres
  const setPageSize = (size: number) => {
    pagination.value.pageSize = size
    if (tableRef?.value?.tableApi) {
      tableRef.value.tableApi.setPageSize(size)
    }
  }

  // Sincroniza si la tabla cambia la página directamente (opcional)
  if (tableRef?.value?.tableApi) {
    watch(
      () => tableRef.value.tableApi.getState().pagination,
      (newPag) => {
        pagination.value.pageIndex = newPag.pageIndex
        pagination.value.pageSize = newPag.pageSize
      },
      { deep: true }
    )
  }

  return {
    pagination,
    currentPage,
    itemsPerPage,
    totalItems,
    handlePageChange,
    setPageSize
  }
}
