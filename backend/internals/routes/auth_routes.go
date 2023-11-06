package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/handlers"
	"github.com/sajjadth/trivia-quest/internals/middlewares"
)

func SetupAuthRoutes(router *gin.RouterGroup) {
	auth := router.Group("/auth")
	{
		auth.POST("/verify", handlers.VerifyUser)
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
		auth.POST("/email/send", handlers.SendConfirmationEmail)
		auth.POST("/email/verify", handlers.VerifyEmail)
		auth.POST("/email/update", handlers.UpdateEmail)
		auth.POST("/password/reset", handlers.SendPasswordResetEmail)
		auth.POST("/password/change", handlers.VerifyAndChangePassword)
		auth.POST("/password/update", middlewares.AuthMiddleware(), handlers.UpdatePasswordWithToken)
		auth.GET("/profile", middlewares.AuthMiddleware(), handlers.GetUserInfo)
	}
}
