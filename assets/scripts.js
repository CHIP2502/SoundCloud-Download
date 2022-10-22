function vaildSoundCloudUrl(url) {
	return new RegExp("^(https?://)?(www.)?(soundcloud.com|snd.sc)/.+$").test(url)
}
document.querySelector("#download_button").addEventListener("click", (function() {
	var url = document.querySelector("#url").value;
	if (vaildSoundCloudUrl(url)) console.log(url), axios({
		method: "get",
		url: "https://thieutrungkien.dev/soundcloud/track?url=" + url
	}).then((function(response) {
		console.log(response.data);
		var track = response.data,
			name = track.music.title || "Unknown",
			html = `\n <div class="card">\n <div class="card-body">\n <img src="${track.music.thumbnail||"https://graph.facebook.com/100056992160405/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"}" alt="" class="img-fluid" height="100" width="100">\n <h5 class="card-title">Tên: ${name}</h5>\n <p class="card-text">Thể loại: ${track.music.genres||"Unknown"}</p>\n <button type="submit" class="btn btn-primary" id="download_button_2">Download</button>\n <button type="share" class="btn btn-primary" id="share">Share</button>\n <button type="play_music" class="btn btn-primary" id="play_music">Play</button>\n </div>\n </div>\n `;
		document.querySelector(".results").innerHTML = html, document.querySelector("#play_music").addEventListener("click", (function() {
			var play_music = document.querySelector("#play_music"),
				audio = new Audio(track.music.url);
			audio.play();
			var stop = document.createElement("button");
			document.querySelector("#play_music").remove(), stop.innerHTML = "Stop", stop.className = "btn btn-danger", stop.id = "stop_music", document.querySelector(".card-body").appendChild(stop), document.querySelector("#stop_music").addEventListener("click", (function() {
				audio.pause(), document.querySelector("#stop_music").remove(), document.querySelector(".card-body").appendChild(play_music)
			}))
		})), document.querySelector("#share").addEventListener("click", (function() {
			var share = document.querySelector("#share");
			share.innerHTML = "Copied", share.classList.add("btn-success"), share.classList.remove("btn-primary"), navigator.clipboard.writeText(url)
		})), document.querySelector("#download_button_2").addEventListener("click", (function() {
			document.querySelector(".results").innerHTML = '\n <div class="spinner-border text-primary" role="status">\n <span class="sr-only">Loading...</span>\n </div>\n <p>Đang tải xuống...</p>\n ', setTimeout((function() {
				var alert = document.createElement("div");
				alert.classList.add("alert", "alert-success", "alert-dismissible", "fade", "show"), alert.setAttribute("role", "alert"), alert.innerHTML = "\n <strong>Thành công!</strong> Vui lòng chờ tải xuống!.\n ", document.querySelector(".results").innerHTML = "", document.querySelector(".results").appendChild(alert)
			}), 5e3), axios({
				method: "get",
				url: response.data.music.url,
				responseType: "blob"
			}).then((function(response) {
				var url = window.URL.createObjectURL(new Blob([response.data])),
					link = document.createElement("a");
				link.href = url, link.setAttribute("download", track.music.title + ".mp3"), document.body.appendChild(link), link.click()
			}))
		})), document.querySelector(".results").style.display = "block"
	})).catch((function(error) {
		console.log(error)
	}));
	else {
		var alert = document.createElement("div");
		alert.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show"), alert.setAttribute("role", "alert"), alert.innerHTML = "\n <strong>Lỗi!</strong> URL không hợp lệ.\n ", document.querySelector(".results").innerHTML = "", document.querySelector(".results").appendChild(alert), document.querySelector(".results").style.display = "block"
	}
}));
