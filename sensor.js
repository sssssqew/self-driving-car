class Sensor{
  constructor(car){
    this.car = car 
    this.rayCount = 5
    this.rayLength = 150
    this.raySpread = Math.PI / 2

    this.rays = []
    this.readings = []
  }
  update(roadBorders){
    this.#castRays()
    this.readings = []
    for(let i=0;i<this.rays.length;i++){
      this.readings.push(this.#getReading(this.rays[i], roadBorders))
    }
  }
  #getReading(ray, roadBorders){ // 센서와 도로 경계선이 겹치는 지점 중 자동차에 가까운 지점의 위치를 반환 
    let touches = []

    for(let i=0;i<roadBorders.length;i++){
      const touch = getIntersection( // 센서와 도로 경계선 겹치는 지점 반환 
        ray[0], // 센서 시작점
        ray[1], // 센서 끝점
        roadBorders[i][0], // 경계선 상단
        roadBorders[i][1] // 경계선 하단
      )
      if(touch){
        touches.push(touch)
      }
    }
    if(touches.length === 0){
      return null 
    }else{
      const offsets = touches.map(e => e.offset) // 센서와 경계선이 겹치는 지점과 자동차와의 거리(offest)들을 저장한 배열 
      const minOffset = Math.min(...offsets) 
      return touches.find(e => e.offset === minOffset) // 겹치는 지점중 자동차와 가장 가까운 지점 반환
    }
  }

  #castRays(){
    this.rays = []
    for(let i=0;i<this.rayCount;i++){
      const rayAngle = lerp(
        this.raySpread/2, // 센서 전체 각도의 절반
        -this.raySpread/2,
        this.rayCount === 1 ? 0.5 : i/(this.rayCount-1) // this.rayCount === 1 : 중앙에 하나의 센서만 보여줌
      )+this.car.angle // this.car.angle : 차가 이동하는 각도만큼 센서도 움직여줘야 함 
      const start = {x: this.car.x, y: this.car.y} // 센서 시작점 (차의 중앙지점)
      const end = { // 센서 각각의 끝점
        x: this.car.x - this.rayLength * Math.sin(rayAngle),
        y: this.car.y - this.rayLength * Math.cos(rayAngle)
      } 
      this.rays.push([start, end]) // 센서 배열
    }
  }
  draw(ctx){
    for(let i=0;i<this.rayCount;i++){
      let end = this.rays[i][1] // 센서의 끝점
      if(this.readings[i]){
        end = this.readings[i] // 센서와 도로 경계선이 겹치는 지점 중 가장 가까운 지점을 센서의 끝점으로 설정함
      }

      ctx.beginPath()
      ctx.lineWidth=2
      ctx.strokeStyle='yellow'
      ctx.moveTo(
        this.rays[i][0].x,
        this.rays[i][0].y
      )
      ctx.lineTo(
        end.x,
        end.y
      )
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth=2
      ctx.strokeStyle='black'
      ctx.moveTo(
        this.rays[i][1].x,
        this.rays[i][1].y
      )
      ctx.lineTo(
        end.x,
        end.y
      )
      ctx.stroke()
    }
  }
}