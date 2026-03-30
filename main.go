package main

	
import (
    "log"
    "net/http"
    "github.com/gorilla/mux"
    "galery/handlers"
)

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/api/photos", handlers.GetPhotos).Methods("GET")
    r.HandleFunc("/api/upload", handlers.UploadPhoto).Methods("POST")
    r.HandleFunc("/api/delete/{filename}", handlers.DeletePhoto).Methods("DELETE")

    r.PathPrefix("/images/").Handler(http.StripPrefix("/images/", http.FileServer(http.Dir("./uploads"))))
    r.PathPrefix("/").Handler(http.FileServer(http.Dir("./static")))

    log.Println("Server berjalan di http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}