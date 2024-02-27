function asDateString(date) {
    return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
      .toString(10)
      .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
  }

  const date = '2024-02-06'
  console.log(asDateString(date))