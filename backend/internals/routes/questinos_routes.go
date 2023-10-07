package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/handlers"
	"github.com/sajjadth/trivia-quest/internals/middlewares"
)

func SetupQuestionRoutes(router *gin.RouterGroup) {
	questions := router.Group("/questions", middlewares.AuthMiddleware())
	{
		questions.POST("/get", handlers.GetQuestions)
	}
}
