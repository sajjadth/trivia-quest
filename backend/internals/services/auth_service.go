package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"time"

	"github.com/sajjadth/trivia-quest/config"
	"github.com/sajjadth/trivia-quest/internals/auth"
	"github.com/sajjadth/trivia-quest/internals/models"
	"github.com/sajjadth/trivia-quest/internals/tokens"
)

func getVerificationCode() string {
	code := rand.Intn(999999)

	// Format the verification code as a six-digit string
	return fmt.Sprintf("%06d", code)
}

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
	verificationCode := getVerificationCode()

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

func LoginUser(email, password string) (string, bool, error) {
	// initializing user for access user info
	user := &models.User{}
	var needConfirmation bool

	// get database
	db := config.GetDB()

	// check if user exist in database
	err := db.QueryRow(
		"SELECT users.username, users.password, verification_attempts.verified FROM users, verification_attempts WHERE users.email = ?;",
		email,
	).Scan(&user.Username, &user.Password, &needConfirmation)
	if err != nil {
		return "", false, errors.New("invalid email or password")
	}

	// compare user entered password with hashed password in database
	if !auth.VerifyPassword(password, user.Password) {
		return "", false, errors.New("invalid email or password")
	}

	//creating token
	token := tokens.Create(user.Username)

	return token, !needConfirmation, nil
}

func SendConfirmationEmail(email, verificationCode string) (bool, error) {
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

func EmailVerification(email string, code int) error {
	// initial necessary variables
	var verification_code int
	var createdAt []uint8
	var verified bool
	var userID int

	// get database
	db := config.GetDB()

	// get confirmation info
	err := db.QueryRow(
		`SELECT u.id, va.verification_code, va.verified, va.created_at
 		 FROM verification_attempts va
 		 JOIN users u ON va.user_id = u.id
 		 WHERE u.email = ?;`,
		email,
	).Scan(&userID, &verification_code, &verified, &createdAt)
	if err != nil {
		return fmt.Errorf("%v", err)
	}

	// parse time to solve type error
	parsedTime, _ := time.Parse("2006-01-02 15:04:05", string(createdAt))

	// check if user already verified
	if verified {
		return fmt.Errorf("%v", "user already verified")
	}

	//send new confirmation code if code expired
	if parsedTime.Add(time.Minute*5).Compare(time.Now()) != 1 {
		verificationCode := getVerificationCode()
		_, err := SendConfirmationEmail(email, verificationCode)
		if err != nil {
			return fmt.Errorf("%v", err)
		}
		db.Exec(
			"UPDATE verification_attempts SET verification_code = ?, created_at = ? WHERE user_id = ?;",
			verificationCode,
			time.Now(),
			userID,
		)
		return fmt.Errorf("%v", "the verification code has expired")
	}

	// check if user input and varification code is same
	if code != verification_code {
		return fmt.Errorf("incorrect Verification Code")
	}

	// update the verification status of user in database
	_, err = db.Exec("UPDATE verification_attempts SET verified = TRUE WHERE user_id = ?;", userID)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	return nil
}
