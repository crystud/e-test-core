import { Student } from '../../students/student.entity'
import { Attempt } from '../../attempts/attempt.entity'

export interface PermissionReportResultInterface {
  student: Student

  result: Attempt | number
}
