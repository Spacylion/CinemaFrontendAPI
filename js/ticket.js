document.addEventListener("DOMContentLoaded", async () => {
  const dataToStore = JSON.parse(localStorage.getItem("dataToStore"))
  const dataTicket = JSON.parse(localStorage.getItem("dataTicket"))

  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const selectedSeatsElement = document.querySelector(".ticket__chairs")
  const totalCostElement = document.querySelector(".ticket__cost")

  if (filmNameElement) {
    filmNameElement.textContent = dataToStore.filmName
  }
  if (hallNameElement) {
    hallNameElement.textContent = dataToStore.hallName
  }
  if (seanceTimeElement) {
    seanceTimeElement.textContent = dataToStore.seanceTime
  }
  if (selectedSeatsElement) {
    if (
      dataTicket &&
      dataTicket.selectedSeats &&
      dataTicket.selectedSeats.length > 0
    ) {
      const formattedSeats = dataTicket.selectedSeats
        .map((seat) => `${seat.row}/${seat.place}`)
        .join(", ")
      selectedSeatsElement.textContent = formattedSeats
    } else {
      selectedSeatsElement.textContent = "No seats information available"
    }
  }
  if (totalCostElement && dataTicket && dataTicket.totalCost) {
    totalCostElement.textContent = dataTicket.totalCost
  }

  const qrData = `${dataToStore.filmName}\n${
    dataTicket &&
    dataTicket.selectedSeats &&
    dataTicket.selectedSeats.length > 0
      ? dataTicket.selectedSeats
          .map((seat) => `${seat.row}\${seat.place}`)
          .join("\n")
      : "No seats information available"
  }\n${dataToStore.hallName}\n${dataToStore.seanceTime}`

  const qrcodeContainer = document.getElementById("qrcode")
  const qrcode = QRCreator(qrData)

  if (qrcode.error) {
    qrcodeContainer.textContent = `Error: ${qrcode.error}`
  } else {
    qrcodeContainer.appendChild(qrcode.result)
  }
})
