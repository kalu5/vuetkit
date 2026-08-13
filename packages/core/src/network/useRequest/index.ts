import type { Ref } from 'vue'

import { realObj } from '@vuecraft/shared'
import { onMounted, onUnmounted, ref, shallowRef, toValue } from 'vue'

export interface RequestOptions<T, U> {
  // whether to execute the request immediately
  manual?: boolean
  // default params for the request
  defaultParams?: any
  // initial data for the request
  initialData?: T
  // delay loading time
  delayLoadingTime?: number
  // format data before set to data ref
  formatData?: (data: U) => T
  // success callback
  onSuccess?: (data: T) => void
  // error callback
  onError?: (error: any) => void
  // finally callback
  onFinally?: () => void
}

export interface RequestReturn<T> {
  loading: Ref<boolean>
  data: Ref<T | null>
  error: Ref<unknown>
  // manual execute the request
  execute: (params?: any) => void
  // cancel the request
  cancel: () => void
}

export type RequestService<U> = (params?: any) => Promise<U>

/**
 * useRequest
 * @description T is the type returned by the request interface or the type returned by formatData.
 * @description U is the type returned by the request interface. default is T.
 */
export function useRequest<T, U = T>(
  service: RequestService<U>,
  options?: RequestOptions<T, U>,
): RequestReturn<T> {
  const { initialData = null, manual, defaultParams, delayLoadingTime = 300, formatData, onSuccess, onError, onFinally } = options || {}

  const loading = ref(false)
  const data = shallowRef<T | null>(initialData)
  const error = ref<unknown>()

  const timer = ref<any> (null)
  const requestComplete = ref<boolean>(false)
  const isDiscardRequestData = ref<boolean>(false)

  const requestId = ref<number>(0)

  const cancel = () => {
    loading.value = false
    // discard request data
    isDiscardRequestData.value = true
    clearTimer()
  }

  /**
   * get params
   * @param oldParams old params
   * @param newParams new params
   * @returns request params
   * @description get oldParams and newParams, if both are obj, merge them, otherwise newParams will be cover oldParams
   */
  function getParams(oldParams?: any, newParams?: any) {
    if (!oldParams && !newParams) {
      return newParams
    }

    if (oldParams) {
      const oldParamsVal = toValue(oldParams)
      if (newParams) {
        const newParamsVal = toValue(newParams)
        // both obj, merge them
        if (realObj(oldParamsVal) && realObj(newParamsVal)) {
          return {
            ...oldParamsVal,
            ...newParamsVal,
          }
        }
        // cover params with newParams
        return newParamsVal
      }
      return oldParamsVal
    }

    return toValue(newParams)
  }

  // clear timer
  function clearTimer() {
    if (timer.value) {
      clearTimeout(timer.value)
      timer.value = null
    }
    requestComplete.value = false
  }

  // delay loading
  function delayLoading() {
    timer.value = setTimeout(() => {
      if (!requestComplete.value) {
        loading.value = true
      }
    }, delayLoadingTime)
  }

  async function execute(params?: any) {
    try {
      const currentRequestId = ++requestId.value
      isDiscardRequestData.value = false
      // reset timer
      clearTimer()
      // merge params
      const requestParams = getParams(defaultParams, params)
      // delay loading
      delayLoading()
      // execute request
      const res = await service(requestParams)
      // reset error
      error.value = null
      // request complete
      requestComplete.value = true
      // avoid race condition
      if (currentRequestId !== requestId.value) {
        return
      }
      // format data
      const formatRes = formatData ? formatData(res as U) : res as T
      // discard request data
      if (isDiscardRequestData.value) {
        return
      }
      data.value = formatRes
      onSuccess?.(data.value)
    }
    catch (err) {
      error.value = err
      onError?.(err)
    }
    finally {
      clearTimer()
      loading.value = false
      isDiscardRequestData.value = false
      onFinally?.()
    }
  }

  onMounted(() => {
    if (!manual) {
      execute()
    }
  })

  onUnmounted(() => {
    clearTimer()
    requestId.value = 0
  })

  return {
    loading,
    data,
    error,
    execute,
    cancel,
  }
}
