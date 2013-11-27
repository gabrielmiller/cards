package main

import(
    "fmt"
    "net/http"
)

func index(w http.ResponseWriter, req *http.Request){
    http.ServeFile(w, req, "./index.html")
}

func signup(w http.ResponseWriter, req *http.Request){
    fmt.Println("signup hit")
}

func serveFile(pattern string, filename string) {
    http.HandleFunc(pattern, func(w http.ResponseWriter, req *http.Request) {
        http.ServeFile(w, req, filename)
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
    http.HandleFunc("/static/", func(w http.ResponseWriter, req *http.Request) {
        http.ServeFile(w, req, req.URL.Path[1:])
    })
    http.HandleFunc("/signup", signup)
    http.HandleFunc("/", index)
    serveFile("/favicon.ico", "./static/favicon.ico")
    serveFile("/robots.txt", "./static/robots.txt")
    http.ListenAndServe(":8000", printOutput(http.DefaultServeMux))
}
