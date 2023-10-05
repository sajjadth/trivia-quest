package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/handlers"
)

func SetupAuthRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
		auth.POST("/email/send", handlers.SendConfirmationEmail)
		auth.POST("/email/verify", handlers.VerifyEmail)
	}
}
