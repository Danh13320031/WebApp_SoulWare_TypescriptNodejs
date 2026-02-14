const headerSearchBox = document.querySelector(".header-search-box");

if (headerSearchBox) {
  const headerSearchInput = headerSearchBox.querySelector(
    ".header-search-input",
  );

  if (headerSearchInput) {
    const headerSearchResult = headerSearchBox.querySelector(
      ".header-search-result",
    );

    headerSearchInput.addEventListener("input", async (e) => {
      const inputValue = e.target.value;
      const apiUrl = `/search/suggest?keyword=${inputValue}`;
      const fetchOptions = { method: "GET" };

      const res = await fetch(apiUrl, fetchOptions);
      const result = await res.json();

      const searchResultList = result.data;
      if (searchResultList.length > 0) {
        headerSearchResult.classList.add("show");

        const haederSearchItemHtmlList = searchResultList.map(
          (headerSearchItem) => {
            return `
          <li
            class="d-flex align-items-center gap-2 p-1 w-100 rounded-2 header-search-item"
          >
            <div class="rounded-1 overflow-hidden header-search-img-box">
              <a href="/songs/detail/${headerSearchItem.slug}" class="header-search-link">
                <img
                  src="${headerSearchItem.avatar}"
                  alt="${headerSearchItem.title}"
                  width="50px"
                  class="header-search-img"
                />
              </a>
            </div>
            <div class="d-flex flex-column header-search-info">
              <a
                class="text-decoration-none header-search-title"
                style="
                  color: var(--primary-color);
                  font-weight: var(--font-weight-semibold);
                  font-size: var(--font-size-md);
                "
                href="/songs/detail/${headerSearchItem.slug}"
                >${headerSearchItem.title}</a
              >
              <div
                class="d-flex gap-3 align-items-center header-search-meta"
              >
                <a href="/singers/${headerSearchItem.singerId.slug}" class="text-decoration-none header-search-singer"
                  ><i class="fa-solid fa-microphone-lines me-1"></i>${headerSearchItem.singerId.stageName}</a
                >
                <a href="/songs/${headerSearchItem.topicId.slug}" class="text-decoration-none header-search-topic"
                  ><i class="fa-solid fa-icons me-1"></i>${headerSearchItem.topicId.title}</a
                >
              </div>
            </div>
          </li>
          `;
          },
        );

        headerSearchResult.innerHTML = haederSearchItemHtmlList.join("");
      } else {
        headerSearchResult.classList.remove("show");
      }
    });
  }
}
