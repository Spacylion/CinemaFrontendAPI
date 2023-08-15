document.addEventListener("DOMContentLoaded", async () => {
  try {
    const selectedSeance = JSON.parse(localStorage.getItem("dataToStore"))
    const {
      timestamp,
      hallId,
      hallName,
      hallSeatPrice,
      hallVIPPrice,
      seanceId,
      hallConfig: defaultHallConfig,
      filmName,
      startTime,
    } = selectedSeance

    const confStepWrapper = document.querySelector(".conf-step__wrapper")
    const seatPrices = {
      "conf-step__chair_standart": parseInt(hallSeatPrice),
      "conf-step__chair_vip": parseInt(hallVIPPrice),
    }

    const filmNameElement = document.querySelector(".buying__info-title")
    const startTimeElement = document.querySelector(".buying__info-start")
    const hallNameElement = document.querySelector(".buying__info-hall")
    const standartPriceElement = document.querySelector(
      ".conf-step__legend-value.price-standart"
    )
    const vipPriceElement = document.querySelector(
      ".conf-step__legend-value.price-vip"
    )

    if (filmNameElement) filmNameElement.textContent = filmName
    if (startTimeElement) startTimeElement.textContent = startTime
    if (hallNameElement) hallNameElement.textContent = hallName
    if (standartPriceElement) standartPriceElement.textContent = hallSeatPrice
    if (vipPriceElement) vipPriceElement.textContent = hallVIPPrice

    let totalCost = 0
    const updateTotalCost = () => {
      totalCost = 0
      const selectedSeatsData = []

      confStepWrapper
        .querySelectorAll(".conf-step__chair_selected")
        .forEach((seat) => {
          const seatPriceClass = [...seat.classList].find(
            (className) =>
              className.includes("conf-step__chair_standart") ||
              className.includes("conf-step__chair_vip")
          )

          if (seatPriceClass) totalCost += seatPrices[seatPriceClass]

          const rowElement = seat.closest(".conf-step__row")
          const rowNumber =
            Array.from(
              confStepWrapper.querySelectorAll(".conf-step__row")
            ).indexOf(rowElement) + 1
          const placeNumber = Array.from(rowElement.children).indexOf(seat) + 1

          selectedSeatsData.push({
            row: rowNumber,
            place: placeNumber,
          })
        })

      const dataTicket = {
        selectedSeats: selectedSeatsData,
        totalCost: totalCost,
        hallName: hallName,
      }

      console.log("Data Ticket with hallConfig:", dataTicket)
      localStorage.setItem("dataTicket", JSON.stringify(dataTicket))
    }

    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `event=get_hallConfig&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}`,
    })

    if (response.ok) {
      const data = await response.json()
      if (data && data.hallConfig !== null) {
        confStepWrapper.innerHTML = decodeURIComponent(data.hallConfig)
      } else {
        confStepWrapper.innerHTML = defaultHallConfig
      }
    } else {
      confStepWrapper.innerHTML = defaultHallConfig
    }

    confStepWrapper.addEventListener("click", (event) => {
      const clickedSeat = event.target
      if (
        clickedSeat.classList.contains("conf-step__chair_standart") ||
        clickedSeat.classList.contains("conf-step__chair_vip") ||
        clickedSeat.classList.contains("conf-step__chair_selected")
      ) {
        clickedSeat.classList.toggle("conf-step__chair_selected")
        updateTotalCost()
        localStorage.setItem(
          "hallConfig",
          JSON.stringify(confStepWrapper.innerHTML)
        )
      }
    })

    const bookingButton = document.querySelector(".acceptin-button")

    bookingButton.addEventListener("click", () => {
      const selectedSeats = confStepWrapper.querySelectorAll(
        ".conf-step__chair_selected"
      )

      selectedSeats.forEach((seat) => {
        seat.classList.remove("conf-step__chair_selected")
        seat.classList.add("conf-step__chair_taken")
      })

      localStorage.setItem(
        "hallConfig",
        JSON.stringify(confStepWrapper.innerHTML)
      )
      window.location.href = "payment.html"
    })
  } catch (error) {
    console.error("Error:", error)
  }
})
