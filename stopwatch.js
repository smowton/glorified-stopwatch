
var grid;
var data = [];
var dataView = new Slick.Data.DataView();
dataView.setItems(data);

window.addEventListener('beforeunload', function (e) {
  // Cancel the event
  e.preventDefault();
  // Chrome requires returnValue to be set
  e.returnValue = '';
});

dataView.onRowCountChanged.subscribe(function (e, args) {
  grid.updateRowCount();
  grid.scrollRowIntoView(dataView.length - 1);
  grid.render();
});

dataView.onRowsChanged.subscribe(function (e, args) {
  grid.invalidateRows(args.rows);
  grid.render();
});

var columns = [
  {id: "competitor", name: "Competitor", field: "competitor", width: 120, cssClass: "cell-competitor", editor: Slick.Editors.Text},
  {id: "time", name: "Time", field: "time", width: 120, editor: Slick.Editors.Text},
  {id: "notes", name: "Notes", field: "notes", width: 200, editor: Slick.Editors.Text},
];
var options = {
  editable: true,
  enableCellNavigation: true,
  asyncEditorLoading: false,
  autoEdit: false
};

$(function () {
  grid = new Slick.Grid("#myGrid", dataView, columns, options);
  grid.setSelectionModel(new Slick.CellSelectionModel());

  grid.onAddNewRow.subscribe(function (e, args) {
    var item = args.item;
    grid.invalidateRow(data.length);
    data.push(item);
    grid.updateRowCount();
    grid.render();
  });

  grid.onFocusSetAfterEdit.subscribe(function(e, args) {
    // Reset focus to data entry after any editing operation:
    competitorForm.competitorId.focus();
  });

  competitorForm.competitorId.addEventListener("keypress", function(event) {
    if (event.which == '13') {
      event.preventDefault();
      recordTime();
    }
  });

  competitorForm.competitorId.focus();
})

var freshId = 0;

function record(text) {
  dataView.addItem({
    "id": freshId++,
    "competitor": competitorForm.competitorId.value,
    "time": text,
    "notes": ""
  });

  nextCompetitor();
  grid.scrollRowIntoView(data.length);
}

function pad(s) {
    return ("" + s).padStart(2, "0");
}

function getTime() {
  const now = new Date();
  return pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
}

function recordTime() {
  record(getTime());
}

function recordRetired() {
  record("Rtd");
}

function recordDNS() {
  record("DNS");
}

function recordDisqualified() {
  record("Dsq");
}

function nextCompetitor() {
  competitorForm.competitorId.value = "";
  competitorForm.competitorId.focus();
}

function escapeCSVCell(cell) {
  return '"' + cell.replace(new RegExp('"', 'g'), '""') + '"';
}

function rowToCSV(row) {
  return escapeCSVCell(row.competitor) + "," + escapeCSVCell(row.time) + "," + escapeCSVCell(row.notes);
}

function downloadCSV() {
  let csv = "Competitor,Finish Time,Notes\n";
  for(let i = 0; i < dataView.getLength(); ++i) {
    csv += (rowToCSV(dataView.getItem(i)) + "\n");
  }

  download(csv, "results.csv", "text/csv");
}

