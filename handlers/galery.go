package handlers

import (
	"io"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"galery/helpers"
)

func GetPhotos(w http.ResponseWriter, r *http.Request) {
	files, err := os.ReadDir("./uploads") 
	if err != nil {
		helpers.WriteJSON(w, 500, map[string]any{"status": "error", "message": "Gagal baca folder"})
		return
	}

	var photos []string
	for _, file := range files {
		if !file.IsDir() { 
			photos = append(photos, file.Name())
		}
	}

	helpers.WriteJSON(w, 200, map[string]any{"status": "success", "data": photos})
}
func UploadPhoto(w http.ResponseWriter, r *http.Request) {
	file, handler, err := r.FormFile("photo")
	if err != nil {
		helpers.WriteJSON(w, 400, map[string]any{"status": "error", "message": "File tidak ditemukan"})
		return
	}
	defer file.Close()

	dst, err := os.Create("./uploads/" + handler.Filename)
	if err != nil {
		helpers.WriteJSON(w, 500, map[string]any{"status": "error", "message": "Gagal simpan file"})
		return
	}
	defer dst.Close()

	io.Copy(dst, file)

	helpers.WriteJSON(w, 201, map[string]any{"status": "success", "message": "Foto berhasil diupload"})
}
func DeletePhoto(w http.ResponseWriter, r *http.Request) {
	fileName := mux.Vars(r)["filename"] 

	err := os.Remove("./uploads/" + fileName)
	if err != nil {
		helpers.WriteJSON(w, 404, map[string]any{"status": "error", "message": "File tidak ditemukan"})
		return
	}

	helpers.WriteJSON(w, 200, map[string]any{"status": "success", "message": "Foto berhasil dihapus"})
}


