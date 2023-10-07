package main

import (
	"fmt"
	"os"

	"github.com/sajjadth/trivia-quest/config"
	"github.com/sajjadth/trivia-quest/internals/routes"
)

func main() {
	// initialize configurations
	config.Init()

	// get app port fron .env
	appPort := fmt.Sprintf(":%v", os.Getenv("APP_PORT"))

	// run app
	app := config.GetRouter()
	router := app.Group("/api/v1")
	routes.SetupAuthRoutes(router)
	routes.SetupQuestionRoutes(router)
	app.Run(appPort)
}
