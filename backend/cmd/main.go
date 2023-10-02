package main

import (
	"fmt"
	"os"

	"github.com/sajjadth/trivia-quest/config"
)

func main() {
	// initialize configurations
	config.Init()

	// get app port fron .env
	appPort := fmt.Sprintf(":%v", os.Getenv("APP_PORT"))

	// run app
	router := config.GetRouter()
	router.Run(appPort)
}
