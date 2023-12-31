package models

type User struct {
	ID               int    `json:"userID"`
	Username         string `json:"username"`
	Password         string `json:"password"`
	Email            string `json:"email"`
	CreatedAt        string `json:"createdAt"`
	VerificationCode string `json:"verification_code"`
	Token            string `json:"token"`
	TemporaryKey     string `json:"tmp_key"`
	NewPassword      string `json:"new_password"`
	Score            int    `json:"score"`
	Place            int    `json:"place"`
}
