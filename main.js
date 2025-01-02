let totalNumberOfPages = 0;
let audioPlayer = document.getElementById('audioPlayer');
let audioSource = document.getElementById('audioSource');

$(document).ready(function(){
  const source = new EventSource("/pdf-to-img");
  source.addEventListener("generatedpages", function(event){
    $("#pageNumber").html(event.data);
  });
  source.addEventListener("totalpages", function(event){
    totalNumberOfPages = parseInt(event.data);
    source.close();
    generatePages();
  });
});

function generatePages() {
  $("#message").css("display", "none");
  for (let i = 1; i <= totalNumberOfPages; i++) {
    $('#flipbook').append(`
      <div class="page" data-audio="audio/page${i}.mp3" style="background-image:url(http://localhost:3000/images/page${i}.png);">
      </div>
    `);
  }

  $("#flipbook").turn({
    display: "double",
    acceleration: true,
    // Ao mudar de página, trocar o áudio
    when: {
      turned: function(event, page) {
        changeAudio(page);
      }
    }
  });
}

// Função para trocar o áudio
function changeAudio(page) {
  let audioFile = `audio/page${page}.mp3`; // Caminho do áudio baseado no número da página
  audioSource.src = audioFile;

  // Recarregar e tocar o áudio
  audioPlayer.load();
  audioPlayer.play();
}

$(window).bind("keydown", function(e) {
  if (e.keyCode == 37) {
    $("#flipbook").turn("previous");
  } else if (e.keyCode == 39) {
    $("#flipbook").turn("next");
  }
});
