const favoriteSongList = document.querySelectorAll(
  ".favorite-song-info .favorite-song-favorite",
);

if (favoriteSongList) {
  favoriteSongList.forEach((favoriteSongItem) => {
    favoriteSongItem.addEventListener("click", async () => {
      const songId = favoriteSongItem.dataset.id;
      const isFavorited = favoriteSongItem.classList.contains("favorited");
      const typeFavorite = isFavorited ? "no" : "yes";
      const apiUrl = `/songs/favorite/${typeFavorite}/${songId}`;
      const fetchOptions = { method: "PATCH" };
      const res = await fetch(apiUrl, fetchOptions);
      const result = await res.json();

      result.code === 200
        ? favoriteSongItem.classList.toggle("favorited")
        : null;
    });
  });
}
