document.addEventListener("DOMContentLoaded", function () {
  const daysContainer = document.querySelector(".page-nav")
  const filmsContainer = document.querySelector(".movie")
  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]

  function updateScheduleForDate(dateElement, selectedDate) {
    const chosenDay = document.querySelector(".page-nav__day_chosen")
    if (chosenDay) chosenDay.classList.remove("page-nav__day_chosen")
    dateElement.classList.add("page-nav__day_chosen")

    fetchAndProcessData(selectedDate)
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
        const films = data.films.result
        const seances = data.seances.result
        const halls = data.halls.result.filter((hall) => hall.hall_open === "1")

        films.forEach((film) => {
          const filmElement = document.createElement("section")
          filmElement.className = "movie"
          const seancesForFilm = seances.filter(
            (seance) => seance.seance_filmid === film.film_id
          )
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
              seanceTimeElement.className = "movie__seance-time"
              seanceTimeElement.textContent = seance.seance_time

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
            const seancesForHallAndFilm = seancesForFilm.filter(
              (seance) => seance.seance_hallid === hall.hall_id
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
                      hallConfig: hall.hall_config,
                      hallId: seance.seance_hallid,
                      hallName: hall.hall_name,
                      hallRaw: hall.hall_rows,
                      hallSeatPrice: hall.hall_price_standart,
                      hallVIPPrice: hall.hall_price_vip,
                      hall_places: hall.hall_places,
                      seanceId: seance.seance_id,
                      seanceTime: seance.seance_time,
                      timestamp: Math.floor(seanceStartTime / 1000),
                    }

                    localStorage.setItem(
                      "dataToStore",
                      JSON.stringify(dataToStore)
                    )

                    const url = `hall.html`
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
    const today = new Date()
    const currentDay = new Date(today)
    currentDay.setDate(today.getDate() + i)

    const dayIndex = currentDay.getDay()
    const dayName = daysOfWeek[dayIndex]
    const dayNumber = currentDay.getDate()
    const isActive = currentDay.toDateString() === today.toDateString()
    const isWeekend = dayIndex === 0 || dayIndex === 6

    const dayElement = document.createElement("a")
    dayElement.classList.add("page-nav__day")
    dayElement.dataset.date = currentDay.toDateString()

    if (isActive) {
      dayElement.classList.add("page-nav__day_active", "page-nav__day_chosen")
      updateScheduleForDate(dayElement, currentDay)
    }
    if (isWeekend) dayElement.classList.add("page-nav__day_weekend")

    dayElement.innerHTML = `
      <span class="page-nav__day-week">${isActive ? "Сегодня" : dayName}</span>
      <span class="page-nav__day-number">${dayName} ${dayNumber}</span>
    `

    dayElement.addEventListener("click", () =>
      updateScheduleForDate(dayElement, currentDay)
    )

    daysContainer.appendChild(dayElement)
  }
})
