import { Permission } from '../permission.entity'
import { PermissionReportResultInterface } from './permissionReportResult.interface'

export interface PermissionReportInterface {
  permission: Permission

  results: PermissionReportResultInterface[]
}
