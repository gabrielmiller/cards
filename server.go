package main

import(
    "fmt"
    "net/http"
    "encoding/hex"
    "encoding/json"
    "crypto/sha512"
    //"database/sql"
    //"github.com/bmizerany/pq" //_
)

type User struct {
    UserName string
    UserEmail string
    UserPassword string
    UserHash string
    UserRemember bool
    UserTOS bool
}

func index(w http.ResponseWriter, req *http.Request){
    http.ServeFile(w, req, "./index.html")
}

func user(w http.ResponseWriter, req *http.Request){
    fmt.Println("-------------")
    fmt.Println(req.Method)
    user := new(User)
    json.NewDecoder(req.Body).Decode(user)
    hash := sha512.New()
    hash.Write([]byte("this is a test"))
    hashArray := make([]byte, hash.Size())
    hash.Sum(hashArray[:0])
    user.UserHash = hex.EncodeToString(hashArray)
    fmt.Println(user.UserName)
    fmt.Println(user.UserEmail)
    fmt.Println(user.UserPassword)
    fmt.Println(user.UserHash)
    fmt.Println(user.UserRemember)
    fmt.Println(user.UserTOS)
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
