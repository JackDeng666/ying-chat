import { useCallback, useEffect, useState } from 'react'

type UseApiOptions<T> = {
  func: () => Promise<T>
  immediately?: boolean
}

export const useApi = <T>({ func, immediately = true }: UseApiOptions<T>) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()

  const run = useCallback(async () => {
    try {
      setLoading(true)
      const res = await func()
      setData(res)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [func])

  useEffect(() => {
    if (immediately) run()
  }, [run, immediately])

  return {
    loading,
    data,
    setData,
    run
  }
}
