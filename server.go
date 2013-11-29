package main

import(
    "crypto/hmac"
    "crypto/rand"
    "crypto/sha512"
    "database/sql"
    "encoding/hex"
    "encoding/json"
    _ "github.com/bmizerany/pq"
    "fmt"
    "net/http"
    "os"
)

var db = dbConnect()

type User struct {
    Name string
    Email string
    Password string
    Hash string
    Salt string
    Remember bool
    TOS bool
}

func index(w http.ResponseWriter, req *http.Request){
    http.ServeFile(w, req, "./index.html")
}

func user(w http.ResponseWriter, req *http.Request){
    fmt.Println("-------------")
    fmt.Println(req.Method)

    user := new(User)
    json.NewDecoder(req.Body).Decode(user)
    user.Salt = generateRandomString(255)
    key := []byte(user.Password)
    hmac := hmac.New(sha512.New, key)
    hmac.Write([]byte(user.Salt))
    user.Hash = hex.EncodeToString(hmac.Sum(nil))

    fmt.Println(user.Name)
    fmt.Println(user.Email)
    fmt.Println(user.Password)
    fmt.Println(user.Hash)
    fmt.Println(user.Salt)
    fmt.Println(user.Remember)
    fmt.Println(user.TOS)

    switch req.Method {
        case "POST":
            db.Query(`INSERT INTO users (username, hash, salt) VALUES ($1, $2, $3)`, user.Name, user.Hash, user.Salt)
        case "GET":
            fmt.Println("GET / no action specified")
        default:
            fmt.Println("no action specified")
    }
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
    defer db.Close()
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

func dbConnect() *sql.DB {
    databaseName := os.Getenv("DATABASENAME")
    sslMode := os.Getenv("SSL")
    if databaseName == "" {
        os.Setenv("DATABASENAME", "cards")
    }
    if sslMode == "" {
        os.Setenv("SSL", "disable")
    }
    conn, err := sql.Open("postgres", "dbname=cards password=PASSWORD")
    if err != nil {
        panic(err)
    }
    err = conn.Ping()
    if err != nil {
        panic(err)
    }
    return conn
}

func generateRandomString(length int) string {
    alphanum := "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    var bytes = make([]byte, length)
    rand.Read(bytes)
    for i, b := range bytes {
        bytes[i] = alphanum[b%byte(len(alphanum))]
    }
    return string(bytes)
}
