document.addEventListener("DOMContentLoaded", async function () {
  const selectedSeanceData = JSON.parse(localStorage.getItem("selectedSeance"))
  const urlParams = new URLSearchParams(window.location.search)
  const hallId = urlParams.get("hallId")
  const seanceId = urlParams.get("seanceId")
  const hallConfiguration = localStorage.getItem("hallConfiguration")

  if (selectedSeanceData) {
    const { filmName, seanceTime, hallName } = selectedSeanceData

    const filmNameElement = document.querySelector(".ticket__title")
    const hallElement = document.querySelector(".ticket__hall")
    const seanceStartElement = document.querySelector(".ticket__start")

    filmNameElement.textContent = filmName
    hallElement.textContent = hallName
    seanceStartElement.textContent = seanceTime

    // Retrieve selected seats information
    const selectedSeatsInfo = JSON.parse(
      localStorage.getItem("selectedSeatsInfo")
    )
    const selectedSeatsDetails = JSON.parse(
      localStorage.getItem("selectedSeatsDetails")
    )
    const totalCost = localStorage.getItem("totalCost")

    if (selectedSeatsInfo && selectedSeatsDetails && totalCost) {
      const seatsElement = document.querySelector(".ticket__chairs")
      const costElement = document.querySelector(".ticket__cost")

      const selectedSeatsHTML = selectedSeatsInfo
        .map((seat, index) => `<p>${selectedSeatsDetails[index]}</p>`)
        .join("")

      seatsElement.innerHTML = selectedSeatsHTML
      costElement.textContent = `${totalCost} рублей`
    }

    // Add event listener to the "Get Code" button
    const getCodeButton = document.querySelector(".acceptin-button")
    getCodeButton.addEventListener("click", async function () {
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const hallId = hallId /* get hallId from localStorage or URL */
      const seanceId = seanceId /* get seanceId from localStorage or URL */
      const hallConfiguration =
        hallConfiguration /* get hallConfiguration from the previous page */

      // Prepare the POST request data
      const postData = `event=sale_add&timestamp=${timestamp}&hallId=${hallId}&seanceId=${seanceId}&hallConfiguration=${hallConfiguration}`

      try {
        const response = await fetch("https://jscp-diplom.netoserver.ru/", {
          method: "POST",
          body: postData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        if (response.ok) {
          // Handle success, e.g., display a success message
          alert("Бронирование успешно добавлено в базу данных")
          // Optionally, clear the stored seat and cost information
          localStorage.removeItem("selectedSeatsInfo")
          localStorage.removeItem("selectedSeatsDetails")
          localStorage.removeItem("totalCost")
        } else {
          throw new Error("Error adding booking data")
        }
      } catch (error) {
        console.error("Error adding booking data:", error)
      }
    })
  }
})
