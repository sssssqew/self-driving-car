const canvas = document.getElementById('myCanvas')
canvas.width = 200

const ctx = canvas.getContext('2d')
const road = new Road(canvas.width/2, canvas.width*0.9)
const car = new Car(road.getLaneCenter(3), 100, 30, 50)

animate()

function animate(){
  canvas.height = window.innerHeight
  car.update(road.borders)

  ctx.save()
  ctx.translate(0, -car.y + canvas.height*0.7) // 자동차가 캔버스의 중앙점보다 조금 아래쪽에 항상 위치하도록 함

  road.draw(ctx)
  car.draw(ctx)

  ctx.restore()
  requestAnimationFrame(animate)
}