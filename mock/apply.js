
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
  }
]

