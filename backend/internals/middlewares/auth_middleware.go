package middlewares

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/tokens"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get token from request headers or cookies
		token := c.GetHeader("token")
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is missing", "success": false})
			c.Abort()
			return
		}

		// validate token
		isValid, username := tokens.Validate(token)
		if !isValid {
			c.JSON(http.StatusForbidden, gin.H{"error": "Access Denied: Unauthorized.", "success": false})
			c.Abort()
			return
		}

		// pass username to request context for later use
		c.Set("username", username)

		// continue with the next middleware or handler
		c.Next()
	}
}
