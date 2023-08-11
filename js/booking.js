document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Retrieve selected seance information from local storage
    const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"))
    const { filmName, seanceTime, hallName } = selectedSeance

    // Fetch API response
    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      body: "event=update",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      throw new Error("Error fetching data")
    }

    const apiResponseData = await response.json()

    // Find the hall configuration and reserved places
    const selectedHall = apiResponseData.halls.result.find(
      (hall) => hall.hall_name === hallName
    )

    const hallConfig = selectedHall.hall_config
    const hallPlaces = selectedHall.hall_places
    const hallRow = selectedHall.hall_row
    const hallStandardPrice = selectedHall.hall_price_standart
    const hallVIPPrice = selectedHall.hall_price_vip

    const reservedPlaces = apiResponseData.reservedPlaces || []

    // Apply reserved places styling and configure seat click behavior
    const hallWrapper = document.querySelector(".conf-step__wrapper")
    hallWrapper.innerHTML = hallConfig

    hallWrapper.querySelectorAll(".conf-step__chair").forEach((seat) => {
      const seatNumber = seat.getAttribute("data-place")

      if (reservedPlaces.some((place) => place.place === seatNumber)) {
        seat.classList.remove("conf-step__chair_standart")
        seat.classList.remove("conf-step__chair_vip")
        seat.classList.add("conf-step__chair_taken")
        seat.setAttribute("title", "Занято")
        seat.addEventListener("click", function () {
          alert("Это место уже занято")
        })
      } else {
        seat.addEventListener("click", function () {
          if (seat.classList.contains("conf-step__chair_selected")) {
            seat.classList.remove("conf-step__chair_selected")
            seat.classList.add("conf-step__chair_standart")
          } else {
            seat.classList.remove("conf-step__chair_standart")
            seat.classList.add("conf-step__chair_selected")
          }
        })
      }
    })

    // Handle booking button click
    const bookingButton = document.querySelector(".acceptin-button")
    bookingButton.addEventListener("click", function () {
      // Retrieve selected seats information and calculate total cost
      const selectedSeats = Array.from(
        hallWrapper.querySelectorAll(".conf-step__chair_selected")
      )

      const selectedSeatsDetails = selectedSeats.map((seat) => {
        const place = parseInt(seat.getAttribute("data-place"))
        const row = Math.floor((place - 1) / hallPlaces) + 1
        const seatInRow = ((place - 1) % hallPlaces) + 1
        return `${row}/${seatInRow}`
      })

      const vipSeatCount = selectedSeats.filter((seat) =>
        seat.classList.contains("conf-step__chair_vip")
      ).length

      const totalCost =
        vipSeatCount * hallVIPPrice +
        (selectedSeats.length - vipSeatCount) * hallStandardPrice

      // Store data in local storage and navigate to payment.html
      const selectedSeanceData = {
        filmName,
        hallName,
        hall_places: hallPlaces,
        hall_rows: hallRow,
        hall_selected: selectedSeatsDetails,
        seanceTime,
        totalCost,
      }

      localStorage.setItem(
        "selectedSeanceData",
        JSON.stringify(selectedSeanceData)
      )

      window.location.href = "payment.html"
    })
  } catch (error) {
    console.error("Error fetching data:", error)
  }
})
