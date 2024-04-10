var imglist_Url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=ca370d51a054836007519a00ff4ce59e&per_page=10&format=json&nojsoncallback=1';

var imgSizes_Url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca370d51a054836007519a00ff4ce59e&format=json&nojsoncallback=1';

function getimg() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imglist_Url, true);
    xhr.send();
    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        var photos = data.photos.photo;
        add_new_img(photos);
    }
}

function add_new_img(photos) {
    var gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; 
    
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        var photoId = photo.id;
        var photoSizesUrl = imgSizes_Url + '&photo_id=' + photoId;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', photoSizesUrl, true);
        xhr.send();
        xhr.onload = function() {
            var sizesData = JSON.parse(this.responseText);

           
            var mediumPhotoUrl;
            sizesData.sizes.size.forEach(function(size) {
                if (size.label === 'Medium') {
                    mediumPhotoUrl = size.source;
                }
            });

            var img = document.createElement("img");
            img.setAttribute("src", mediumPhotoUrl);
            gallery.appendChild(img);
        }
    }
}