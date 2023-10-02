package tokens

import (
	"log"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func Create(username string) string {
	// get JWT secret key from .env
	jwtSecret := os.Getenv("JWT_SECRET")

	// creating the tokena
	expirationTime := time.Now().Add(168 * time.Hour)
	claims := &Claims{
		Username: username,
		RegisteredClaims: jwt.RegisteredClaims{
			// In JWT, the expiry time is expressed as unix milliseconds
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(jwtSecret))
	if err != nil {
		log.Printf("Failed to sign token Error: %v", err)
	}

	return tokenString
}

func Validate(tokenString string) (bool, string) {
	// get JWT secret key from .env
	jwtSecret := os.Getenv("JWT_SECRET")

	// parsing the token
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		return []byte(jwtSecret), nil
	})

	if err != nil {
		log.Printf("Failed to parse token Error: %v", err)
	}

	// get exporation time
	expirationTime, _ := token.Claims.GetExpirationTime()
	expired := expirationTime.Compare(time.Now())

	// check if token is expired or not valid
	if expired != 1 || !token.Valid {
		return false, ""
	}

	return token.Valid, claims.Username
}
