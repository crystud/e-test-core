import { Injectable } from '@nestjs/common'
import { CreateCollegeDto } from './dto/createCollege.dto'
import { College } from './college.entity'
import { User } from '../users/user.entity'
import { FilterCollegeDto } from './dto/filterCollege.dto'
import { BadRequestExceptionError } from '../tools/exceptions/BadRequestExceptionError'
import { Subject } from '../subjects/subject.entity'
import { UserRolesType } from '../enums/userRolesType'
import { AccessLevelType } from '../enums/accessLevelType'
import { dbStringLikeBuilder } from '../tools/dbRequestBuilers/dbStringLike.builder'

@Injectable()
export class CollegesService {
  async create(
    createCollegeDto: CreateCollegeDto,
    user: User,
  ): Promise<College> {
    try {
      const college = await College.create({
        ...createCollegeDto,
        creator: user,
      }).save()

      return await this.findOne(college.id)
    } catch (e) {
      if (e.name === 'QueryFailedError' && e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestExceptionError({
          property: 'field',
          value: '',
          constraints: {
            duplicate: e.message,
          },
        })
      }
    }
  }

  async findOne(id: number): Promise<College> {
    const college = await College.findOne({
      where: {
        id,
      },
      relations: [
        'creator',
        'editors',
        'specialties',
        'subjects',
        'studies',
        'tests',
        'specialties.groups',
      ],
    })

    if (!college) {
      throw new BadRequestExceptionError({
        property: 'id',
        value: id,
        constraints: {
          isNotExist: 'college is not exist',
        },
      })
    }

    return college
  }

  async findAll(
    filterCollegeDto: FilterCollegeDto,
    like = true,
  ): Promise<College[]> {
    const filter = like
      ? dbStringLikeBuilder(filterCollegeDto)
      : filterCollegeDto

    return await College.find({
      where: {
        ...filter,
      },
      relations: [
        'creator',
        'editors',
        'specialties',
        'subjects',
        'studies',
        'tests',
      ],
    })
  }

  async findOwn(user: User): Promise<College[]> {
    return await this.findAll(
      {
        creator: user.id,
      },
      false,
    )
  }

  async confirm(id: number): Promise<College> {
    await College.update(
      {
        id,
      },
      {
        confirmed: true,
      },
    )

    return await this.findOne(id)
  }

  async addEditor(college: College, user: User): Promise<College> {
    college.editors.push(user)

    await college.save()

    return this.findOne(college.id)
  }

  async findEditable(user: User): Promise<College[]> {
    const { editableColleges } = await User.findOne({
      where: {
        id: user.id,
      },
      relations: [
        'editableColleges',
        'editableColleges.creator',
        'editableColleges.editors',
      ],
    })

    return editableColleges
  }

  async hasAccess(college: College, user: User): Promise<boolean> {
    if (user.roles.includes(UserRolesType.ADMIN)) return true

    return (await this.isEditor(college, user)) || this.isCreator(college, user)
  }

  public hasSubject(college: College, subject: Subject): boolean {
    return college.subjects.some(value => value.id === subject.id)
  }

  async addSubject(college: College, subject: Subject): Promise<College> {
    if (this.hasSubject(college, subject))
      throw new BadRequestExceptionError({
        value: subject.id,
        property: 'subject',
        constraints: {
          duplicate: "College's already contained this subject",
        },
      })

    college.subjects.push(subject)
    await college.save()

    return college
  }

  async isStudent(college: College, student: User): Promise<boolean> {
    const isStudent = await College.createQueryBuilder('college')
      .leftJoinAndSelect('college.specialties', 'specialties')
      .leftJoinAndSelect('specialties.groups', 'groups')
      .leftJoinAndSelect('groups.students', 'students')
      .where('college.id = :collegeID', { collegeID: college.id })
      .where('students.id = :studentID', { studentID: student.id })
      .getCount()

    return Boolean(isStudent)
  }

  async isCreator(college: College, user: User): Promise<boolean> {
    const ownCollege = await College.findOne({
      where: {
        id: college.id,
        creator: user,
      },
    })

    return !!ownCollege
  }

  async isEditor(college: College, user: User): Promise<boolean> {
    const editableCollege = await College.findOne({
      relations: ['editors'],
      where: {
        id: college.id,
        'editors.id': user,
      },
    })

    return !!editableCollege
  }

  async accessRelations(
    college: College,
    user: User,
  ): Promise<AccessLevelType[]> {
    const levels: AccessLevelType[] = []

    const [isStudent, isCreator, isEditor] = await Promise.all([
      this.isStudent(college, user),
      this.isCreator(college, user),
      this.isEditor(college, user),
    ])

    if (isStudent) levels.push(AccessLevelType.STUDENT)
    if (isCreator) levels.push(AccessLevelType.OWNER)
    if (isEditor) levels.push(AccessLevelType.EDITOR)

    return levels
  }
}
