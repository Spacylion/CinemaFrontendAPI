document.addEventListener("DOMContentLoaded", async () => {
  const dataToStore = JSON.parse(localStorage.getItem("dataToStore"))
  const selectedSeats = JSON.parse(localStorage.getItem("selectedSeats"))

  const filmNameElement = document.querySelector(".ticket__title")
  const hallNameElement = document.querySelector(".ticket__hall")
  const seanceTimeElement = document.querySelector(".ticket__start")
  const hallConfiguration = encodeURIComponent(dataToStore.hallConfig)
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
    if (selectedSeats) {
      selectedSeatsElement.textContent = selectedSeats.join(", ")
    } else {
      selectedSeatsElement.textContent = "No seats information available"
    }
  }
  if (totalCostElement && dataToStore.totalCost) {
    totalCostElement.textContent = dataToStore.totalCost
  }

  const acceptButton = document.querySelector(".acceptin-button")
  if (acceptButton) {
    acceptButton.addEventListener("click", async () => {
      const timestamp = dataToStore.timestamp
      const hallId = dataToStore.hallId
      const seanceId = dataToStore.seanceId

      const requestBody = `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfiguration=${hallConfiguration}`

      try {
        const response = await fetch("https://jscp-diplom.netoserver.ru/", {
          method: "POST",
          body: requestBody,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        if (response.ok) {
          const ticketInfo = {
            filmName: dataToStore.filmName,
            hallName: dataToStore.hallName,
            seanceTime: dataToStore.seanceTime,
            seatsInfo: selectedSeats,
          }

          localStorage.setItem("ticketInfo", JSON.stringify(ticketInfo))

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
