package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sajjadth/trivia-quest/internals/models"
	"github.com/sajjadth/trivia-quest/internals/services"
)

func Register(c *gin.Context) {
	var user models.User

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	// register user and save user data into database
	if err := services.RegisterUser(&user); err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error":   "User already exists. Please choose a different username/email.",
				"success": false,
			})
		return
	}

	// send success message to user if there was no error
	c.JSON(
		http.StatusOK,
		gin.H{
			"message":           "User registered successfully",
			"need_confirmation": true,
			"success":           true,
		})
}

func Login(c *gin.Context) {
	var user models.User

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	// check if user exist and verified; if so, creating token
	token, needConfimation, err := services.LoginUser(user.Email, user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error(), "success": false})
		return
	}

	// send confirmation code if user is not verified
	if needConfimation {
		services.EmailVerification(user.Email, -1)
		c.JSON(
			http.StatusOK,
			gin.H{
				"message":           "Please enter the confirmation code and remember to check your spam folder.",
				"need_confirmation": true,
				"success":           true,
			},
		)
		return
	}

	// send token and success message for user login
	c.JSON(
		http.StatusOK,
		gin.H{
			"message":           "Welcome back! You're now logged in.",
			"need_confirmation": false,
			"success":           true,
			"token":             token,
		})
}

func SendConfirmationEmail(c *gin.Context) {
	var user models.User

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	// send new verification code to user
	if err := services.EmailVerification(user.Email, -1); err != nil {
		log.Println(err)
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error":   "something went wrong please try again later",
				"success": false,
			})
		return
	}

	// send success message for success email verification
	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "A new confirmation code has been sent to your email. Please also check your spam folder.",
			"success": true,
		})
}

func VerifyEmail(c *gin.Context) {
	var user models.User
	var verificationCode int

	// bind JSON data from the request to the user variable
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	// Bind verification_code from the request
	if err := c.ShouldBindJSON(&gin.H{"verification_code": &verificationCode}); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error(), "success": false})
		return
	}

	// check user verification code
	if err := services.EmailVerification(user.Email, verificationCode); err != nil {
		log.Println(err)
		c.JSON(
			http.StatusInternalServerError,
			gin.H{
				"error":   err.Error(),
				"success": false,
			})
		return
	}

	// send success message for success email verification
	c.JSON(
		http.StatusOK,
		gin.H{
			"message": "Congratulations! Your email has been successfully verified. You're all set to enjoy our services.",
			"success": true,
		})
}
