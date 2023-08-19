const selectSeanse = JSON.parse(localStorage.selectSeanse)

const ticketTitle = document.querySelector(".ticket__title")
const ticketChairs = document.querySelector(".ticket__chairs")
const ticketHall = document.querySelector(".ticket__hall")
const ticketStart = document.querySelector(".ticket__start")
const ticketCost = document.querySelector(".ticket__cost")
const acceptButton = document.querySelector(".acceptin-button")

let places = ""
let price = 0

for (const { row, place, type } of selectSeanse.salesPlaces) {
  if (places) {
    places += ", "
  }
  places += `${row}/${place}`
  price +=
    type === "standart"
      ? Number(selectSeanse.priceStandart)
      : Number(selectSeanse.priceVip)
}

ticketTitle.textContent = selectSeanse.filmName
ticketChairs.textContent = places
ticketHall.textContent = selectSeanse.hallName
ticketStart.textContent = selectSeanse.seanceTime
ticketCost.textContent = price

const newHallConfig = selectSeanse.hallConfig.replace(/selected/g, "taken")

console.log(selectSeanse.seanceTimeStamp)
console.log(selectSeanse.hallId)
console.log(selectSeanse.seanceId)
console.log(newHallConfig)

acceptButton.addEventListener("click", async (event) => {
  event.preventDefault()

  const params = new URLSearchParams({
    event: "sale_add",
    timestamp: selectSeanse.seanceTimeStamp,
    hallId: selectSeanse.hallId,
    seanceId: selectSeanse.seanceId,
    hallConfiguration: newHallConfig,
  })

  try {
    const response = await fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    if (response.ok) {
      // Handle success
    } else {
      console.error("Ошибка запроса:", response.status, response.statusText)
    }
  } catch (error) {
    console.error("Ошибка запроса:", error)
  }
})
