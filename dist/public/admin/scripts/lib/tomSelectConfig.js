const tomSelectList = document.querySelectorAll("select[tom-select]");

if (tomSelectList && tomSelectList.length > 0) {
  tomSelectList.forEach((select) => {
    new TomSelect(select, {
      maxItems: 10,
    });
  });
}
