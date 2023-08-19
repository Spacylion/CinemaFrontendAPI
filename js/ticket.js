function generateTicket() {
  const selectSeanse = JSON.parse(localStorage.selectSeanse)

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

  const ticketTitle = document.querySelector(".ticket__title")
  const ticketChairs = document.querySelector(".ticket__chairs")
  const ticketHall = document.querySelector(".ticket__hall")
  const ticketStart = document.querySelector(".ticket__start")
  const ticketQRInfo = document.querySelector(".ticket__info-qr")

  ticketTitle.textContent = selectSeanse.filmName
  ticketChairs.textContent = places
  ticketHall.textContent = selectSeanse.hallName
  ticketStart.textContent = selectSeanse.seanceTime

  const date = new Date(Number(`${selectSeanse.seanceTimeStamp}000`))
  const formattedDate = date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  const textQR = `Фильм: ${selectSeanse.filmName} Зал: ${selectSeanse.hallName} Ряд/Место ${places} Дата: ${formattedDate} Начало сеанса: ${selectSeanse.seanceTime} Билет действителен строго на свой сеанс`

  const qrcode = QRCreator(textQR, { image: "SVG" })
  qrcode.download()
  ticketQRInfo.append(qrcode.result)
}
