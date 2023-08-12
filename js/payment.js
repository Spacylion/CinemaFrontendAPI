document.addEventListener("DOMContentLoaded", () => {
  const bookingData = JSON.parse(localStorage.getItem("bookingData"))

  const hallConfiguration = bookingData.hallConfig

  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const selectedSeatsElement = document.querySelector(".ticket__chairs")
  const totalCostElement = document.querySelector(".ticket__cost")

  if (filmNameElement) {
    filmNameElement.textContent = bookingData.filmName
  }
  if (hallNameElement) {
    hallNameElement.textContent = bookingData.hallName
  }
  if (seanceTimeElement) {
    seanceTimeElement.textContent = bookingData.seanceTime
  }
  if (selectedSeatsElement) {
    selectedSeatsElement.textContent = bookingData.selectedSeats.join(", ")
  }
  if (totalCostElement) {
    totalCostElement.textContent = bookingData.totalCost + " рублей"
  }

  const acceptButton = document.querySelector(".acceptin-button")
  if (acceptButton) {
    acceptButton.addEventListener("click", async () => {
      const timestamp = bookingData.timestamp
      const hallId = bookingData.hallId
      const seanceId = bookingData.seanceId
      const hallConfiguration = encodeURIComponent(hallConfiguration)
      const requestBody = `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfiguration=${hallConfiguration}`

      try {
        const response = await fetch("your_api_endpoint_here", {
          method: "POST",
          body: requestBody,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        if (response.ok) {
          const ticketData = {
            filmName: selectedSeanceData.filmName,
            seatsInfo: selectedSeatsInfo,
            hallName: selectedSeanceData.hallName,
            seanceTime: selectedSeanceData.seanceTime,
          }

          localStorage.setItem("ticketData", JSON.stringify(ticketData))

          window.location.href = "ticket.html"
        } else {
          console.error("Error adding ticket information to the database")
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    })
  }
})
