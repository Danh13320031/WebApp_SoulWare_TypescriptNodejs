const songFavoriteItem = document.querySelector(
  ".song-info .song-info-favorite",
);

if (songFavoriteItem) {
  songFavoriteItem.addEventListener("click", async () => {
    const songId = songFavoriteItem.dataset.id;
    const isFavorited = songFavoriteItem.classList.contains("favorited");
    const type = isFavorited ? "no" : "yes";
    const apiUrl = `/songs/favorite/${type}/${songId}`;
    const fetchOptions = { method: "PATCH" };
    const res = await fetch(apiUrl, fetchOptions);
    const result = await res.json();

    result.code === 200 ? songFavoriteItem.classList.toggle("favorited") : null;
  });
}
