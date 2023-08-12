document.addEventListener("DOMContentLoaded", function () {
  const daysContainer = document.querySelector(".page-nav")
  const filmsContainer = document.querySelector(".movie")
  const selectedDateKey = "selectedDate"
  const bookingData = JSON.parse(localStorage.getItem("bookingData"))

  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
  const today = new Date()
  let currentDay = new Date(today)
  currentDay.setDate(today.getDate())

  function updateScheduleForDate(dateElement) {
    const chosenDay = document.querySelector(".page-nav__day_chosen")
    if (chosenDay) {
      chosenDay.classList.remove("page-nav__day_chosen")
    }
    dateElement.classList.add("page-nav__day_chosen")
    const selectedDate = new Date(dateElement.dataset.date)
    localStorage.setItem(selectedDateKey, selectedDate.getTime())
    fetchAndProcessData(selectedDate)
  }

  function createDayElement(dayName, dayNumber, isActive, isWeekend) {
    const dayElement = document.createElement("a")
    dayElement.classList.add("page-nav__day")

    const dayIndex = currentDay.getDay()
    const dayDateString = currentDay.toDateString()

    dayElement.dataset.date = dayDateString

    if (isActive) {
      dayElement.classList.add("page-nav__day_active")
      dayElement.classList.add("page-nav__day_chosen")
    }

    if (isWeekend) {
      dayElement.classList.add("page-nav__day_weekend")
    }

    dayElement.innerHTML = isActive
      ? `<span class="page-nav__day-number">Сегодня,</span>`
      : `<span class="page-nav__day-week">${dayName}</span>`

    dayElement.innerHTML += `<span class="page-nav__day-number">${dayName} ${dayNumber}</span>`

    dayElement.addEventListener("click", () =>
      updateScheduleForDate(dayElement)
    )

    return dayElement
  }

  function fetchAndProcessData(selectedDate) {
    fetch("https://jscp-diplom.netoserver.ru/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `event=update`,
    })
      .then((response) => response.json())
      .then((data) => {
        filmsContainer.innerHTML = ""
        localStorage.setItem("apiResponseData", JSON.stringify(data))

        const currentTime = new Date().getTime()

        filmsContainer.innerHTML = ""
        const films = data.films.result
        const seances = data.seances.result
        const halls = data.halls.result.filter((hall) => hall.hall_open === "1")

        films.forEach((film) => {
          const filmElement = document.createElement("section")
          filmElement.classList.add("movie")

          const movieInfoElement = document.createElement("div")
          movieInfoElement.classList.add("movie__info")

          const moviePosterElement = document.createElement("div")
          moviePosterElement.classList.add("movie__poster")

          const filmPosterElement = document.createElement("img")
          filmPosterElement.src = film.film_poster
          filmPosterElement.alt = film.film_name
          filmPosterElement.classList.add("movie__poster-image")

          const movieDescriptionElement = document.createElement("div")
          movieDescriptionElement.classList.add("movie__description")

          const movieTitleElement = document.createElement("h2")
          movieTitleElement.classList.add("movie__title")
          movieTitleElement.textContent = film.film_name

          const seanceListElement = document.createElement("ul")
          seanceListElement.classList.add("movie__seance-list")

          seances.forEach((seance) => {
            if (seance.seance_filmid === film.film_id) {
              const seanceTimeElement = document.createElement("li")
              seanceTimeElement.classList.add("movie__seance-time")
              seanceTimeElement.textContent = seance.seance_time

              const [hours, minutes] = seance.seance_time.split(":")
              const seanceStartTime = new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate(),
                hours,
                minutes
              ).getTime()

              if (currentTime >= seanceStartTime) {
                seanceTimeElement.style.backgroundColor = "#ccc"
                seanceTimeElement.style.color = "#666"
                seanceTimeElement.style.cursor = "not-allowed"
                seanceTimeElement.style.pointerEvents = "none"
              } else {
                seanceTimeElement.addEventListener("click", () => {
                  const selectedSeanceData = {
                    filmName: film.film_name,
                    seanceTime: seance.seance_time,
                    hallId: seance.seance_hallid,
                    seanceId: seance.seance_id,
                  }

                  localStorage.setItem(
                    "selectedSeance",
                    JSON.stringify(selectedSeanceData)
                  )

                  window.location.href = `hall.html?timestamp=${seanceStartTime}&hallId=${seance.seance_hallid}&seanceId=${seance.seance_id}`
                })
              }

              seanceListElement.appendChild(seanceTimeElement)
            }
          })

          const movieSynopsisElement = document.createElement("p")
          movieSynopsisElement.classList.add("movie__synopsis")
          movieSynopsisElement.textContent = film.film_description

          const movieDataElement = document.createElement("p")
          movieDataElement.classList.add("movie__data")

          const movieDurationElement = document.createElement("span")
          movieDurationElement.classList.add("movie__data-duration")
          movieDurationElement.textContent = `${film.film_duration} минут`

          const movieOriginElement = document.createElement("span")
          movieOriginElement.classList.add("movie__data-origin")
          movieOriginElement.textContent = film.film_origin

          movieDescriptionElement.appendChild(movieTitleElement)
          movieDescriptionElement.appendChild(movieSynopsisElement)
          movieDataElement.appendChild(movieDurationElement)
          movieDataElement.appendChild(movieOriginElement)
          movieDescriptionElement.appendChild(movieDataElement)

          moviePosterElement.appendChild(filmPosterElement)
          movieInfoElement.appendChild(moviePosterElement)
          movieInfoElement.appendChild(movieDescriptionElement)

          filmElement.appendChild(movieInfoElement)

          halls.forEach((hall) => {
            const seancesForHallAndFilm = seances.filter(
              (seance) =>
                seance.seance_hallid === hall.hall_id &&
                seance.seance_filmid === film.film_id
            )

            if (seancesForHallAndFilm.length > 0) {
              const seancesHallElement = document.createElement("div")
              seancesHallElement.classList.add("movie-seances__hall")

              const hallTitleElement = document.createElement("h3")
              hallTitleElement.classList.add("movie-seances__hall-title")
              hallTitleElement.textContent = hall.hall_name

              const seancesListElement = document.createElement("ul")
              seancesListElement.classList.add("movie-seances__list")

              seancesForHallAndFilm.forEach((seance) => {
                const seanceTimeBlockElement = document.createElement("li")
                seanceTimeBlockElement.classList.add(
                  "movie-seances__time-block"
                )

                const seanceTimeLinkElement = document.createElement("a")
                seanceTimeLinkElement.classList.add("movie-seances__time")
                seanceTimeLinkElement.textContent = seance.seance_time

                const [hours, minutes] = seance.seance_time.split(":")
                const seanceStartTime = new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
                  hours,
                  minutes
                ).getTime()

                if (currentTime >= seanceStartTime) {
                  seanceTimeLinkElement.style.backgroundColor = "#ccc"
                  seanceTimeLinkElement.style.color = "#666"
                  seanceTimeLinkElement.style.cursor = "not-allowed"
                  seanceTimeLinkElement.style.pointerEvents = "none"
                } else {
                  seanceTimeLinkElement.addEventListener("click", () => {
                    const dataToStore = {
                      filmName: film.film_name,
                      seanceTime: seance.seance_time,
                      hallName: hall.hall_name,
                      hallConfig: hall.hall_config,
                      hallVIPPrice: hall.hall_price_vip,
                      hallSeatPrice: hall.hall_price_standart,
                      hallRaw: hall.hall_rows,
                      hall_places: hall.hall_places,
                      timestamp: seanceStartTime,
                      hallId: seance.seance_hallid,
                      seanceId: seance.seance_id,
                    }

                    localStorage.setItem(
                      "selectedSeance",
                      JSON.stringify(dataToStore)
                    )

                    const url = `hall.html?timestamp=${seanceStartTime}&hallId=${seance.seance_hallid}&seanceId=${seance.seance_id}`
                    window.location.href = url
                  })
                }

                seanceTimeBlockElement.appendChild(seanceTimeLinkElement)
                seancesListElement.appendChild(seanceTimeBlockElement)
              })

              seancesHallElement.appendChild(hallTitleElement)
              seancesHallElement.appendChild(seancesListElement)
              filmElement.appendChild(seancesHallElement)
            }
          })

          filmsContainer.appendChild(filmElement)
        })
      })
      .catch((error) => {
        console.error("Error fetching data:", error)
      })
  }

  for (let i = 0; i < 6; i++) {
    const dayIndex = currentDay.getDay()
    const dayName = daysOfWeek[dayIndex]
    const dayNumber = currentDay.getDate()
    const isActive = currentDay.toDateString() === today.toDateString()
    const isWeekend = dayIndex === 0 || dayIndex === 6

    const dayElement = createDayElement(dayName, dayNumber, isActive, isWeekend)
    daysContainer.appendChild(dayElement)

    currentDay.setDate(currentDay.getDate() + 1)
  }

  fetchAndProcessData(today)
})
