package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

var db *sql.DB
var r *gin.Engine

func tableExists(db *sql.DB, tableName string) bool {
	query := fmt.Sprintf("SHOW TABLES LIKE '%s'", tableName)
	rows, err := db.Query(query)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	return rows.Next()
}

func Init() {
	// load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Failed to load .env", err)
	}

	// initialize gin
	r = gin.Default()

	cfg := mysql.Config{
		User:                 os.Getenv("DATABASE_USERNAME"),
		Passwd:               os.Getenv("DATABASE_PASSWORD"),
		Addr:                 fmt.Sprintf("%v:%v", os.Getenv("DATABASE_HOST"), os.Getenv("DATABASE_PORT")),
		Net:                  "tcp",
		DBName:               os.Getenv("DATABASE_NAME"),
		AllowNativePasswords: true,
	}

	// initialize and connect to the database
	db, err = sql.Open("mysql", cfg.FormatDSN())
	if err != nil {
		log.Fatal("Failed to connect to database", err)
	}

	// Get the current working directory
	dir, err := os.Getwd()
	if err != nil {
		log.Fatal("Failed to get current working directory", err)
	}

	// reading content of schema.sql
	schemaPath := filepath.Join(dir, "db/schema.sql")
	content, err := os.ReadFile(schemaPath)
	if err != nil {
		log.Fatal("Failed to read schema.sql file", err)
	}

	// split the content into individual SQL statements
	statements := strings.Split(string(content), ";")

	// iterate through each statement and execute it if the table does not exist
	for _, statement := range statements {
		// trim leading and trailing spaces
		statement = strings.TrimSpace(statement)
		if statement == "" {
			continue
		}

		// extract table name from CREATE TABLE statement
		tableName, isAlter := strings.Fields(statement)[2], strings.ToLower(strings.Fields(statement)[0]) == "alter"
		if !tableExists(db, tableName) || isAlter {
			// execute the SQL statement
			_, err := db.Exec(statement)
			if err != nil {
				log.Printf("Failed to executing statement Error: %s\n", err)
			}
		}
	}
}

// det the database instance
func GetDB() *sql.DB {
	return db
}

// get the gin engine
func GetRouter() *gin.Engine {
	return r
}
