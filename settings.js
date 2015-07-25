module.exports = settings;

function settings() {
    return {

        debug: false,

        /***
        * Directories and filepaths
        */
        colors_path: __dirname+"/colors.js",
        models_path: __dirname+"/models.js",
        project_directory:  __dirname,
        sockets_path: __dirname+"/sockets.js",
        static_directory: __dirname+"/static",

        /***
        * Web server settings
        */
        cookie_secret: "11rn@J2d9SSv21qz%17201439pKTB28cnOWe4cjd!kd",
        jwtSecret: "2cards2furious",
        session_key: "2cards2furious",
        session_secret: "p2(236cVb3S#a,25gffDxrR|tb{{bddR31aAz35917",
        port: 8000,

        /***
        * Database server settings
        */
        database_host: "127.0.0.1",
        database_port: 27017,
        mongodb_database_name: "cards",
        mongodb_salt_keyword: "salty"+String(Math.floor(Math.random()*10000000000000000))+"poop",
        /*
        mongodb_options: {
            user: "cards_user_xd43hgEdjRLfks33gfddsw3",
            pass: "cards_password_j3#5gfd343wxzZs",
            server: { poolSize: 5 }
        },
        */
        mongodb_collections: {
            user_accounts: "users"
        },
        redis_settings: {
            db: "cards",
            host: "127.0.0.1",
            pass: "SHittYpAssWORd",
            port: "6379",
            ttl: 60*60*24*365 //Cookies last a year
        },
        context : {
            errors : [],
            messages : [],
            version : 1,
            year : new Date().getFullYear()
        }
    };
}
