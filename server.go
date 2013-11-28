package main

import(
    "fmt"
    "net/http"
)

func index(w http.ResponseWriter, req *http.Request){
    http.ServeFile(w, req, "./index.html")
}

func user(w http.ResponseWriter, req *http.Request){
    fmt.Println("user hit")
}

func serveFile(pattern string, filename string) {
    http.HandleFunc(pattern, func(w http.ResponseWriter, req *http.Request) {
        http.ServeFile(w, req, filename)
    })
}

func serveStatic(path string){
    http.HandleFunc(path, func(w http.ResponseWriter, req *http.Request) {
        http.ServeFile(w, req, "./static"+req.URL.Path[0:])
    })
}

func printOutput(handler http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
        fmt.Printf("%s %s %s\n", req.RemoteAddr, req.Method, req.URL)
        handler.ServeHTTP(w, req)
    })
}

func main(){
    fmt.Println(" > HTTP Server running...")
    serveStatic("/css/")
    serveStatic("/fonts/")
    serveStatic("/js/")
    serveStatic("/icons/")
    serveStatic("/partials/")
    serveFile("/favicon.ico", "./static/favicon.ico")
    serveFile("/robots.txt", "./static/robots.txt")
    http.HandleFunc("/user", user)
    http.HandleFunc("/", index)
    http.ListenAndServe(":8000", printOutput(http.DefaultServeMux))
}
