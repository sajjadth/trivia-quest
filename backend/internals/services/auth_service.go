package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"net/http"
	"os"

	"github.com/sajjadth/trivia-quest/config"
	"github.com/sajjadth/trivia-quest/internals/auth"
	"github.com/sajjadth/trivia-quest/internals/models"
	"github.com/sajjadth/trivia-quest/internals/tokens"
)

func RegisterUser(user *models.User) error {
	// hashing password
	user.Password = auth.HashPassword(user.Password)

	// get database
	db := config.GetDB()

	// insert user in to database and send error if user already exist
	_, err := db.Exec("INSERT INTO users (username, email, password) VALUES(?, ?, ?);", user.Username, user.Email, user.Password)
	if err != nil {
		return err
	}

	// get userID from database
	err = db.QueryRow("SELECT id FROM users WHERE username = ?;", user.Username).Scan(&user.ID)
	if err != nil {
		return err
	}

	// create row for user in scores table
	_, err = db.Exec("INSERT INTO scores (user_id, score) VALUES(?, ?);", user.ID, 0)
	if err != nil {
		return err
	}

	// creating verification code for verifying email
	verificationCode := rand.Intn(999999)

	// sending confirmation code
	_, err = SendConfirmationEmail(user.Email, verificationCode)
	if err != nil {
		return err
	}
	//creating row for user in verification_attempts table
	_, err = db.Exec("INSERT INTO verification_attempts (user_id, verification_code) VALUES(?, ?);", user.ID, verificationCode)
	if err != nil {
		return err
	}

	return nil
}

func LoginUser(email, password string) (string, error) {
	// initializing user for access user info
	user := &models.User{}

	// get database
	db := config.GetDB()

	// check if user exist in database
	err := db.QueryRow("SELECT username, password FROM users WHERE email = ?;", email).Scan(&user.Username, &user.Password)
	if err != nil {
		return "", errors.New("invalid email or password")
	}

	// compare user entered password with hashed password in database
	if !auth.VerifyPassword(password, user.Password) {
		return "", errors.New("invalid email or password")
	}

	//creating token
	token := tokens.Create(user.Username)

	return token, nil
}

func SendConfirmationEmail(email string, verificationCode int) (bool, error) {
	var result map[string]interface{}

	// get api key and sender from .env
	emailApiKey := os.Getenv("EMAIL_API_KEY")
	emailSender := os.Getenv("EMAIL_SENDER")

	// url for sending confirmation email
	emailUrl := fmt.Sprintf(
		"https://api.elasticemail.com/v2/email/send?apikey=%v&msgTo=%v&from=%v&subject=Verification%%20Code&body=verification%%20code:%%20%v",
		emailApiKey,
		email,
		emailSender,
		verificationCode)

	// sending confirmatino email
	res, err := http.Get(emailUrl)

	// handle error in sending confirmation email
	if err != nil {
		return false, fmt.Errorf("failed to send confirmation email Error: %v", err)
	}

	// getting result of sendig confirmation email
	json.NewDecoder(res.Body).Decode(&result)

	// handle error in sendgin cofirmation email
	if result["success"] != true {
		errorMessage := result["error"].(string)
		return false, errors.New(errorMessage)
	}

	return true, nil
}
