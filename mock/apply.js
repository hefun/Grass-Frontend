const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    from_id: 0,
    to_id: 2,
    from_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    to_time: '',
    start_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    end_time: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
    reason: '@cword(5, 10)',
    destination: '@cword(2, 20)',
    to_name: '@cname',
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
    url: '/apply/listForm',
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

