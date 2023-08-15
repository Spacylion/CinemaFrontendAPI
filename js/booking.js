document.addEventListener("DOMContentLoaded", async () => {
  try {
    const selectedSeance = JSON.parse(localStorage.getItem("dataToStore"))
    const {
      timestamp,
      hallId,
      hallName,
      hallSeatPrice,
      hallVIPPrice,
      filmName,
      seanceId,
      hallConfig: defaultHallConfig,
    } = selectedSeance
    const filmNameElement = document.querySelector(".buying__info-title")
    const hallNameElement = document.querySelector(".buying__info-hall")
    const standartPriceElement = document.querySelector(
      ".conf-step__legend-value.price-standart"
    )
    const vipPriceElement = document.querySelector(
      ".conf-step__legend-value.price-vip"
    )
    if (filmNameElement) {
      filmNameElement.textContent = filmName
    }
    if (hallNameElement) {
      hallNameElement.textContent = hallName
    }
    if (standartPriceElement) {
      standartPriceElement.textContent = hallSeatPrice
    }
    if (vipPriceElement) {
      vipPriceElement.textContent = hallVIPPrice
    }
    const confStepWrapper = document.querySelector(".conf-step__wrapper")
    let hallConfigFetched = false
    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `event=get_hallConfig&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}`,
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.hallConfig) {
        confStepWrapper.innerHTML = data.hallConfig
        hallConfigFetched = true
      }
    }

    if (!hallConfigFetched) {
      confStepWrapper.innerHTML = defaultHallConfig
    }

    const seatPrices = {
      "conf-step__chair_standart": parseInt(hallSeatPrice),
      "conf-step__chair_vip": parseInt(hallVIPPrice),
    }

    const selectedSeatsData = []

    const updateTotalCost = () => {
      let totalCost = 0

      selectedSeatsData.forEach((seat) => {
        const seatPriceClass = [...seat.seat.classList].find(
          (className) =>
            className.includes("conf-step__chair_standart") ||
            className.includes("conf-step__chair_vip")
        )

        if (seatPriceClass) {
          totalCost += seatPrices[seatPriceClass]
        }
      })

      const dataTicket = {
        selectedSeats: selectedSeatsData.map((seat) => ({
          row: seat.row,
          place: seat.place,
        })),
        totalCost: totalCost,
        hallName: hallName,
        hallConfig: confStepWrapper.outerHTML,
      }

      localStorage.setItem("dataTicket", JSON.stringify(dataTicket))
    }

    confStepWrapper.addEventListener("click", (event) => {
      const clickedSeat = event.target
      if (
        clickedSeat.classList.contains("conf-step__chair_standart") ||
        clickedSeat.classList.contains("conf-step__chair_vip")
      ) {
        clickedSeat.classList.toggle("conf-step__chair_selected")

        const rowElement = clickedSeat.closest(".conf-step__row")
        const rowNumber =
          Array.from(
            confStepWrapper.querySelectorAll(".conf-step__row")
          ).indexOf(rowElement) + 1

        const placeNumber =
          Array.from(rowElement.children).indexOf(clickedSeat) + 1

        const isSelected = clickedSeat.classList.contains(
          "conf-step__chair_selected"
        )

        if (isSelected) {
          selectedSeatsData.push({
            seat: clickedSeat,
            row: rowNumber,
            place: placeNumber,
          })
        } else {
          const indexToRemove = selectedSeatsData.findIndex(
            (seat) => seat.seat === clickedSeat
          )
          if (indexToRemove !== -1) {
            selectedSeatsData.splice(indexToRemove, 1)
          }
        }

        updateTotalCost()
      }
    })

    const bookingButton = document.querySelector(".acceptin-button")

    bookingButton.addEventListener("click", () => {
      selectedSeatsData.forEach((seat) => {
        seat.seat.classList.remove("conf-step__chair_selected")
        seat.seat.classList.add("conf-step__chair_taken")
      })

      let totalCost = 0

      selectedSeatsData.forEach((seat) => {
        const seatPriceClass = [...seat.seat.classList].find(
          (className) =>
            className.includes("conf-step__chair_standart") ||
            className.includes("conf-step__chair_vip")
        )

        if (seatPriceClass) {
          totalCost += seatPrices[seatPriceClass]
        }
      })

      const dataTicket = {
        selectedSeats: selectedSeatsData.map((seat) => ({
          row: seat.row,
          place: seat.place,
        })),
        totalCost: totalCost,
        hallName: hallName,
        hallConfig: confStepWrapper.outerHTML,
      }

      localStorage.setItem("dataTicket", JSON.stringify(dataTicket))
      window.location.href = "payment.html"
    })
  } catch (error) {
    console.error("Error:", error)
  }
})
