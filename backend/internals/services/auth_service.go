package services

import (
	ra "crypto/rand"
	"encoding/hex"
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

// generateTempKey generates a random 16-byte temporary key
// and returns it as a hexadecimal string.
func generateTempKey() (string, error) {
	// Generate 16 random bytes
	bytes := make([]byte, 16)
	_, err := ra.Read(bytes)
	if err != nil {
		return "", err
	}

	// Convert bytes to a hexadecimal string
	tempKey := hex.EncodeToString(bytes)

	return tempKey, nil
}

func RegisterUser(user *models.User) error {
	// hashing password
	user.Password = auth.HashPassword(user.Password)

	// get database
	db := config.GetDB()

	// insert user in to database and send error if user already exist
	_, err := db.Exec(
		`INSERT INTO users(username, email, password, created_at) VALUES(?, ?, ?, NOW());`,
		user.Username,
		user.Email,
		user.Password,
	)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// get userID from database
	err = db.QueryRow("SELECT id FROM users WHERE username = ?;", user.Username).Scan(&user.ID)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// create row for user in scores table
	_, err = db.Exec("INSERT INTO scores (user_id, score) VALUES(?, ?);", user.ID, 0)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// creating verification code for verifying email
	verificationCode := getVerificationCode()

	// sending confirmation code
	_, err = SendConfirmationEmail(user.Email, verificationCode)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}
	//creating row for user in verification_attempts table
	_, err = db.Exec(
		"INSERT INTO verification_attempts (user_id, verification_code, created_at) VALUES(?, ?, NOW());",
		user.ID,
		verificationCode,
	)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
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
		`SELECT u.username, u.password, va.verified
 		 FROM verification_attempts va
 		 JOIN users u ON va.user_id = u.id
 		 WHERE u.email = ?;`,
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
		"https://api.elasticemail.com/v2/email/send?apikey=%v&msgTo=%v&from=%v&subject=Verification%%20Code&template=verification-code-trivia-quest-main&merge_email=%s&merge_code=%s",
		emailApiKey,
		email,
		emailSender,
		email,
		verificationCode)

	// sending confirmatino email
	res, err := http.Get(emailUrl)

	// handle error in sending confirmation email
	if err != nil {
		log.Println(err)
		return false, fmt.Errorf("something went wrong please try again later")
	}

	// getting result of sendig confirmation email
	json.NewDecoder(res.Body).Decode(&result)

	// handle error in sendgin cofirmation email
	if result["success"] != true {
		errorMessage := result["error"].(string)
		log.Println(errorMessage)
		return false, fmt.Errorf("something went wrong please try again later")
	}

	return true, nil
}

func EmailVerification(email string, code string) (string, error) {
	// initial necessary variables
	var verification_code, username string
	var createdAt []uint8
	var verified bool
	var userID int

	// get database
	db := config.GetDB()

	// get confirmation info
	err := db.QueryRow(
		`SELECT u.id, u.username, va.verification_code, va.verified, va.created_at
 		 FROM verification_attempts va
 		 JOIN users u ON va.user_id = u.id
 		 WHERE u.email = ?;`,
		email,
	).Scan(&userID, &username, &verification_code, &verified, &createdAt)
	if err != nil {
		log.Println(err)
		return "", fmt.Errorf("something went wrong please try again later")
	}

	// parse time to solve type error
	parsedTime, _ := time.Parse("2006-01-02 15:04:05", string(createdAt))

	// check if user already verified
	if verified {
		return "", fmt.Errorf("user already verified")
	}

	//send new confirmation code if code expired
	now, _ := time.Parse("2006-01-02 15:04:05", time.Now().Format("2006-01-02 15:04:05"))

	if now.After(parsedTime.Add(time.Minute * 5)) {
		verificationCode := getVerificationCode()
		_, err := SendConfirmationEmail(email, verificationCode)
		if err != nil {
			log.Println(err)
			return "", fmt.Errorf("something went wrong please try again later")
		}
		db.Exec(
			"UPDATE verification_attempts SET verification_code = ?, created_at = NOW() WHERE user_id = ?;",
			verificationCode,
			userID,
		)
		return "", fmt.Errorf("the verification code has expired")
	}

	// check if user input and varification code is same
	if code != verification_code {
		return "", fmt.Errorf("incorrect Verification Code")
	}

	// update the verification status of user in database
	_, err = db.Exec("UPDATE verification_attempts SET verified = TRUE WHERE user_id = ?;", userID)
	if err != nil {
		log.Println(err)
		return "", fmt.Errorf("something went wrong please try again later")
	}

	// create new token for user and return it
	token := tokens.Create(username)

	return token, nil
}

func VerifyUser(token string) (bool, string) {
	return tokens.Validate(token)
}

