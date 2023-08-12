document.addEventListener("DOMContentLoaded", async () => {
  const selectedSeanceData = JSON.parse(
    localStorage.getItem("selectedSeanceData")
  )
  const selectedSeatsInfo = JSON.parse(
    localStorage.getItem("selectedSeatsInfo")
  )
  const QRCreator = window.QRCreator

  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const selectedSeatsElement = document.querySelector(".ticket__chairs")
  const totalCostElement = document.querySelector(".ticket__cost")
  const qrData = `${selectedSeanceData.filmName}\n${selectedSeatsInfo}\n${selectedSeanceData.hallName}\n${selectedSeanceData.seanceTime}`
  const qrcodeContainer = document.getElementById("qrcode")
  const qrcode = QRCreator(qrData)

  if (qrcode.error) {
    qrcodeContainer.textContent = `Ошибка: ${qrcode.error}`
  } else {
    qrcodeContainer.innerHTML = ""
    qrcodeContainer.appendChild(qrcode.result)
  }
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
    selectedSeatsElement.textContent =
      selectedSeanceData.selectedSeats.join(", ")
  }
  if (totalCostElement) {
    totalCostElement.textContent = selectedSeanceData.totalCost + " рублей"
  }
})
