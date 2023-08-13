document.addEventListener("DOMContentLoaded", async () => {
  const selectedSeanceData = JSON.parse(localStorage.getItem("dataToStore"))
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"))

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
    if (selectedSeats) {
      selectedSeatsElement.textContent = selectedSeats.join(", ")
    } else {
      selectedSeatsElement.textContent = "No seats information available"
    }
  }

  const qrData = `${selectedSeanceData.filmName}\n${selectedSeats.join(
    ", "
  )}\n${selectedSeanceData.hallName}\n${selectedSeanceData.seanceTime}`

  const qrcodeContainer = document.getElementById("qrcode")
  const qrcode = QRCreator(qrData)

  if (qrcode.error) {
    qrcodeContainer.textContent = `Error: ${qrcode.error}`
  } else {
    qrcodeContainer.appendChild(qrcode.result)
  }
})
