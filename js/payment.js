document.addEventListener("DOMContentLoaded", function () {
  const selectedSeanceData = JSON.parse(localStorage.getItem("selectedSeance"))
  const selectedSeatsInfo = JSON.parse(
    localStorage.getItem("selectedSeatsInfo")
  )
  const totalCost = localStorage.getItem("totalCost")

  if (selectedSeanceData && selectedSeatsInfo && totalCost) {
    const { filmName, seanceTime, hallName } = selectedSeanceData

    const filmNameElement = document.querySelector(".ticket__title")
    const seatsElement = document.querySelector(".ticket__chairs")
    const hallElement = document.querySelector(".ticket__hall")
    const seanceStartElement = document.querySelector(".ticket__start")
    const costElement = document.querySelector(".ticket__cost")

    const selectedSeatsHTML = selectedSeatsInfo
      .map(
        (seat, index) => `
        <p>Место ${index + 1}: ${seat.type} (${seat.price} руб)</p>
      `
      )
      .join("")

    filmNameElement.textContent = filmName
    seatsElement.innerHTML = selectedSeatsHTML
    hallElement.textContent = hallName
    seanceStartElement.textContent = seanceTime
    costElement.textContent = `${totalCost} рублей`
  }
})
