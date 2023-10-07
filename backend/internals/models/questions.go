package models

type Questions struct {
	ResponseCode int         `json:"response_code"`
	Questions    []*question `json:"results"`
}

type question struct {
	Category         string   `json:"category"`
	CorrectAnswer    string   `json:"correct_answer"`
	Difficulty       string   `json:"difficulty"`
	IncorrectAnswers []string `json:"incorrect_answers"`
	Question         string   `json:"question"`
	Type             string   `json:"type"`
}

type QuestionRequest struct {
	Amount       int    `json:"amount"`
	Category     int    `json:"category"`
	Difficulty   string `json:"difficulty"`
	QuestionType string `json:"question_type"`
}
