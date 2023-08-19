const createRequest = async (options = {}) => {
  try {
    const response = await fetch(options.url, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: options.params,
    })

    if (!response.ok) {
      throw new Error(
        `Ошибка ответа: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()

    for (const key in data) {
      if (data[key].err) {
        throw new Error(
          `Ошибка запроса ${data[key].err}: ${data[key].errMessage}`
        )
      }
    }

    options.callback(data)
  } catch (error) {
    alert(`Ошибка: ${error.message}`)
  }
}
