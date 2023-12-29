document.addEventListener("DOMContentLoaded", () => {
  var table = document
    .getElementById("dataTable")
    .getElementsByTagName("tbody")[0];
  let events = JSON.parse(localStorage.getItem("events")) || [];

  function validateForm() {
    var eventName = document.getElementById("naslov").value;
    var eventDescription = document.getElementById("opis").value;
    var eventDate = document.getElementById("datum").value;
    var eventTime = document.getElementById("cas").value;

    var error = false;

    if (eventName == "") {
      document.getElementsByClassName("error")[0].style.display = "inline";
      document.getElementsByClassName("error")[0].innerHTML =
        "To polje ne sme biti prazno!";
      error = true;
    } else {
      document.getElementsByClassName("error")[0].style.display = "none";
    }

    if (eventDescription == "") {
      document.getElementsByClassName("error")[1].style.display = "inline";
      document.getElementsByClassName("error")[1].innerHTML =
        "To polje ne sme biti prazno!";
      error = true;
    } else {
      document.getElementsByClassName("error")[1].style.display = "none";
    }

    yearDate = Number(eventDate.slice(0, 4));

    if (yearDate < 1900 || yearDate > 2100) {
      document.getElementsByClassName("error")[2].style.display = "inline";
      document.getElementsByClassName("error")[2].innerHTML =
        "Prosim vstavi ustrezen datum!";
      error = true;
    } else {
      document.getElementsByClassName("error")[2].style.display = "none";
    }

    if (eventTime == "") {
      document.getElementsByClassName("error")[3].style.display = "inline";
      document.getElementsByClassName("error")[3].innerHTML =
        "Prosim vstavi ustrezen čas!";
      error = true;
    } else {
      document.getElementsByClassName("error")[3].style.display = "none";
    }

    // when all fields are correct it can add to the table
    if (!error) {
      document.getElementsByClassName("error")[0].style.display = "none";
      document.getElementsByClassName("error")[1].style.display = "none";
      document.getElementsByClassName("error")[2].style.display = "none";
      document.getElementsByClassName("error")[3].style.display = "none";
      addEvent(eventName, eventDescription, eventDate, eventTime);
    }
  }

  function addEvent(eventName, eventDescription, eventDate, eventTime) {
    var table = document
      .getElementById("dataTable")
      .getElementsByTagName("tbody")[0];

    let events = JSON.parse(localStorage.getItem("events")) || [];

    // get random ID and from that also the color which is in hsl format and choosen lighter version
    function getRandomIdColor() {
      var uniqueId = Math.random() * 360;
      var color = "hsl(" + uniqueId + ", 100%, 93%)";
      var uniqueIdString = String(uniqueId).replace(".", "").slice(0, 7);

      // add a character to uniqueIdString to have a posibillity to extract color from ID
      if (uniqueId < 10) {
        uniqueIdString = uniqueIdString + "l";
      } else if (10 <= uniqueId && uniqueId < 100) {
        uniqueIdString = uniqueIdString + "e";
      } else if (uniqueId >= 100) {
        uniqueIdString = uniqueIdString + "i";
      }

      return { backgroundColor: color, ID: uniqueIdString };
    }

    var idColor = getRandomIdColor();

    const newEvent = {
      ID: idColor.ID,
      title: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      color: idColor.backgroundColor,
    };

    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents(table, events);
    document.getElementById("form").reset();
  }

  // sorting function
  function sortTableString(n) {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;

    table = document.getElementById("dataTable");
    var columns = table.rows[0].getElementsByTagName("th");

    // loop through headers and set aria-hidden to true so that all span elements firstly get hidden in all headers before showing the desired one
    for (let i = 0; i < columns.length; i++) {
      var columnHeader = document.querySelector(`th:nth-child(${i + 1})`);

      columnHeader.setAttribute("aria-sort", "");
      columnHeader.setAttribute("aria-hidden", "true");
    }

    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    /* Make a loop that will continue until
  no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;

      /* Loop through all table rows (except the
    first, which contains table headers): */
      for (i = 1; i < rows.length - 1; i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
      one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }

    var columnHeader = document.querySelector(`th:nth-child(${n + 1})`);

    // set aria-sort and aria-hidden for span element
    console.log("dir", dir);
    if (dir === "asc") {
      console.log("ascending");
      columnHeader.setAttribute("aria-sort", "ascending");
      columnHeader.setAttribute("aria-hidden", "false");
    } else if (dir === "desc") {
      console.log("descending");
      columnHeader.setAttribute("aria-sort", "descending");
      columnHeader.setAttribute("aria-hidden", "false");
    }
  }

  // remove row
  window.removeRow = (index) => {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    displayEvents(table, events);
  };

  // on click submit form it firstly goes through validation function
  document.getElementById("submit").onclick = function () {
    validateForm();
  };

  // calling sorting functions by column numbers
  document.getElementById("buttonSortName").onclick = function () {
    sortTableString(1);
  };

  document.getElementById("buttonSortDescription").onclick = function () {
    sortTableString(2);
  };

  document.getElementById("buttonSortDate").onclick = function () {
    sortTableString(3);
  };

  document.getElementById("buttonSortTime").onclick = function () {
    sortTableString(4);
  };

  displayEvents(table, events);
});

function displayEvents(table, events) {
  // remove visual table
  table.innerHTML = "";
  events.forEach((event, index) => {
    // create table row
    var newRow = table.insertRow(table.rows.length);

    // create table cells
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    var cell5 = newRow.insertCell(4);
    var cell6 = newRow.insertCell(5);

    var removeButton = `<button class="removeButton" onclick="removeRow(${index})">Odstrani</button>`;

    newRow.style.backgroundColor = event.color;

    // add values to separate table cells
    cell1.innerHTML = event.ID;
    cell1.style.textAlign = "center";
    cell2.style.overflow = "hidden";
    cell2.style.textOverflow = "ellipsis";
    cell2.style.whiteSpace = "nowrap";
    cell2.style.maxWidth = "10vw";
    cell2.style.position = "relative";
    cell2.innerHTML = event.title;

    cell3.style.overflow = "hidden";
    cell3.style.textOverflow = "ellipsis";
    cell3.style.whiteSpace = "nowrap";
    cell3.style.maxWidth = "20vh";
    cell3.style.position = "relative";
    cell3.innerHTML = event.description;
    cell4.innerHTML = event.date;
    cell4.style.textAlign = "center";
    cell5.innerHTML = event.time;
    cell5.style.textAlign = "center";
    cell6.innerHTML = removeButton;
    cell6.style.textAlign = "center";
  });
}

function logSelectedValue() {
  var table = document
    .getElementById("dataTable")
    .getElementsByTagName("tbody")[0];
  let events = JSON.parse(localStorage.getItem("events")) || [];

  var selectElement = document.getElementById("selectEvents");
  var selectedValue = selectElement.value;

  const today = new Date();
  var isoDate = today.toISOString();
  var date = isoDate.slice(0, 10);

  function filterEvents(predicate) {
    const filteredEvents = events.filter(predicate);

    return filteredEvents;
  }

  switch (selectedValue) {
    case "Vsi dogodki":
      displayEvents(table, events);
      break;
    case "Današnji dogodki":
      const todaysEvents = filterEvents((event) => event.date == date);
      displayEvents(table, todaysEvents);
      break;
    case "Prihajajoči dogodki":
      const nextEvents = filterEvents((event) => event.date > date);
      displayEvents(table, nextEvents);
      break;
    case "Pretekli dogodki":
      const previousEvents = filterEvents((event) => event.date < date);
      displayEvents(table, previousEvents);
      break;
  }
}
