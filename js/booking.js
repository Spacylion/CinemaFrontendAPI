let selectedSeats = []
let hallPlaces
let seatStatusArray = []
let totalCost = 0

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const selectedSeance = JSON.parse(localStorage.getItem("dataToStore"))
    const {
      timestamp,
      hallId,
      seanceId,
      hallConfig: defaultHallConfig,
    } = selectedSeance

    const confStepWrapper = document.querySelector(".conf-step__wrapper")

    const response = await fetch(`https://jscp-diplom.netoserver.ru/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `event=get_hallConfig&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}`,
    })

    let hallConfig = defaultHallConfig

    if (response.ok) {
      const data = await response.json()
      if (data && data.hallConfig) {
        hallConfig = data.hallConfig
      }
    }

    confStepWrapper.innerHTML = hallConfig

    hallPlaces = parseInt(selectedSeance.hall_places)

    const seatPrices = {
      "conf-step__chair_standart": parseInt(selectedSeance.hallSeatPrice),
      "conf-step__chair_vip": parseInt(selectedSeance.hallVIPPrice),
    }

    seatStatusArray = Array.from({ length: hallPlaces }, () => [])

    confStepWrapper
      .querySelectorAll(".conf-step__chair")
      .forEach((seat, index) => {
        if (
          !seat.classList.contains("conf-step__chair_taken") &&
          !seat.classList.contains("conf-step__chair_disabled")
        ) {
          seat.addEventListener("click", function () {
            const seatNumber = index + 1
            const rowIndex = Math.floor((seatNumber - 1) / hallPlaces)
            const seatIndex = (seatNumber - 1) % hallPlaces

            const seatPriceClass = Array.from(seat.classList).find(
              (className) => className in seatPrices
            )
            const seatPrice = seatPriceClass ? seatPrices[seatPriceClass] : 0

            if (seat.classList.contains("conf-step__chair_selected")) {
              selectedSeats = selectedSeats.filter(
                (seat) => seat !== `${rowIndex}/${seatIndex}`
              )
              totalCost -= seatPrice
              seatStatusArray[rowIndex][seatIndex] = null
              seat.classList.remove("conf-step__chair_selected")
            } else {
              selectedSeats.push(`${rowIndex}/${seatIndex}`)
              totalCost += seatPrice
              seatStatusArray[rowIndex][seatIndex] = "selected"
              seat.classList.add("conf-step__chair_selected")
            }
          })
        }
      })
  } catch (error) {
    console.error("Error:", error)
  }
})

const bookingButton = document.querySelector(".acceptin-button")
bookingButton.addEventListener("click", async function () {
  try {
    const selectedSeance = JSON.parse(localStorage.getItem("dataToStore"))
    const { timestamp, hallId, seanceId } = selectedSeance

    const confStepWrapper = document.querySelector(".conf-step__wrapper")
    confStepWrapper
      .querySelectorAll(".conf-step__chair")
      .forEach((seat, rowIndex) => {
        seat
          .querySelectorAll(".conf-step__chair_selected")
          .forEach((selectedSeat) => {
            selectedSeat.classList.remove("conf-step__chair_selected")
            selectedSeat.classList.add("conf-step__chair_taken")
          })
      })

    const hallConfiguration = confStepWrapper.innerHTML
    const requestBody = `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfiguration=${encodeURIComponent(
      hallConfiguration
    )}`

    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      body: requestBody,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })

    if (response.ok) {
      localStorage.setItem("selectedSeats", JSON.stringify(selectedSeats))
      selectedSeance.totalCost = totalCost
      localStorage.setItem("dataToStore", JSON.stringify(selectedSeance))

      const ticketData = {
        filmName: selectedSeance.filmName,
        hallName: selectedSeance.hallName,
        seanceTime: selectedSeance.seanceTime,
        totalCost: totalCost,
        hallConfig: hallConfiguration,
      }

      window.location.href = "payment.html"
    } else {
      console.error("Error adding ticket information to the database")
    }
  } catch (error) {
    console.error("Error:", error)
  }
})
