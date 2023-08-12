document.addEventListener("DOMContentLoaded", async () => {
  const selectedSeanceData = JSON.parse(
    localStorage.getItem("selectedSeanceData")
  )

  const selectedSeatsInfo = JSON.parse(
    localStorage.getItem("selectedSeatsInfo")
  )

  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const selectedSeatsElement = document.querySelector(".ticket__chairs")
  const totalCostElement = document.querySelector(".ticket__cost")

  if (filmNameElement) {
    filmNameElement.textContent = selectedSeanceData.filmName
  }
  if (hallNameElement) {
    hallNameElement.textContent = selectedSeanceData.hallName
  }
  if (seanceTimeElement) {
    seanceTimeElement.textContent = selectedSeanceData.seanceTime
  }
  if (selectedSeatsElement) {
    if (selectedSeatsInfo) {
      const seatsHTML = selectedSeatsInfo
        .map((seat, index) => `${index + 1}: ${seat.type} (${seat.price} руб)`)
        .join(", ")
      selectedSeatsElement.textContent = seatsHTML

      const qrcodeContainer = document.querySelector("#qrcode")
      const qrData = `${selectedSeanceData.filmName}\n${seatsHTML}\n${selectedSeanceData.hallName}\n${selectedSeanceData.seanceTime}`
      const qrcode = QRCreator(qrData)

      if (qrcode.error) {
        qrcodeContainer.textContent = `Ошибка: ${qrcode.error}`
      } else {
        qrcodeContainer.innerHTML = ""
        qrcodeContainer.appendChild(qrcode.result)
      }
    } else {
      selectedSeatsElement.textContent = "No seats information available"
    }
  }
  if (totalCostElement) {
    totalCostElement.textContent = selectedSeanceData.totalCost + " рублей"
  }
})
