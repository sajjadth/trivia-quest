package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/handlers"
)

func SetupQuestionRoutes(router *gin.RouterGroup) {
	questions := router.Group("/questions")
	{
		questions.POST("/get", handlers.GetQuestions)
	}
}