func SendPasswordResetEmail(email string) error {
	var userExists bool
	var result map[string]interface{}

	// get database
	db := config.GetDB()

	// check if users exists in database
	err := db.QueryRow("SELECT EXISTS(SELECT id FROM users WHERE email = ?);", email).Scan(&userExists)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// send and error if user not exists in database
	if !userExists {
		return fmt.Errorf("sorry, we couldn't find an account associated with that email address please double-check and try again")
	}

	// generate temporary key for changing password
	tmpKey, err := generateTempKey()
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// set temporary key to database
	_, err = db.Exec("UPDATE users SET reset_key = ? WHERE email = ?;", tmpKey, email)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// get frontend address from environment variables
	frontendAddress := os.Getenv("FRONTEND_ADDRESS")

	// link for changing the password
	link := fmt.Sprintf("%s/account/password/reset?tmpkey=%s", frontendAddress, tmpKey)

	// get api key and sender from .env
	emailApiKey := os.Getenv("EMAIL_API_KEY")
	emailSender := os.Getenv("EMAIL_SENDER")

	// url for sending confirmation email
	emailUrl := fmt.Sprintf(
		"https://api.elasticemail.com/v2/email/send?apikey=%v&msgTo=%v&from=%v&subject=Password%%20Reset&template=forgot-password-trivia-quest-main&merge_link=%s",
		emailApiKey,
		email,
		emailSender,
		link)

	// send password change email
	res, err := http.Get(emailUrl)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// get data fromt res.Body
	err = json.NewDecoder(res.Body).Decode(&result)
	if err != nil {
		return fmt.Errorf("something went wrong please try again later")
	}

	// return error if email didn't send
	if !result["success"].(bool) {
		log.Println(result["error"])
		return fmt.Errorf("something went wrong please try again later")
	}

	// return success message
	return nil
}

func VerifyAndChangePassword(tmpKey, newPassword string) error {
	// encrypt new password fot storing in database
	encryptedPassword := auth.HashPassword(newPassword)

	// get database
	db := config.GetDB()

	// set the new encrypted password in users table and delete reset_key fromt table
	_, err := db.Exec("UPDATE users SET password = ?, reset_key = null WHERE reset_key = ?;", encryptedPassword, tmpKey)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	return nil
}

func UpdatePasswordWithToken(password, newPassword, token string) error {
	var oldHashedPassword string

	// validate the seassion and get username form it
	valid, username := tokens.Validate(token)

	// if seassion is not valid return an error
	if !valid {
		return fmt.Errorf("seassion is not valid")
	}

	// get database
	db := config.GetDB()

	// get the old hashed password from database
	err := db.QueryRow("SELECT password FROM users WHERE username = ?;", username).Scan(&oldHashedPassword)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	// check if password is valid
	passwordIsValid := auth.VerifyPassword(password, oldHashedPassword)

	if !passwordIsValid {
		return fmt.Errorf("invalid password. Please try again")
	}

	// hash new password
	newHashedPassword := auth.HashPassword(newPassword)

	// update password with new hashed password
	_, err = db.Exec("UPDATE users SET password = ? WHERE username = ?;", newHashedPassword, username)
	if err != nil {
		log.Println(err)
		return fmt.Errorf("something went wrong please try again later")
	}

	return nil
}

func UpdateEmail(newEmail, username, password string) error {
	var hashedPassword string

	// get database
	db := config.GetDB()

	// get hashed password from database
	err := db.QueryRow("SELECT password FROM users WHERE username = ?;", username).Scan(&hashedPassword)
	if err != nil {
		return fmt.Errorf("something went wrong please try again later")
	}

	// check if password is valid
	passwordIsValid := auth.VerifyPassword(password, hashedPassword)
	if !passwordIsValid {
		return fmt.Errorf("invalid password. Please try again")
	}

	// creating verification code for verifying email
	verificationCode := getVerificationCode()

	// update the email in database
	_, err = db.Exec(`
		UPDATE users u
		JOIN verification_attempts va
		ON u.id = va.user_id
		SET u.email = ?, va.verification_code = ?, va.created_at = NOW()
		WHERE u.username = ?;
		`, newEmail, verificationCode, username)
	fmt.Println(1010, err)
	if err != nil {
		return fmt.Errorf("invalid password. Please try again")
	}

	_, err = SendConfirmationEmail(newEmail, verificationCode)
	if err != nil {
		return fmt.Errorf("something went wrong please try again later")
	}

	return nil
}

func GetUserInfo(username string) (models.User, error) {
	var user models.User

	// get database
	db := config.GetDB()

	// get user info from database
	err := db.QueryRow(`
		SELECT 
			subquery.place,
			subquery.email,
			subquery.score
		FROM (
			SELECT 
				ROW_NUMBER() OVER(ORDER BY s.score DESC) AS place,
				u.email,
				u.username,
				s.score
			FROM users u
			JOIN scores s
			ON u.id = s.user_id
			ORDER BY s.score DESC
		) AS subquery
		WHERE subquery.username = ?;
	`, username).Scan(&user.Place, &user.Email, &user.Score)
	if err != nil {
		log.Println(err)
		return user, fmt.Errorf("something went wrong please try again later")
	}

	return user, nil
}
