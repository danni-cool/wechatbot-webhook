import { wxProviderInterface } from '@/utils/types'

declare module 'hono' {
  interface Context {
    wxProvider: wxProviderInterface
  }
}
