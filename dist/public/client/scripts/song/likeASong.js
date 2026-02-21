const songLikeItem = document.querySelector(".song-info .song-info-like");

if (songLikeItem) {
  songLikeItem.addEventListener("click", async () => {
    const songId = songLikeItem.getAttribute("data-id");
    const isLiked = songLikeItem.classList.contains("liked");
    const typeLike = isLiked ? "no" : "yes";
    const apiUrl = `/songs/like/${typeLike}/${songId}`;
    const fetchOptions = { method: "PATCH" };
    const res = await fetch(apiUrl, fetchOptions);
    const result = await res.json();
    const data = result.data;
    const songLikeNumber = document.querySelector(".song-like-number");

    songLikeNumber.innerHTML = data.like;
    songLikeItem.classList.toggle("liked");
  });
}
