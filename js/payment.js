document.addEventListener("DOMContentLoaded", () => {
  const selectedSeanceData = JSON.parse(
    localStorage.getItem("selectedSeanceData")
  )
  const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"))

  const hallConfiguration = selectedSeance.hallConfig

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
    selectedSeatsElement.textContent =
      selectedSeanceData.selectedSeats.join(", ")
  }
  if (totalCostElement) {
    totalCostElement.textContent = selectedSeanceData.totalCost + " рублей"
  }

  const acceptButton = document.querySelector(".acceptin-button")
  if (acceptButton) {
    acceptButton.addEventListener("click", async () => {
      const timestamp = selectedSeanceData.timestamp
      const hallId = selectedSeance.hallId
      const seanceId = selectedSeance.seanceId
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
