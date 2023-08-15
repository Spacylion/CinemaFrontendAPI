function updateTicketInfo() {
  const ticketInfo = JSON.parse(localStorage.getItem("dataTicket"))
  const timeConfig = JSON.parse(localStorage.getItem("dataToStore"))
  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const selectedSeatsElement = document.querySelector(".ticket__chairs")
  const totalCostElement = document.querySelector(".ticket__cost")

  if (filmNameElement) {
    filmNameElement.textContent = ticketInfo.hallName
  }
  if (hallNameElement) {
    hallNameElement.textContent = ticketInfo.hallName
  }
  if (seanceTimeElement) {
    seanceTimeElement.textContent = timeConfig.seanceTime
  }
  if (selectedSeatsElement) {
    if (ticketInfo.selectedSeats && ticketInfo.selectedSeats.length > 0) {
      const formattedSeats = ticketInfo.selectedSeats
        .map((seat) => `${seat.row}/${seat.place}`)
        .join(", ")
      selectedSeatsElement.textContent = formattedSeats
    } else {
      selectedSeatsElement.textContent = "No seats information available"
    }
  }
  if (totalCostElement && ticketInfo.totalCost) {
    totalCostElement.textContent = ticketInfo.totalCost
  }

  const acceptButton = document.querySelector(".acceptin-button")
  if (acceptButton) {
    acceptButton.addEventListener("click", sendHallConfigToServer)
  }
}

async function sendHallConfigToServer() {
  const hallConfig = JSON.parse(localStorage.getItem("hallConfig"))
  const timeConfig = JSON.parse(localStorage.getItem("dataToStore"))
  const timestamp = timeConfig.timestamp
  const hallId = timeConfig.hallId
  const seanceId = timeConfig.seanceId

  const encodedHallConfig = encodeURIComponent(JSON.stringify(hallConfig))

  try {
    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      body: `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfig=${encodedHallConfig}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (response.ok) {
      console.log("Updated hall configuration successfully sent to the server.")
    } else {
      console.log("Failed to send updated hall configuration to the server.")
    }
  } catch (error) {
    console.error("An error occurred:", error)
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    updateTicketInfo()
  } catch (error) {
    console.error("Error:", error)
  }
})
