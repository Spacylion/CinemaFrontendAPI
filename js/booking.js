document.addEventListener("DOMContentLoaded", () => {
  const selectSeanse = JSON.parse(localStorage.selectSeanse)
  console.log(selectSeanse)

  const buttonAcceptin = document.querySelector(".acceptin-button")
  const buyingInfoTitle = document.querySelector(".buying__info-title")
  const buyingInfoStart = document.querySelector(".buying__info-start")
  const buyingInfoHall = document.querySelector(".buying__info-hall")
  const priceStandart = document.querySelector(".price-standart")
  const confStepWrapper = document.querySelector(".conf-step__wrapper")

  const updateButtonState = () => {
    const chairsSelected = document.querySelectorAll(
      ".conf-step__row .conf-step__chair_selected"
    )
    buttonAcceptin.disabled = chairsSelected.length === 0
  }

  const handleChairClick = (event) => {
    if (event.target.classList.contains("conf-step__chair_taken")) {
      return
    }
    event.target.classList.toggle("conf-step__chair_selected")
    updateButtonState()
  }

  buyingInfoTitle.textContent = selectSeanse.filmName
  buyingInfoStart.textContent = `Начало сеанса ${selectSeanse.seanceTime}`
  buyingInfoHall.textContent = selectSeanse.hallName
  priceStandart.textContent = selectSeanse.priceStandart

  const params = new URLSearchParams({
    event: "get_hallConfig",
    timestamp: selectSeanse.seanceTimeStamp,
    hallId: selectSeanse.hallId,
    seanceId: selectSeanse.seanceId,
  })

  fetch("https://jscp-diplom.netoserver.ru/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })
    .then((response) => response.json())
    .then((resp) => {
      if (resp) {
        selectSeanse.hallConfig = resp
      }
      confStepWrapper.innerHTML = selectSeanse.hallConfig
      const chairs = document.querySelectorAll(
        ".conf-step__row .conf-step__chair"
      )
      chairs.forEach((chair) => {
        chair.addEventListener("click", handleChairClick)
      })
      updateButtonState()
    })
    .catch((error) => {
      console.error("Ошибка запроса:", error)
    })

  buttonAcceptin.addEventListener("click", (event) => {
    event.preventDefault()

    const selectedPlaces = []
    const divRows = Array.from(
      document.getElementsByClassName("conf-step__row")
    )

    for (let i = 0; i < divRows.length; i++) {
      const spanPlaces = Array.from(
        divRows[i].getElementsByClassName("conf-step__chair")
      )

      for (let j = 0; j < spanPlaces.length; j++) {
        if (spanPlaces[j].classList.contains("conf-step__chair_selected")) {
          const typePlace = spanPlaces[j].classList.contains(
            "conf-step__chair_standart"
          )
            ? "standart"
            : "vip"

          selectedPlaces.push({
            row: i + 1,
            place: j + 1,
            type: typePlace,
          })
        }
      }
    }

    selectSeanse.hallConfig = confStepWrapper.innerHTML
    selectSeanse.salesPlaces = selectedPlaces
    localStorage.clear()
    localStorage.setItem("selectSeanse", JSON.stringify(selectSeanse))
    const link = document.createElement("a")
    link.href = "payment.html"
    link.click()
  })
})
