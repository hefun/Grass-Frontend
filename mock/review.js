const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    from_id: 0,
    to_id: 2,
    from_name: '@cname',
    student_id: /^(BY|SY){0,1}(17|18|19|20|21|22)([0-1][0-9]|[2-4][0-2])[0-9]{3}$/,
    department: function() {
      if (Mock.Random.boolean()) return '@cword(1, 5)' + '书院'
      else return '@cword(1, 5)' + '学院'
    },
    phone: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/,
    from_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    to_time: '',
    start_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    end_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    reason: '@cword(5, 10)',
    destination: '@cword(2, 20)',
    comment: '@cword(2, 10)',
    'status|1': [0, 1, 2]
  }))
}

module.exports = [
  {
    url: '/apply/addApply',
    type: 'post',
    response: config => {
      return {
        code: 20000,
        status: 1,
        msg: 'success',
        data: {
          id: 3,
          from_id: 0,
          to_id: 2,
          from_time: '',
          to_time: '',
          start_time: config.startTime,
          end_time: config.endTime,
          destination: config.destination,
          reason: config.reason,
          comment: '',
          status: 0
        }
      }
    }
  },
  {
    url: '/review/listForm',
    type: 'get',
    response: config => {
      const { page = 1, limit = 10 } = config.query
      const pageList = List.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: pageList,
        total: List.length
      }
    }

  }
]

