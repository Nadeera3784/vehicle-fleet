import dayjs from 'dayjs'
export const mockData = (count) => {
  const Vehicle = [
    'BMW',
    'Auid',
    'Tesla',
    'BENZ',
    'Vehicle 2',
    'Vehicle 6',
    'Vehicle 7',
    'Vehicle 8',
    'Vehicle 9',
    'Vehicle 10'
  ]
  const workType = ['Type 01', 'Type 2', 'Type 3', 'Type 4', 'Type 05', 'Type 06', 'Type 07', 'Type 08', 'Type 09', 'Type 10', 'Type 11', 'Type 12', 'Type 13', 'Type 14', 'Type 15', 'Type 16', 'Type 17', 'Type 18', 'Type 19', 'Type 20', 'Type 21', 'Type 22', 'Type 23', 'Type 24', 'Type 25', 'Type 26', 'Type 27', 'Type 28', 'Type 29']
  const model = ['A300', 'A310', 'A318', 'A319', 'A320-200']
  const mocks = []
  for (let i = 0; i < count; i++) {
    mocks.push({
      id: i,
      currentAirport: Vehicle[Math.floor(Math.random() * Vehicle.length)],
      number: `${randomNum()}-${randomLett()}`,
      model: model[Math.floor(Math.random() * model.length)],
      childArray: ((length = Math.floor(3)) => {
        const childs = []
        for (let j = 0; j < length; j++) {
          const start = dayjs(new Date()).add(Math.floor(Math.random() * 65), 'hour').format('YYYY/MM/DD HH:mm')
          const end = dayjs(start).add(Math.random() * 15, 'hour').format('YYYY/MM/DD HH:mm')
          childs.push({
            id: j,
            startAirport: Vehicle[Math.floor(Math.random() * Vehicle.length)],
            endAirport: Vehicle[Math.floor(Math.random() * Vehicle.length)],
            workType: workType[Math.floor(Math.random() * workType.length)],
            start: start,
            end: end
          })
        }
        return childs
      })()
    })
  }
  mocks[0].currentAirport = 'Vehicle'
  mocks[0].number = ''
  mocks[0].model = ''
  return mocks
}

function randomNum (n = 2) {
  let number = ''
  for (let i = 0; i < n; i++) {
    number += Math.floor(Math.random() * 10)
  }
  return number
}

function randomLett (n = 4) {
  const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  let idvalue = ''
  for (let i = 0; i < n; i++) {
    idvalue += arr[Math.floor(Math.random() * 26)]
  }
  return idvalue
}
