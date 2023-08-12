document.addEventListener("DOMContentLoaded", function () {
  try {
    const selectedSeance = JSON.parse(localStorage.getItem("selectedSeance"))
    const {
      timestamp,
      hallId,
      seanceId,
      hallName,
      filmName,
      hallConfig,
      seanceTime,
      hallRaw,
      hallSeatPrice,
      hallVIPPrice,
      hallStandardPrice,
    } = selectedSeance

    document.querySelector(".buying__info-title").textContent = filmName
    document.querySelector(".buying__info-start").textContent = seanceTime
    document.querySelector(".buying__info-hall").textContent = hallName

    const confStepWrapper = document.querySelector(".conf-step__wrapper")
    confStepWrapper.innerHTML = hallConfig
    const hallWrapper = document.querySelector(".conf-step__wrapper")
    const selectedSeats = []
    const hallPlaces = parseInt(hallRaw)

    const seatPrices = {
      "conf-step__chair_standart": parseInt(hallSeatPrice),
      "conf-step__chair_vip": parseInt(hallVIPPrice),
    }

    let totalCost = 0

    hallWrapper.querySelectorAll(".conf-step__chair").forEach((seat, index) => {
      if (
        !seat.classList.contains("conf-step__chair_taken") &&
        !seat.classList.contains("conf-step__chair_disabled")
      ) {
        seat.addEventListener("click", function () {
          seat.classList.toggle("conf-step__chair_selected")

          const seatNumber = index + 1
          const rowIndex = Math.floor((seatNumber - 1) / hallPlaces) + 1
          const seatIndex = ((seatNumber - 1) % hallPlaces) + 1

          console.log(`Clicked on Seat: Row ${rowIndex}, Seat ${seatIndex}`)

          const seatPriceClass = Array.from(seat.classList).find(
            (className) => className in seatPrices
          )
          const seatPrice = seatPriceClass ? seatPrices[seatPriceClass] : 0

          const seatIndexInArray = selectedSeats.indexOf(
            `${rowIndex}/${seatIndex}`
          )
          if (seatIndexInArray !== -1) {
            selectedSeats.splice(seatIndexInArray, 1)
            totalCost -= seatPrice
          } else {
            selectedSeats.push(`${rowIndex}/${seatIndex}`)
            totalCost += seatPrice
          }

          console.log(`Total Cost: ${totalCost} р`)
        })
      }
    })

    const bookingButton = document.querySelector(".acceptin-button")
    bookingButton.addEventListener("click", async function () {
      const selectedRows = selectedSeats.map(
        (seatNumber) => Math.floor((seatNumber - 1) / hallPlaces) + 1
      )
      const selectedSeatNumbers = selectedSeats.map(
        (seatNumber) => ((seatNumber - 1) % hallPlaces) + 1
      )

      const hallConfiguration = encodeURIComponent(confStepWrapper.innerHTML)
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
          const bookingData = {
            filmName,
            hallName,
            selectedSeats,
            seanceTime,
            totalCost,
            seanceId,
            hallConfig: hallConfiguration,
          }

          localStorage.setItem("bookingData", JSON.stringify(bookingData))

          window.location.href = "payment.html"
        } else {
          console.error("Error updating hall_config")
        }
      } catch (error) {
        console.error("An error occurred:", error)
      }
    })
  } catch (error) {
    console.error("Error:", error)
  }
})
